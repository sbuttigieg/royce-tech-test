import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../repositories/users.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { TestLogger } from './test.logger';
import * as mockData from './mockRepository';

// test UsersRepository
describe('UsersRepository', () => {
  // global test variables
  let usersRepository;

  // before each test create a test module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();
    module.useLogger(TestLogger);
    usersRepository = await module.get<UsersRepository>(UsersRepository);
  });

  // test UsersRepository.createUser
  describe('createUser', () => {
    it('successfully creates a user', async () => {
      // create a mock save and create methods
      const save = jest.fn();
      usersRepository.create = jest.fn().mockReturnValue({ save });
      // create a mock result for the save() method
      save.mockResolvedValue(undefined);
      // call the usersRepository.createUser method
      const result = await usersRepository.createUser(mockData.mockUserDto);
      // check that result is correct
      expect(result.name).toEqual(mockData.mockUserDto.name);
    });

    it('throws error if save fails', async () => {
      // create a mock save() method that throws an error
      const save = jest.fn().mockRejectedValue('any error');
      usersRepository.create = jest.fn().mockReturnValue({ save });
      // test that the correct error is thrown when save method fails
      await expect(
        usersRepository.createUser(mockData.mockUserDto),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create user'),
      );
    });
  });

  // test UsersRepository.updateUser
  describe('updateUser', () => {
    it('throws error if save fails', async () => {
      // create a mock save() method that throws an error
      const save = jest.fn().mockRejectedValue('any error');
      // test that the correct error is thrown when updateUser fails
      await expect(
        usersRepository.updateUser(mockData.mockUser, mockData.mockUserDto),
      ).rejects.toThrow(
        new InternalServerErrorException('Error while updating user'),
      );
    });
  });
});
