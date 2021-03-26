import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    // ERROR HANDLING: none
    // DETAILS: uses the find method of the inbuilt Repository class
    // RETURNS: a promise of an array of entity User
    const users = this.usersRepository.find();
    this.logger.debug('Get all users query successful');
    return users;
  }

  async getUserById(id: number): Promise<User | void> {
    // SCOPE: returns the user that matches the id
    // ERROR HANDLING: if the user does not exist, NotFoundException is thrown
    // DETAILS: uses the findOneOrFail method of the inbuilt Repository class
    // RETURNS: a promise of an entity User or void if nothing is returned
    try {
      const user = await this.usersRepository
        .findOneOrFail({ id })
        .catch(() => {
          throw new NotFoundException('Failed to get user');
        });
      this.logger.debug(`User with id ${id} retrieved successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to get user with id ${id}`, error.stack);
      throw error;
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
    try {
      const result = await this.usersRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException('Failed to delete user');
      }
      this.logger.debug(`User with id ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete user with id ${id}`, error.stack);
      throw error;
    }
  }

  async updateUser(id: number, userDto: UserDto): Promise<User | void> {
    // SCOPE: updates the user
    // ERROR HANDLING: id is validated within the getUserById method.
    //                 body is validated in the controller.
    // DETAILS: user matching received id is retrieved with getUserById method
    //          logic for updating user is all in the repository
    // RETURNS: a promise of an entity user
    try {
      const user = await this.getUserById(id);
      if (user) {
        return this.usersRepository.updateUser(user, userDto);
      }
    } catch (error) {
      this.logger.error(`Failed to get user with id ${id}`, error.stack);
      throw error;
    }
  }
}
