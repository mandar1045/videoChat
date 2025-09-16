import { Server } from "socket.io";
import User from "../models/user.model.js";

// used to store online users
const userSocketMap = {}; // {userId: [socketId1, socketId2, ...]}
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("👤 User ID from handshake:", userId);

    if (userId) {
      if (!userSocketMap[userId]) {
        userSocketMap[userId] = [];
      }
      userSocketMap[userId].push(socket.id);
      console.log("📊 Updated userSocketMap for", userId, ":", userSocketMap[userId]);

      // Update last seen
      User.findByIdAndUpdate(userId, { lastSeen: new Date() }).catch(err => console.error("Error updating last seen:", err));
    } else {
      console.warn("⚠️ No userId in socket handshake query");
    }

    console.log("👥 Online users:", Object.keys(userSocketMap));
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Call signaling events
    socket.on("call-user", async (data) => {
      console.log('📞 BACKEND: ===== RECEIVED CALL-USER EVENT =====');
      console.log('📞 BACKEND: From user:', userId);
      console.log('📞 BACKEND: To user:', data.to);
      console.log('📞 BACKEND: Call type:', data.type);
      console.log('📞 BACKEND: Offer present:', !!data.offer);

      const { to, offer, type } = data;
      const receiverSocketIds = getReceiverSocketId(to);
      console.log('📞 BACKEND: Receiver socket IDs for', to, ':', receiverSocketIds);
      console.log('📞 BACKEND: Number of receiver sockets:', receiverSocketIds.length);

      if (receiverSocketIds.length > 0) {
        try {
          // Fetch caller user data
          const caller = await User.findById(userId).select('fullName profilePic');
          console.log('📞 BACKEND: Caller data fetched:', caller);
          if (caller) {
            receiverSocketIds.forEach(socketId => {
              console.log('📞 BACKEND: Emitting incoming-call to socket', socketId);
              io.to(socketId).emit("incoming-call", {
                from: {
                  _id: userId,
                  fullName: caller.fullName,
                  profilePic: caller.profilePic,
                },
                offer,
                type,
              });
            });
          } else {
            console.error('📞 BACKEND: Caller not found in database');
          }
        } catch (error) {
          console.error('📞 BACKEND: Error fetching caller data:', error);
        }
      } else {
        console.warn('📞 BACKEND: No receiver sockets found for user', to);
        console.log('📞 BACKEND: Current userSocketMap:', userSocketMap);
      }
    });

    socket.on("answer-call", (data) => {
      console.log('📞 BACKEND: ===== RECEIVED ANSWER-CALL EVENT =====');
      console.log('📞 BACKEND: From user:', userId);
      console.log('📞 BACKEND: To user:', data.to);
      console.log('📞 BACKEND: Answer present:', !!data.answer);

      const { to, answer } = data;
      const receiverSocketIds = getReceiverSocketId(to);
      console.log('📞 BACKEND: Receiver socket IDs for answer-call:', receiverSocketIds);

      if (receiverSocketIds.length > 0) {
        receiverSocketIds.forEach(socketId => {
          console.log('📞 BACKEND: Emitting call-accepted to socket', socketId);
          io.to(socketId).emit("call-accepted", { answer });
          console.log('✅ BACKEND: Call-accepted emitted successfully to', socketId);
        });
      } else {
        console.warn('⚠️ BACKEND: No receiver sockets found for answer-call to', to);
        console.log('📊 BACKEND: Current userSocketMap:', userSocketMap);
      }
    });

    socket.on("reject-call", (data) => {
      console.log('📞 BACKEND: ===== RECEIVED REJECT-CALL EVENT =====');
      const { to } = data;
      const receiverSocketIds = getReceiverSocketId(to);
      if (receiverSocketIds.length > 0) {
        receiverSocketIds.forEach(socketId => {
          io.to(socketId).emit("call-rejected");
        });
      }
    });

    socket.on("ice-candidate", (data) => {
      console.log('🧊 BACKEND: ===== RECEIVED ICE-CANDIDATE EVENT =====');
      console.log('🧊 BACKEND: From user:', userId);
      console.log('🧊 BACKEND: To user:', data.to);
      console.log('🧊 BACKEND: Candidate type:', data.candidate?.type);

      const { to, candidate } = data;
      const receiverSocketIds = getReceiverSocketId(to);
      if (receiverSocketIds.length > 0) {
        receiverSocketIds.forEach(socketId => {
          io.to(socketId).emit("ice-candidate", { candidate });
        });
      }
    });

    socket.on("end-call", (data) => {
      console.log('🔚 BACKEND: ===== RECEIVED END-CALL EVENT =====');
      const { to } = data;
      const receiverSocketIds = getReceiverSocketId(to);
      if (receiverSocketIds.length > 0) {
        receiverSocketIds.forEach(socketId => {
          io.to(socketId).emit("call-ended");
        });
      }
    });

    // Test event for debugging
    socket.on("test-event", (data) => {
      console.log('🧪 BACKEND: Received test event from', userId, ':', data);
      socket.emit('test-response', {
        message: 'Hello from backend',
        received: data,
        timestamp: Date.now(),
        userId: userId
      });
    });

    socket.on("disconnect", async () => {
      console.log("A user disconnected", socket.id);
      if (userId && userSocketMap[userId]) {
        userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
          // Update last seen when user goes completely offline
          try {
            const updatedUser = await User.findByIdAndUpdate(userId, { lastSeen: new Date() }, { new: true });
            // Emit to all clients to update this user's last seen
            io.emit("userLastSeenUpdate", { userId, lastSeen: updatedUser.lastSeen });
          } catch (err) {
            console.error("Error updating last seen on disconnect:", err);
          }
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || [];
}

export { io };
