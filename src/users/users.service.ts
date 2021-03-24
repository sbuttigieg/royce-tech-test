import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async getUsers(): Promise<User[]> {
    // SCOPE: returns all users in the db
    // ERROR HANDLING: If query fails, internal server error is thrown
    // DETAILS: uses the find method of the inbuilt Repository class
    // RETURNS: a promise of an array of entity User
    try {
      const users = this.usersRepository.find();
      this.logger.debug('Get all users query successful');
      return users;
    } catch (error) {
      this.logger.error('Failed to get all users', error.stack);
      throw new InternalServerErrorException('Failed to get all users');
    }
  }

  async getUserById(id: number): Promise<User> {
    // SCOPE: returns the user that matches the id
    // ERROR HANDLING: if the user does not exist, NotFoundException is thrown
    // DETAILS: uses the findOne method of the inbuilt Repository class
    // RETURNS: a promise of an entity User
    try {
      const user = this.usersRepository.findOneOrFail({ id });
      this.logger.debug(`User with id ${id} retrieved successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to get user with id ${id}`, error.stack);
      throw new NotFoundException('Failed to get user');
    }
  }

  async createUser(userDto: UserDto): Promise<User> {
    // SCOPE: create a new user
    // ERROR HANDLING: none, data checked with a validation pipe in controller
    // DETAILS: the logic for this service is all in the repository
    // RETURNS: a promise of an entity User
    return this.usersRepository.createUser(userDto);
  }

  async deleteUser(id: number): Promise<void> {
    // SCOPE: deletes the user that matches the id
    // ERROR HANDLING: if no entities were deleted then the entity for the ID
    //                 did not exist and so a NotFoundException is thrown
    // DETAILS: Uses the delete method of the inbuilt Repository class
    //          The delete method returns an affected param that specifies
    //          the number of entities deleted
    // RETURNS: nothing, hence returns a void promise
    const result = await this.usersRepository.delete({ id });
    if (result.affected !== 0) {
      this.logger.debug(`User with id ${id} deleted successfully`);
    }
    this.logger.error(`Failed to delete user with id ${id}`);
    throw new NotFoundException(`Failed to delete user with id ${id}`);
  }

  async updateUser(id: number, userDto: UserDto): Promise<User> {
    // SCOPE: updates the user
    // ERROR HANDLING: id is validated within the getUserById method.
    //                 body is validated in the controller.
    // DETAILS: user matching received id is retrieved with getUserById method
    //          logic for updating user is all in the repository
    // RETURNS: a promise of an entity user
    const user = await this.getUserById(id);
    return this.usersRepository.updateUser(user, userDto);
  }
}
