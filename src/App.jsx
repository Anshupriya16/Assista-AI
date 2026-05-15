import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AppLayout from "./Components/AppLayout";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChatHistory from "./pages/ChatHistory.jsx";
import Settings from "./pages/Setting.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#080d17] text-white">
      {!hideNavbar && <Navbar />}

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/history" element={<AppLayout><ChatHistory /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
