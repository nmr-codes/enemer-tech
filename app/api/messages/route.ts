import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { messageSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = messageSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { success: false, error: "Validation failed", details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, email, subject, body: messageBody } = result.data
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    const userAgent = req.headers.get("user-agent") || "unknown"

    // Save message record
    const message = await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || null,
        body: messageBody,
        ip,
        userAgent,
      },
    })

    // Forward email notification
    const resendKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || "admin@abdurasul.dev"

    if (resendKey && resendKey !== "re_placeholder" && resendKey !== "re_your_api_key") {
      try {
        await resend.emails.send({
          from: "Portfolio Form <onboarding@resend.dev>",
          to: contactEmail,
          subject: `Contact Form: ${subject || "No Subject"}`,
          html: `
            <h2>New Contact Message from ${name}</h2>
            <p><strong>Submitted by:</strong> ${name} (&lt;${email}&gt;)</p>
            <p><strong>Subject:</strong> ${subject || "(No Subject)"}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-family: sans-serif; white-space: pre-wrap; color: #1f2937;">${messageBody}</div>
          `,
        })
      } catch (emailErr) {
        console.error("Resend email forwarding failed:", emailErr)
      }
    }

    return Response.json({ success: true, data: message }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    })
    return Response.json({ success: true, data: messages })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
