import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const postSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  titleUz: z.string().optional().nullable(),
  slug: z.string().min(2, "Slug is too short"),
  excerpt: z.string().optional().nullable(),
  excerptUz: z.string().optional().nullable(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  contentUz: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional().nullable().or(z.date()),
  tagIds: z.array(z.string()).default([]),
})

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameUz: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color hex").optional().nullable(),
})

export const projectSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  titleUz: z.string().optional().nullable(),
  slug: z.string().min(2, "Slug is too short"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  descriptionUz: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  techStack: z.array(z.string()).min(1, "Select at least one tech stack tag"),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")).nullable(),
  liveUrl: z.string().url("Invalid Live URL").optional().or(z.literal("")).nullable(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("COMPLETED"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  startDate: z.string().optional().nullable().or(z.date()),
  endDate: z.string().optional().nullable().or(z.date()),
})

export const messageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters").optional().or(z.literal("")),
  body: z.string().min(10, "Message must be at least 10 characters"),
})

export const experienceSchema = z.object({
  year: z.string().min(1, "Year is required"),
  title: z.string().min(2, "Title is required"),
  titleUz: z.string().optional().nullable(),
  organization: z.string().min(2, "Organization is required"),
  organizationUz: z.string().optional().nullable(),
  description: z.string().min(5, "Description is required"),
  descriptionUz: z.string().optional().nullable(),
  order: z.number().int().default(0),
})

export const educationSchema = z.object({
  year: z.string().min(1, "Year is required"),
  title: z.string().min(2, "Title is required"),
  titleUz: z.string().optional().nullable(),
  organization: z.string().min(2, "Organization is required"),
  organizationUz: z.string().optional().nullable(),
  description: z.string().min(5, "Description is required"),
  descriptionUz: z.string().optional().nullable(),
  order: z.number().int().default(0),
})
