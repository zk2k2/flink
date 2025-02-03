export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface UserHobbies {
    id?: number;
    name: string;
  }
  

  export interface UserProfile {
    firstName: string;
    lastName: string;
    username: string;
    profilePic?: string;
    xp: number;
    followersCount: number;
    followingCount: number;
    achievements: Achievement[];
    hobbies: string[];  // Array of hobby titles
    postsCount: number;
  }
  
  // Supporting interfaces
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    photo: string;
    // Add other achievement properties as needed
  }