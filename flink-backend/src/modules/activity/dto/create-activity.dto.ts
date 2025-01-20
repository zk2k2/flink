export class CreateActivityDto {
  title: string;
  description: string;
  activityPhotos?: string[];
  location?: string[];
  conditions?: string[];
  nbOfParticipants: number;
  creatorId: number; // Maps directly to the creator field in Activity
}
