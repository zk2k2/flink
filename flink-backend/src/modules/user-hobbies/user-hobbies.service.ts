import { Injectable,Inject, forwardRef , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/service/common.service';
import { UserHobby } from './entities/user-hobby.entity';
import { UpdateUserHobbiesDto } from './dto/update-user-hobbies.dto';
import { UserService } from 'src/modules/user/user.service';
import { HobbyService } from 'src/modules/hobby/hobby.service';
@Injectable()
export class UserHobbiesService extends CommonService<UserHobby, UserHobby, UpdateUserHobbiesDto> {
  constructor(
    @InjectRepository(UserHobby)
    private readonly userHobbyRepository: Repository<UserHobby>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hobbyService: HobbyService,
  ) {
    super(userHobbyRepository);
  }

async getUserHobbiesByUserId(userId: string): Promise<UserHobby[]> {
  return this.findAll({
    where: { user: { id: userId } },
  });
}
async addHobbyToUser(userId: string, hobbyId: string, interestLevel: number): Promise<UserHobby> {
  const user = await this.userService.findOneById(userId);
  const hobby = await this.hobbyService.findOneById(hobbyId);

  const existingUserHobby = await this.findOne({
    where: { user: { id: userId }, hobby: { id: hobbyId } },
  }); 

  if (existingUserHobby) {
    throw new NotFoundException('User already has this hobby');
  }
  const userHobby = new UserHobby();
  userHobby.user = user;
  userHobby.hobby = hobby;
  userHobby.interestLevel = interestLevel;


  return this.create(userHobby);
}


async updateInterestLevel(userId: string, hobbyId: string, interestLevel: number): Promise<UserHobby> {
  const userHobby = await this.findOne({ where: { user: { id: userId }, hobby: { id: hobbyId } }});

  if (!userHobby) throw new NotFoundException('UserHobby association not found');

  return this.update(userHobby.id, { interestLevel });
}
async removeHobbyFromUser(userId: string, hobbyId: string): Promise<void> {
  const userHobby = await this.findOne({where: { user: { id: userId }, hobby: { id: hobbyId } }});

  if (!userHobby) throw new NotFoundException('UserHobby association not found');

  await this.remove(userHobby.id);
}
}
