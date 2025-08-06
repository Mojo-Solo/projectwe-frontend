// Simple test route with minimal dependencies
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Vercel API test successful",
      timestamp: new Date().toISOString(),
      method: "GET",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Vercel API POST test successful",
      timestamp: new Date().toISOString(),
      method: "POST",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
