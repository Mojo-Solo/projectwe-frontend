import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET works" });
}

export async function POST() {
  return NextResponse.json({ message: "POST works" });
}

export async function PUT() {
  return NextResponse.json({ message: "PUT works" });
}

export async function DELETE() {
  return NextResponse.json({ message: "DELETE works" });
}
