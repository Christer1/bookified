import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 mt-24 md:mb-16">
      <div className="bg-[#EBE2D5] rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 h-full min-h-[400px]">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center max-w-md h-full gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your Digital Library, Anywhere
          </h1>
          <p className="text-lg text-gray-700">
            Keep track of all the books you&apos;ve read, currently reading, or want to read in the future.
          </p>
          <div>
            <Link href="/books/new" className="inline-block bg-white text-[#2A3B1D] font-semibold px-6 py-3 rounded-sm hover:bg-[#C2D1AE] transition block w-max">
              + Add New Book
            </Link>
          </div>
        </div>

        {/* Center - Illustration */}
        <div className="flex-1 flex justify-center items-center h-full">
          <div className="relative w-full max-w-[320px] aspect-square">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and globe"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Side - Steps Card */}
        <div className="flex-[0.8] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 h-full justify-center">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#EBE2D5] text-[#8C7A6B] flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add a Book</h3>
              <p className="text-sm text-gray-500">Search or enter details manually.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#D3E0C1] text-[#2A3B1D] flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Track Progress</h3>
              <p className="text-sm text-gray-500">Update your reading status.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#EBE2D5] text-[#8C7A6B] flex items-center justify-center font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Write Reviews</h3>
              <p className="text-sm text-gray-500">Share your thoughts on the book.</p>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default HeroSection;
