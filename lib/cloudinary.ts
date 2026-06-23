import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = "portfolio"

/**
 * Ensures that the target storage bucket exists and is public.
 */
async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === BUCKET_NAME)
    
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
      })
    }
  } catch (err) {
    console.warn("Failed to verify/create Supabase storage bucket:", err)
  }
}

/**
 * Uploads an image/file buffer to Supabase storage.
 * @param file Buffer of the file to upload
 * @param folder Subfolder name inside the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  file: Buffer,
  folder: string = "portfolio"
): Promise<string> {
  await ensureBucketExists()

  const extension = "webp" // Default to webp format
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: `image/${extension}`,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Deletes a file from Supabase storage using its public URL.
 * @param imageUrl The public URL of the file to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return
  
  try {
    // Supabase URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[folder]/[filename]
    const urlPattern = `/storage/v1/object/public/${BUCKET_NAME}/`
    const pathIndex = imageUrl.indexOf(urlPattern)
    
    if (pathIndex === -1) {
      console.warn("Image URL does not match current bucket pattern:", imageUrl)
      return
    }

    const filePath = imageUrl.substring(pathIndex + urlPattern.length)
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error(`Failed to remove file from Supabase Storage: ${error.message}`)
    }
  } catch (err) {
    console.error("Error occurred while deleting file from Supabase Storage:", err)
  }
}
