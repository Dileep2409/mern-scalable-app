# MERN Stack Scalable Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application with user authentication, task management, and a responsive UI built with Tailwind CSS.

## Features

- **User Authentication**
  - User registration and login with JWT
  - Protected routes
  - Password hashing with bcrypt

- **Task Management**
  - Create, read, update, and delete tasks
  - Filter and sort tasks
  - Search functionality
  - Task status tracking

- **User Profile**
  - Update profile information
  - Change password
  - View user details

- **Responsive Design**
  - Mobile-first approach
  - Clean and modern UI with Tailwind CSS
  - Dark mode support (coming soon)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-scalable-app.git
cd mern-scalable-app
```

### 2. Set Up the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Set Up the Frontend

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```
mern-scalable-app/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── contexts/       # React contexts
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── App.tsx         # Main App component
│       └── index.tsx       # Entry point
│
└── server/                 # Backend Node.js/Express application
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── utils/             # Utility functions
    ├── server.js          # Express server
    └── package.json       # Backend dependencies
```

## Available Scripts

### Client

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Server

- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the production server
- `npm test` - Run tests

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get a single task (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)
- `GET /api/tasks/search/:query` - Search tasks (protected)

### Profile

- `GET /api/profile/me` - Get current user's profile (protected)
- `PUT /api/profile` - Update profile (protected)
- `PUT /api/profile/password` - Update password (protected)

## Deployment

### Backend Deployment

1. **Heroku**
   - Install the Heroku CLI
   - Login to your Heroku account: `heroku login`
   - Create a new Heroku app: `heroku create your-app-name`
   - Add MongoDB Atlas connection string to Heroku config vars
   - Deploy: `git push heroku main`

2. **Vercel**
   - Install Vercel CLI: `npm install -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`

### Frontend Deployment

1. **Vercel**
   - Install Vercel CLI: `npm install -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`

2. **Netlify**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login: `netlify login`
   - Build the app: `npm run build`
   - Deploy: `netlify deploy --prod`

## Environment Variables

### Server

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number | 5000 |
| MONGODB_URI | MongoDB connection string | |
| JWT_SECRET | Secret key for JWT | |
| NODE_ENV | Environment | development |

### Client

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000 |

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
