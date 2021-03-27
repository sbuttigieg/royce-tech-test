import {
  Injectable,
  Logger,
  NotFoundException,
  HttpService,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../dto/user.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  private baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  private accessToken =
    'pk.eyJ1Ijoic2J1dHRpZ2llZyIsImEiOiJja21zNTZnNTAwZWY2Mm9wbWwzNzNpZ2tiIn0.mJK5YQFHupaeCVsrsl7fYA';
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private readonly httpService: HttpService,
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

  async getUserAddress(id: number): Promise<AxiosResponse<any> | void> {
    // SCOPE: gets the coordinates of the user address
    // ERROR HANDLING: id is validated within the getUserById method.
    // DETAILS: user matching received id is retrieved with getUserById method
    //          the coordinates are retrieved by sending get request to mapbox
    // RETURNS: an Axios response or void
    try {
      const user = await this.getUserById(id);
      if (user) {
        const formattedAddress = encodeURI(user.address);
        const url =
          this.baseUrl +
          formattedAddress +
          '.json?access_token=' +
          this.accessToken;
        return this.httpService
          .get(url)
          .toPromise()
          .then((response) => {
            return response.data.features[0].geometry;
          })
          .catch((error) => {
            throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          });
      }
    } catch (error) {
      this.logger.error(`Failed to get user with id ${id}`, error.stack);
      throw error;
    }
  }
}
