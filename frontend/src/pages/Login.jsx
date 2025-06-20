import { useState } from "react";
import axios from "axios";
import "../assets/Login.css";
import { useNavigate } from "react-router-dom";


function Login({ setUser }) {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isSignup ? "/api/auth/signup" : "/api/auth/login";
        try {
            const res = await axios.post(`http://localhost:5000${url}`, form);
            setUser(res.data);
            navigate("/dashboard"); // ✅ Navigate after login
        } catch (err) {
            alert(err.response?.data?.error || "Something went wrong");
        }
    };



    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isSignup ? "Sign Up" : "Login"}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            <input name="name" placeholder="Name" onChange={handleChange} required />
                            <select name="role" onChange={handleChange}>
                                <option value="patient">Patient</option>
                                <option value="caretaker">Caretaker</option>
                            </select>
                        </>
                    )}
                    <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
                    <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
                    <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
                </form>
                <p>
                    {isSignup ? "Already have an account?" : "New user?"}{" "}
                    <button onClick={() => setIsSignup(!isSignup)}>{isSignup ? "Login" : "Sign Up"}</button>
                </p>
            </div>
        </div>
    );

}
export default Login;
