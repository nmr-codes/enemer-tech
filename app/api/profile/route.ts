import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET authenticated user profile details
export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user || !(session.user as any).id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    })

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: user })
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT update authenticated user profile credentials
export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user || !(session.user as any).id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()

    const { name, email, currentPassword, newPassword } = body

    // Validation
    if (!name || !email || !currentPassword) {
      return Response.json(
        { error: "Name, email, and current password are required." },
        { status: 400 }
      )
    }

    // Retrieve user from DB to verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.password) {
      return Response.json({ error: "User not found or password not set" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return Response.json({ error: "Incorrect current password." }, { status: 400 })
    }

    // Check if email is being changed and if it is already taken by another user
    if (email !== user.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      })
      if (emailTaken) {
        return Response.json({ error: "Email is already in use by another account." }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    }

    // Hash new password if provided
    if (newPassword) {
      if (newPassword.length < 8) {
        return Response.json({ error: "New password must be at least 8 characters long." }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        name: true,
        email: true,
      },
    })

    return Response.json({ success: true, data: updatedUser })
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to update profile" },
      { status: 500 }
    )
  }
}
