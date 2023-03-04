import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// This function is responsible for registering a new user in the database
export const register = (req, res) => {
  // CHECK EXISTING USER
  // SQL query to check if the user already exists in the database
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  // Execute the query with the user's email and username as parameters
  db.query(query, [req.body.email, req.body.username], (err, data) => {
    // Check for errors
    if (err) return res.json(err);
    // If the query returns data, it means the user already exists, return a 409 conflict status code
    if (data.length) return res.status(409).json("User already exists!");

    // Hash the password and create a user
    // Generate a salt value
    const salt = bcrypt.genSaltSync(10);
    // Generate a hash value using the password and the salt value
    const hash = bcrypt.hashSync(req.body.password, salt);

    // SQL query to insert the new user in the database
    const query = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    // Define the values to be inserted in the query, including the hashed password
    const values = [req.body.username, req.body.email, hash];

    // Execute the query with the values as parameters
    db.query(query, [values], (err, data) => {
      // Check for errors
      if (err) return res.json(err);
      // If successful, return a 200 status code with a message
      return res.status(200).json("User has been created.");
    });
  });
};

// This function handles user login
export const login = (req, res) => {
  // SQL query to check if the user exists in the DB
  const query = "SELECT * FROM users WHERE username = ?";

  // Execute the query with the provided username
  db.query(query, [req.body.username], (err, data) => {
    // Handle DB errors
    if (err) return res.json(err);

    // If no user is found, return an error
    if (data.length === 0) return res.status(404).json("User not found!");

    // Check if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    // If the password is incorrect, return an error
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    // If the login is successful, create a JSON web token
    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    // Remove the password from the user data
    const { password, ...other } = data[0];

    // Set the token as a http-only cookie and send user data as response
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

// This function handles user logout
export const logout = (req, res) => {
  // Clear the access_token cookie and send a success message
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
