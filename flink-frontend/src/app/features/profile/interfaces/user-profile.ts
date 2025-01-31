export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface UserHobbies {
    id?: number;
    name: string;
  }
  
  export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    birthDate: Date;
    profilePic?: string;
    hobbies: UserHobbies[];
    location: Location;
  }