"use client";
import { Mic, MicOff } from "lucide-react";
import React from "react";
import { IBook } from "@/types";
import { useVapi } from "../../lib/hooks/useVapi";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearErrors,
  } = useVapi(book);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 px-6">
      <section className="vapi-header-card !bg-[#F3EAD7] shadow-sm border border-black/5">
        <div className="flex flex-row items-center gap-8 md:gap-12 w-full">
          {/* Left: Book Cover with Mic Button */}
          <div className="relative shrink-0">
            <div className="relative w-[110px] h-[160px] sm:w-[130px] sm:h-[195px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={book.coverURL || ""}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlapping Mic Button */}
            <div className="absolute -bottom-3 -right-3 z-10">
              {isActive && (status === "speaking" || status === "thinking") && (
                <div className="absolute inset-0 size-12 sm:size-14 bg-white rounded-full animate-ping opacity-75"></div>
              )}
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                className={`vapi-mic-btn relative size-12 sm:size-14 bg-white shadow-xl rounded-full flex items-center justify-center border border-black/10 transition-all ${isActive ? "scale-110" : "hover:scale-105"}`}
              >
                {isActive ? (
                  <Mic className="w-5 h-5 sm:w-6 h-6 text-[#663820]" />
                ) : (
                  <MicOff className="w-5 h-5 sm:w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Book Details & Badges */}
          <div className="flex flex-col gap-5 flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold text-[#212a3b] font-serif tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg text-[#3d485e] font-medium opacity-80">
                by {book.author}
              </p>
            </div>

            {/* Status Badges Row */}
            <div className="flex flex-wrap gap-3 mt-1">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border border-black/5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                <span className="text-sm font-semibold text-[#212a3b]">
                  Ready
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border border-black/5">
                <span className="text-sm font-semibold text-[#212a3b]">
                  Voice: {book.persona || "rachel"}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border border-black/5">
                <span className="text-sm font-semibold text-[#212a3b]">
                  0:00/15:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="vapi-transcript-wrapper w-full">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </div>
  );
};

export default VapiControls;
