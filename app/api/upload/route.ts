import { MAX_FILE_SIZE } from '@/lib/constant';
import { auth } from '@clerk/nextjs/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {

  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        const { userId } = await auth();

        if(!userId){
          throw new Error("Unauthorized: User not authenticated");
        }
        
        return {
          allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true,
          maxFileSize: MAX_FILE_SIZE,
          tokenPayload: JSON.stringify({
            userId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on localhost, see https://vercel.com/docs/storage/vercel-blob/using-blob-with-nextjs#local-development
        console.log('blob upload completed', blob.url);

        const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
        const userId = payload?.userId;
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The client will also get this error
    );
  }
}
