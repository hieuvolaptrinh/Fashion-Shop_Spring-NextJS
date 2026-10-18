"use client";

import { FormEvent, KeyboardEvent } from "react";
import {
  X,
  RotateCcw,
  Send,
  Loader2,
  Bot,
} from "lucide-react";
import ChatMessageItem from "./ChatMessageItem";
import ChatQuickPrompts from "./ChatQuickPrompts";
import type { ChatMessage } from "@/core/lib/type";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onClearChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatWindow({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  isLoading,
  onSendMessage,
  onClearChat,
  messagesEndRef,
}: ChatWindowProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Cửa sổ tư vấn AI Fashion Shop"
      className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shadow-xs border-b border-primary/20">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-xs flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Lan Fashion Assistant</h3>
            <p className="text-[11px] text-primary-foreground/80 leading-tight">Trực tuyến • Tư vấn 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClearChat}
            title="Làm mới đoạn chat"
            className="p-1.5 rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Đóng cửa sổ"
            className="p-1.5 rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 animate-in fade-in duration-150">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-3.5 py-2.5 bg-muted/70 text-foreground border border-border/40 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" />
              <span className="text-xs text-muted-foreground ml-1.5">Em đang tìm kiếm...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatQuickPrompts onSelectPrompt={onSendMessage} disabled={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border/60 bg-background/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi về áo, đầm, size, giá tiền..."
          disabled={isLoading}
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-muted/50 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Gửi tin nhắn"
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-xs hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
