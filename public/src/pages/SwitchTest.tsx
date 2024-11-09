import React, { useEffect, useState } from 'react';

const SwitchTest = () => {
    const [isTabVisible, setIsTabVisible] = useState(true);
    const [message, setMessage] = useState('');
    const [isCheating, setIsCheating] = useState(false); // New state to track if the user switched tabs

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabVisible(false);
                setMessage('You cannot continue as you switched tabs or minimized the browser.');
                setIsCheating(true); // Lock the user out
                console.log('Tab is inactive or minimized');
            } else {
                setIsTabVisible(true);
                console.log('Tab is active');
            }
        };

        // Check if browser supports the Visibility API
        if (typeof document.hidden !== "undefined") {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            console.warn('This browser does not support the Page Visibility API.');
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSubmit = () => {
        if (isTabVisible && !isCheating) {
            alert('Quiz submitted!');
        } else {
            alert('You cannot submit after switching tabs!');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>{isTabVisible ? 'Tab is Active' : 'Tab is Inactive'}</h1>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <button onClick={handleSubmit} disabled={isCheating}>
                Submit Quiz
            </button>
            {isCheating && <p style={{ color: 'red' }}>You have been disqualified for switching tabs.</p>}
        </div>
    );
};

export default SwitchTest;
