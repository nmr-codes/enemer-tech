import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { educationSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const data = await prisma.education.findMany({
      orderBy: { order: "asc" },
    })
    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const result = educationSchema.safeParse(body)
    if (!result.success) {
      return Response.json({ success: false, error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const data = await prisma.education.create({ data: result.data })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
