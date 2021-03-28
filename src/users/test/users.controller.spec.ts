import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { TestLogger } from './test.logger';
import * as mockData from './mockRepository';

// create a mock UserServices with jest functions
const mockUserServices = () => ({
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
  getUserAddress: jest.fn(),
});

describe('UsersController', () => {
  let usersController;
  let usersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUserServices,
        },
      ],
    }).compile();
    module.useLogger(TestLogger);
    usersController = await module.get<UsersController>(UsersController);
    usersService = await module.get<UsersService>(UsersService);
  });

  // test that controller is defined
  it('controller should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('get all Users', () => {
    it('should get an array of users', async () => {
      // create a mock result for the getUsers() method
      usersService.getUsers.mockResolvedValue(
        Promise.resolve(mockData.mockUsers),
      );
      // test that result matches the output
      await expect(usersController.getAllUsers()).resolves.toEqual(
        mockData.mockUsers,
      );
    });
  });

  describe('get one User by ID', () => {
    it('should get one user', async () => {
      // create a mock result for the getUserById() method
      usersService.getUserById.mockResolvedValue(
        Promise.resolve(mockData.mockUser),
      );
      // test that result matches the output
      await expect(usersController.getUserById(1)).resolves.toEqual(
        mockData.mockUser,
      );
    });
  });

  describe('create a new user', () => {
    it('should create a user', async () => {
      // create a mock result for the creatUser() method
      usersService.createUser.mockResolvedValue(
        Promise.resolve(mockData.mockUserDto),
      );
      // test that result matches the output
      const result = await usersController.createUser(mockData.mockUserDto);
      expect(result.name).toEqual(mockData.mockUserDto.name);
    });
  });

  describe('delete a user', () => {
    it('should delete a user', async () => {
      // create a mock result for the deleteUser() method
      usersService.deleteUser.mockResolvedValue(Promise.resolve(true));
      // test that result matches the output
      const result = await usersController.deleteUser(1);
      expect(result).toEqual(true);
    });
  });

  describe('update a user', () => {
    it('should update a user', async () => {
      // create a mock result for the updateUser() method
      usersService.updateUser.mockResolvedValue(
        Promise.resolve(mockData.mockUser),
      );
      // test that result matches the output
      const result = await usersController.updateUser(1);
      expect(result).toEqual(mockData.mockUser);
    });
  });

  describe('get user address', () => {
    it('should show coordinates', async () => {
      // create a mock result for the updateUser() method
      usersService.getUserAddress.mockResolvedValue(
        Promise.resolve('any'),
      );
      // test that result matches the output
      const result = await usersController.getUserAddress(1);
      expect(result).toEqual('any');
    });
  });
});
