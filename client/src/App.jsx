import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/authProvider";

function App() {
  return (
    
    <div className="app-bg flex items-center justify-center">
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/" element={<LoginScreen />} />
          <Route path="/signup" element={<RegisterScreen />} />
        </Routes>
      </Router>
      </AuthProvider>
    </div>
    
  );
}

export default App;
