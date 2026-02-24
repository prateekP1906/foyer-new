import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone } from 'lucide-react';

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || '');

export default function TestWebCallButton({ user }) {
    const [isCalling, setIsCalling] = useState(false);

    useEffect(() => {
        vapi.on('call-start', () => setIsCalling(true));
        vapi.on('call-end', () => setIsCalling(false));
        vapi.on('error', (e) => {
            console.error(e);
            setIsCalling(false);
        });

        return () => {
            vapi.removeAllListeners('call-start');
            vapi.removeAllListeners('call-end');
            vapi.removeAllListeners('error');
        };
    }, []);

    const handleStartCall = async () => {
        if (isCalling) {
            vapi.stop();
            return;
        }

        try {
            await vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, {
                metadata: {
                    user_id: user?.id
                }
            });
        } catch (error) {
            console.error(error);
            setIsCalling(false);
        }
    };

    return (
        <button
            onClick={handleStartCall}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 font-bold shadow-lg ${isCalling
                ? 'bg-amber-500 text-white shadow-amber-500/20 hover:shadow-amber-500/40 opacity-75'
                : 'bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:bg-indigo-600'
                }`}
        >
            <Phone className="w-5 h-5" />
            {isCalling ? 'Call in progress...' : 'Test Web Call'}
        </button>
    );
}
