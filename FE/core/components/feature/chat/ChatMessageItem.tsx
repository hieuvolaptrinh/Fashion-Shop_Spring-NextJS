"use client";

import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/core/lib/type";
import ChatProductCard from "./ChatProductCard";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } animate-in fade-in duration-200`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Message Bubble + Rich Cards */}
      <div className={`flex flex-col max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-xs shadow-xs"
              : "bg-muted/70 text-foreground border border-border/40 rounded-2xl rounded-tl-xs shadow-xs"
          }`}
        >
          {message.text}
        </div>

        {/* Rich Product Cards Slider (nếu bot có gợi ý sản phẩm) */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="w-full mt-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
            <div className="flex gap-2">
              {message.products.map((prod) => (
                <ChatProductCard key={prod.productId} product={prod} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <span className="text-[10px] text-muted-foreground/70 mt-1 px-1">
            {message.timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
