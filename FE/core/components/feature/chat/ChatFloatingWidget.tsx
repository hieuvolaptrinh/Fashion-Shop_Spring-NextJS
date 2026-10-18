"use client";

import { MessageCircle, X } from "lucide-react";
import { useChatPresenter } from "@/core/hooks/useChatPresenter";
import ChatWindow from "./ChatWindow";

export default function ChatFloatingWidget() {
  const {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    isLoading,
    handleSendMessage,
    clearChat,
    messagesEndRef,
  } = useChatPresenter();

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearChat={clearChat}
        messagesEndRef={messagesEndRef}
      />

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isOpen ? "Đóng cửa sổ tư vấn AI" : "Mở trợ lý ảo AI tư vấn"}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOpen
              ? "bg-muted-foreground/80 hover:bg-muted-foreground"
              : "bg-gradient-to-tr from-primary via-sky-500 to-blue-600 hover:shadow-primary/30"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                  AI
                </span>
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
