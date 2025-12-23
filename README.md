# 🎥 YoChat - Realtime Video Chat App

![YoChat Logo](frontend/public/yochat-logo.svg)

A modern, feature-rich realtime chat application with integrated video calling capabilities. Built with the MERN stack and Socket.io for seamless communication.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://yochat-2nay.onrender.com)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## ✨ Features

### 💬 Realtime Messaging
- **Instant Messaging**: Send and receive messages in real-time
- **Group Chats**: Create and manage group conversations
- **Online Status**: See who's online and available to chat
- **Message History**: Persistent message storage with MongoDB
- **Typing Indicators**: Know when someone is typing

### 📹 Video Calling
- **HD Video Calls**: Crystal-clear video communication
- **Audio Controls**: Mute/unmute microphone and camera
- **Call Management**: Initiate, accept, reject, or end calls
- **Peer-to-Peer**: Direct connection for better performance

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: Sign in with Google account
- **Password Encryption**: bcrypt hashing for security
- **Protected Routes**: Secure API endpoints

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Themes**: Toggle between themes
- **Beautiful Components**: DaisyUI component library
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Comprehensive error management

### 👤 User Management
- **Profile Management**: Customize your profile with avatars
- **User Search**: Find and connect with other users
- **Avatar Upload**: Cloudinary integration for image storage

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **Zustand** - Simple state management
- **Socket.io-client** - Realtime communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Robust web framework
- **MongoDB** - NoSQL database
- **Socket.io** - Bidirectional communication
- **JWT** - Secure authentication
- **Cloudinary** - Media storage

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mandar1045/videoChat.git
   cd yochat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both `backend/` and `frontend/` directories:

   **backend/.env**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=development
   ```

   **frontend/.env**
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
yochat/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── lib/            # Database, Socket, Cloudinary utils
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   └── seeds/          # Database seeders
│   └── package.json
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── store/         # Zustand state stores
│   │   ├── lib/           # Utility functions
│   │   └── constants/     # App constants
│   └── package.json
└── package.json          # Root build scripts
```

## 🔧 Build for Production

```bash
# Build the entire application
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/messages/:userId` | Get chat messages |
| POST | `/api/messages/send/:userId` | Send message |
| GET | `/api/groups` | Get user groups |
| POST | `/api/groups` | Create group |

## 📡 Socket Events

### Client → Server
- `sendMessage` - Send a message
- `startCall` - Initiate video call
- `acceptCall` - Accept incoming call
- `endCall` - End current call

### Server → Client
- `newMessage` - Receive new message
- `incomingCall` - Incoming call notification
- `callAccepted` - Call accepted
- `getOnlineUsers` - Online users list

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.io](https://socket.io/) for realtime communication
- [DaisyUI](https://daisyui.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

If you have any questions or need help, feel free to open an issue or contact the maintainers.

---

**Made with ❤️ by [mandar1045](https://github.com/mandar1045)**
