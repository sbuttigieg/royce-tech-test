import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';

// Create a mock user that to get
const mockUser = {
  id: 1,
  name: 'Stephen Buttigieg',
  dob: '2009-09-08T22:00:00.000Z',
  address: '4, Triq-Klin Mgarr, MGR2241, Malta',
  description: 'Full stack developer',
  createdAt: '2021-03-25T08:29:40.192Z',
  updatedAt: '2021-03-25T08:29:40.192Z',
};

// Create a mock user that to create
const mockUserWrite = {
  name: 'Stephen Buttigieg',
  dob: new Date('1988-03-21'),
  address: '4, Triq-Klin Mgarr, MGR2241, Malta',
  description: 'Full stack developer',
};

// Create an array of mock users
const mockUsers = [
  {
    id: 1,
    name: 'Stephen Buttigieg',
    dob: '2009-09-08T22:00:00.000Z',
    address: '4, Triq-Klin Mgarr, MGR2241, Malta',
    description: 'Full stack developer',
    createdAt: '2021-03-25T08:29:40.192Z',
    updatedAt: '2021-03-25T08:29:40.192Z',
  },
  {
    id: 2,
    name: 'Robert Abela',
    dob: '2009-09-08T22:00:00.000Z',
    address: 'Triq ta Tnella, Zejtun, Malta',
    description: 'Prime Minister',
    createdAt: '2021-03-25T08:29:40.192Z',
    updatedAt: '2021-03-25T08:29:40.192Z',
  },
];

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
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUserRepository },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  // test UsersService.getUsers
  describe('getUsers', () => {
    it('calls find() from the repository and retrieve all users', async () => {
      // create a mock result for the find() method
      usersRepository.find.mockResolvedValue(Promise.resolve(mockUsers));
      // test that find is not yet called
      expect(usersRepository.find).not.toHaveBeenCalled();
      // call usersService.getUserById
      const result = await usersService.getUsers();
      // test that find has been called
      expect(usersRepository.find).toHaveBeenCalled();
      // test that findOneOrFail was called with the right parameters
      expect(usersRepository.find).toHaveBeenCalledWith();
      // test that result is correct
      expect(result).toEqual(mockUsers);
    });
  });

  // test UsersService.getUsersById
  describe('getUsersById', () => {
    it('calls findOneOrFail() from the repository and retrieve a user', async () => {
      // create a mock result for the findOneOrFail() method
      usersRepository.findOneOrFail.mockResolvedValue(
        Promise.resolve(mockUser),
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
      expect(result).toEqual(mockUser);
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
      const newUser: UserDto = mockUserWrite;
      // create a mock result for the createUser method
      usersRepository.createUser.mockResolvedValue(Promise.resolve(mockUser));
      // test that createUser is not yet called
      expect(usersRepository.createUser).not.toHaveBeenCalled();
      // call the usersService.createUser
      const result = await usersService.createUser(newUser);
      // test that createUser has been called
      expect(usersRepository.createUser).toHaveBeenCalled();
      // test that createUser was called with the right parameters
      expect(usersRepository.createUser).toHaveBeenCalledWith(newUser);
      // test that result is correct
      expect(result).toEqual(mockUser);
    });
  });

  // test UsersService.deleteUser
  describe('deleteUser', () => {
    it('calls delete() from repository and deletes a user', async () => {
      // create a mock result for the delete method
      const mockResult = { raw: 'Test raw', affected: 1 };
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
        Promise.resolve({ raw: null, affected: 0 }),
      );
      // test that the correct error is thrown when no user is deleted
      expect(usersService.deleteUser(1, mockUser)).rejects.toThrow(
        new NotFoundException(`Failed to delete use`),
      );
    });
  });

  // test UsersService.updateUser
  describe('updateUser', () => {
    it('calls updateUser() from repository and deletes a user update it', async () => {
      // create a mock getUserById()
      usersService.getUserById = jest.fn().mockResolvedValue(mockUser);
      // create a mock result for the updateUser method
      usersRepository.updateUser.mockResolvedValue(Promise.resolve(mockUser));
      // test that getUserById isn't called before calling updateUser
      expect(usersService.getUserById).not.toHaveBeenCalled();
      // test that updateUser is not yet called
      expect(usersRepository.updateUser).not.toHaveBeenCalled();
      // call the usersService.updateUser
      const result = await usersService.updateUser(1, mockUserWrite);
      // test that getUserById has been called
      expect(usersService.getUserById).toHaveBeenCalled();
      // test that getUserById was called with the right parameters
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
      // test that result is correct
      expect(result).toEqual(mockUser);
      // test that updateUser has been called
      expect(usersRepository.updateUser).toHaveBeenCalled();
      // test that updateUser was called with the right parameters
      expect(usersRepository.updateUser).toHaveBeenCalledWith(
        mockUser,
        mockUserWrite,
      );
      // test that result is correct
      expect(result).toEqual(mockUser);
    });

    it('throws an error during getUserById', async () => {
      // create a mock getTaskById() that throws an error
      usersService.getUserById = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundException('Failed to get user'));
      // call the usersService.updateUser and test that the correct error is
      // thrown when no user is found
      await expect(usersService.updateUser(1, mockUserWrite)).rejects.toThrow(
        new NotFoundException('Failed to get user'),
      );
    });
  });
});
