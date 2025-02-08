import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { motion } from "framer-motion";

const CollaborationSpace = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const socket = useRef(null);
  const messageContainerRef = useRef(null);
  const { projectId } = useParams();

  const userEmail = localStorage.getItem("userEmail") || "anonymous";

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("join-project", projectId);

    socket.current.on("message-history", (history) => {
      setMessages(history);
    });

    socket.current.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("user-typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const messageWithEmail = `${userEmail}: ${newMessage}`;

    socket.current.emit("send-message", {
      projectId,
      userId: 123, // The authenticated user's ID
      content: messageWithEmail,
      type: "text",
      timestamp,
    });

    setNewMessage("");
  };

  const handleTyping = () => {
    socket.current.emit("user-typing", projectId);
  };

  const MessageBubble = ({ message }) => {
    if (!message || !message.content) return null;
    
    const [email, content] = message.content.includes(": ")
      ? message.content.split(": ")
      : ["Unknown", message.content];
    const isCurrentUser = email === userEmail;
    const bgColor = isCurrentUser ? "bg-red-500 text-white" : "bg-gray-800 text-white";
    const alignment = isCurrentUser ? "justify-end" : "justify-start";

    return (
      <motion.div
        className={`flex ${alignment} mb-4`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center max-w-[75%]">
          {!isCurrentUser && (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className={`p-3 rounded-2xl ${bgColor} shadow-lg`}>
            <p className="text-xs text-gray-300">{email}</p>
            <p className="text-sm font-medium">{content}</p>
            <p className="text-[10px] text-gray-300 mt-1 text-right">{message.timestamp || ""}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen p-4 flex flex-col bg-gray-900 text-white">
      <div className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Collaboration Space</div>
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto space-y-4 border border-gray-700 p-4 rounded bg-gray-850 shadow-md"
      >
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {typing && <p className="text-xs text-gray-300 italic">Someone is typing...</p>}
      </div>
      <div className="mt-4 flex gap-2 items-center">
        <Input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message here..."
          className="flex-1 py-2 px-4 rounded-full bg-gray-700 taext-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        />
        <Button className="rounded-full p-2 flex items-center gap-2 bg-red-500 hover:bg-red-600" onClick={handleSendMessage}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CollaborationSpace;
