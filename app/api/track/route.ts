import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { path, referrer, userAgent } = body

    if (!path) {
      return Response.json({ success: false, error: "Path is required" }, { status: 400 })
    }

    const ua = (userAgent || "").toLowerCase()
    
    // Parse device format
    let device = "desktop"
    if (ua.includes("ipad") || ua.includes("tablet")) {
      device = "tablet"
    } else if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android")) {
      device = "mobile"
    }

    // Parse browser engine
    let browser = "Unknown"
    if (ua.includes("edge")) {
      browser = "Edge"
    } else if (ua.includes("opr") || ua.includes("opera")) {
      browser = "Opera"
    } else if (ua.includes("chrome") || ua.includes("chromium")) {
      browser = "Chrome"
    } else if (ua.includes("safari")) {
      browser = "Safari"
    } else if (ua.includes("firefox")) {
      browser = "Firefox"
    }

    // Resolve country from Vercel geolocation headers
    const country = req.headers.get("x-vercel-ip-country") || "Unknown"

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const rawString = `${ip}-${userAgent}`
    const sessionId = crypto.createHash("sha256").update(rawString).digest("hex")

    const pageView = await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        device,
        browser,
        country,
        sessionId,
      },
    })

    return Response.json({ success: true, data: pageView })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 550 })
  }
}
