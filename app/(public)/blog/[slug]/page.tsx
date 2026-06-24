import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye } from "lucide-react"
import { ViewCounter } from "@/components/public/ViewCounter"
import { ShareButtons } from "@/components/public/ShareButtons"
import { TableOfContents } from "@/components/public/TableOfContents"
import { PostDefaultCover } from "@/components/shared/PostDefaultCover"
import { generateSlug } from "@/lib/utils"

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
      },
    })
  } catch (err) {
    console.error("Failed to load post from DB:", err)
  }

  if (!post) {
    notFound()
  }

  const tags = post.tags.map((pt) => pt.tag)
  const contentWithIds = injectHeadingIds(post.content)
  const contentUzWithIds = post.contentUz ? injectHeadingIds(post.contentUz) : ""

  return (
    <article className="space-y-8 max-w-4xl mx-auto relative">
      <ViewCounter slug={post.slug} />

      <div className="space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readingTime || 3} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {post.views} views
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {post.title}
        </h1>
        {post.titleUz && (
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-500 dark:text-neutral-400">
            {post.titleUz}
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ borderColor: tag.color || "#005fe8", color: tag.color || "#005fe8" }}
              className="px-3 py-0.5 rounded-full text-xs font-semibold"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <PostDefaultCover title={post.title} size="hero" />
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4 items-start">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 hidden lg:block border-r border-neutral-100 dark:border-neutral-900 pr-6 space-y-8">
          <TableOfContents content={post.content} />
          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </aside>

        <div className="lg:col-span-3 prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 leading-relaxed editor-content-area space-y-6">
          <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          
          {post.contentUz && (
            <div className="mt-12 border-t-2 border-dashed border-neutral-200 dark:border-neutral-800 pt-12">
              <h3 className="text-xl font-bold mb-6 text-neutral-500">O'zbek tilidagi matn:</h3>
              <div dangerouslySetInnerHTML={{ __html: contentUzWithIds }} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
