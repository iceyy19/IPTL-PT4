export interface Post {
    id: string;
    name: string;
    username: string;
    content: string;
    image: string | null; // Allow null for image
    likes: number;
    comments: {
      id: string;
      name: string;
      username: string;
      content: string;
      timestamp: string;
    }[];
    timestamp: string;
    saved: boolean;
    privacy: string;
    edited: boolean;
  }