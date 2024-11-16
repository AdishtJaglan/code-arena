import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProblemSet from "./pages/ProblemSet";
import ProblemDetails from "./pages/ProblemDetails";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<ProblemSet />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
