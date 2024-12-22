import React, { useState } from 'react';

const ServerControl = () => {
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');

    const handleCommandChange = (e) => {
        setCommand(e.target.value);
    };

    const handleCommandSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/server/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
        const data = await res.json();
        setResponse(data.result);
    };

    return (
        <div className="server-control-container">
            <h2>Server Control</h2>
            <form onSubmit={handleCommandSubmit}>
                <input
                    type="text"
                    value={command}
                    onChange={handleCommandChange}
                    placeholder="Enter server command"
                />
                <button type="submit">Send Command</button>
            </form>
            {response && <p>Response: {response}</p>}
        </div>
    );
};

export default ServerControl;
