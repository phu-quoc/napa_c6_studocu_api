import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/database/users/user.entity';
import { CreateUserDto, UpdateUserDto } from '@/modules/users/dto';
import { ResourceNotFoundException } from '@exceptions/resource-not-found.exception';
import { MessageName } from '@/bases/constants/message';
import { UniversitiesService } from '@/modules/universities/universities.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private universitiesService: UniversitiesService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const university = await this.universitiesService.findById(
      dto.universityId,
    );
    if (!university)
      throw new ResourceNotFoundException(MessageName.UNIVERSITY);
    return await this.userRepository.save(dto);
  }

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, dto: UpdateUserDto) {
    const toUpdate = await this.userRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new ResourceNotFoundException(MessageName.USER);
    }
    const updated = Object.assign(toUpdate, dto);
    return this.userRepository.save(updated);
  }
}
