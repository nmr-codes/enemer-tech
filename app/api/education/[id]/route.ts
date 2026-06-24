import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { educationSchema } from "@/lib/validations"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const result = educationSchema.safeParse(body)
    if (!result.success) {
      return Response.json({ success: false, error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const data = await prisma.education.update({
      where: { id: params.id },
      data: result.data,
    })
    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    await prisma.education.delete({ where: { id: params.id } })
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
