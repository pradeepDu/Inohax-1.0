import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { useState } from "react";
import { FaPaperPlane, FaPlay } from "react-icons/fa";

const apiUrl = process.env.REACT_APP_API;

const AssignmentNew =()=>{
    const [language,setLanguage] =useState<string>("")
    const [theme,setTheme] =useState<string>("")
    const [code,setCode] =useState<string>("")
    const[loading,setLoading]=useState<boolean>(false)
    const [consoleLogs,setConsoleLogs]=useState<string>("")
    const commentTemplates: { [key: string]: string } = {
        javascript: "// Write your JavaScript code here",
        python: "# Write your Python code here",
        java: "// Write your Java code here",
        cpp: "// Write your C++ code here",
        c: "// Write your C code here",
      };
    const handleSubmit = async () => {
      
       setLoading(true)
        console.log("Submitted code:", code);
                //   const { data } = await axios.post("http://localhost:5000/evaluate", {
                //     question,
                //     code,
                    
                //   });
                //   console.log(data);
                  setLoading(false)
          }
          const handleTheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setTheme(event.target.value);
          };
          const handleLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newLanguage = event.target.value;
            setLanguage(newLanguage);
            setCode(commentTemplates[newLanguage] || "");
          };
          const runCode = async () => {
            try {
              const { data } = await axios.post(`${apiUrl}/execute`, { code:code });
              setConsoleLogs(String(data.output))
            } catch (e) {
              console.error(e);
            }
          }
    return(
        <div className="container mx-auto p-4 bg-base-200 min-h-screen">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Code Assignment</h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={handleLang}
                            value={language}
                        >
                            <option disabled value="">Select Language</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                        </select>
                        <select
                            className="select select-bordered w-full max-w-xs"
                            onChange={handleTheme}
                            value={theme}
                        >
                            <option disabled value="">Select Theme</option>
                            <option value="vs-dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="vs-light">VS Light</option>
                            <option value="hc-black">High Contrast</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <MonacoEditor
                            key={language}
                            height="400px"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme={theme}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                            }}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="space-x-2">
                            {loading ? (
                                <button className="btn btn-primary loading">Submitting...</button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    <FaPaperPlane className="mr-2" /> Submit
                                </button>
                            )}
                            <button className="btn btn-secondary" onClick={runCode}>
                                <FaPlay className="mr-2" /> Run Code
                            </button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="checkbox" />
                            <div className="collapse-title text-xl font-medium">
                                Console Output
                            </div>
                            <div className="collapse-content">
                                <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                                    {consoleLogs || "No output yet. Run your code to see results."}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignmentNew;