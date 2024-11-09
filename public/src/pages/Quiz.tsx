import axios from "axios";
import { ArrowRight, CheckCircle, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setIncrementStar, setUserTags, useAppDispatch } from "./redux";

const apiUrl = process.env.REACT_APP_API;

const Quiz = () => {
  const { id } = useParams();
  const location = useLocation();
  const [topic, setTopic] = useState<any>(
    new URLSearchParams(location.search).get("topic")
  );
  const [quizData, setQuizData] = useState<any>({
    questions: [
      {
        id: 1,
        prompt:
          "What command is used to navigate to the root directory in Linux?",
        answers: [
          { text: "cd /", correct: true },
          { text: "cd ..", correct: false },
          { text: "ls -l", correct: false },
          { text: "pwd", correct: false },
        ],
      },
      {
        id: 2,
        prompt: "What is the purpose of the 'chmod' command in Linux?",
        answers: [
          { text: "Change file permissions", correct: true },
          { text: "Create a new directory", correct: false },
          { text: "List files and directories", correct: false },
          { text: "Delete a file", correct: false },
        ],
      },
      {
        id: 3,
        prompt: "What command is used to view the contents of a file in Linux?",
        answers: [
          { text: "cat", correct: true },
          { text: "mkdir", correct: false },
          { text: "rm", correct: false },
          { text: "cp", correct: false },
        ],
      },
      {
        id: 4,
        prompt: "Which of the following is a common Linux distribution?",
        answers: [
          { text: "Ubuntu", correct: true },
          { text: "Windows", correct: false },
          { text: "macOS", correct: false },
          { text: "Android", correct: false },
        ],
      },
      {
        id: 5,
        prompt: "What is the purpose of the 'grep' command in Linux?",
        answers: [
          { text: "Search for text within files", correct: true },
          { text: "Create a new file", correct: false },
          { text: "Compress a file", correct: false },
          { text: "Run a program", correct: false },
        ],
      },
    ],
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const fetchQuiz = async (topic: any) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/quiz/generate`, {
        topic,
      });
      setQuizData(JSON.parse(data));
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      // You might want to add error handling here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(id);
    setTopic(id);
    fetchQuiz(id);
  }, [id]);

  const handleAnswerClick = (answer: any) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer.correct);
    if (answer.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <div className="form-control">
          <div className="input-group flex flex-row">
            <input
              type="text"
              placeholder="Enter quiz topic..."
              className="input input-bordered w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button
              className="btn btn-square"
              onClick={() => fetchQuiz(topic)}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Search />
              )}
            </button>
          </div>
        </div>
      </div>

      {quizData && !loading && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Quiz on {topic}</h2>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg">
                Question {currentQuestionIndex + 1} of{" "}
                {quizData.questions.length}
              </p>
              <p className="text-lg">
                Score: {score}/{quizData.questions.length}
              </p>
            </div>
            <p className="text-xl mb-6">{currentQuestion.prompt}</p>
            <ul className="space-y-4">
              {currentQuestion.answers.map((answer: any, index: any) => (
                <li key={index}>
                  <button
                    className={`btn btn-outline w-full justify-start ${
                      selectedAnswer === answer
                        ? answer.correct
                          ? "btn-success"
                          : "btn-error"
                        : ""
                    }`}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={selectedAnswer !== null}
                  >
                    {answer.text}
                    {selectedAnswer === answer && (
                      <span className="ml-2">
                        {answer.correct ? (
                          <CheckCircle className="inline" />
                        ) : (
                          <XCircle className="inline" />
                        )}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {selectedAnswer && (
              <div className="mt-6">
                <p
                  className={`text-lg ${
                    isCorrect ? "text-success" : "text-error"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect. Try again!"}
                </p>
              </div>
            )}
            {currentQuestionIndex < quizData.questions.length - 1 &&
              selectedAnswer && (
                <button
                  className="btn btn-primary mt-6"
                  onClick={handleNextQuestion}
                >
                  Next Question <ArrowRight className="ml-2" />
                </button>
              )}
            {currentQuestionIndex === quizData.questions.length - 1 &&
              selectedAnswer && (
                <div className="mt-6">
                  <p className="text-xl">
                    Quiz completed! Your final score is {score}/
                    {quizData.questions.length}
                  </p>
                  <div className="flex gap-x-4">
                  <button
                    className="btn btn-primary mt-4"
                    onClick={() => fetchQuiz(topic)}
                  >
                    Start New Quiz
                  </button>
                  <button
                    className="btn btn-primary mt-4"
                    onClick={() => {
                      dispatch(setIncrementStar(1))
                      dispatch(setUserTags({tag:id}))
                      navigate('/your-profile')
                    }}
                  >
                   View Your Progress
                  </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
