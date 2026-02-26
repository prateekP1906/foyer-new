import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        if (message?.type === 'end-of-call-report') {
            try {
                const user_id = message.call?.metadata?.user_id;
                const patient_name = message.analysis?.structuredData?.patient_name;
                const appointment_time = message.analysis?.structuredData?.date_time;
                const issue_description = message.analysis?.structuredData?.issue;

                if (user_id && patient_name && appointment_time) {
                    const { error } = await supabaseAdmin
                        .from('appointments')
                        .insert([{
                            user_id,
                            patient_name,
                            appointment_time,
                            issue_description,
                            status: 'confirmed'
                        }]);

                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: error.message });
                    }
                }
            } catch (dbError) {
                console.error(dbError);
                return res.status(500).json({ error: dbError.message });
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
