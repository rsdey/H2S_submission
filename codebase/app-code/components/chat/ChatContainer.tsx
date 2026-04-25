"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "../../types/chat";
import { Button } from "../ui/Button";

export default function ChatContainer({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: "Unknown error" }));
        throw new Error(errorData.details || "Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        assistantContent += text;
        
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-screen relative">
      <header className="h-20 border-b flex items-center px-8 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <Bot className="w-7 h-7 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-primary">Strat</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 pb-40">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center border-2 border-secondary/20 shadow-xl">
              <Bot className="w-10 h-10 text-secondary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-primary">Ready to learn?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Enter any topic to begin. I will guide you using the Strat method, 
                helping you discover answers through inquiry.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.role === "user" ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary"
                }`}>
                  {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div className={`p-5 rounded-2xl shadow-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-on-primary rounded-tr-none" 
                    : "bg-white border border-outline-variant rounded-tl-none"
                }`}>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {msg.content.split('\n').map((line, idx) => (
                      <p key={idx} className={line.includes('[MASTERY:') ? 'hidden' : 'mb-2 last:mb-0'}>
                        {line}
                      </p>
                    ))}
                    {msg.content.includes('[MASTERY:') && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-4 p-4 bg-secondary/5 border-2 border-secondary/20 rounded-xl flex items-center gap-3"
                      >
                        <div className="p-2 bg-secondary rounded-lg">
                          <Bot className="w-4 h-4 text-on-secondary" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest">Achievement Unlocked</span>
                          <span className="text-sm font-bold text-primary">Concept Mastered</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white border border-outline-variant p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              <span className="text-xs text-on-surface-variant font-medium">Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background to-transparent pt-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to learn..."
            className="w-full h-16 pl-6 pr-20 rounded-2xl bg-white border-2 border-outline-variant focus:border-secondary outline-none transition-all shadow-xl text-lg placeholder:text-on-surface-variant/40"
          />
          <Button 
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-3 top-3 h-10 w-10"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
