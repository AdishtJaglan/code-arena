import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProblemSet from "./pages/ProblemSet";
import ProblemDetails from "./pages/ProblemDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LeaderboardPage from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import FindPartner from "./pages/FindPartner";
import QuestionContribution from "./pages/QuestionContribution";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemSet />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/leaderboard" element={<LeaderboardPage />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        <Route path="/find-partner" element={<FindPartner />}></Route>
        <Route
          path="/question-contribution"
          element={<QuestionContribution />}
        ></Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
