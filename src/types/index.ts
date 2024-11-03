export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  category: string;
  price: number;
  imageUrl: string;
  ticketUrl?: string;
}