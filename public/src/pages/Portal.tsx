import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaJava,
  FaPython,
  FaCuttlefish,
  FaJsSquare,
  FaReact,
  FaDatabase,
  FaLinux,
} from "react-icons/fa";
import { setLanguage, useAppDispatch } from "./redux";
import { Sidebar, SidebarItem } from "./Sidebar";
import Header from "../components/Header";
import { Book, Map, CheckCircle, Code, MessageCircle, User } from "lucide-react";

const Portal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("learning");

  // Example Data for Learning Modules
  const learningModules = [
    {
      icon: <FaJava className="text-indigo-500 text-4xl mb-4" />,
      title: "Learn Java",
      description:
        "Master Java programming, including OOP concepts, advanced syntax, and real-world projects.",
      questions: 18,
      route: "/module/java",
    },
    {
      icon: <FaCuttlefish className="text-blue-500 text-4xl mb-4" />,
      title: "Learn C",
      description:
        "Dive into C programming with a focus on memory management, pointers, and efficient algorithms.",
      questions: 19,
      route: "/module/c",
    },
    {
      icon: <FaPython className="text-green-500 text-4xl mb-4" />,
      title: "Learn Python",
      description:
        "Explore Python from basics to advanced topics, such as data science, web development, and automation.",
      questions: 14,
      route: "/module/python",
    },
    {
      icon: <FaJsSquare className="text-yellow-500 text-4xl mb-4" />,
      title: "Learn JavaScript",
      description:
        "Become proficient in JavaScript, mastering DOM manipulation, modern frameworks, and event handling.",
      questions: 14,
      route: "/module/javascript",
    },
  ];

  // Example Data for Testing Modules
  const testingModules = [
    {
      icon: <FaJsSquare className="text-yellow-500 text-4xl mb-4" />,
      title: "Learn Express",
      description:
        "Master Express.js and develop server-side applications with Node.js, routing, and middleware.",
      questions: 80,
      route: "/quiz/express",
    },
    {
      icon: <FaReact className="text-blue-500 text-4xl mb-4" />,
      title: "Learn React",
      description:
        "Master React.js, create dynamic UIs, and learn about state management, hooks, and more.",
      questions: 100,
      route: "/quiz/react",
    },
    {
      icon: <FaDatabase className="text-green-500 text-4xl mb-4" />,
      title: "Learn SQL",
      description:
        "Master SQL database querying and learn how to handle data with relational databases.",
      questions: 70,
      route: "/quiz/sql",
    },
    {
      icon: <FaLinux className="text-gray-500 text-4xl mb-4" />,
      title: "Learn Linux",
      description:
        "Explore Linux commands, shell scripting, file systems, and server administration.",
      questions: 90,
      route: "/quiz/linux",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <Sidebar>
        <SidebarItem onClick={() => navigate("/ai-tutor")}>
          <Code style={{ marginRight: '8px' }} />
          Code Editor
        </SidebarItem>
        <SidebarItem onClick={() => navigate("/project-roadmap")}>
          <Map style={{ marginRight: '8px' }} />
          Roadmap Generator
        </SidebarItem>
        <SidebarItem onClick={() => setActiveTab("learning")}>
          <Book style={{ marginRight: '8px' }} />
          Learning Modules
        </SidebarItem>
        <SidebarItem onClick={() => setActiveTab("testing")}>
          <CheckCircle style={{ marginRight: '8px' }} />
          Testing Modules
        </SidebarItem>
        <SidebarItem onClick={() => navigate("/forum")}>
          <MessageCircle style={{ marginRight: '8px' }} />
          Query Forum
        </SidebarItem>
        <SidebarItem onClick={() => navigate("/your-profile")}>
          <User style={{ marginRight: '8px' }} />
          My Profile
        </SidebarItem>
      </Sidebar>
      <div className="flex-grow">

        <div className="max-w-7xl mx-auto p-10">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-10">
            {activeTab === "learning" ? "Explore Learning Modules" : "Test Your Skills"}
          </h1>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeTab === "learning" ? learningModules : testingModules).map((module, index) => (
              <div
                key={index}
                className="card bg-white shadow-xl rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {module.icon}
                <h2 className="card-title text-2xl font-bold text-gray-800 mb-4">
                  {module.title}
                </h2>
                <p className="text-gray-700 mb-2">{module.description}</p>
                <div className="badge badge-outline mb-4">
                  Questions: {module.questions}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const route = module.route;
                    const regex = /\/(module|quiz)\/(\w+)/;
                    const match = route.match(regex);

                    if (match) {
                      const lang = match[2];
                      dispatch(setLanguage({ language: lang }));
                    }
                    navigate(module.route);
                  }}
                >
                  {activeTab === "learning" ? "Start Learning" : "Start Testing"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
