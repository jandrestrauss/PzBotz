import React, { useState, useEffect } from 'react';

const Localization = () => {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        const response = await fetch('/api/localization/languages');
        const data = await response.json();
        setLanguages(data);
    };

    const handleLanguageChange = async (e) => {
        const language = e.target.value;
        setSelectedLanguage(language);
        await fetch('/api/localization/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language })
        });
    };

    return (
        <div className="localization-container">
            <h2>Localization Settings</h2>
            <select value={selectedLanguage} onChange={handleLanguageChange}>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Localization;
