# YoChat - Full Stack Realtime Video Chat Application

## Project Overview

YoChat is a modern, full-stack realtime chat application with integrated video calling capabilities. Built using the MERN stack (MongoDB, Express.js, React, Node.js) with Socket.io for realtime communication, it provides a seamless messaging and video calling experience.

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind CSS
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Socket.io-client** - Realtime communication client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Realtime bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware (Google OAuth)
- **Cloudinary** - Cloud-based image storage
- **bcryptjs** - Password hashing

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Google OAuth integration
- Secure password hashing
- Protected routes and middleware

### Realtime Messaging
- Instant messaging with Socket.io
- Online user status indicators
- Message history persistence
- Group chat functionality
- Real-time typing indicators

### Video Calling
- WebRTC-based video calls
- Peer-to-peer communication
- Call management (initiate, accept, reject)
- Video/audio controls

### User Management
- User profiles with avatars
- Profile customization
- User search and friend management

### UI/UX
- Responsive design for all devices
- Dark/light theme support
- Modern, clean interface with DaisyUI
- Loading skeletons and error handling
- Toast notifications

## Project Structure

```
yochat/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── lib/            # Utility libraries (DB, Socket, Cloudinary)
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── seeds/          # Database seeders
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # Utility functions
│   │   └── constants/     # App constants
│   ├── package.json
│   └── .env
├── package.json           # Root package.json for build scripts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback

### Messages
- `GET /api/messages/:userId` - Get messages with a user
- `POST /api/messages/send/:userId` - Send message to user

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:groupId/messages` - Send message to group

## Socket Events

### Client to Server
- `join` - Join user's room
- `sendMessage` - Send message
- `startCall` - Initiate video call
- `acceptCall` - Accept incoming call
- `rejectCall` - Reject incoming call
- `endCall` - End ongoing call

### Server to Client
- `getOnlineUsers` - List of online users
- `newMessage` - New message received
- `incomingCall` - Incoming call notification
- `callAccepted` - Call accepted by peer
- `callRejected` - Call rejected by peer
- `callEnded` - Call ended

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://...
PORT=5001
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Build and Deployment

### Development
```bash
# Install dependencies
npm install

# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start the application
npm start
```

### Deployment
The application is configured for deployment on Render.com with:
- Automatic build process
- Static file serving for frontend
- Environment variable configuration
- MongoDB Atlas integration

## Recent Fixes

- Fixed `__dirname` path resolution in ES modules for correct static file serving in production
- Updated to use `fileURLToPath(import.meta.url)` for proper directory resolution

## Future Enhancements

- End-to-end encryption for messages
- File sharing capabilities
- Voice messages
- Screen sharing in video calls
- Push notifications
- Message reactions and replies
- User status (online, away, busy)
- Message search functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.