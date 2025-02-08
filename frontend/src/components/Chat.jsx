import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, Calendar } from 'lucide-react';
import MeetingScheduler from './MeetingScheduler';

const ChatPanel = ({ socket, projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message-history', (history) => {
      setMessages(history);
    });

    return () => {
      socket.off('message');
      socket.off('message-history');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleSendMessage = () => {
  //   if (!newMessage.trim()) return;
    
  //   socket.emit('send-message', {
  //     projectId,
  //     content: newMessage,
  //     type: 'text'
  //   });
    
  //   setNewMessage('');
  // };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    socket.emit('send-message', {
      projectId,
      content: newMessage,
      type: 'text'
    });
    
    setNewMessage('');
  };

  const handleLikeMessage = (messageId) => {
    socket.emit('like-message', {
      projectId,
      messageId
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-600">{message.sender}</p>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1">{message.content}</p>
              <div className="mt-2 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLikeMessage(message.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {message.likes || 0}
                </Button>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
          <Button 
            variant="outline"
            onClick={() => setShowScheduler(true)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </Button>
        </div>

        {showScheduler && (
          <MeetingScheduler
            socket={socket}
            projectId={projectId}
            onClose={() => setShowScheduler(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPanel;