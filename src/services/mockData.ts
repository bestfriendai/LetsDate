import { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Romantic Sunset Dinner Cruise',
    description: 'Enjoy a magical evening with your special someone aboard our luxury dinner cruise. Features a gourmet three-course meal, live music, and breathtaking views of the city skyline.',
    date: '2024-03-15',
    time: '6:30 PM',
    location: {
      name: 'Harbor Cruise Terminal',
      address: '123 Marina Way, New York, NY 10004',
      coordinates: [40.702271, -74.015137]
    },
    category: 'Restaurant',
    price: 129,
    imageUrl: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/sunset-cruise'
  },
  {
    id: '2',
    title: 'Rooftop Jazz & Wine Night',
    description: 'An intimate evening of live jazz, premium wines, and tapas on our stunning rooftop lounge. Perfect for date night or special occasions.',
    date: '2024-03-16',
    time: '7:00 PM',
    location: {
      name: 'Sky Lounge',
      address: '456 High St, New York, NY 10013',
      coordinates: [40.719167, -74.006389]
    },
    category: 'Nightlife',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/jazz-night'
  },
  {
    id: '3',
    title: 'Couples Cooking Class: Italian Romance',
    description: 'Learn to cook authentic Italian dishes together in this hands-on cooking class. Includes wine pairing and a romantic dinner with your creations.',
    date: '2024-03-17',
    time: '5:00 PM',
    location: {
      name: 'Culinary Institute',
      address: '789 Foodie Ave, New York, NY 10014',
      coordinates: [40.731411, -74.006123]
    },
    category: 'Learning',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/cooking-class'
  },
  {
    id: '4',
    title: 'Art After Dark: Gallery Night',
    description: 'Experience contemporary art in a romantic setting. Includes guided tours, champagne, and live music performances throughout the evening.',
    date: '2024-03-18',
    time: '8:00 PM',
    location: {
      name: 'Modern Art Gallery',
      address: '321 Gallery Row, New York, NY 10011',
      coordinates: [40.744591, -74.005974]
    },
    category: 'Arts',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/art-night'
  },
  {
    id: '5',
    title: 'Sunset Yoga in the Park',
    description: 'Connect with your partner through partner yoga poses while enjoying the peaceful sunset in the park. Suitable for all skill levels.',
    date: '2024-03-19',
    time: '6:00 PM',
    location: {
      name: 'Central Park',
      coordinates: [40.785091, -73.968285],
      address: 'Central Park West, New York, NY'
    },
    category: 'Outdoor',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/sunset-yoga'
  },
  {
    id: '6',
    title: 'Comedy Night & Craft Cocktails',
    description: 'Laugh the night away with top comedians while enjoying expertly crafted cocktails in an intimate speakeasy setting.',
    date: '2024-03-20',
    time: '8:00 PM',
    location: {
      name: 'The Secret Room',
      address: '789 Hidden Lane, New York, NY 10013',
      coordinates: [40.722345, -74.002123]
    },
    category: 'Entertainment',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/comedy-night'
  },
  {
    id: '7',
    title: 'Wine & Chocolate Pairing Experience',
    description: 'Indulge in an evening of fine wines paired with artisanal chocolates. Learn about wine tasting and chocolate making in this interactive experience.',
    date: '2024-03-21',
    time: '7:00 PM',
    location: {
      name: 'Wine & Co.',
      address: '234 Grape St, New York, NY 10014',
      coordinates: [40.735678, -74.008912]
    },
    category: 'Food & Drink',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&q=80',
    ticketUrl: 'https://example.com/tickets/wine-chocolate'
  }
];