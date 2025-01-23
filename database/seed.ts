import dummyBooks from "@/dummybooks.json";
import ImageKit from "imagekit";
import { books } from "./schema";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

// Utility function to check if a URL is accessible
const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error(`URL check failed for ${url}:`, error);
    return false;
  }
};

const uploadToImageKit = async (url: string, fileName: string, folder: string) => {
  const isAccessible = await isUrlAccessible(url);
  if (!isAccessible) {
    console.warn(`URL is inaccessible: ${url}`);
    return null; // Return null if the URL is not valid
  }
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });
    return response.filePath;
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    return null; // Return null if the upload fails
  }
};

const seed = async () => {
  console.log("Seeding data...");

  try {
    for (const book of dummyBooks) {
      const coverUrl =
        (await uploadToImageKit(book.coverUrl, `${book.title}.jpg`, "/books/covers")) ??
        "/default-cover.jpg"; // Fallback to default image

      const videoUrl =
        (await uploadToImageKit(book.videoUrl, `${book.title}.mp4`, "/books/videos")) ??
        "/default-video.mp4"; // Fallback to default video

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });
    }
    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
