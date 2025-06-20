import './assets/variables.css';
import './assets/styles.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === "patient" ? <Dashboard user={user} /> : <CaretakerDashboard user={user} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

    </Routes>
  );
}
export default App;
