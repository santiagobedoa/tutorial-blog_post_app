import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Defining a functional component named Menu which takes a single prop named cat
const Menu = ({ cat }) => {
  // Initializing posts state with an empty array using useState hook
  const [posts, setPosts] = useState([]);

  // useEffect hook is used to fetch posts related to the category
  useEffect(() => {
    // Defining an async function fetchData to fetch posts related to the category using axios
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    // Calling fetchData function to fetch data when component is mounted or when category is changed
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <img src={`../upload/${post.img}`} alt="post cover" />
          <h2>{post.title}</h2>
          {/* Using Link component to navigate to the post */}
          <Link className="link" to={`/post/${post.id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Menu;
