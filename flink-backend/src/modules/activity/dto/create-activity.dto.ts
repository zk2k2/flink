import { ActivityConditionsEnum } from "src/common/enums/activity.conditions.enum";

export class CreateActivityDto {
  title: string;
  description: string;
  activityPhotos?: string[];
  location?: string;
  conditions?: ActivityConditionsEnum;
  nbOfParticipants: number;
}
