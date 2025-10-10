
'use client';

import { useEffect } from 'react';
import { getToken, isSupported } from 'firebase/messaging';
import { doc } from 'firebase/firestore';
import { useMessaging, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

// IMPORTANT: This key is part of the Web Push standard and is not a secret.
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // This will be replaced by a secure server-side process in a real app.

export function NotificationPermissionManager() {
  const messaging = useMessaging();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !messaging || !firestore) {
      return;
    }

    const requestPermissionAndToken = async () => {
      try {
        const isMessagingSupported = await isSupported();
        if (!isMessagingSupported) {
          console.log("Firebase Messaging is not supported in this browser.");
          return;
        }
        
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
          
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            const userDocRef = doc(firestore, 'users', user.uid);
            // Save the token to Firestore
            setDocumentNonBlocking(userDocRef, { fcmToken: currentToken }, { merge: true });

          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
        toast({
          variant: "destructive",
          title: "Error requesting notification permission.",
          description: (err as Error).message || "Could not set up notifications.",
        });
      }
    };

    requestPermissionAndToken();
  }, [user, messaging, firestore, toast]);

  return null; // This component does not render anything
}

    