"use client";

import ComposePost from "./ComposePost";
import styles from "./mainSection.module.css";
import NewsFeed from "./NewsFeed";

import { useState, useEffect } from "react";

const MainSection = () => {
  const [posts, setPosts] = useState([]);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
      });

      const result = await response.json();
      if (result.success) {
        setPosts(result.posts);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      setError("Failed to fetch posts " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setFullName(data.fullName);
      setUserName(data.userName);
    } else {
      console.error("Failed to fetch Me");
    }
  };
  // Handle new post submission and add it to the posts list
  const handleNewPost = async (newPost) => {
    setPosts([newPost, ...posts]); // Add new post at the top
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        // Remove deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        console.error(result.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
    fetchMe();
  }, []);

  return (
    <>
      <div className={styles.feed}>
        <div className={styles.head}>
          <div className={styles.you}>For you</div>
          <div className={styles.following}>Following</div>
        </div>
        <div>
          <hr className={styles.lineBreak} />
        </div>
        <div>
          {" "}
          <ComposePost onPostCreated={handleNewPost} />{" "}
        </div>
        <div>
          <hr className={styles.lineBreak} />
          <br />
          <hr className={styles.lineBreak} />
        </div>
        <div>
          {loading ? (
            <div className={styles.spinner}></div> // Show spinner when loading
          ) : (
            <NewsFeed
              posts={posts}
              fullName={fullName}
              userName={userName}
              onDeletePost={handleDeletePost}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainSection;
