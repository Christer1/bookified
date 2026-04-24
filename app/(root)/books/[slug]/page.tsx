'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Mic, Share2, MoreHorizontal, Settings, Volume2 } from 'lucide-react';
import { sampleBooks } from '@/app/lib/constant';

const BookInterviewPage = () => {
  const { slug } = useParams();
  const book = sampleBooks.find((b) => b.slug === slug) || sampleBooks[0];
  
  const [isCalling, setIsCalling] = useState(false);
  
  // Mock transcript
  const transcript = [
    { role: 'assistant', content: `Hello! I'm your AI assistant for "${book.title}". Ask me anything about the concepts in this book!` },
    { role: 'user', content: "What are the key takeaways from the first chapter?" },
    { role: 'assistant', content: "In the first chapter, the author emphasizes the importance of starting with a 'growth mindset'. It sets the foundation for everything else discussed in the book." },
  ];

  return (
    <main className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ChevronLeft className="w-6 h-6 text-[#663820]" />
      </Link>

      <div className="vapi-main-container">
        {/* Header / Stats Section */}
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          <div className="vapi-header-card flex-1">
            <div className="vapi-cover-wrapper">
              <Image 
                src={book.coverURL} 
                alt={book.title} 
                width={160} 
                height={240} 
                className="vapi-cover-image"
              />
              <div className="vapi-mic-wrapper">
                {isCalling && <div className="vapi-pulse-ring"></div>}
                <button 
                  onClick={() => setIsCalling(!isCalling)}
                  className={`vapi-mic-btn ${isCalling ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive shadow-soft-md'}`}
                >
                  <Mic className={`w-6 h-6 ${isCalling ? 'text-[#663820] animate-pulse' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 ml-2 md:ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="vapi-badge-ai">
                    <span className="vapi-badge-ai-text">AI INTERVIEW</span>
                  </div>
                  <div className="vapi-status-indicator">
                    <span className={`vapi-status-dot ${isCalling ? 'vapi-status-dot-listening' : 'vapi-status-dot-ready'}`}></span>
                    <span className="vapi-status-text">{isCalling ? 'Listening...' : 'Ready'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div>
                <h1 className="book-title-lg">{book.title}</h1>
                <p className="text-[#3d485e] font-medium">by {book.author}</p>
              </div>

              <div className="mt-auto flex gap-3">
                <button className="flex items-center gap-2 text-sm font-bold text-[#663820] hover:opacity-80">
                  <Settings className="w-4 h-4" />
                  Voice Settings
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-between">
            <div className="vapi-stat-box">
              <p className="vapi-stat-label">Session Time</p>
              <p className="vapi-stat-value-lg">12:45</p>
            </div>
            <div className="vapi-stat-box-sm">
              <p className="vapi-stat-label">Current Persona</p>
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-[#663820]" />
                <p className="vapi-stat-value-sm">Knowledgeable Professor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="transcript-container shadow-soft">
          <div className="transcript-messages">
            {transcript.map((msg, i) => (
              <div 
                key={i} 
                className={`transcript-message ${msg.role === 'user' ? 'transcript-message-user' : 'transcript-message-assistant'}`}
              >
                <div className={`transcript-bubble ${msg.role === 'user' ? 'transcript-bubble-user' : 'transcript-bubble-assistant shadow-soft-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isCalling && (
              <div className="transcript-message transcript-message-assistant">
                <div className="transcript-bubble transcript-bubble-assistant shadow-soft-sm italic text-gray-400">
                  Assistant is thinking... <span className="transcript-cursor"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookInterviewPage;
