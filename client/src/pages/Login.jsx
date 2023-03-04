import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// Define a functional component called Login
const Login = () => {
  // Use useState hook to create state variables for inputs and errors
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setError] = useState(null);

  // Use useNavigate hook to create a navigate function
  const navigate = useNavigate();

  //useContext hook to get the login function from the AuthContext.
  const { login } = useContext(AuthContext);

  // Define handleChange function to update the input state variables when the user types into the input fields
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Define handleSubmit function to handle the form submission when the user clicks the submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post the user input to the "/auth/login" endpoint and navigate to the home page
      await login(inputs);
      navigate("/");
    } catch (err) {
      // If there is an error, set the error state variable to the error message
      setError(err.response.data);
    }
  };

  // Render the login form with input fields for username and password and a button to submit the form
  return (
    <div className="auth">
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Login</button>
        {err && <p>{err}</p>}
        <span>
          Don't you have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
