import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CodeEditor from "./pages/CodeEditor";
import Project from "./pages/Project";
import DetailsA from "./pages/DetailsA";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import QuestionPage from "./pages/QuestionPage";
import Quiz from "./pages/Quiz";
import ForumPage from "./pages/forum";
import TimeTracker from './components/TimeTracker';


// Import FontAwesome for profile icon (optional)
import SelfProfile from "./pages/SelfProfile";
import Profiles from "./pages/Profiles";
import SwitchTest from "./pages/SwitchTest";
import CreateMeeting from "./pages/CreateMeeting";
import AdministratorLogin from "./pages/AdministratorLogin";
import CreateAssignment from "./pages/CreateAsssignment";
import Assignment from "./pages/Assignment";
import AssignmentNew from "./pages/AssignmentNew";
import Landing from "./pages/Landing";
import UserLogin from "./pages/UserLogin";

function App() {
  return (
    <>
      <TimeTracker />
      <Router>
        <Routes>
          <Route path="/ai-tutor" element={<CodeEditor />} />
          <Route path="/project-roadmap" element={<Project />} />
          <Route path="/DetailsA/:id" element={<DetailsA />} />
          <Route path="/portal/*" element={<Portal />} />
          <Route path="/module/java" element={<QuestionPage module="Java" />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/your-profile" element={<SelfProfile />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route
            path="/module/python"
            element={<QuestionPage module="Python" />}
          />
          <Route path="/module/c" element={<QuestionPage module="C" />} />
          <Route
            path="/module/javascript"
            element={<QuestionPage module="JavaScript" />}
          />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/SwitchTest" element={<SwitchTest />} />
          <Route path="/create-room" element={<CreateMeeting />} />
          <Route path="/AdministratorLogin" element={<AdministratorLogin />} />
          <Route
            path="/admin/create-assignment"
            element={<CreateAssignment />}
          />

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/UserLogin" element={<UserLogin />} />

          <Route path="/Assignment" element={<AssignmentNew />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
