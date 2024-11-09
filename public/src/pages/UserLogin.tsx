import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API;

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Hardcoded credentials for demonstration
  const correctUsername = "student";
  const correctPassword = "12345";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate login validation
    if (username === correctUsername && password === correctPassword) {
      setMessage("Login successful!");
      navigate("/Portal");
    } else {
      setMessage("Invalid username or password. Please try again.");
    }
  };
  async function start() {
    const { data } = await axios.post(`${apiUrl}/`, {
      user: "user", //user | admin
      tool: "aitutor", //aitutor | codeforum | roadmap | quizzes | modules | profile | join-meeting   ||  connect | create-assignment | host-meeting | learnings | leaderboard&internships
      aitutor: "", // theory | analysis
      codeforum: "", // ask-questions
      modules: "", // aitutor | theory | analysis
      profile: "", // take-assignment
    });
    console.log(data);
  }
  useEffect(() => {
    start();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 p-10">
      <div className="card w-96 bg-white shadow-xl rounded-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          User Login
        </h2>
        <form className="flex flex-col space-y-6" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered input-primary bg-white w-full focus:ring focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary bg-white w-full focus:ring focus:ring-indigo-300"
          />
          <button
            className="btn btn-primary btn-lg text-white font-semibold py-3 rounded-md shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out focus:ring-4 focus:ring-blue-300"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Display the message based on login status */}
        {message && (
          <p
            className={`mt-4 text-center font-bold ${
              message === "Login successful!"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
