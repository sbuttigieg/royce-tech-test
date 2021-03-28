import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersRepository } from '../repositories/users.repository';
import { UserDto } from '../dto/user.dto';
import { HttpModule, NotFoundException } from '@nestjs/common';
import { TestLogger } from './test.logger';
import * as mockData from './mockRepository';

// create a mock UserRepository with jest functions
const mockUserRepository = () => ({
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  createUser: jest.fn(),
  delete: jest.fn(),
  updateUser: jest.fn(),
});

// test UsersService
describe('UsersService', () => {
  // global test variables
  let usersService;
  let usersRepository;

  // before each test create a test module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUserRepository },
      ],
    }).compile();
    module.useLogger(TestLogger);
    usersService = await module.get<UsersService>(UsersService);
    usersRepository = await module.get<UsersRepository>(UsersRepository);
  });

  // test UsersService.getUsers
  describe('getUsers', () => {
    it('calls find() from the repository and retrieve all users', async () => {
      // create a mock result for the find() method
      usersRepository.find.mockResolvedValue(
        Promise.resolve(mockData.mockUsers),
      );
      // test that find is not yet called
      expect(usersRepository.find).not.toHaveBeenCalled();
      // call usersService.getUserById
      const result = await usersService.getUsers();
      // test that find has been called
      expect(usersRepository.find).toHaveBeenCalled();
      // test that findOneOrFail was called with the right parameters
      expect(usersRepository.find).toHaveBeenCalledWith();
      // test that result is correct
      expect(result).toEqual(mockData.mockUsers);
    });
  });

  // test UsersService.getUsersById
  describe('getUsersById', () => {
    it('calls findOneOrFail() from the repository and retrieve a user', async () => {
      // create a mock result for the findOneOrFail() method
      usersRepository.findOneOrFail.mockResolvedValue(
        Promise.resolve(mockData.mockUser),
      );
      // test that findOneOrFail is not yet called
      expect(usersRepository.findOneOrFail).not.toHaveBeenCalled();
      // call usersService.getUserById
      const result = await usersService.getUserById(1);
      // test that findOneOrFail has been called
      expect(usersRepository.findOneOrFail).toHaveBeenCalled();
      // test that findOneOrFail was called with the right parameters
      expect(usersRepository.findOneOrFail).toHaveBeenCalledWith({ id: 1 });
      // test that result is correct
      expect(result).toEqual(mockData.mockUser);
    });

    it('throws error if user is not found', async () => {
      // create a mock failed result for the findOneOrFail() method
      usersRepository.findOneOrFail.mockRejectedValue(null);
      // test that the correct error is thrown when no user is found
      await expect(usersService.getUserById(1)).rejects.toThrow(
        new NotFoundException('Failed to get user'),
      );
    });
  });

  // test UsersService.createUser
  describe('createUser', () => {
    it('calls createUser() from repository and returns the new user', async () => {
      // Create a new mock user
      const newUser: UserDto = mockData.mockUserDto;
      // create a mock result for the createUser method
      usersRepository.createUser.mockResolvedValue(
        Promise.resolve(mockData.mockUser),
      );
      // test that createUser is not yet called
      expect(usersRepository.createUser).not.toHaveBeenCalled();
      // call the usersService.createUser
      const result = await usersService.createUser(newUser);
      // test that createUser has been called
      expect(usersRepository.createUser).toHaveBeenCalled();
      // test that createUser was called with the right parameters
      expect(usersRepository.createUser).toHaveBeenCalledWith(newUser);
      // test that result is correct
      expect(result).toEqual(mockData.mockUser);
    });
  });

  // test UsersService.deleteUser
  describe('deleteUser', () => {
    it('calls delete() from repository and deletes a user', async () => {
      // create a mock result for the delete method
      const mockResult = { affected: 1 };
      usersRepository.delete.mockResolvedValue(Promise.resolve(mockResult));
      // test that delete is not yet called
      expect(usersRepository.delete).not.toHaveBeenCalled();
      // call the usersService.deleteUser
      await usersService.deleteUser(1);
      // test that delete has been called
      expect(usersRepository.delete).toHaveBeenCalled();
      // test that delete was called with the right parameters
      expect(usersRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('throws an error if user is not found', () => {
      // create a mock result for the delete method that returns null
      usersRepository.delete.mockResolvedValue(
        Promise.resolve({ affected: 0 }),
      );
      // test that the correct error is thrown when no user is deleted
      expect(usersService.deleteUser(1, mockData.mockUser)).rejects.toThrow(
        new NotFoundException(`Failed to delete user`),
      );
    });
  });

  // test UsersService.updateUser
  describe('updateUser', () => {
    it('calls updateUser() from repository and updates a user', async () => {
      // create a mock getUserById()
      usersService.getUserById = jest.fn().mockResolvedValue(mockData.mockUser);
      // create a mock result for the updateUser method
      usersRepository.updateUser.mockResolvedValue(
        Promise.resolve(mockData.mockUser),
      );
      // test that getUserById isn't called before calling updateUser
      expect(usersService.getUserById).not.toHaveBeenCalled();
      // test that updateUser is not yet called
      expect(usersRepository.updateUser).not.toHaveBeenCalled();
      // call the usersService.updateUser
      const result = await usersService.updateUser(1, mockData.mockUserDto);
      // test that getUserById has been called
      expect(usersService.getUserById).toHaveBeenCalled();
      // test that getUserById was called with the right parameters
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
      // test that result is correct
      expect(result).toEqual(mockData.mockUser);
      // test that updateUser has been called
      expect(usersRepository.updateUser).toHaveBeenCalled();
      // test that updateUser was called with the right parameters
      expect(usersRepository.updateUser).toHaveBeenCalledWith(
        mockData.mockUser,
        mockData.mockUserDto,
      );
      // test that result is correct
      expect(result).toEqual(mockData.mockUser);
    });

    it('throws an error during getUserById', async () => {
      // create a mock getTaskById() that throws an error
      usersService.getUserById = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException('Failed to get user'));
      // call the usersService.updateUser and test that the correct error is
      // thrown when no user is found
      await expect(
        usersService.updateUser(1, mockData.mockUserDto),
      ).rejects.toThrow(new NotFoundException('Failed to get user'));
    });
  });

  // test UsersService.getUserAddress
  describe('getUserAddress', () => {
    it('gets address coordinates for a user', async () => {
      // mock result from httpService
      const address = {
        type: 'Point',
        coordinates: [14.36639, 35.91972],
      };
      // create a mock getUserById()
      usersService.getUserById = jest.fn().mockResolvedValue(mockData.mockUser);
      // test that getUserById isn't called before calling updateUser
      expect(usersService.getUserById).not.toHaveBeenCalled();
      // call the usersService.getUserAddress
      const result = await usersService.getUserAddress(1);
      // test that getUserById has been called
      expect(usersService.getUserById).toHaveBeenCalled();
      // test that getUserById was called with the right parameters
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
      // test that result is correct
      expect(result).toEqual(address);
    });

    it('throws an error during getUserById', async () => {
      // create a mock getTaskById() that throws an error
      usersService.getUserById = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException('Failed to get user'));
      // call the usersService.getUserAddress and test that the correct error is
      // thrown when no user is found
      await expect(usersService.getUserAddress(1)).rejects.toThrow(
        new NotFoundException('Failed to get user'),
      );
    });
  });
});
