"use client";

import { LuMessageCircle } from "react-icons/lu";
import { BiRepost } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import { LuPenLine } from "react-icons/lu";

import styles from "./newsFeedFooter.module.css";
import styles2 from "./userPostFooter.module.css";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getLoggedInUser } from "@/app/actions/userActions";
import { postLike, repostTweet } from "@/app/actions/tweetActions";

const UserPostFooter = ({ post, postId, replyCount }) => {
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);

  const [repostCount, setRepostedCount] = useState(post.reposts?.length || 0);
  const [reposted, setReposted] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOpenMore, setIsOpenMore] = useState(false);
  const boxMoreRef = useRef(null);

  const { data: session } = useSession();

  // Toggle function
  const toggleMore = () => {
    setIsOpenMore(true); // Open MoreOptions
  };

  // Close MoreOptions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxMoreRef.current && !boxMoreRef.current.contains(event.target)) {
        setIsOpenMore(false); // Close MoreOptions when clicking outside
      }
    };

    if (isOpenMore) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMore]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;

      try {
        const data = await getLoggedInUser();

        if (data) {
          const userId = data._id.toString();
          setCurrentUserId(userId);
          setLiked(post?.likes?.includes(userId));
          setReposted(post?.reposts?.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  const handleLike = async () => {
    const { liked, likeCount } = await postLike({
      postId,
      currentUserId,
    });
    setLiked(liked);
    setLikeCount(likeCount);
  };

  const handleRepost = async () => {
    const data = await repostTweet({
      repostedId: postId,
      currentUserId: currentUserId,
      content: "",
    });
    setReposted(data.reposted);
    setRepostedCount(data.reposts);
    setIsOpenMore(false);
  };

  return (
    <div className={styles2.reactionsContainer}>
      <div className={`${styles.icon} ${styles.icon1}`}>
        <span className={styles.iconRVBS}>
          <LuMessageCircle />
          <div className={styles.tooltip}>Reply</div>
        </span>
        <span> {replyCount > 0 ? replyCount : ""}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div
          className={`${styles.icon} ${styles.icon2} ${
            isOpenMore && !reposted ? styles.disabled : ""
          } `}
          style={{ color: reposted ? "rgb(93, 204, 71)" : "" }}
          onClick={reposted ? handleRepost : undefined}
        >
          <span className={styles.iconRepost}>
            {" "}
            <BiRepost onClick={toggleMore} />
            <div className={styles.tooltip}>
              {reposted ? "Undo Repost" : "Repost"}
            </div>
          </span>
          <span>{repostCount > 0 ? repostCount : ""}</span>
        </div>
        {isOpenMore && !reposted && (
          <div ref={boxMoreRef}>
            <div className={styles.layoutMore}>
              <div className={styles.rowRepost} onClick={handleRepost}>
                <span className={styles.space}>
                  <BiRepost />
                </span>
                Repost
              </div>
              <div className={styles.rowQuote}>
                <span className={styles.space}>
                  <LuPenLine />
                </span>
                Quote
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${styles.icon} ${styles.icon3}`}
        onClick={handleLike}
        style={{ color: liked ? "rgb(238, 49, 128)" : "" }}
      >
        <span className={styles.iconLike}>
          {liked ? <FaHeart /> : <CiHeart />}
        </span>
        <span>{likeCount > 0 ? likeCount : ""}</span>
        <div className={styles.tooltip}>{liked ? "Unlike" : "Like"}</div>
      </div>
      <div className={`${styles.icon} ${styles.icon1}`}>
        <span className={styles.iconRVBS}>
          {" "}
          <RiBarChartGroupedLine />{" "}
        </span>
        <div className={styles.tooltip}>View</div>
      </div>
      <div>
        <span
          className={`${styles.icon} ${styles.icon1} `}
          style={{ marginRight: "12px" }}
        >
          <span className={styles.iconRVBS}>
            {" "}
            <CiBookmark />{" "}
          </span>
          <div className={styles.tooltip}>Bookmark</div>
        </span>
        <span className={`${styles.icon} ${styles.icon1}`}>
          <span className={styles.iconRVBS}>
            {" "}
            <MdOutlineFileUpload />
          </span>
          <div className={styles.tooltip}>Share</div>
        </span>
      </div>
    </div>
  );
};

export default UserPostFooter;
