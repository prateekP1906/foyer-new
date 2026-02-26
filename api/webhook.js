import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mziqagmbyfwhelsyuwhp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (message?.type === 'end-of-call-report') {
            try {
                const user_id = message.call?.metadata?.user_id;
                const data = message.analysis?.structuredData;

                if (data) {
                    const patient_name = data.patient_name || data['patient name'];
                    const issue = data.issue || data.issue_description;
                    const apptDate = data.appointment_date || data['appointment date'];
                    const apptTime = data.appointment_time || data['appointment time'];

                    const formattedDate = apptDate ? apptDate.replace(/\s/g, '-') : '';
                    const appointment_time = formattedDate && apptTime ? `${formattedDate}T${apptTime}:00` : null;

                    const insertData = {
                        patient_name,
                        issue_description: issue,
                        appointment_time,
                        phone_number: data.phone_number || 'Not provided',
                        status: 'confirmed'
                    };

                    if (user_id) insertData.user_id = user_id;

                    const { error } = await supabaseAdmin.from('appointments').insert([insertData]);

                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }
                }
            } catch (dbError) {
                return res.status(500).json({ error: dbError.message });
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}