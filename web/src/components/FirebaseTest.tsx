'use client';

import React, { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '@/utils/firebase';

const FirebaseTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFirebase = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Starting Firebase messaging test...');
        
        // Request FCM token
        const fcmToken = await requestForToken();
        if (fcmToken) {
          setToken(fcmToken);
          console.log('✅ FCM Token obtained successfully');
        } else {
          setError('Failed to get FCM token');
          console.log('❌ Failed to get FCM token');
        }

        // Listen for foreground messages
        onMessageListener()
          .then((payload: any) => {
            console.log('✅ Foreground message received:', payload);
            setNotification(payload);
          })
          .catch((err) => {
            console.log('❌ FCM listener failed:', err);
            setError('FCM listener failed: ' + err.message);
          });

      } catch (err: any) {
        console.error('❌ Firebase initialization error:', err);
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from your app',
        icon: '/next.svg',
        badge: '/next.svg',
      });
    } else {
      alert('Notification permission not granted');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Firebase Messaging Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Status</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Service Worker: </span>
              <span className={typeof window !== 'undefined' && 'serviceWorker' in navigator ? 'text-green-600' : 'text-red-600'}>
                {typeof window !== 'undefined' && 'serviceWorker' in navigator ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div>
              <span className="font-medium">Notifications: </span>
              <span className={typeof window !== 'undefined' && 'Notification' in window ? 'text-green-600' : 'text-red-600'}>
                {typeof window !== 'undefined' && 'Notification' in window ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
            <div>
              <span className="font-medium">Permission: </span>
              <span className={typeof window !== 'undefined' && Notification.permission === 'granted' ? 'text-green-600' : 'text-yellow-600'}>
                {typeof window !== 'undefined' ? Notification.permission : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">FCM Token</h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : token ? (
            <div>
              <p className="text-green-600 mb-2">✅ Token obtained successfully</p>
              <textarea 
                value={token} 
                readOnly 
                className="w-full h-20 p-2 border rounded text-sm font-mono"
              />
            </div>
          ) : (
            <p className="text-red-600">❌ No token available</p>
          )}
        </div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {notification && (
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Latest Notification</h3>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {JSON.stringify(notification, null, 2)}
            </pre>
          </div>
        )}

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Test Actions</h3>
          <button
            onClick={testNotification}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Browser Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
