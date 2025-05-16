# Community Platform API

A RESTful API for managing communities, members, and roles. This platform allows users to create communities, manage members, and assign different roles within communities.

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Input Validation**: express-validator
- **ID Generation**: @theinternetfolks/snowflake
- **Development**: nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd community-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Authentication

#### Sign Up
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Sign In
- **POST** `/api/auth/signin`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

### Communities

#### Create Community
- **POST** `/api/community`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Community Name"
  }
  ```

#### Get All Communities
- **GET** `/api/community`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

#### Get Community Members
- **GET** `/api/community/:id/members`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

#### Get My Owned Communities
- **GET** `/api/community/me/owner`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

#### Get My Joined Communities
- **GET** `/api/community/me/member`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

### Members

#### Add Member
- **POST** `/api/member`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "community": "community_id",
    "user": "user_id",
    "role": "role_id"
  }
  ```

#### Remove Member
- **DELETE** `/api/member/:id`
- **Headers**: `Authorization: Bearer <token>`

### Roles

#### Get All Roles
- **GET** `/api/role`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

## Response Format

All API responses follow this format:

```json
{
  "status": true,
  "content": {
    "data": {},
    "meta": {
      "total": 0,
      "pages": 0,
      "page": 1
    }
  }
}
```

Error responses:
```json
{
  "status": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `NOT_AUTHORIZED`: Authentication required
- `NOT_ALLOWED_ACCESS`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

## Project Structure

```
community-platform/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── communityController.js
│   ├── memberController.js
│   └── roleController.js
├── middleware/
│   ├── auth.js
│   └── error.js
├── models/
│   ├── Community.js
│   ├── Member.js
│   ├── Role.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── communityRoutes.js
│   ├── memberRoutes.js
│   └── roleRoutes.js
├── utils/
│   ├── errorResponse.js
│   └── validators.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 