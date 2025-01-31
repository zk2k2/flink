import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from './entities/hobby.entity';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { UserModule } from '../user/user.module';
@Module({
  imports: [TypeOrmModule.forFeature([Hobby])],
  providers: [HobbyService],
  controllers: [HobbyController],
  exports:[HobbyService]
})
export class HobbyModule {}