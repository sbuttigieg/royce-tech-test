import { Body, Controller, Delete, Logger } from '@nestjs/common';
import { Get, Param, Post, Patch } from '@nestjs/common';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';
import { AxiosResponse } from 'axios';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private usersService: UsersService) {}

  // SCOPE: retrieve all users
  // ERROR HANDLING: performed in the service
  // DETAILS: calls getUsers method in the users service
  // RETURNS: a promise of an array of entity User
  @Get()
  getAllUsers(): Promise<User[]> {
    this.logger.verbose('Retrieve all users');
    return this.usersService.getUsers();
  }

  // SCOPE: to retrieve a user by id
  // ERROR HANDLING: The id is validated to be a number with the ParseIntPipe.
  //                 Validation that the id actually exists in the db is done
  //                 within the service
  // DETAILS: calls getUserById method in the users service
  // RETURNS: a promise of an entity User or void if nothing is returned
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User | void> {
    this.logger.verbose(`Retrieve a user by id`);
    return this.usersService.getUserById(id);
  }

  // SCOPE: to create a new user
  // ERROR HANDLING: The keys and values in the body are validated using a
  //                 validation pipe to the UserDto.
  //                 The keys must match otherwise an error is given since
  //                 they do not have the @IsOptional decorator.
  // DETAILS: calls createUser method in the users service
  // RETURNS: a promise of an entity User
  @Post()
  createUser(@Body(ValidationPipe) userDto: UserDto): Promise<User> {
    this.logger.verbose(`Create a new user`);
    return this.usersService.createUser(userDto);
  }

  // SCOPE: request to delete a user
  // ERROR HANDLING: The id is validated to be a number with the ParseIntPipe
  //                 Validation that the id actually exists in the db is done
  //                 within the service
  // DETAILS: calls deleteUser method in the users service
  // RETURNS: nothing, hence returns a void promise
  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.verbose(`Delete a user.`);
    return this.usersService.deleteUser(id);
  }

  // SCOPE: request to update the user
  // ERROR HANDLING: The id is validated to be a number with the ParseIntPipe
  //                 Body is validated using a validation pipe to the UserDto
  // DETAILS: calls updateUser method in the users service
  // RETURNS: a promise of an entity User or void if nothing is returned
  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) userDto: UserDto,
  ): Promise<User | void> {
    this.logger.verbose(`Update a user`);
    return this.usersService.updateUser(id, userDto);
  }

  // SCOPE: to retrieve address coordinates by id
  // ERROR HANDLING: The id is validated to be a number with the ParseIntPipe.
  //                 Validation that the id actually exists in the db is done
  //                 within the service
  // DETAILS: calls getUserById method in the users service
  // RETURNS: a promise of an entity User or void if nothing is returned
  @Get('/address/:id/')
  getUserAddress(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AxiosResponse | void> {
    this.logger.verbose(`Retrieve address coordinates by id`);
    return this.usersService.getUserAddress(id);
  }
}
