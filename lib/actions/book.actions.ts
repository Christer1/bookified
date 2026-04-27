'use server';
import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { escapeRegex, generateSlug, serializeData } from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(title);

        const existingBook = await Book.findOne({slug}).lean();

        if(existingBook){
            return {exists: true, book: serializeData(existingBook)}
        }

        return {exists: false};

    }catch(error){
        console.error("Error checking book exists");
        return {exists: false, error: error}
    }
}

export const createBook = async (data: CreateBook) => {
    
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({slug}).lean();

        if(existingBook) {
            return {success: false, data: serializeData(existingBook), alreadyExist: true}
        }
        //check subscription limits before creating a book
        
        const book = await Book.create({...data, slug, totalSegments: 0})
        
        return {success: true, book: serializeData(book)}
        
    } catch (error) {
        console.log('Error creation a book',error);
        return {success: false, error: error}
    }

}

export const saveBookContent = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    
    try {
        await connectToDatabase();

        console.log("Saving book segments...");

        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId, 
            bookId, 
            content: text, 
            segmentIndex, 
            pageNumber, 
            wordCount
        }));

        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
        console.log("Book content saved successfully");
        
        return { success: true, data: { segmentsCreated: segments.length } }
        
    } catch (error) {
        console.log('Error saving book segments', error);
        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log("Deleted book segments and book due to failure to save segments");
        return { success: false, error: error }
    }
}

export const getAllBooks = async (search?: string) => {
    try {
        await connectToDatabase();

        // let query = {};
        // if (search) {
        //     const escapedSearch = escapeRegex(search);
        //     const regex = new RegExp(escapedSearch, 'i');
        //     query = {
        //         $or: [
        //             { title: { $regex: regex } },
        //             { author: { $regex: regex } },
        //         ]
        //     };
        // }

        const books = await Book.find().sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: serializeData(books)
        }
    } catch (e) {
        console.error('Error connecting to database', e);
        return {
            success: false, error: e
        }
    }
}

export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const book = await Book.findOne({ slug }).lean();

        if (!book) {
            return { success: false, error: 'Book not found' };
        }

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (e) {
        console.error('Error fetching book by slug', e);
        return {
            success: false, error: e
        }
    }
}