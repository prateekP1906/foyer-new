import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

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
        const { user_id } = req.body;

        const response = await fetch('https://api.vapi.ai/call/web', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VITE_VAPI_PUBLIC_KEY || process.env.VAPI_PUBLIC_KEY}`
            },
            body: JSON.stringify({
                assistantId: process.env.VITE_VAPI_ASSISTANT_ID || process.env.VAPI_ASSISTANT_ID,
                assistantOverrides: {
                    metadata: {
                        user_id: user_id
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Vapi API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}