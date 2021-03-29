#  Royce Technology Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

## User Model
```
{
  "id": "xxx",                  // unique user ID
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
```
## Installation
```
git clone https://github.com/sbuttigieg/royce-tech-test
(use master branch)

docker-compose up
```
## Start the app
```
# development mode (watch mode + see logger messages)
npm run start:dev

# production mode
npm run start
```
## Test
```
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
## Endpoints
Postman collections can be used to test the following endpoints
```
# remote server at aws
_AWS_Royce Tech Test.postman_collection.json

# local
_Royce Tech Test.postman_collection.json
``` 

```
# Get all users
GET     
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users
http://localhost:3000/users

# Get a use by user ID
GET
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users/:id
http://localhost:3000/users/:id

# Delete user by user ID
DELETE
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users/:id
http://localhost:3000/users/:id

# Get address coordinates by user ID
GET
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users/address/:id
http://localhost:3000/users/address/:id/

# Create a new user
POST    
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users
http://localhost:3000/users
Body name:  dob:    address:    description:
        
# Update user
PATCH   
http://ec2-18-194-243-118.eu-central-1.compute.amazonaws.com/users/:id
http://localhost:3000/users/:id
Body name:  dob:    address:    description:
```