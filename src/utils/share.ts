import type { Event } from '../types';

export function shareEvent(event: Event) {
  const shareData = {
    title: event.title,
    text: `Check out ${event.title} at ${event.location.name}`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare(shareData)) {
    navigator.share(shareData).catch((error) => {
      console.error('Error sharing:', error);
      fallbackShare(event);
    });
  } else {
    fallbackShare(event);
  }
}

function fallbackShare(event: Event) {
  const text = `${event.title}\n${event.date} at ${event.time}\n${event.location.name}\n${event.location.address}`;
  navigator.clipboard.writeText(text).then(
    () => alert('Event details copied to clipboard!'),
    () => alert('Failed to copy event details')
  );
}