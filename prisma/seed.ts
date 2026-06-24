import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "abdurasulnematxonov@gmail.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "abdurasul2007"

  console.log(`Seeding admin user: ${adminEmail}`)
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  // Remove any existing admin users with different emails so there's only one admin
  await prisma.user.deleteMany({
    where: {
      role: "ADMIN",
      email: { not: adminEmail },
    },
  })

  // Upsert the canonical admin user
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "Abdurasul Nematxonov",
      role: "ADMIN",
    },
    create: {
      name: "Abdurasul Nematxonov",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log(`✅ Admin user seeded: ${adminEmail}`)

  // Seed Default Settings
  const defaultSettings = [
    { key: "site_title", value: "Abdurasul Nematxonov | Portfolio & Blog" },
    { key: "site_description_en", value: "Personal website and blog about software development, startups, and technology." },
    { key: "site_description_uz", value: "Dasturlash, startaplar va texnologiyalar haqida shaxsiy veb-sayt va blog." },
    { key: "about_content_en", value: "<h2>About Me</h2><p>Welcome! I am Abdurasul, a software engineer passionate about building high-performance web systems and writing about clean code.</p>" },
    { key: "about_content_uz", value: "<h2>Men haqimda</h2><p>Xush kelibsiz! Men Abdurasulman, yuqori samarali veb-tizimlarni yaratish va toza kod haqida yozishga qiziquvchi dasturchiman.</p>" },
    { key: "profile_photo", value: "" },
    { key: "resume_pdf", value: "" },
    { key: "social_github", value: "https://github.com" },
    { key: "social_linkedin", value: "https://linkedin.com" },
    { key: "social_telegram", value: "https://t.me" },
    { key: "social_twitter", value: "https://twitter.com" },
    { key: "contact_email", value: adminEmail },
  ]

  console.log("Seeding default site settings...")
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    })
  }

  console.log("✅ Seeding completed successfully.")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
