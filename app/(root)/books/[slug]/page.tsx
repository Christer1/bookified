import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/app/components/VapiControls";

interface Props {
  params: Promise<{ slug: string }>;
}

const BookInterviewPage = async ({ params }: Props) => {
  const { slug } = await params;

  // 1. Require Auth
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch Book data
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;

  return (
    <main className="book-page-container pt-32 pb-20">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="w-5 h-5 text-[#212a3b]" />
      </Link>

      {/* 2. Transcript Area */}
      <VapiControls book={book} />
    </main>
  );
};

export default BookInterviewPage;
