import { auth } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./signup";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default to Login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Optional: 404 Page */}
        <Route path="*" element={<div className="text-white bg-black h-screen flex items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
