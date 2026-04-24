import Image from "next/image";
import Link from "next/link";
import HeroSection from "../components/HeroSection";
import { sampleBooks } from "../lib/constant";
import BookCard from "@/app/components/BookCard";

export default function Home() {
  return (
    <main className="wrapper container">
      <HeroSection />

      <section className="mt-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-title">Latest Books</h2>
          <Link href="/books/new" className="text-[#663820] font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="library-books-grid">
          {sampleBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
