import z from 'zod';

export const UploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  author: z.string().min(2, "Author must be at least 2 characters."),
  pdfFile: z.any()
    .refine((file) => file !== undefined && file !== null, "PDF file is required"),
  coverImage: z.any().optional(),
  persona: z.string().min(1, "Please select an assistant voice"),
});
