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
import ComposeRepost from "@/components/ComposeRepost/ComposeRepost";
import ComposeReply from "@/components/ComposeReply/ComposeReply";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NewsFeedFooter = ({
  postId,
  likes,
  reposts,
  comments,
  onPostReposted,
  onPostRemove,
  userImage,
  ownerId,
}) => {
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [liked, setLiked] = useState(false);

  const [repostCount, setRepostedCount] = useState(reposts?.length || 0);
  const [reposted, setReposted] = useState(false);
  const [replyCount, setRepliedCount] = useState(comments?.length || 0);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOpenMore, setIsOpenMore] = useState(false);
  const boxMoreRef = useRef(null);

  const [showRepostModal, setShowRepostModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const handlePopState = () => {
      setShowRepostModal(false);
      setShowReplyModal(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
        const res = await fetch(`${window.location.origin}/api/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const userId = data._id.toString();
          setCurrentUserId(userId);
          setLiked(likes.includes(userId));
          setReposted(reposts.includes(userId));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  // Toggle function
  const toggleMore = () => {
    setIsOpenMore(true); // Open MoreOptions
  };

  const handleOpenRepost = () => {
    setIsOpenMore(false);
    setShowRepostModal(true);
    window.history.pushState(null, "", "/compose/post"); // Change URL without navigation
  };

  const handleCloseRepost = () => {
    setShowRepostModal(false);
    setShowReplyModal(false);

    router.push("/home");
  };

  const handleLike = async () => {
    const res = await fetch("/api/tweet/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, currentUserId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likes);
      if (data.liked) {
        // if the user liked the post create a notification
        await fetch("/api/notification", {
          method: "POST",
          body: JSON.stringify({
            recipient: ownerId, // post owner Id
            sender: currentUserId,
            postId: postId,
            type: "like",
          }),
        });
      }
    }
  };

  const handleRepost = async () => {
    let content = "";
    const res = await fetch("/api/tweet/repost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, currentUserId, content }),
    });
    if (res.ok) {
      const data = await res.json();

      setReposted(data.reposted);
      setRepostedCount(data.reposts);
      setIsOpenMore(false);
      if (data.reposted) {
        // do an repost

        // if the user reposted the post create a notification
        await fetch("/api/notification", {
          method: "POST",
          body: JSON.stringify({
            recipient: ownerId, // post owner Id
            sender: currentUserId,
            postId: postId,
            type: "repost",
          }),
        });

        // update the posts in <MainSection/> to get the updated result in NewsFeed

        onPostReposted(data.newPost);
      } else {
        // remove repost
        // update the posts in parent
        //console.log("removed reposted id : ", data.removedRepostedId);
        onPostRemove(data.removedRepostedId);
      }
    }
  };

  const handleOpenReply = () => {
    setShowReplyModal(true);
    window.history.pushState(null, "", "/compose/post"); // Change URL without navigation
  };

  const handleCloseReply = () => {
    setShowReplyModal(false);
    router.push("/home");
  };
  // Each reply is a separate post but references a parentPostId.
  const handleReply = () => {};

  return (
    <>
      <div
        className={`${styles.icon} ${styles.icon1}`}
        onClick={handleOpenReply}
      >
        <span className={styles.iconRVBS}>
          <LuMessageCircle />
          <div className={styles.tooltip}>Reply</div>
        </span>
        <span>{replyCount > 0 ? replyCount : ""}</span>
      </div>
      {showReplyModal && (
        <ComposeReply
          onPostReplied={onPostReposted}
          setRepliedCount={setRepliedCount}
          handleCloseReply={() => handleCloseReply()}
          repliedPostId={postId} // Pass original post
          userImage={userImage}
          currentUserId={currentUserId}
          ownerId={ownerId}
        />
      )}

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
              <div className={styles.rowQuote} onClick={handleOpenRepost}>
                <span className={styles.space}>
                  <LuPenLine />
                </span>
                Quote
              </div>
            </div>
          </div>
        )}

        {showRepostModal && (
          <ComposeRepost
            onPostReposted={onPostReposted}
            setReposted={setReposted}
            setRepostedCount={setRepostedCount}
            handleCloseRepost={() => handleCloseRepost()}
            repostedId={postId} // Pass original post
            userImage={userImage}
            currentUserId={currentUserId}
            ownerId={ownerId}
          />
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
    </>
  );
};

export default NewsFeedFooter;
