/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { io, Socket } from 'socket.io-client';

export interface NotificationPayload {
    title: string;
    body: string;
    data?: any;
    timestamp: string;
}

class NotificationClient {
    private socket: Socket | null = null;
    private fcmToken: string | null = null;
    private messageHandlers: ((notification: NotificationPayload) => void)[] = [];

    // async connect(baseUrl: string, accessToken?: string) {
    //     if (this.socket && this.socket.connected) return;
        
    //     // Initialize WebSocket connection
    //     this.socket = io(baseUrl, { 
    //         transports: ['websocket'], 
    //         autoConnect: true,
    //         reconnection: true,
    //         reconnectionAttempts: 5,
    //         reconnectionDelay: 1000,
    //     });

    //     // Handle connection
    //     this.socket.on('connect', async () => {
    //         const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '');
    //         if (token) {
    //             this.socket?.emit('subscribe_token', { token });
    //             await this.registerFcmToken(token);
    //         }
    //     });

    //     // Handle reconnection
    //     this.socket.on('reconnect', () => {
    //         console.log('Reconnected to notification server');
    //     });

    //     // Handle errors
    //     this.socket.on('connect_error', (error) => {
    //         console.error('Connection error:', error);
    //     });
    // }

    // private async registerFcmToken(accessToken: string) {
    //     if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    //     try {
    //         // Request FCM token
    //         const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    //         if (!vapidKey) {
    //             console.warn('VAPID key not found. Push notifications may not work.');
    //             return;
    //         }

    //         const token = await requestFcmToken(vapidKey);
    //         if (token) {
    //             this.fcmToken = token;
    //             this.socket?.emit('register_fcm_token', { 
    //                 token: accessToken,
    //                 fcmToken: token 
    //             });

    //             // Listen for foreground messages
    //             listenForegroundMessages((payload) => {
    //                 const notification = {
    //                     title: payload.notification?.title || 'New Notification',
    //                     body: payload.notification?.body || '',
    //                     data: payload.data || {},
    //                     timestamp: new Date().toISOString()
    //                 };
    //                 this.notifyHandlers(notification);
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error registering FCM token:', error);
    //     }
    // }

    // subscribe(userId: string) {
    //     this.socket?.emit('subscribe', { userId });
    // }

    // onNotification(handler: (notification: NotificationPayload) => void) {
    //     this.messageHandlers.push(handler);
    //     this.socket?.on('notification', handler);
        
    //     // Return cleanup function
    //     return () => {
    //         this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    //         this.socket?.off('notification', handler);
    //     };
    // }

    // private notifyHandlers(notification: NotificationPayload) {
    //     this.messageHandlers.forEach(handler => handler(notification));
    // }

    // disconnect() {
    //     this.socket?.disconnect();
    //     this.socket = null;
    //     this.messageHandlers = [];
    // }

    // // Show browser notification if permission is granted
    // async showBrowserNotification(title: string, options?: NotificationOptions) {
    //     if (typeof window === 'undefined' || !('Notification' in window)) return;
        
    //     if (Notification.permission === 'granted') {
    //         new Notification(title, options);
    //     } else if (Notification.permission !== 'denied') {
    //         const permission = await Notification.requestPermission();
    //         if (permission === 'granted') {
    //             new Notification(title, options);
    //         }
    //     }
    // }
}

export const notificationClient = new NotificationClient();


