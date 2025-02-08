// CollaborationSpace.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const CollaborationSpace = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef(null);
    const messageContainerRef = useRef(null);
    const { projectId } = useParams();

    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail') || 'anonymous';

    useEffect(() => {
        socket.current = io('http://localhost:5000');
        
        socket.current.emit('join-project', projectId);

        socket.current.on('message-history', (history) => {
            setMessages(history);
        });

        socket.current.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [projectId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Concatenate email and message content
        const messageWithEmail = `${userEmail}: ${newMessage}`;

        socket.current.emit('send-message', {
            projectId,
            content: messageWithEmail,
            type: 'text'
        });
        
        setNewMessage('');
    };

    return (
        <div className="flex h-screen">
            {/* Chat Panel */}
            <div className="w-1/2 p-4 flex flex-col">
                <div 
                    ref={messageContainerRef}
                    className="flex-1 overflow-y-auto space-y-4"
                >
                    {messages.map((message, index) => (
                        <div key={index} className="p-2 rounded bg-gray-100">
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
};

export default CollaborationSpace;