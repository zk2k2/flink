import { ActivityConditions } from 'src/common/enums/activity-conditions.enum';

export class UpdateActivityDto {
  title?: string;
  description?: string;
  activityPhotos?: string[];
  locationId?: string;
  conditions?: ActivityConditions;
  nbOfParticipants?: number;
  finished?: boolean;
}
