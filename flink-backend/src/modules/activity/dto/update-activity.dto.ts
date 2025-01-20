export class UpdateActivityDto {
  title?: string;
  description?: string;
  activityPhotos?: string[];
  location?: string[];
  conditions?: string[];
  nbOfParticipants?: number;
  finished?: boolean;
}
