import Image from "next/image";
import { IoIosMore } from "react-icons/io";
import styles from "./commentSection.module.css";
import UserPostFooter from "../MainSection/UserPostFooter";
import { useRouter } from "next/navigation";

const CommentSection = ({ comments, level = 0 }) => {
  const router = useRouter();
  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      {" "}
      {/* Indentation for nested comments */}
      {comments.map((comment) => (
        <div key={comment._id} className={styles.mainContainer}>
          <div className={styles.commentContainer}>
            {/* Comment User Info */}
            <div className={styles.column1}>
              {comment?.userId?.image && (
                <Image
                  className={styles.img}
                  src={comment?.userId?.image}
                  alt="user profile"
                  width="35"
                  height="35"
                />
              )}
            </div>
            <div className={styles.column2}>
              <div className={styles.header}>
                <div className={styles.profileName}>
                  <span
                    className={styles.fullname}
                    onClick={() => router.push(`/${comment?.userId?.userName}`)}
                  >
                    {comment?.userId?.fullName}
                  </span>
                  <span className={styles.username}>
                    @{comment?.userId?.userName}
                  </span>
                </div>
                <div className={styles.containerMore}>
                  <div className={styles.more}>
                    <IoIosMore />
                  </div>
                </div>
              </div>

              <div className={styles.content}>
                {/* Comment Content */}
                <p className={styles.commentText}>{comment.content}</p>

                {/* Comment Media (if any) */}
                {comment?.media?.data && (
                  <div className={styles.commentMedia}>
                    {comment.media.contentType.startsWith("image/") ? (
                      <Image
                        src={`data:${comment.media.contentType};base64,${comment.media.data}`}
                        alt="Comment Image"
                        className={styles.media}
                        loader={base64Loader}
                        width={500}
                        height={300}
                        unoptimized // Allows using Base64 images without Next.js optimization
                      />
                    ) : comment.media.contentType.startsWith("audio/") ? (
                      <audio controls className={styles.media}>
                        <source
                          src={`data:${comment.media.contentType};base64,${comment.media.data}`}
                          type={comment.media.contentType}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    ) : comment.media.contentType.startsWith("video/") ? (
                      <video controls className={styles.media}>
                        <source
                          src={`data:${comment.media.contentType};base64,${comment.media.data}`}
                          type={comment.media.contentType}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <p>Unsupported file type: {comment.media.contentType}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Actions (Likes, Replies, etc.) */}
              <div className={styles.reactions}>
                <UserPostFooter
                  post={comment}
                  postId={comment._id}
                  replyCount={comment?.comments?.length || 0}
                />
              </div>
            </div>
          </div>

          {/* Recursive Rendering for Nested Comments */}
          {comment.comments && comment.comments.length > 0 && (
            <CommentSection comments={comment.comments} level={level + 1} />
          )}
          {level === 0 && (
            <div className={styles.row2}>
              <hr className={styles.lineBreak} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
