export class CreateUserDto {
  name: string;
  username: string;
  age: number;
  profilePic?: string;
  phone: string;
  interests?: string[];
  habits?: string[];
}
