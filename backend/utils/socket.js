import { Server } from 'socket.io';

let io;
const userSocketMap = new Map(); // userId -> socketId
const onlineDoctors = new Set(); // Set of doctorIds

export const initSocket = (server, allowedOrigins) => {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                const isAllowed = allowedOrigins.some(allowed => 
                    origin === allowed || 
                    (typeof origin === 'string' && origin.endsWith('.onrender.com'))
                );
                if (isAllowed) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join', (userId) => {
            if (userId) {
                socket.join(userId);
                userSocketMap.set(userId, socket.id);
                console.log(`User ${userId} joined room`);
                
                // Send current online doctors to the newly joined user
                socket.emit('online_doctors_list', Array.from(onlineDoctors));
            }
        });

        socket.on('join_admin', () => {
            socket.join('admin_room');
            console.log(`Admin joined admin_room`);
        });

        socket.on('doctor_online', (docId) => {
            if (docId) {
                onlineDoctors.add(docId);
                io.emit('doctor_status_update', { docId, status: 'online' });
                console.log(`Doctor ${docId} is online`);
            }
        });

        socket.on('disconnect', () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSocketMap.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId && onlineDoctors.has(disconnectedUserId)) {
                onlineDoctors.delete(disconnectedUserId);
                io.emit('doctor_status_update', { docId: disconnectedUserId, status: 'offline' });
                console.log(`Doctor ${disconnectedUserId} is offline`);
            }
            
            console.log('User disconnected:', socket.id);
        });
        
        // Chat events (keeping existing functionality)
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
        });

        socket.on('send_message', (data) => {
            socket.to(data.roomId).emit('receive_message', data);
        });

        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('user_typing', data);
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.roomId).emit('user_stop_typing', data);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const emitToUser = (userIdOrRoom, event, data) => {
    if (io) {
        io.to(userIdOrRoom).emit(event, data);
    }
};

export const isDoctorOnline = (docId) => {
    return onlineDoctors.has(docId);
};
