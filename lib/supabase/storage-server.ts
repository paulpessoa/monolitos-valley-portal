import { createServiceClient } from "@/lib/supabase/server"

export async function deleteStorageFileServer(bucket: string, url: string): Promise<void> {
  if (!url) return;
  
  try {
    const supabase = await createServiceClient()
    
    // Extract the file path from the public URL
    // Format: .../storage/v1/object/public/{bucket}/{path}
    const publicUrlString = `/public/${bucket}/`
    if (!url.includes(publicUrlString)) {
      console.warn(`URL does not seem to match bucket ${bucket}:`, url)
      return;
    }
    
    const path = url.split(publicUrlString)[1]
    if (!path) return;

    const { error } = await supabase.storage.from(bucket).remove([path])
    
    if (error) {
      console.error(`Error deleting file ${path} from bucket ${bucket}:`, error)
      throw error
    }
  } catch (error) {
    console.error("Error in deleteStorageFileServer:", error)
    // We don't throw here to avoid failing the main operation if just the file deletion fails,
    // but in a production environment you might want to handle this differently.
  }
}
