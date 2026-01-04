// Install event - register with macOS
self.addEventListener('install', function(event) {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service worker activating...');
  event.waitUntil(clients.claim());
});

// Helper function to play notification sound
async function playNotificationSound() {
  try {
    // Get all clients (open windows/tabs of your app)
    const allClients = await clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    });

    // If there's at least one client open, send message to play sound
    if (allClients.length > 0) {
      allClients.forEach(client => {
        client.postMessage({
          type: 'PLAY_NOTIFICATION_SOUND'
        });
      });
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

self.addEventListener('push', function (event) {
  console.log('Push event received:', event);
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Push notification data:', data);
      const options = {
        body: data.body,
        icon: data.icon || '/icon192.png',
        badge: '/icon192.png',
        // vibrate: [100, 50, 100],
        requireInteraction: false,
        silent: true, // Set to true since we'll play our own sound
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
        },
      };
      console.log('Showing notification with options:', options);

      // Play custom sound
      playNotificationSound();

      event.waitUntil(
        self.registration.showNotification(data.title, options)
          .then(() => console.log('Notification shown successfully'))
          .catch(err => console.error('Failed to show notification:', err))
      );
    } catch (error) {
      console.error('Error processing push notification:', error);
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(self.location.origin)
  );
});