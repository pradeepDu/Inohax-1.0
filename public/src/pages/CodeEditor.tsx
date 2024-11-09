import React, { useState, useEffect } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import { GoLightBulb } from "react-icons/go";

import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./redux";

const apiUrl = process.env.REACT_APP_API;

function CodeEditor() {
  const [question, setQuestion] = useState("");
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [hint, setHint] = useState<boolean>(false);
  const [stepHint, setStepHint] = useState<string>("");
  const [response, setResponse] = useState<any>({});
  const [keywords, setKeywords] = useState<
    { keyword: string; description: string }[]
  >([]);
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string>("");
  const [structResponse, setStructResponse] = useState<{ [key: string]: any }>(
    {}
  );
  const [showCompletionPopup, setShowCompletionPopup] = useState<boolean>(
    false
  );
  const [codeparseLoading, setcodeparseLoading] = useState<boolean>(false);
  const [codeparseError, setcodeparseError] = useState<boolean>(false);

  let interval: NodeJS.Timeout;
  // Comment templates based on language
  const commentTemplates: { [key: string]: string } = {
    javascript: "// Write your JavaScript code here",
    python: "# Write your Python code here",
    java: "// Write your Java code here",
    cpp: "// Write your C++ code here",
    c: "// Write your C code here",
  };
  const courseQues = useAppSelector((zoom) => zoom.question.question);
  const courseLang = useAppSelector((zoom) => zoom.question.language);

  // Fetch steps and start the timer
  useEffect(() => {
    if (courseQues) {
      setQuestion(courseQues);
      fetchSteps(courseQues, courseLang);
      console.log(1);
    }
  }, [courseQues]);
  const fetchSteps = async (question: string, language: string) => {
    try {
      setLoading(true);
      setStartTime(Date.now());
      const { data } = await axios.post(`${apiUrl}/generate-code`, {
        prompt: question,
        language,
      });
      console.log(data);
      setResponse(data);
      setSteps(data.code.steps);
      setCompletedSteps([]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching steps:", error);
      setLoading(false);
    }
  };

  const runCode = async () => {
    try {
      const { data } = await axios.post(`${apiUrl}/execute`, { code:code });
      setConsoleLogs(String(data.output))
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (steps.length > 0) {
      const step = steps[currentStep];
      if (step && step.keywords) {
        setKeywords(
          step.keywords.map((kw: any) => ({
            keyword: kw.keyword,
            description: kw.description || "No description available",
          }))
        );
        setStepHint(step.hint);
      } else {
        setKeywords([]);
      }
    }
  }, [currentStep, steps]);

  const handleSubmit = async () => {
    try {
      if (Object.keys(response).length === 0) return;
      setcodeparseLoading(true);
      console.log("Submitted code:", code);
      let {
        data: { structuredResponse },
      } = await axios.post(`${apiUrl}/parseCode`, {
        response,
        code,
        currentStep,
      });
      setStructResponse(structuredResponse);
      console.log(structuredResponse.isCorrect);
      console.log(structuredResponse);

      if (structuredResponse.isCorrect) {
        setcodeparseError(false);
        setCompletedSteps((prev) => [...prev, currentStep]);

        //checking for the last step
        const isLastStep = currentStep === steps.length - 1;

        if (isLastStep) {
          clearInterval(interval);
          setFinalTime(elapsedTime);
          setShowCompletionPopup(true); // Show completion popup
          setTimeout(() => setShowCompletionPopup(false), 2000);
          setTimeout(() => {
            const dialouge = document.getElementById(
              "my_modal_1"
            ) as HTMLDialogElement;
            dialouge.showModal();
          }, 3000);
          console.log(finalTime);
        }

        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
        setConsoleLogs(structuredResponse.feedback);
      } else {
        setConsoleLogs(structuredResponse.feedback);
        setcodeparseError(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setcodeparseLoading(false);
    }
  };

  useEffect(() => {
    if (startTime !== null) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime]);

  const handleLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setCode(commentTemplates[newLanguage] || "");
  };

  const handleTheme = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  let days = Math.floor((finalTime ?? elapsedTime) / (24 * 3600));
  let hours = Math.floor(((finalTime ?? elapsedTime) % (24 * 3600)) / 3600);
  let minutes = Math.floor(((finalTime ?? elapsedTime) % 3600) / 60);
  let seconds = (finalTime ?? elapsedTime) % 60;

  const handleStepClick = (index: number) => {
    if (index <= currentStep || completedSteps.includes(index)) {
      if (index === currentStep) {
        return; // Prevent clicking on the current step
      }
      setCurrentStep(index);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      {showCompletionPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          {showCompletionPopup && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              tweenDuration={2000}
              run
            />
          )}
          <h1 className="text-white text-5xl font-bold">
            Successfully Completed!
          </h1>
        </div>
      )}

      <dialog id="my_modal_1" className="modal ">
        <div className="modal-box rounded-lg shadow-lg p-6 bg-white text-black max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Congratulations!
          </h2>

          <div className="divider"></div>

          {/* Display the question */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Question:</h3>
            <p className="text-xl capitalize text-gray-700 mt-2 font-bold ">
              {question || "No question entered"}
            </p>
          </div>

          {/* Display final time */}
          <div className="flex justify-center space-x-8 mb-4">
            <div className="text-center">
              <span className="block text-4xl font-mono text-blue-500">
                {days}
              </span>
              <span className="text-sm text-gray-500">Days</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-mono text-blue-500">
                {hours}
              </span>
              <span className="text-sm text-gray-500">Hours</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-mono text-blue-500">
                {minutes}
              </span>
              <span className="text-sm text-gray-500">Minutes</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-mono text-blue-500">
                {seconds}
              </span>
              <span className="text-sm text-gray-500">Seconds</span>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn "
                onClick={() => {
                  navigate(`/DetailsA/${question}`);
                }}
              >
                Detailed Analysis
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="flex w-full justify-end items-center gap-x-4 mb-6">
        <div className="text-center w-1/2 mb-12 mr-auto ">
          <label className="input input-bordered flex items-center gap-2 mx-auto w-full ">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`h-4 w-4 opacity-70 ${loading ? "hidden" : ""}`}
              onClick={() => fetchSteps(question, language)}
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            {loading && (
              <span className="loading loading-infinity loading-md"></span>
            )}
          </label>
        </div>
        <select
          className="select select-bordered w-26 max-w-xs"
          onChange={handleLang}
        >
          <option disabled selected>
            Language
          </option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
        <select
          className="select select-bordered w-26 max-w-xs"
          onChange={handleTheme}
        >
          <option disabled selected>
            Theme
          </option>
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>
          <option value="vs-light">VS Light</option>
          <option value="hc-black">High Contrast</option>
        </select>
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/project-roadmap");
          }}
        >
          Learn Theory
        </button>

        <button
          className="btn btn-accent"
          onClick={() => {
            setHint(true);
          }}
        >
          hint
        </button>
        {hint && (
          <div
            className="toast toast-start z-40"
            onClick={() => {
              setHint(false);
            }}
          >
            <div className="alert alert-info z-10">
              <span>{stepHint}</span>
            </div>
          </div>
        )}
        {Object.keys(structResponse).length !== 0 && (
          <div className="drawer w-10 absolute top-3 right-10 z-30">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button bg-amber-400 p-4 rounded-full "
              >
                <GoLightBulb color="#ffffff" />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 ">
                <p className="text-center font-bold mb-6">Tips and Hints</p>
                {/* Sidebar content here */}
                <li>
                  <a>{structResponse.hints[0]}</a>
                </li>
                <li>
                  <a>{structResponse.hints[1]}</a>
                </li>
                <div className="mt-auto mb-5">
                  <p className="text-center font-bold">Further Steps</p>
                  <p>{structResponse.nextStep}</p>
                </div>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="pl-4 flex gap-4">
        <div className="basis-1/5">
          <div className="mb-4 font-bold">Steps</div>
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            <ul className="steps steps-vertical">
              {steps.map((step, index) => (
                <li
                  key={step.step_id}
                  className={`step ${currentStep === index ? "step-primary" : ""
                    } ${index > currentStep && !completedSteps.includes(index)
                      ? "step-disabled"
                      : ""
                    }`}
                  onClick={() => handleStepClick(index)}
                >
                  {step.step_title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 basis-3/5">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-3">Code Editor</h3>
            <MonacoEditor
              key={language}
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={theme}
            // options={{
            //   readOnly: completedSteps.includes(currentStep),
            // }}
            />
          </div>
          <div className="flex gap-x-2 items-center pr-14">
            {codeparseLoading ? (
              <span className="loading loading-dots loading-lg text-primary"></span>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit}>
                {finalTime && (
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    tweenDuration={2000}
                  />
                )}
                Submit
              </button>
            )}
            <button className="btn btn-primary" onClick={runCode}>
                Run Code
              </button>
            {codeparseError && (
              <div className="badge badge-error gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-4 w-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                error
              </div>
            )}
          </div>
          <div className="mt-5 bg-base-300 border">
            <p className="ml-4 font-bold">Console</p>
            <div className="bg-base-200 flex px-4 py-4">{consoleLogs}</div>
          </div>
        </div>

        <div className="w-64">
          <div className="mb-4 font-bold">Keywords</div>
          <div className="bg-base-200 border rounded-md p-4">
            <ul className="list-disc pl-5">
              {keywords.map((kw, index) => (
                <li key={index}>
                  <strong>{kw.keyword}:</strong> {kw.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="fixed bottom-0 right-0 flex gap-5 z-10 bg-gray-900 bg-opacity-5 p-3 backdrop-blur-sm mix-blend-multiply">
            <div>
              <span className="countdown font-mono text-4xl">
                <span style={{ "--value": days } as React.CSSProperties}></span>
              </span>
              days
            </div>
            <div>
              <span className="countdown font-mono text-4xl">
                <span
                  style={{ "--value": hours } as React.CSSProperties}
                ></span>
              </span>
              hours
            </div>
            <div>
              <span className="countdown font-mono text-4xl">
                <span
                  style={{ "--value": minutes } as React.CSSProperties}
                ></span>
              </span>
              min
            </div>
            <div>
              <span className="countdown font-mono text-4xl">
                <span
                  style={{ "--value": seconds } as React.CSSProperties}
                ></span>
              </span>
              sec
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
