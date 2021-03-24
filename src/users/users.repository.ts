import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository');

  async createUser(userDto: UserDto): Promise<User> {
    // SCOPE: create a new user
    // ERROR HANDLING: Data checked with a validation pipe in the controller.
    //                 If saving fails, internal server error is thrown.
    // DETAILS: id, createdAt and updatedAt fields are automatically generated.
    //          The save method stores the data in the db
    // RETURNS: a promise of an entity User
    const user = new User();
    const { name, dob, address, description } = userDto;
    user.name = name;
    user.dob = dob;
    user.address = address;
    user.description = description;

    try {
      await user.save();
      this.logger.debug(`User ${user.name} created successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user ${user.name}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(user: User, body: UserDto): Promise<User> {
    // SCOPE: updates the user
    // ERROR HANDLING: id is validated within the getUserById method.
    //                 body is validated with in the controller.
    //                 If saving fails, internal server error is thrown.
    // DETAILS:  createdAt and updatedAt fields are automatically updated
    //           the save method stores the data in the db
    // RETURNS: a promise of an entity user
    user.name = body.name;
    user.dob = body.dob;
    user.address = body.address;
    user.description = body.description;

    try {
      await user.save();
      this.logger.debug(`User with id ${user.id} updated successfully`);
      return user;
    } catch (error) {
      this.logger.error(`Error while updating user with id ${user.id}`);
      throw new InternalServerErrorException('Error while updating user');
    }
  }
}
