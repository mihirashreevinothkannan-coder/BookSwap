import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/login", {
                email,
                password,
            });

            console.log(response.data);

            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("userName", response.data.name);

            alert("Login Successful");

            navigate("/dashboard");
        } catch (error) {
            console.log(error);

            alert("Invalid Credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleLogin}>
                Login
            </button>

            <br />
            <br />

            <Link to="/register">
                Create Account
            </Link>
        </div>
    );
}

export default Login;