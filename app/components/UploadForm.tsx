"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { voiceOptions, voiceCategories } from "@/lib/constant";
import type { BookUploadFormValues } from "@/types";
import { resolve } from "path";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookContent,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { generateSlug, parsePDFFile } from "@/lib/utils";
import { access } from "fs";
import { upload } from "@vercel/blob/client";

const UploadForm = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [isMounted, setIsMounted] = useState(false);

  //   useEffect(() => {
  //     setIsMounted(true);
  //   }, []);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  const onSubmit = async (data: BookUploadFormValues) => {
    if (!userId) {
      toast.error("Please login to upload a book");
      return;
    }

    setIsSubmitting(true);
    console.log("Form data:", data);
    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   alert('Success! Synthesis Started.');
    // }, 2000);

    //postHog - Track Book upload

    try {
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck.exists && existsCheck.book) {
        toast.info(
          "Book with the same title already exists. Please try a different title",
        );
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }
      const fileTitle = generateSlug(data.title);
      const pdfFile = data.pdfFile;

      const parsePDF = await parsePDFFile(pdfFile);

      if (parsePDF.content.length === 0) {
        return toast.error(
          "Failed to parse PDF file. Please try again with a different file",
        );
      }
      const uploadPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      let coverUrl: string;

      if (data.coverImage && data.coverImage.length > 0) {
        const coverFile = data.coverImage[0];
        const uploadedCoverBlob = await upload(
          `${fileTitle}_cover.png`,
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: coverFile.type,
          },
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        const response = await fetch(parsePDF.cover);
        const blob = await response.blob();
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: "image/png",
        });
        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadPdfBlob.url,
        fileBlobKey: uploadPdfBlob.pathname,
        coverURL: coverUrl,
        coverBlobKey: coverUrl,
        fileSize: pdfFile.size,
      });

      if (!book.success) throw new Error("Failed to create a book");

      if (book.alreadyExist) {
        toast.info(
          "Book with the same title already exists. Please try a different title",
        );
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const segments = await saveBookContent(
        book.book._id,
        userId,
        parsePDF.content,
      );

      if (!segments.success) {
        toast.error("Failed to save book segments");
        throw new Error("Failed to save book segments");
      }

      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload book");
    } finally {
      setIsSubmitting(false);
    }
  };

  //   if(isMounted) return null

  return (
    <div className="new-book-wrapper">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* PDF File Upload */}
        <div className="space-y-2">
          <label className="form-label">Book PDF File</label>
          <Controller
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div>
                {!value ? (
                  <label className="upload-dropzone border-2 border-dashed border-[#d4c4a8] relative block w-full text-center p-6 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="hidden"
                    />
                    <UploadCloud className="upload-dropzone-icon mx-auto" />
                    <p className="upload-dropzone-text">Click to upload PDF</p>
                    <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                  </label>
                ) : (
                  <div className="upload-dropzone upload-dropzone-uploaded relative overflow-hidden flex flex-col justify-center items-center py-6 px-10">
                    <div className="flex items-center gap-3 w-full max-w-full z-10 break-all justify-center">
                      <p className="upload-dropzone-text truncate font-bold">
                        {value.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="upload-dropzone-remove bg-white/50 rounded-full shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.message?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="form-label">Cover Image (Optional)</label>
          <Controller
            control={form.control}
            name="coverImage"
            render={({ field: { onChange, value } }) => (
              <div>
                {!value ? (
                  <label className="upload-dropzone border-2 border-dashed border-[#d4c4a8] relative block w-full text-center p-6 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="hidden"
                    />
                    <ImageIcon className="upload-dropzone-icon mx-auto" />
                    <p className="upload-dropzone-text">
                      Click to upload cover image
                    </p>
                    <p className="upload-dropzone-hint">
                      Leave empty to auto-generate from PDF
                    </p>
                  </label>
                ) : (
                  <div className="upload-dropzone upload-dropzone-uploaded relative overflow-hidden flex flex-col justify-center items-center py-6 px-10">
                    <div className="flex items-center gap-3 w-full max-w-full z-10 break-all justify-center">
                      <p className="upload-dropzone-text truncate font-bold">
                        {value.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => onChange(undefined)}
                        className="upload-dropzone-remove bg-white/50 rounded-full shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            {...form.register("title")}
            className="form-input"
            placeholder="ex: Rich Dad Poor Dad"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message?.toString()}
            </p>
          )}
        </div>

        {/* Author Input */}
        <div className="space-y-2">
          <label className="form-label" htmlFor="author">
            Author Name
          </label>
          <input
            id="author"
            {...form.register("author")}
            className="form-input"
            placeholder="ex: Robert Kiyosaki"
          />
          {form.formState.errors.author && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.author.message?.toString()}
            </p>
          )}
        </div>

        {/* Voice Selector */}
        <div className="space-y-4">
          <label className="form-label mb-4">Choose Assistant Voice</label>

          <Controller
            control={form.control}
            name="persona"
            render={({ field: { onChange, value } }) => (
              <div className="space-y-6">
                {/* Male Voices Group */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Male Voices
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {voiceCategories.male.map((voiceId) => {
                      const voice =
                        voiceOptions[voiceId as keyof typeof voiceOptions];
                      return (
                        <div
                          key={voiceId}
                          onClick={() => onChange(voiceId)}
                          className={`voice-selector-option ${
                            value === voiceId
                              ? "voice-selector-option-selected"
                              : "voice-selector-option-default"
                          }`}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <input
                              type="radio"
                              name="voice-selector"
                              checked={value === voiceId}
                              readOnly
                              className="mt-1 shrink-0 bg-white"
                            />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-gray-900">
                                {voice.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {voice.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Female Voices Group */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Female Voices
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {voiceCategories.female.map((voiceId) => {
                      const voice =
                        voiceOptions[voiceId as keyof typeof voiceOptions];
                      return (
                        <div
                          key={voiceId}
                          onClick={() => onChange(voiceId)}
                          className={`voice-selector-option ${
                            value === voiceId
                              ? "voice-selector-option-selected"
                              : "voice-selector-option-default"
                          }`}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <input
                              type="radio"
                              name="voice-selector"
                              checked={value === voiceId}
                              readOnly
                              className="mt-1 shrink-0 bg-white"
                            />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-gray-900">
                                {voice.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {voice.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          />
          {form.formState.errors.persona && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.persona.message?.toString()}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="form-btn w-full !mt-10"
        >
          Begin Synthesis
        </button>
      </form>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-wrapper">
          <div className="loading-shadow-wrapper bg-white">
            <div className="loading-shadow">
              <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
              <h2 className="loading-title">Synthesizing...</h2>
              <div className="loading-progress">
                <div className="loading-progress-item">
                  <span className="loading-progress-status"></span>
                  <span className="text-gray-600 font-medium">
                    Please wait while we process.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
