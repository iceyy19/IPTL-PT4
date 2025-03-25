export interface MediaItem {
    id: string;
    type: string;
    url: string;
  }
  
  export interface Story {
    id: string;
    title: string;
    media: string; // Array of media URLs
    type: string;
    username: string;
    privacy: string;
    views: number;
    viewers: Array<{
      id: string;
      name: string;
      username: string;
      avatar: string;
      time: string;
    }>;
    likes: number;
    likers: Array<{
      id: string;
      name: string;
      username: string;
      avatar: string;
    }>;
  }