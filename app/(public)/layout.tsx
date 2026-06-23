import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { CanvasBackground3D } from "@/components/shared/CanvasBackground3D"

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-neutral-900 dark:text-neutral-100 relative">
      <CanvasBackground3D />
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
