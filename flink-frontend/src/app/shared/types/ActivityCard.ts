import { ActivityMember } from './ActivityMember';
import { Location } from './Location';

export interface ActivityCard {
  id: string;
  createdAt: Date;
  creator: {
    id?: string;
    firstName: string;
    lastName: string;
    profilePic: string;
  };
  title: string;
  category: {
    icon: string;
    name: string;
  };
  date: string;

  nbOfParticipants: number;
  description: string;
  activityPhotos: string[];
  users: ActivityMember[];

  location: Location;
}
