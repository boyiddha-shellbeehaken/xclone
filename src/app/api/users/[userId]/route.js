import { NextResponse } from "next/server";
import { User } from "@/models/userModel";

export async function GET(req, { params }) {
  const { userId } = await params; // No need for "await" on params
  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching user" }, // Fixed typo from "post" to "user"
      { status: 500 }
    );
  }
}
