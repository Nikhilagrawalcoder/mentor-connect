# Mentor Connect

Mentor Connect is a platform designed to connect mentors with mentees, facilitating skill development and career growth.

## Features

- User Registration and Authentication
- Profile Management for Mentors and Mentees
- Mentor Search and Matching
- Scheduling and Communication Tools
- Feedback and Rating System

## API Endpoints

### User Routes

- **Get all mentors**
  ```http
  GET /user/mentors
  ```
  Response: List of all mentors

- **Get mentors by location**
  ```http
  GET /user/mentors/:location
  ```
  Parameter: `location` (string)  
  Response: List of mentors based on location

- **Get mentors by expertise**
  ```http
  GET /user/mentors/expertise/:value
  ```
  Parameter: `value` (string)  
  Response: List of mentors based on expertise

- **Register a new user**
  ```http
  POST /user/register
  ```
  Body: `{ name, email, password, role, expertise, location, meetLink }`  
  Response: Registration confirmation

### Booking Routes

- **Get all appointments for a user**
  ```http
  GET /booking/paticularUser
  ```
  Header: `Authorization: token`  
  Response: List of all appointments for the user

## Technical Details

### Backend

- **Node.js**: Handles server-side logic using Express.js
- **MongoDB**: Used for data storage with Mongoose for object modeling
- **JWT**: For authentication
- **Nodemailer**: For sending emails

### Frontend

- **HTML/CSS**: Basic structure and styling
- **JavaScript**: Client-side logic
- **Frameworks/Libraries**: None specified

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/Nikhilagrawalcoder/mentor-connect.git
   ```
2. Navigate to the project directory:
   ```sh
   cd mentor-connect
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

To run the project locally, use the following command:
```sh
npm start
```

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) before you start.

## License

This project is licensed under the MIT License.
