import { NextResponse } from "next/server";
import Conversation from "@/models/chat/conversationModel";

// Fetch or create conversation Id
export async function POST(req) {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { message: "Sender ID and Receiver ID are required." },
        { status: 400 }
      );
    }

    // If senderId and receiverId are the same, check if a self-chat conversation exists
    if (senderId === receiverId) {
      let conversation = await Conversation.findOne({
        participants: [senderId, senderId], // Look for self-chat conversation
      });

      if (!conversation) {
        // If no self-chat conversation exists, create a new one
        conversation = new Conversation({
          participants: [senderId, senderId],
        });
        await conversation.save();

        return NextResponse.json(
          {
            conversationId: conversation._id,
            message: "New self-chat conversation created.",
          },
          { status: 200 }
        );
      }

      // If self-chat conversation exists, return the existing one
      return NextResponse.json(
        {
          conversationId: conversation._id,
          message: "Self-chat conversation retrieved.",
        },
        { status: 200 }
      );
    }

    // Otherwise, check if a conversation already exists between these two users
    const participants = [senderId, receiverId].sort(); // Ensure order doesn't matter
    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 }, // Match two participants
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        participants,
      });
      await conversation.save();
    }

    return NextResponse.json(
      {
        conversationId: conversation._id,
        message: "Conversation retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in conversation route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
