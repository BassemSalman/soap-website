import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: string,
  preset: "soap-products" | "soap-categories"
): Promise<{ publicId: string; url: string; width: number; height: number }> {
  const folder = preset === "soap-products" ? "soap/products" : "soap/categories";
  const result = await cloudinary.uploader.upload(file, {
    folder,
    upload_preset: preset,
  });
  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
