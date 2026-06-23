import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status } = await req.json()
    if (!status || !["UNREAD", "READ", "REPLIED", "SPAM"].includes(status)) {
      return Response.json({ success: false, error: "Invalid status value" }, { status: 400 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: params.id },
      data: { status },
    })

    return Response.json({ success: true, data: updatedMessage })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return Response.json({ success: false, error: "Message not found" }, { status: 404 })
    }

    await prisma.message.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true, data: { id: params.id } })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
