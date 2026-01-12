import { auth } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./signup";
import Login from "./Login";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import Events from "./Events";
import Navbar from "./Navbar";
import Footer from "./Footer";


function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {!hideLayout && <Navbar />} 
      
      <main className="flex-grow">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}


function App() {
  return (
    <Router>
      <LayoutWrapper>
      <div className="flex flex-col min-h-screen bg-black">
        {/* <Navbar />  */}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            
            <Route path="*" element={<div className="text-white text-center mt-20">404 - Not Found</div>} />
          </Routes>
        </main>

        {/* <Footer /> */}
      </div>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
