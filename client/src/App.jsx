import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  return (
    <div className="app-bg flex items-center justify-center">
      <Router>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
