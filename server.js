const { Console } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/ACTIONS');

const server = http.createServer(app);

const io = new Server(server);

const UserSocketMap = {};

function getAllConnectedClients(RoomId) {
    return Array.from(io.sockets.adapter.rooms.get(RoomId) || []).map((socketID) => {
        return {
            socketID,
            UserName: UserSocketMap[socketID]
        }
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);


    socket.on(ACTIONS.JOIN, ({ RoomId, UserName }) => {
        UserSocketMap[socket.id] = UserName;
        socket.join(RoomId);
        const clients = getAllConnectedClients(RoomId);
        // console.log(clients);
        clients.forEach(({ socketID }) => {
            io.to(socketID).emit(ACTIONS.JOINED, {
                clients,
                UserName: UserName,
                socketID: socket.id,
            });
        });
    });


    socket.on(ACTIONS.CODE_CHANGE, ({ RoomId, code, linenumber }) => {
        // console.log('receiving', code);
        // console.log('linenumber', linenumber);
        socket.in(RoomId).emit(ACTIONS.CODE_CHANGE, { code, linenumber });
    });


    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((RoomId) => {
            socket.in(RoomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                UserName: UserSocketMap[socket.id],
            });
        });
        delete UserSocketMap[socket.id];
        socket.leave();
    });

    // socket.on('disconnecting', () => {
    //     const rooms = [...socket.rooms];
    //     console.log(rooms);
    //     rooms.forEach((RoomId) => {
    //         socket.in(RoomId).emit(ACTIONS.DISCONNECTED, {
    //             socketID: socket.id,
    //             UserName: UserSocketMap[socket.id],
    //         });
    //     });
    //     console.log(UserName)
    //     delete UserSocketMap[socket.id];
    //     socket.leave();
    // })

});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('listening on port', PORT));