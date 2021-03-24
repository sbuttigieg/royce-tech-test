#  Developer Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

## Context

Build a RESTful API that can `create/read/update/delete` user data from a persistence store.

### User Model

```
{
  "id": "xxx",                  // user ID (must be unique)
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
```

### Functionality

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper API documentation.
- Proper error handling should be used.

## What We Care About

Use any libraries that you would normally use if this were a real production App. Please note: we're interested in your code & the way you solve the problem, not how well you can use a particular library or feature.

_We're interested in your method and how you approach the problem just as much as we're interested in the end result._

Here's what you should strive for:

- Good use of current Node.js & API design best practices.
- Solid testing approach.
- Extensible code.

If you have not been specifically asked, you may pick either `Implementation Path: Docker Containers` or `Implementation Path: Cloud-native` requirements below.

## Implementation Path: Docker Containers

### Basic Requirements

  - Use Node.js `LTS` and any framework of your choice.
  - Write concise and clear commit messages.
  - Write clear **documentation** on how it has been designed and how to run the code.

### Bonus

  - Provide proper unit tests.
  - Add a read only endpoint to fetch location information based off the user's address (use [NASA](https://api.nasa.gov/api.html) or [Mapbox](https://www.mapbox.com/api-documentation/) APIs)
  - Use Docker containers.
  - Utilize Docker Compose.
  - Setup a CircleCI config to build/test/deploy the service.
  - Leverage Terraform or other infrastructure management tooling to spin up needed resources.
  - Providing an online demo is welcomed, but not required.
## Q&A

> Where should I send back the result when I'm done?

Either put the project into a private repo or email it to me.

> What if I have a question?

Feel free to email me at joseph.griffin@roycetechnology.com
