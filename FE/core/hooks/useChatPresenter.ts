"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { sendChatMessage } from "@/core/apis/chat";
import type { ChatMessage, ChatHistoryItem } from "@/core/lib/type";

const SESSION_STORAGE_KEY = "fashion_shop_chat_history";

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-1",
  sender: "bot",
  text: "Dạ xin chào bạn! Em là Lan Fashion Assistant. Em có thể tư vấn mẫu đồ, kiểm tra giá, gợi ý phong cách hoặc giải đáp chính sách của shop cho bạn ạ!",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export const QUICK_PROMPTS = [
  "Áo thun nam bán chạy nhất",
  "Đầm dạ hội nữ mới về",
  "Chính sách đổi trả hàng",
  "Phí ship và thời gian giao",
];

export function useChatPresenter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Tải lịch sử chat từ sessionStorage khi component mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    }
    setMessages([INITIAL_WELCOME_MESSAGE]);
  }, []);

  // 2. Lưu tin nhắn vào sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Bỏ qua nếu quota vượt
      }
    }
  }, [messages]);

  // 3. Tự động cuộn xuống dưới cùng khi có tin nhắn mới hoặc khi mở modal
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading, scrollToBottom]);

  // 4. Mở / đóng cửa sổ chat
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // 5. Xóa lịch sử chat
  const clearChat = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Dạ em đã làm mới đoạn chat! Bạn đang quan tâm đến sản phẩm nào tại shop ạ?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // 6. Gửi tin nhắn
  const handleSendMessage = useCallback(
    async (messageText?: string) => {
      const query = (messageText ?? input).trim();
      if (!query || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Đẩy tin nhắn của User vào giao diện ngay lập tức
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Chuẩn bị 4-6 câu thoại gần nhất làm history
      const historyPayload: ChatHistoryItem[] = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      try {
        const responseData = await sendChatMessage({
          message: query,
          history: historyPayload,
        });

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: responseData.reply || "Dạ em gửi bạn một số sản phẩm tham khảo bên dưới nhé:",
          products: responseData.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Dạ kết nối máy chủ đang chậm, bạn vui lòng thử lại sau giây lát hoặc liên hệ hotline để được hỗ trợ nhanh nhất nhé!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  return {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    isLoading,
    handleSendMessage,
    clearChat,
    messagesEndRef,
  };
}
