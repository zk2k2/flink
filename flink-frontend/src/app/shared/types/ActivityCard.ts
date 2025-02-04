import { Location } from './Location';

export interface ActivityCard {
  creator: {
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

  location: Location;
}
