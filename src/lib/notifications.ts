import { Followup } from '../types';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported by browser');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => console.log('Service Worker registered with scope:', reg.scope),
        (err) => console.log('Service Worker registration failed:', err)
      );
    });
  }
}

export function triggerPushNotification(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      } as NotificationOptions);
    });
  } else {
    new Notification(title, { body, icon: '/icon-192.png' });
  }
}

/**
 * Checks for follow-ups that scheduled for tomorrow or today (1 day prior)
 * and sends push notification if push is enabled.
 */
export function checkAndNotifyUpcomingFollowups(followups: Followup[], pushEnabled: boolean) {
  if (!pushEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;

  const now = new Date();
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  followups.forEach((f) => {
    if (f.is_completed) return;
    const fDate = new Date(f.followup_date);
    const fDay = new Date(fDate.getFullYear(), fDate.getMonth(), fDate.getDate()).getTime();
    const diffDays = Math.round((fDay - todayDay) / (1000 * 60 * 60 * 24));

    // Send push notification 1 day prior or today
    if (diffDays === 1) {
      triggerPushNotification(
        `Upcoming Follow-up: ${f.client_name}`,
        `Follow-up with ${f.client_name} is scheduled for tomorrow at ${f.location}.`
      );
    } else if (diffDays === 0) {
      triggerPushNotification(
        `Follow-up Due Today: ${f.client_name}`,
        `Follow-up with ${f.client_name} is scheduled for today at ${f.location}.`
      );
    }
  });
}
