import { FaBrain, FaCode, FaDatabase, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { useAppSelector } from "./redux";

const SelfProfile = () => {
  const profile = useAppSelector((store) => store.userInfo.userInfo);
  const testingModules = [
    {
      icon: <FaBrain className="text-yellow-500 text-4xl mb-4" />,
      title: "Explore artificialintelligence",
      description:
        "Explore the fundamentals of AI, including machine learning, neural networks, and natural language processing.",
      questions: 80,
      route: "/quiz/artificial-intelligence",
    },
    {
      icon: <FaRobot className="text-blue-500 text-4xl mb-4" />,
      title: "Explore machinelearning",
      description:
        "Master machine learning algorithms, data preprocessing, model evaluation, and implementation using popular libraries.",
      questions: 100,
      route: "/quiz/machine-learning",
    },
    {
      icon: <FaCode className="text-blue-400 text-4xl mb-4" />,
      title: "Explore typescript",
      description:
        "Master TypeScript, including static typing, interfaces, generics, and its integration with popular frameworks.",
      questions: 70,
      route: "/quiz/typescript",
    },
    {
      icon: <FaDatabase className="text-green-500 text-4xl mb-4" />,
      title: "Explore mongoDB",
      description:
        "Explore MongoDB, including document model, CRUD operations, indexing, and integration with server-side applications.",
      questions: 90,
      route: "/quiz/mongodb",
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap flex-col justify-center items-center gap-y-4">
      <button
        className="btn btn-warning absolute top-16 left-10 font-bold px-12"
        onClick={() => navigate("/admin/create-assignment")}
      >
        Create assignment
      </button>
      <div className="w-full flex justify-center items-center">
        <ProfileCard profile={profile} />
      </div>
      <h1 className=" font-mono font-bold text-3xl mb-3">Suggestions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-16">
        {testingModules.map((module, index) => (
          <div
            key={index}
            className="card bg-white shadow-xl rounded-lg p-6 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {module.icon}
            <h2 className="card-title text-2xl font-bold text-gray-800 mb-4">
              {module.title}
            </h2>
            <p className="text-gray-700 mb-2">{module.description}</p>

            <button
              className="btn btn-accent"
              onClick={() => navigate(module.route)}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfProfile;
