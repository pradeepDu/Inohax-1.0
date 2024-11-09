import axios from 'axios';
import React, { useEffect, useState } from 'react'

const apiUrl = process.env.REACT_APP_API;

function Sandbox() {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const runCode = async () => {
        setError('');
        setOutput('');
        try {
            const { data } = await axios.post(`${apiUrl}/execute`, { code: code })
            setOutput(String(data.output));
        } catch (err: any) {
            setError(err.toString());
        }
    };
    return (
        <div className="container mx-auto p-4">
            {/* <iframe src="https://codesandbox.io/p/devbox/ezcode-ym563m?embed=1"
                style={{
                    width: '100%',
                    height: '500px',
                    border: '0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}
                title="ezcode"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe> */}
            <div className="p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">JavaScript Playground</h1>
                <div className="mb-4">
                    <textarea
                        className="w-full h-40 p-2 border border-gray-300 rounded"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your JavaScript code here..."
                    />
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={runCode}
                >
                    Run Code
                </button>
                {output && (
                    <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded">
                        <h2 className="font-bold">Output:</h2>
                        <pre>{output}</pre>
                    </div>
                )}
                {error && (
                    <pre>{error}</pre>

                )}
            </div>
        </div>
    )
}

export default Sandbox
