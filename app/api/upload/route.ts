import { auth } from "@/lib/auth"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "portfolio"

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return Response.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImage(buffer, folder)

    return Response.json({ success: true, url })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { url } = await request.json()
    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 })
    }

    await deleteImage(url)
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
