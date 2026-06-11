import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
            });

            alert("Registration Successful");

            console.log(response.data);
        } catch (error) {
            console.log(error);
            alert("Registration Failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br />
            <br />

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

            <button onClick={handleRegister}>
                Register
            </button>

            <br />
            <br />

            <Link to="/login">
                Already have an account?
            </Link>
        </div>
    );
}

export default Register;