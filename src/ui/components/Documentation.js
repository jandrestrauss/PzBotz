import React, { useState, useEffect } from 'react';

const Documentation = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
    };

    const handleDocUpdate = async (docId, content) => {
        await fetch(`/api/docs/${docId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        await fetchDocs();
    };

    return (
        <div className="documentation">
            <h2>Documentation Updates</h2>
            <div className="docs-list">
                {docs.map(doc => (
                    <div key={doc.id} className="doc-card">
                        <h3>{doc.title}</h3>
                        <textarea
                            value={doc.content}
                            onChange={(e) => handleDocUpdate(doc.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documentation;
