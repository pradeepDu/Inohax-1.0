import axios from "axios";
import React, { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API;

const CreateAssignment = () => {
  const [lang, setLang] = useState<string>(""); // Language selected
  const [question, setQuestion] = useState<string>(""); // Question entered
  const [fetchQuestions, setFetchQuestions] = useState<any[]>([]); // Store fetched questions

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/uploadQuestion`,
        {
          question, // Send question text
          lang, // Send selected language
        }
      );
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function start() {
      const { data } = await axios.get(`${apiUrl}/getQuestions`);
      setFetchQuestions(data.questions); // Update the state with fetched questions
      console.log(data.questions);
    }
    start();
  }, []);

  return (
    <div className="flex">
      {/* Left Side: Form */}
      <div className="flex basis-1/2 justify-center items-center h-screen bg-gray-900">
        <div className="card w-full max-w-lg bg-gray-800 shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-center text-white">
            Create Assignment
          </h1>
          <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-lg text-gray-300">
                  Add your Question
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-28 w-full bg-gray-100 text-gray-800 placeholder-gray-500"
                placeholder="Post your question"
                value={question}
                onChange={
                  (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setQuestion(e.target.value) // Update question state
                }
              ></textarea>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-lg text-gray-300">
                  Select Language
                </span>
              </label>
              <select
                className="select select-bordered w-full bg-gray-100 text-gray-800"
                onChange={
                  (e: React.ChangeEvent<HTMLSelectElement>) =>
                    setLang(e.target.value) // Update selected language
                }
              >
                <option disabled selected>
                  Choose a language
                </option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>

            <div className="form-control">
              <button
                type="button"
                className="btn btn-outline w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                onClick={handleSubmit}
              >
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Display Fetched Questions */}
      <div className="basis-1/2 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Questions List
        </h2>
        <ul>
          {fetchQuestions.length > 0 ? (
            fetchQuestions.map((q, index) => (
              <li
                key={q._id || index}
                className="p-4 mb-4 bg-white rounded-lg shadow-md"
              >
                <p className="text-lg font-semibold text-gray-800">
                  Question: {q.question}
                </p>
                <p className="text-sm text-gray-600">Language: {q.language}</p>
              </li>
            ))
          ) : (
            <p>No questions found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateAssignment;
