/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket as SocketIOClient } from 'socket.io-client';

interface SocketContextType {
    socket: SocketIOClient | null;
    isConnected: boolean;
    joinPost: (postId: string) => void;
    leavePost: (postId: string) => void;
    sendTyping: (postId: string, user: any) => void;
    stopTyping: (postId: string, user: any) => void;
    typingUsers: Map<string, Set<string>>; // postId -> Set of user names
  
    onNewComment: (callback: (comment: any) => void) => void;
    onCommentLoading: (callback: (comment: any) => void) => void;
    onCommentSaved: (callback: (data: { tempId: string, savedComment: any }) => void) => void;
    onCommentError: (callback: (data: { tempId: string, error: any }) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<SocketIOClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());

    useEffect(() => {
        // Kết nối WebSocket
        const socketInstance = io('http://localhost:5000', {
            transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
        });

        socketInstance.on('userTyping', (user: any) => {
            console.log('User typing:', user);
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const postId = user.postId || 'default'; // Fallback nếu không có postId
                if (!newMap.has(postId)) {
                    newMap.set(postId, new Set());
                }
                newMap.get(postId)!.add(user.name);
                return newMap;
            });
        });

        socketInstance.on('userStopTyping', (user: any) => {
            console.log('User stop typing:', user);
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const postId = user.postId || 'default';
                if (newMap.has(postId)) {
                    newMap.get(postId)!.delete(user.name);
                    if (newMap.get(postId)!.size === 0) {
                        newMap.delete(postId);
                    }
                }
                return newMap;
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinPost = (postId: string) => {
        if (socket) {
            socket.emit('joinPost', postId);
        }
    };

    const leavePost = (postId: string) => {
        if (socket) {
            socket.emit('leavePost', postId);
        }
    };

    const sendTyping = (postId: string, user: any) => {
        if (socket) {
            socket.emit('typing', { postId, user });
        }
    };

    const stopTyping = (postId: string, user: any) => {
        if (socket) {
            socket.emit('stopTyping', { postId, user });
        }
    };

    // Comment event handlers
    const onNewComment = (callback: (comment: any) => void) => {
        if (socket) {
            socket.on('newComment', callback);
        }
    };

    const onCommentLoading = (callback: (comment: any) => void) => {
        if (socket) {
            socket.on('commentLoading', callback);
        }
    };

    const onCommentSaved = (callback: (data: { tempId: string, savedComment: any }) => void) => {
        if (socket) {
            socket.on('commentSaved', callback);
        }
    };

    const onCommentError = (callback: (data: { tempId: string, error: any }) => void) => {
        if (socket) {
            socket.on('commentError', callback);
        }
    };

    const value: SocketContextType = {
        socket,
        isConnected,
        joinPost,
        leavePost,
        sendTyping,
        stopTyping,
        typingUsers,
        onNewComment,
        onCommentLoading,
        onCommentSaved,
        onCommentError,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
