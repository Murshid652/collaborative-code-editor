const { Console } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/ACTIONS');
const cors = require("cors");
const Axios = require("axios");


app.use(cors());
app.use(express.json());

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

    socket.on(ACTIONS.SYNC_CODE, ({ code, socketID }) => {
        console.log(code)
        console.log(socketID)
        io.to(socketID).emit(ACTIONS.CODE_CHANGE, { code, linenumber: 10000 })
    })


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


app.post("/compile", (req, res) => {
    //getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    // if (language === "python") {
    //     language="py"
    // }

    let data = ({
        "script": code,
        "language": language,
        "versionIndex": "1",
        "clientId": "dd9e65f02a57d858f1bac2c2ddf85433",
        "clientSecret": "20e51818f51c5bf3d0df6e1e29d2d493e2e1d2457defec6b9fd12df208a52316",
        "stdin": input
    });


    //     "code": code,
    //     "language": language,
    //     "input": input
    // "script": code,
    // "language": language,
    // "versionIndex": "1",
    // "clientId": 'dd9e65f02a57d858f1bac2c2ddf85433',
    // "clientSecret": '20e51818f51c5bf3d0df6e1e29d2d493e2e1d2457defec6b9fd12df208a52316'

    // });

    let config = {
        method: 'post',
        url: 'https://api.jdoodle.com/v1/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };


    // let program = {
    //     script: code,
    //     language: language,
    //     versionIndex: "1",
    //     clientId: "dd9e65f02a57d858f1bac2c2ddf85433",
    //     clientSecret: "20e51818f51c5bf3d0df6e1e29d2d493e2e1d2457defec6b9fd12df208a52316"
    // };
    // request({
    //         url: 'https://api.jdoodle.com/v1/execute',
    //         method: "POST",
    //         json: program
    //     },
    //     function(error, response, body) {
    //         console.log('error:', error);
    //         console.log('statusCode:', response && response.statusCode);
    //         console.log('body:', body);
    //     })


    //calling the code compilation API
    Axios(config)
        .then((response) => {
            res.send(response.data)
            console.log("data", response.data)
        }).catch((error) => {
            res.send("network error\n");
            console.log("error", error);
        });
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('listening on port', PORT));