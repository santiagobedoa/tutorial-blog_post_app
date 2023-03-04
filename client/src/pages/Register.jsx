import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    // setting initial state for inputs using useState hook
    username: "",
    email: "",
    password: "",
  });

  const [err, setError] = useState(null); // setting initial state for error using useState hook

  const navigate = useNavigate(); // using useNavigate hook from react-router-dom to navigate

  const handleChange = (e) => {
    // function to handle input changes
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // using spread operator to spread previous state and update the current input
  };

  const handleSubmit = async (e) => {
    // function to handle form submit
    e.preventDefault(); // preventing the default form submission behavior
    try {
      await axios.post("/auth/register", inputs); // making a post request to register the user using axios library
      navigate("/login"); // navigating to login page after successful registration
    } catch (err) {
      // handling errors if any
      setError(err.response.data); // setting error message from response data
    }
  };

  return (
    <div className="auth">
      {/* containing the authentication form */}
      <h1>Register</h1>
      <form>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange} // triggering handleChange function on input change
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange} // triggering handleChange function on input change
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange} // triggering handleChange function on input change
        />
        <button onClick={handleSubmit}>Register</button>{" "}
        {/* triggering handleSubmit function on form submit */}
        {err && <p>{err}</p>} {/* displaying error message if there's any */}
        <span>
          Do you have an account? <Link to="/login">Login</Link>{" "}
          {/* providing link to login page */}
        </span>
      </form>
    </div>
  );
};

export default Register; // exporting Register component
