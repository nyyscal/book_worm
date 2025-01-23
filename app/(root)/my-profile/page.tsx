import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  // Transform the sampleBooks data to match the Book type
  const transformedBooks = sampleBooks.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    rating: book.rating,
    totalCopies: book.totalCopies, // Map snake_case to camelCase
    availableCopies: book.availableCopies, // Map snake_case to camelCase
    description: book.description,
    coverColor: book.coverColor, // Map `color` to `coverColor`
    coverUrl: book.coverUrl, // Map `cover` to `coverUrl`
    video: book.videoUrl,
    summary: book.summary,
  }));

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      {/* Pass the transformed data to BookList */}
      <BookList title="Borrowed Books" books={transformedBooks} />
    </>
  );
};

export default Page;