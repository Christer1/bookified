'use client';

import React, { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Messages } from '@/types';

interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

const Transcript = ({ messages, currentMessage, currentUserMessage }: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or streaming text changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

  if (isEmpty) {
    return (
      <div className="transcript-container bg-white shadow-soft min-h-[420px] rounded-2xl flex items-center justify-center border border-black/5">
        <div className="transcript-empty py-20 flex flex-col items-center">
          <div className="p-5 bg-[#F9F9F9] rounded-full mb-5">
            <Mic className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-[#212a3b] mb-1">No conversation yet</h3>
          <p className="text-gray-500 font-medium text-center">
            Click the mic button above to start talking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container bg-white shadow-soft min-h-[420px] rounded-2xl flex flex-col border border-black/5 overflow-hidden">
      <div 
        ref={scrollRef}
        className="transcript-messages flex-1 overflow-y-auto p-6 space-y-6"
      >
        {/* Render past messages */}
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`transcript-message ${
              msg.role === 'user' ? 'transcript-message-user' : 'transcript-message-assistant'
            }`}
          >
            <div 
              className={`transcript-bubble ${
                msg.role === 'user' ? 'transcript-bubble-user' : 'transcript-bubble-assistant'
              } shadow-sm`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Render currently streaming user message */}
        {currentUserMessage && (
          <div className="transcript-message transcript-message-user">
            <div className="transcript-bubble transcript-bubble-user shadow-sm">
              {currentUserMessage}
              <span className="transcript-cursor ml-1"></span>
            </div>
          </div>
        )}

        {/* Render currently streaming assistant message */}
        {currentMessage && (
          <div className="transcript-message transcript-message-assistant">
            <div className="transcript-bubble transcript-bubble-assistant shadow-sm border border-black/5">
              {currentMessage}
              <span className="transcript-cursor ml-1"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transcript;
