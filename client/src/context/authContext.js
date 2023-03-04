import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create a new context called AuthContext
export const AuthContext = createContext();

// Define a component called AuthContextProvider that takes in children as props
export const AuthContextProvider = ({ children }) => {
  // Initialize a state variable called currentUser and set it to either the user object in local storage or null if it does not exist
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Define a function called login that makes a POST request to the /auth/login endpoint with the given inputs and sets the currentUser state variable to the response data
  const login = async (inputs) => {
    const res = await axios.post("/auth/login", inputs);
    setCurrentUser(res.data);
  };

  // Define a function called logout that makes a POST request to the /auth/logout endpoint and sets the currentUser state variable to null
  const logout = async (inputs) => {
    await axios.post("/auth/logout");
    setCurrentUser(null);
  };

  // Store the currentUser state variable in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Return the AuthContext.Provider component with the currentUser, login, and logout functions as values and the children as its child components
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
