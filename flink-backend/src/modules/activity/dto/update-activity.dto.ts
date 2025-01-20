import { ActivityConditionsEnum } from "src/common/enums/activity.conditions.enum";

export class UpdateActivityDto {
  title?: string;
  description?: string;
  activityPhotos?: string[];
  location?: string;
  conditions?: ActivityConditionsEnum;
  nbOfParticipants?: number;
  finished?: boolean;
}
