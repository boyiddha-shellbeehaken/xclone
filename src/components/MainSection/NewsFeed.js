"use client";
import styles from "./newsFeed.module.css";
import user from "./../../../public/images/user.jpeg";
import Image from "next/image";
import NewsFeedHeader from "./NewsFeedHeader";
import NewsFeedFooter from "./NewsFeedFooter";
import { BiRepost } from "react-icons/bi";
import { useRouter } from "next/navigation";

const NewsFeed = ({
  posts,
  originalPosts, // Contains all posts to find original post if needed
  fullName,
  userName,
  onDeletePost,
  onPostReposted,
  handlePostRemoved,
}) => {
  const router = useRouter();

  return (
    <>
      {posts.map((post) => {
        // Find the original post if it's a repost
        const isRepost = !!post.reposted;
        const originalPost = isRepost
          ? originalPosts.find((p) => p._id === post.reposted)
          : post; // If not a repost, use the post itself

        return (
          <div key={post._id} className={styles.mainDiv}>
            {/* Show "You reposted" if it's a repost */}
            {isRepost && (
              <div className={styles.repostedText}>
                <span>
                  <BiRepost className={styles.repostedIcon} />
                </span>
                <span>You reposted</span>
              </div>
            )}

            <div className={styles.postContainer}>
              <div className={styles.profile}>
                <Image
                  className={styles.img}
                  src={user}
                  alt="user profile"
                  width="35"
                  height="35"
                />
              </div>
              <div className={styles.content}>
                <div className={styles.header}>
                  <NewsFeedHeader
                    fullName={fullName}
                    userName={userName}
                    postId={post._id}
                    onDeletePost={onDeletePost}
                  />
                </div>
                <div
                  className={styles.mainText}
                  onClick={() => router.push(`/${userName}/status/${post._id}`)}
                >
                  {/* Display Content */}
                  {originalPost?.content && (
                    <div className={styles.postContent}>
                      {originalPost?.content}
                    </div>
                  )}

                  {/* Display Media File (if exists) */}
                  {originalPost?.media?.data && (
                    <div>
                      {originalPost?.media.contentType.startsWith("image/") ? (
                        <img
                          src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                          alt={originalPost?.media.name || "Uploaded Image"}
                          className={styles.media}
                        />
                      ) : originalPost?.media.contentType.startsWith(
                          "audio/"
                        ) ? (
                        <audio controls className={styles.media}>
                          <source
                            src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                            type={originalPost?.media.contentType}
                          />
                          Your browser does not support the audio element.
                        </audio>
                      ) : originalPost?.media.contentType.startsWith(
                          "video/"
                        ) ? (
                        <video controls className={styles.media}>
                          <source
                            src={`data:${originalPost?.media.contentType};base64,${originalPost.media.data}`}
                            type={originalPost?.media.contentType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p>
                          Unsupported file type:{" "}
                          {originalPost?.media.contentType}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.reaction}>
                  <NewsFeedFooter
                    postId={post._id}
                    likes={post.likes}
                    reposts={post.reposts}
                    onPostReposted={onPostReposted}
                    onPostRemove={handlePostRemoved}
                  />
                </div>
              </div>
            </div>
            <div className={styles.row2}>
              <hr className={styles.lineBreak} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NewsFeed;
