import { NextRequest, NextResponse } from "next/server";
import { ResendEmailProvider } from "@/lib/email/infrastructure/providers/resend-provider";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in production, verify against Resend webhook secret)
    const signature = request.headers.get("resend-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 },
      );
    }

    // Parse webhook payload
    const payload = await request.json();

    // Validate webhook payload structure
    if (!payload.type || !payload.data) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    console.log("Received Resend webhook:", {
      type: payload.type,
      timestamp: new Date().toISOString(),
      data: payload.data,
    });

    // Initialize email provider to handle webhook
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const emailProvider = new ResendEmailProvider(resendApiKey);

    // Handle webhook event
    await emailProvider.handleWebhook(payload);

    // Process different webhook types
    switch (payload.type) {
      case "email.sent":
        await handleEmailSent(payload.data);
        break;

      case "email.delivered":
        await handleEmailDelivered(payload.data);
        break;

      case "email.delivery_delayed":
        await handleEmailDelayed(payload.data);
        break;

      case "email.complained":
        await handleEmailComplaint(payload.data);
        break;

      case "email.bounced":
        await handleEmailBounced(payload.data);
        break;

      case "email.opened":
        await handleEmailOpened(payload.data);
        break;

      case "email.clicked":
        await handleEmailClicked(payload.data);
        break;

      default:
        console.log(`Unhandled webhook type: ${payload.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function handleEmailSent(data: any) {
  try {
    console.log("Email sent event:", data);

    // Extract email ID from headers or metadata
    const emailId = data.headers?.["X-Email-ID"] || data.email_id;

    if (emailId) {
      // Update email status in database
      // This would typically involve calling your email repository
      console.log(`Email ${emailId} marked as sent`);

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailSent",
        emailId,
        messageId: data.id,
        sentAt: new Date(data.created_at),
      });
    }
  } catch (error) {
    console.error("Failed to handle email sent event:", error);
  }
}

async function handleEmailDelivered(data: any) {
  try {
    console.log("Email delivered event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;

    if (emailId) {
      // Update email status in database
      console.log(`Email ${emailId} marked as delivered`);

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailDelivered",
        emailId,
        messageId: data.id,
        deliveredAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to handle email delivered event:", error);
  }
}

async function handleEmailDelayed(data: any) {
  try {
    console.log("Email delivery delayed event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;

    if (emailId) {
      // Log delivery delay
      console.log(
        `Email ${emailId} delivery delayed: ${data.reason || "Unknown reason"}`,
      );
    }
  } catch (error) {
    console.error("Failed to handle email delayed event:", error);
  }
}

async function handleEmailComplaint(data: any) {
  try {
    console.log("Email complaint event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;
    const userEmail = data.email;

    if (userEmail) {
      // Automatically unsubscribe user from marketing emails
      console.log(`Processing spam complaint for ${userEmail}`);

      // Update user preferences to unsubscribe from marketing
      await handleUnsubscribeFromComplaints(userEmail);

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailComplaint",
        emailId,
        email: userEmail,
        complainedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to handle email complaint event:", error);
  }
}

async function handleEmailBounced(data: any) {
  try {
    console.log("Email bounced event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;
    const userEmail = data.email;
    const bounceType = data.bounce_type; // 'hard' or 'soft'

    if (emailId) {
      // Update email status in database
      console.log(
        `Email ${emailId} bounced (${bounceType}): ${data.reason || "Unknown reason"}`,
      );

      // For hard bounces, consider marking email as invalid
      if (bounceType === "hard") {
        await handleHardBounce(userEmail);
      }

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailBounced",
        emailId,
        email: userEmail,
        bounceType,
        reason: data.reason,
        bouncedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to handle email bounced event:", error);
  }
}

async function handleEmailOpened(data: any) {
  try {
    console.log("Email opened event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;

    if (emailId) {
      // Update email status in database
      console.log(`Email ${emailId} opened`);

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailOpened",
        emailId,
        openedAt: new Date(),
        userAgent: data.user_agent,
        ipAddress: data.ip_address,
      });
    }
  } catch (error) {
    console.error("Failed to handle email opened event:", error);
  }
}

async function handleEmailClicked(data: any) {
  try {
    console.log("Email clicked event:", data);

    const emailId = data.headers?.["X-Email-ID"] || data.email_id;

    if (emailId) {
      // Update email status in database
      console.log(
        `Email ${emailId} clicked - URL: ${data.url || "Unknown URL"}`,
      );

      // Publish domain event
      await publishDomainEvent({
        eventType: "EmailClicked",
        emailId,
        url: data.url,
        clickedAt: new Date(),
        userAgent: data.user_agent,
        ipAddress: data.ip_address,
      });
    }
  } catch (error) {
    console.error("Failed to handle email clicked event:", error);
  }
}

async function handleUnsubscribeFromComplaints(email: string) {
  // In production, this would update user preferences in database
  console.log(
    `Auto-unsubscribing ${email} from marketing emails due to complaint`,
  );

  // You would typically:
  // 1. Look up user by email
  // 2. Update their preferences to disable marketing emails
  // 3. Log the unsubscribe event with reason "complaint"
}

async function handleHardBounce(email: string) {
  // In production, this would mark email as invalid in database
  console.log(`Marking ${email} as invalid due to hard bounce`);

  // You would typically:
  // 1. Look up user by email
  // 2. Mark email as invalid
  // 3. Stop sending emails to this address
  // 4. Possibly notify user through alternative means
}

async function publishDomainEvent(event: any) {
  // In production, this would publish to your event system
  console.log("Publishing domain event:", event);

  // You would typically:
  // 1. Publish to event bus (Kafka, Redis Streams, etc.)
  // 2. Update analytics/metrics
  // 3. Trigger any follow-up actions
}

// GET endpoint for webhook verification (if needed)
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get("challenge");

  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    status: "Resend webhook endpoint ready",
    timestamp: new Date().toISOString(),
  });
}
