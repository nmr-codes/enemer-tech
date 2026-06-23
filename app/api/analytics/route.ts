import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 1. Gather all basic counters
    const [totalPosts, publishedPosts, draftPosts, totalProjects, unreadMessages, totalViews] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.project.count(),
      prisma.message.count({ where: { status: "UNREAD" } }),
      prisma.pageView.count(),
    ])

    // 2. Fetch top 5 recent contact messages
    const recentMessages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // 3. Fetch top 5 viewed articles
    const topPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 5,
    })

    // 4. Group logs over the past 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const pageViews = await prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
        path: true,
        device: true,
        browser: true,
        country: true,
        referrer: true,
      },
    })

    // Create 30-day list
    const dateMap = new Map<string, number>()
    for (let i = 29; i >= 0; i--) {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() - i)
      const dateStr = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      dateMap.set(dateStr, 0)
    }

    pageViews.forEach((view) => {
      const dateStr = new Date(view.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
      }
    })

    const viewsOverTime = Array.from(dateMap.entries()).map(([date, views]) => ({
      date,
      views,
    }))

    // Aggregate top paths
    const pathMap = new Map<string, number>()
    pageViews.forEach((view) => {
      pathMap.set(view.path, (pathMap.get(view.path) || 0) + 1)
    })
    const topPaths = Array.from(pathMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Aggregate devices
    const deviceMap = new Map<string, number>()
    pageViews.forEach((view) => {
      const dev = view.device || "desktop"
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1)
    })
    const devices = Array.from(deviceMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))

    // Aggregate countries
    const countryMap = new Map<string, number>()
    pageViews.forEach((view) => {
      const country = view.country || "Unknown"
      countryMap.set(country, (countryMap.get(country) || 0) + 1)
    })
    const countries = Array.from(countryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Aggregate referrers
    const referrerMap = new Map<string, number>()
    pageViews.forEach((view) => {
      let ref = view.referrer || "direct"
      try {
        if (ref !== "direct") {
          ref = new URL(ref).hostname
        }
      } catch (e) {}
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1)
    })
    const referrers = Array.from(referrerMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return Response.json({
      success: true,
      data: {
        stats: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalProjects,
          unreadMessages,
          totalViews,
        },
        recentMessages,
        topPosts,
        viewsOverTime,
        topPaths,
        devices,
        countries,
        referrers,
      },
    })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 550 })
  }
}
