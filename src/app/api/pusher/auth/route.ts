import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Pusher from "pusher";

// This route must run at request time and in Node.js
export const dynamic = "force-dynamic";
export const runtime = "nodejs";



const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;

    // Validate channel access
    if (channel.startsWith("private-user.")) {
      // User can only subscribe to their own channel
      const channelUserId = channel.replace("private-user.", "");
      if (channelUserId !== session.user.id.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (channel.startsWith("private-workspace.")) {
      // Check if user has access to workspace
      const workspaceId = channel.replace("private-workspace.", "");
      // TODO: Implement workspace access check
      // For now, we'll allow if user is authenticated
    } else if (channel === "presence-global") {
      // Global presence channel for online status
    } else {
      // Unknown channel type
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channel, {
      user_id: session.user.id.toString(),
      user_info: {
        name: session.user.name,
        email: session.user.email,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
