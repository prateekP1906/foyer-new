import React, { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

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
        <button onClick={handleStartCall} disabled={isCalling}>
            {isCalling ? 'Call in progress...' : 'Test Web Call'}
        </button>
    );
}
