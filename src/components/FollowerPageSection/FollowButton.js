import { useState, useEffect } from "react";
import styles from "./followButton.module.css";
import { toggleFollow } from "@/app/actions/followActions";

const FollowButton = ({
  loggedInUserId,
  userId,
  initialFollowers,
  initialFollowing,
}) => {
  const [isFollowing, setIsFollowing] = useState(
    initialFollowing.includes(userId)
  );
  const [isFollowBack, setIsFollowBack] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setIsFollowBack(
      initialFollowers.includes(userId) && !initialFollowing.includes(userId)
    );
  }, [initialFollowers, initialFollowing, loggedInUserId, userId]);

  const handleFollowToggle = async () => {
    try {
      const data = await toggleFollow(loggedInUserId, userId);
      setIsFollowing(data.isFollowing);
      setIsFollowBack(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.followButtonDiv}>
      <button
        className={`${styles.followButton} ${
          isFollowing && hover
            ? styles.unfollow
            : isFollowing
            ? styles.following
            : ""
        }`}
        onClick={handleFollowToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isFollowing
          ? hover
            ? "Unfollow"
            : "Following"
          : isFollowBack
          ? "Follow Back"
          : "Follow"}
      </button>
    </div>

    // {isFollowing
    //   ? ( hover
    //     ? "Unfollow"
    //     : "Following")
    //   : (isFollowBack
    //   ? "Follow Back"
    //   : "Follow" )}
  );
};

export default FollowButton;
