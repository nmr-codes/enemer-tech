import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    })
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 550 })
  }
}
