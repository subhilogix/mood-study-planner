import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Card } from "../components/ui/Card";
import { Send } from "lucide-react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hi there! 👋 I'm your study buddy. How can I help you today? You can ask me for study tips, tell me how you're feeling, or just chat!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        sender: "assistant",
        text: data.reply || "I'm here for you!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I'm having trouble responding right now, but I'm here with you. 💜",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-5">
      
      {/* ------ Header (matches your screenshot) ------ */}
      <div className="py-2">
        <h1 className="text-2xl font-semibold text-mind-textMain flex items-center gap-2">
          <span className="text-mind-primary text-3xl">💬</span>
          Study Buddy
        </h1>
        <p className="text-sm text-mind-textSoft">
          Your motivational companion for study support
        </p>
      </div>

      {/* ------ Chat Panel ------ */}
      <Card className="flex flex-col h-[75vh] overflow-hidden rounded-3xl bg-white shadow-soft border border-mind-border">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.sender === "assistant" ? "justify-start" : "justify-end"}`}
            >
              {/* Assistant Avatar */}
              {msg.sender === "assistant" && (
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-mind-primary flex items-center justify-center text-white text-sm shadow-soft">
                    🤖
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`
                  max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line
                  ${
                    msg.sender === "assistant"
                      ? "bg-mind-primary/20 text-mind-textMain rounded-tl-none"
                      : "bg-mind-primary text-white rounded-tr-none"
                  }
                `}
              >
                {msg.text}
                <div className="mt-1 text-[10px] opacity-60">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-mind-primary/70 text-sm">
              <div className="w-2 h-2 rounded-full bg-mind-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-mind-primary animate-bounce delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-mind-primary animate-bounce delay-300"></div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ------ Input Area (matches screenshot) ------ */}
        <div className="p-4 border-t bg-mind-bg/40">
          <div className="flex items-center bg-white rounded-full shadow-soft border border-mind-border px-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 py-3 text-sm focus:outline-none text-mind-textMain placeholder:text-mind-textSoft"
            />
            <button
              onClick={sendMessage}
              className="ml-3 p-2 bg-mind-primary rounded-full text-white hover:opacity-90 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
