import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const START_HOUR = 9;
const END_HOUR = 17;

const isBusinessHours = (dateStr, timeStr) => {
    if (!timeStr) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= START_HOUR && hours < END_HOUR;
};

async function checkAvailability(args) {
    const { requested_date, requested_time } = args;

    if (!requested_date || !requested_time) {
        return { available: false, message: 'I need a specific date and time to check.' };
    }

    if (!isBusinessHours(requested_date, requested_time)) {
        return { available: false, reason: "Outside of business hours (09:00 - 17:00)" };
    }

    const timestamp = `${requested_date}T${requested_time}:00`;

    if (!supabase) return { available: false, reason: "Database connection failed" };

    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_time', timestamp);

    if (error) {
        return { available: false, reason: "Database error" };
    }

    if (data && data.length > 0) {
        return { available: false, reason: "Slot taken" };
    }

    return { available: true };
}

async function bookAppointment(args, userId) {
    const { name, phone, issue, date, time } = args;
    const timestamp = `${date}T${time}:00`;

    if (!supabase) return { success: false, message: "Database connection failed" };

    const insertData = {
        patient_name: name,
        phone_number: phone,
        issue_description: issue || 'Not specified',
        appointment_time: timestamp,
        status: 'confirmed'
    };

    if (userId) {
        insertData.user_id = userId;
    }

    const { error: dbError } = await supabase.from('appointments').insert([insertData]);

    if (dbError) {
        return { success: false, message: "Database error during booking." };
    }

    const channel = supabase.channel('demo-room');
    await channel.send({
        type: 'broadcast',
        event: 'new_booking',
        payload: {
            id: `demo-${Date.now()}`,
            patient_name: name,
            phone_number: phone,
            issue_description: issue,
            appointment_time: timestamp,
            status: 'confirmed',
            user_id: userId
        }
    });

    return { success: true, message: `Booked for ${time}` };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (message && message.type === 'tool-calls') {
            const userId = message.call?.metadata?.user_id;

            const toolCall = message.toolCalls[0];
            const functionName = toolCall.function.name;
            const rawArgs = toolCall.function.arguments;
            const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : (rawArgs || {});
            let result;

            if (functionName === 'checkAvailability') {
                result = await checkAvailability(args);
            } else if (functionName === 'bookAppointment') {
                result = await bookAppointment(args, userId);
            } else {
                result = { error: 'Unknown function' };
            }

            return res.status(200).json({
                results: [
                    {
                        toolCallId: toolCall.id,
                        result: JSON.stringify(result)
                    }
                ]
            });
        }

        if (message?.type === 'end-of-call-report') {
            return res.status(200).json({ received: true });
        }

        res.status(200).send('OK');

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}