import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserByEmail, findUserByUsername } from "@/services/userService";
import {
  createPostService,
  getAllPostsService,
  getUserPostsService,
  likePostService,
  repostService,
  fetchPost,
  removePost,
} from "@/services/postService";

export const createPost = async (request) => {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user by email
    const { email } = session.user;
    const res = await findUserByEmail(email);
    if (!res.success)
      return NextResponse.json({ success: false, message: "User not found" });

    // Extract form data
    const data = await request.formData();
    const file = data.get("file");
    const content = data.get("content");

    if (!file && !content) {
      return NextResponse.json({
        success: false,
        message: "Post must contain either content or a file",
      });
    }

    // Call the service to create a post
    const newPost = await createPostService(res.user._id, content, file);

    return NextResponse.json({
      success: true,
      message: "Successfully Uploaded",
      post: newPost,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({
      success: false,
      message: "Upload Failed",
      error: error.message,
    });
  }
};

// get logged in user posts
export const getUserPosts = async (req) => {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user by email
    const { email } = session.user;
    const res = await findUserByEmail(email);
    if (!res.success)
      return NextResponse.json({ success: false, message: "User not found" });

    // Fetch posts from the service
    const posts = await getUserPostsService(res.user._id);

    //console.log("✅  user posts: ", posts);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
};

export async function getUserPostsByUserName(req, { params }) {
  try {
    const { userName } = await params;
    const user = await findUserByUsername(userName);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Fetch posts from the service
    const posts = await getUserPostsService(user._id);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
}

export const returnAllPosts = async (req) => {
  try {
    const posts = await getAllPostsService();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve posts",
    });
  }
};

export const likeOrUnlikePost = async (req) => {
  try {
    const { postId, currentUserId } = await req.json();
    // console.log(`postId: ${postId}, userId: ${currentUserId}`);

    const result = await likePostService(postId, currentUserId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { likes: result.likes, liked: result.liked },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in like/unlike Controller:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export const repostController = async (req) => {
  try {
    const { postId, currentUserId, content } = await req.json();
    // console.log(`postId: ${postId}, userId: ${currentUserId}`);

    const result = await repostService(postId, currentUserId, content);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        reposts: result.reposts,
        reposted: result.reposted,
        newPost: result.newPost,
        removedRepostedId: result.removedRepostId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in repost without quote Controller:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export async function deletePostById(req, { params }) {
  try {
    const { postId } = await params; // Use params to get the post ID from the URL
    //console.log("✅  id is : ", id);
    const deletedPost = await removePost(postId);
    if (!deletedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function getPostById(req, { params }) {
  try {
    const { postId } = await params; // Use params to get the post ID from the URL
    //console.log("✅  id is : ", id);
    const post = await fetchPost(postId);

    //console.log("✅  post is : ", post);
    // console.log("✅  post id ", post._id);
    // console.log("✔  post content ", post.content);
    // console.log("✔  post likes ", post.likes);

    // console.log("✔  post reposts ", post.reposts);
    // console.log("✔  post reposted", post.reposted);
    // console.log("✔  post parentPostId ", post.parentPostId);
    //console.log("✔  post comments ", post.comments);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET => sample output
/*
{
  "success": true,
  "post": {
    "_id": "postId123",
    "userId": {
      "_id": "user123",
      "userName": "john_doe",
      "fullName": "John Doe",
      "image": "profile.jpg"
    },
    "content": "This is a sample post",
    "media": {
      "name": "image.png",
      "data": "...",
      "contentType": "image/png"
    },
    "likes": ["user456", "user789"],
    "reposts": ["user111", "user222"],
    "reposted": {
      "_id": "originalPostId"
    },
    "parentPostId": {
      "_id": "parentPostId123"
    },
    "comments": [
      {
        "_id": "commentId1",
        "userId": {
          "_id": "user567",
          "userName": "jane_doe",
          "fullName": "Jane Doe",
          "image": "jane.jpg"
        },
        "content": "This is a comment",
        "media": null,
        "likes": ["user999"]
      }
    ],
    "createdAt": "2025-03-06T12:00:00Z",
    "updatedAt": "2025-03-06T12:30:00Z"
  }
}
*/
