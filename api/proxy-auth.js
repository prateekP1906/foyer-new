import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
}) : null;

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

    if (!supabase) {
        return res.status(500).json({ error: 'Database configuration missing' });
    }

    try {
        const { action, email, password, firstName, lastName } = req.body;

        if (action === 'signUp') {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            });
            if (error) throw error;
            return res.status(200).json(data);
        } else if (action === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return res.status(200).json(data);
        } else if (action === 'getUserData') {
            const { userId } = req.body;
            if (!userId) throw new Error('userId is required');

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const { data: apptData, error: apptError } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', userId)
                .order('appointment_time', { ascending: true });

            return res.status(200).json({
                profile: profileData || null,
                appointments: apptData || [],
                profileError: profileError?.message,
                apptError: apptError?.message
            });
        } else if (action === 'addAppointment') {
            const { appointment } = req.body;
            const { data, error } = await supabase
                .from('appointments')
                .insert(appointment);
            if (error) throw error;
            return res.status(200).json({ success: true, data });
        } else if (action === 'deleteAppointment') {
            const { id } = req.body;
            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return res.status(200).json({ success: true });
        } else if (action === 'updateAppointment') {
            const { id, updates } = req.body;
            const { data, error } = await supabase
                .from('appointments')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
