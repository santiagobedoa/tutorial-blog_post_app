import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Retrieves posts from a database
export const getPosts = (req, res) => {
  // If the query string includes a category parameter,
  // select all posts from the given category. Otherwise,
  // select all posts.
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  // Use the database object to query the database with the
  // appropriate SQL statement and any necessary parameters.
  db.query(q, [req.query.cat], (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).send(err);

    // Otherwise, send a 200 status code and the data as JSON
    return res.status(200).json(data);
  });
};

// Retrieves a single post from the database
export const getPost = (req, res) => {
  // Select specific fields from both the users and posts table,
  // and join them based on the user ID of the post author.
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  // Use the database object to query the database for the post with
  // the given ID, and any necessary parameters.
  db.query(q, [req.params.id], (err, data) => {
    // If there's an error, send a 500 status code and the error message
    if (err) return res.status(500).json(err);

    // Otherwise, send a 200 status code and the first item in the data array as JSON
    return res.status(200).json(data[0]);
  });
};

// Adds a new post to the database
export const addPost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid!");

    // Otherwise, construct the SQL query to insert a new post into the database
    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    // Define an array of values to be inserted into the database, including the
    // post data from the request body and the user ID from the decoded token
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    // Use the database object to execute the SQL query with the values array
    db.query(q, [values], (err, data) => {
      // If there's an error, return a 500 status code and the error message
      if (err) return res.status(500).json(err);

      // Otherwise, return a 200 status code and a success message
      return res.json("Post has been created.");
    });
  });
};

// Deletes a post from the database
export const deletePost = (req, res) => {
  // Check if the user is authenticated by checking for a token in the cookies
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  // Verify the token using the secret key
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    // If there's an error, the token is not valid
    if (err) return res.status(403).json("Token is not valid");

    // Otherwise, get the ID of the post to be deleted from the request parameters
    const postId = req.params.id;

    // Construct an SQL query to delete the post with the specified ID, but only if
    // the user ID associated with the post matches the ID of the authenticated user
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    // Execute the SQL query with the postId and userInfo.id as parameters
    db.query(q, [postId, userInfo.id], (err, data) => {
      // If there's an error, return a 403 status code and an error message
      if (err) return res.status(403).json("You can delete only your post");

      // Otherwise, return a 200 status code and a success message
      return res.json("Post has been deleted");
    });
  });
};

// Update a post
export const updatePost = (req, res) => {
  // Get the access token from the request cookies.
  const token = req.cookies.access_token;

  // Check if the token exists, if not, return an error response.
  if (!token) return res.status(401).json("Not authenticated!");

  // Verify the token using the "jwtkey" secret key. If the token is not valid, return an error response.
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get the post ID from the request parameters.
    const postId = req.params.id;

    // SQL query to update the post with new values.
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    // An array containing the new values for the post.
    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    // Execute the query using the values and post ID. If there's an error, return an error response. Otherwise, return a success response.
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};
