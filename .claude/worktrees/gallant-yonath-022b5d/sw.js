// Atlas AI Travel Planner — Service Worker
const CACHE_NAME = 'atlas-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Push notification handler
self.addEventListener('push', event => {
  let data = { title: 'Atlas', body: 'You have a travel reminder.', icon: '/icon-192.png', url: '/' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'atlas-notif',
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: 'Open Atlas' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('getatlas.ca') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
