import { PartialType } from "@nestjs/mapped-types";
import { CreateUserHobbiesDto } from "./create-user-hobbies.dto";

export class UpdateUserHobbiesDto extends PartialType(CreateUserHobbiesDto) {
    
}