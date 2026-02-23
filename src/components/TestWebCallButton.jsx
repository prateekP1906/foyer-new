import React, { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Phone } from 'lucide-react';

const retellWebClient = new RetellWebClient();

export default function TestWebCallButton({ user }) {
    const [isCalling, setIsCalling] = useState(false);

    const handleStartCall = async () => {
        setIsCalling(true);
        try {
            const response = await fetch('/api/create-web-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clinic_id: user.id }),
            });

            const data = await response.json();

            if (data.access_token) {
                await retellWebClient.startCall({
                    accessToken: data.access_token,
                });

                retellWebClient.on('call_ended', () => {
                    setIsCalling(false);
                });
            } else {
                setIsCalling(false);
            }
        } catch (error) {
            console.error(error);
            setIsCalling(false);
        }
    };

    return (
        <button
            onClick={handleStartCall}
            disabled={isCalling}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 font-bold shadow-lg ${isCalling
                    ? 'bg-amber-500 text-white shadow-amber-500/20 hover:shadow-amber-500/40 opacity-75 cursor-not-allowed'
                    : 'bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 hover:bg-indigo-600'
                }`}
        >
            <Phone className="w-5 h-5" />
            {isCalling ? 'Call in progress...' : 'Test Web Call'}
        </button>
    );
}
