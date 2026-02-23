import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { event, call } = req.body;

        if (event === 'call_analyzed') {
            const clinic_id = call?.retell_llm_dynamic_variables?.clinic_id;
            const patient_name = call?.call_analysis?.custom_analysis_data?.patient_name;
            const date_time = call?.call_analysis?.custom_analysis_data?.date_time;

            if (clinic_id && patient_name && date_time) {
                const { error } = await supabaseAdmin
                    .from('appointments')
                    .insert([{ clinic_id, patient_name, date_time }]);

                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: error.message });
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
