import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ViewCounter } from "@/components/public/ViewCounter"
import { BlogDetailsClient } from "@/components/public/BlogDetailsClient"
import { BlogComments } from "@/components/public/BlogComments"
import { generateSlug } from "@/lib/utils"
import { auth } from "@/lib/auth"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Injects IDs into h2/h3 tags in HTML to enable anchor linking
function injectHeadingIds(html: string): string {
  if (!html) return ""
  return html.replace(/<h(2|3)([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, text) => {
    const plainText = text.replace(/<[^>]*>/g, "")
    const id = generateSlug(plainText)
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`
  })
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params
    const post = await prisma.post.findUnique({
      where: { slug },
    })

    if (!post) return { title: "Post Not Found" }

    return {
      title: `${post.title} | Abdurasul Nematxonov`,
      description: post.excerpt || "",
      openGraph: {
        title: post.title,
        description: post.excerpt || "",
        images: post.coverImage ? [{ url: post.coverImage }] : [],
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        authors: ["Abdurasul Nematxonov"],
      },
    }
  } catch (err) {
    return { title: "Blog Post" }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  let post
  try {
    post = await prisma.post.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      },
    })
  } catch (err) {
    console.error("Failed to load post from DB:", err)
  }

  if (!post) {
    notFound()
  }

  // Inject heading IDs on the server side
  post.content = injectHeadingIds(post.content)
  if (post.contentUz) {
    post.contentUz = injectHeadingIds(post.contentUz)
  }

  // Fetch site settings for profile avatar and bio
  const settingsList = await prisma.setting.findMany()
  const settingsMap = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  const session = await auth()
  const currentUserId = session?.user?.id
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 animate-[fadeIn_0.5s_ease-out]">
      <ViewCounter slug={post.slug} />
      <BlogDetailsClient post={post} settings={settingsMap} />
      
      <BlogComments 
        postId={post.id} 
        comments={post.comments} 
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </article>
  )
}
