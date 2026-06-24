import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// Get all settings as a flat key-value object
export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const settingsObj = settings.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return Response.json({ success: true, data: settingsObj })
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// Update settings
export async function PUT(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate inputs (ensure body is an object)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid request payload" }, { status: 400 })
    }

    // Update settings in database
    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    })

    await prisma.$transaction(updates)

    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to update settings" },
      { status: 500 }
    )
  }
}
