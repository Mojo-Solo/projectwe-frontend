import { isDbAvailable, requireDbAsync } from "@/lib/db-guard";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema/user";
import { organizations } from "@/db/schema/organization";
import { notifications } from "@/db/schema/notifications";
import { aiAgents } from "@/db/schema/ai";
import { eq } from "drizzle-orm";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().min(1, "Organization name is required"),
});

export async function POST(req: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password, organizationName } = validation.data;

    // Check if user already exists
    const existingUserRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserRows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create organization slug
    const baseSlug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (true) {
      const existingOrgRows = await db
        .select()
        .from(organizations)
        .where(eq(organizations.slug, slug))
        .limit(1);

      if (existingOrgRows.length === 0) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create organization and user in a transaction
    const result = await db.transaction(async (tx) => {
      // Create organization
      const [organization] = await tx
        .insert(organizations)
        .values({
          name: organizationName,
          slug,
        })
        .returning();

      // Create user
      const [user] = await tx
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          role: "OWNER", // First user is the owner
          organizationId: organization.id,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
        });

      // Create welcome notification
      await tx.insert(notifications).values({
        type: "WELCOME",
        title: "Welcome to WE-Exit!",
        message:
          "Start your strategic exit planning journey with our guided walkthrough.",
        userId: user.id,
      });

      // Create default AI agents for the organization
      const defaultAgents = [
        {
          name: "Legal Advisor",
          type: "LEGAL",
          description: "AI-powered legal analysis and document review",
          capabilities: {
            documentReview: true,
            complianceCheck: true,
            contractAnalysis: true,
          },
          configuration: {
            model: "gpt-4",
            temperature: 0.3,
            maxTokens: 2000,
          },
        },
        {
          name: "Financial Analyst",
          type: "FINANCIAL",
          description: "Financial planning and valuation analysis",
          capabilities: {
            valuationAnalysis: true,
            financialModeling: true,
            dueDiligenceSupport: true,
          },
          configuration: {
            model: "gpt-4",
            temperature: 0.2,
            maxTokens: 2000,
          },
        },
        {
          name: "Strategic Advisor",
          type: "STRATEGIC",
          description: "Strategic planning and market analysis",
          capabilities: {
            marketAnalysis: true,
            competitorResearch: true,
            strategyFormulation: true,
          },
          configuration: {
            model: "gpt-4",
            temperature: 0.5,
            maxTokens: 2000,
          },
        },
      ];

      await tx.insert(aiAgents).values(
        defaultAgents.map((agent) => ({
          ...agent,
          organizationId: organization.id,
        })),
      );

      return { user, organization };
    });

    // Send welcome email
    try {
      const { sendEmail } = await import("@/lib/email/email-service");
      const welcomeEmailResult = await sendEmail({
        to: email,
        subject: "Welcome to WE-Exit! 🚀",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #7C3AED; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background-color: #7C3AED; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Welcome to WE-Exit!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Welcome to WE-Exit, your AI-powered exit planning platform! Your account has been successfully created.</p>
                
                <h3>Your Organization: ${organizationName}</h3>
                <p>You're all set to start planning your strategic exit. Here's what you can do next:</p>
                
                <ul>
                  <li>Complete your company profile</li>
                  <li>Upload key documents for AI analysis</li>
                  <li>Explore our exit planning frameworks</li>
                  <li>Invite team members to collaborate</li>
                </ul>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL || "https://weexit.ai"}/dashboard" class="button">Go to Dashboard</a>
                </div>
                
                <p>If you have any questions, our AI assistants and support team are here to help!</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} WE-Exit. All rights reserved.</p>
                <p>This email was sent to ${email} because you signed up for WE-Exit.</p>
              </div>
            </body>
          </html>
        `,
        text: `Welcome to WE-Exit!\n\nHi ${name},\n\nWelcome to WE-Exit, your AI-powered exit planning platform! Your account has been successfully created.\n\nYour Organization: ${organizationName}\n\nYou're all set to start planning your strategic exit.\n\nGo to Dashboard: ${process.env.NEXTAUTH_URL || "https://weexit.ai"}/dashboard\n\nIf you have any questions, our AI assistants and support team are here to help!\n\n© ${new Date().getFullYear()} WE-Exit. All rights reserved.`,
      });

      if (!welcomeEmailResult.success) {
        console.error(
          "Failed to send welcome email:",
          welcomeEmailResult.error,
        );
        // Don't fail the signup if email fails - user is already created
      }
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: result.user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
