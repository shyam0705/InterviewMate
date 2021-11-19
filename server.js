const express=require('express');
const nodemailer=require('nodemailer');
const app=express();
const server=require('http').createServer(app);
const PORT=process.env.PORT || 5000;
const cors=require('cors');
const {v4:uuidv4}=require('uuid');
const bodyParser=require('body-parser');
const axios=require('axios');
const twilio=require('twilio');
var jsonParser = bodyParser.json();
const path = require("path")
app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")))
require("dotenv").config();

//request to check if room exists
app.post("/checkRoomAvailable",jsonParser,(req,res)=>{
    const id=req.body.id;
    const room=rooms.filter((r)=>r.id===id)[0];
    if(room)
    {
        if(room.connectedUsers.length<=3)
        {
            res.statusCode=200;
            res.send({err:null});
        }
        else{
            res.statusCode=200;
            res.send({err:"Room Is Full"});
        }
    }
    else{

        res.statusCode=200;
        res.send({err:"Room Do Not Exist"});
    }

})
//to send email

const transporter = nodemailer.createTransport({
    port: process.env.port,          // true for 465, false for other ports
    host: process.env.host,
       auth: {
            user: process.env.user,
            pass: process.env.pass,
        },
        tls: {
            rejectUnauthorized: false
        },    
    secure: false,
});

//for sending email
app.post("/sendEmail",jsonParser,(req,res)=>{

    const mailData = {
        from: process.env.user,  // sender address
          to: req.body.to,   // list of receivers
          subject: 'Inteview',
          text: `your interview is shedule with ${req.body.from} to join use id:-${req.body.id } on site:-http://localhost/3000`
    };
    transporter.sendMail(mailData, (err, info)=>{
        if(err)
        {
            // console.log(err);
            res.statusCode=500;
            res.send(err);
        }
        else
        {
            // console.log(info);
            res.statusCode=200;
            res.send(info);
        }
     });
});


//for running code
app.post("/runCode",jsonParser,(req,res)=>{

    var data = {
        "code":req.body.code,
        "language":req.body.language,
        "input":req.body.input
    };
    var config = {
        method: 'post',
        url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
    };
    axios(config)
        .then((response)=>{
            res.statusCode=200;
            res.send(response.data);
            //console.log(response.data);
        })
        .catch((error)=>{
            res.statusCode=500;
            res.send(error);
            //console.log(error);
        }); 
})

//for getting turn credential

app.get("/get-turn-credentials",async (req,res)=>{
    
    let responseToken=null;
    try {
        const client=twilio(process.env.accountSid,process.env.accountToken);
        responseToken=await client.tokens.create();
        res.send({token:responseToken,err:null});
    } catch (error) {
        // console.log("error");
        res.statusCode=500;
        res.send({token:null,err:error});
    }
})
let connectedUsers=[];
let rooms=[];
const io=require('socket.io')(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})

io.on('connection',(socket)=>{
    // console.log("user connected");
    socket.on('create-new-room',(data)=>{
        createNewRoomHandler(data,socket);
    });
    socket.on('join-room',(data)=>{
        joinRoomHandler(data,socket);
    })

    socket.on('disconnect',()=>{
        handleLeave(socket);
    })

    socket.on("conn-signal", (data) => {
        signalingHandler(data, socket);
    });
    
    socket.on("conn-init", (data) => {
        initializeConnectionHandler(data, socket);
    });
    //for sending direct message
    socket.on("direct-message",(data)=>{
        directMessgeHandler(data,socket);
    })

    socket.on('code-change',(data)=>{
        codeChangeHandler(data,socket);
    });

    socket.on("mode-changed",(data)=>{
        modeChangeHandler(data,socket);
    })

    socket.on("output-changed",(data)=>{
        outputChangeHandler(data,socket);
    })

    socket.on("drawing",(data)=>{
        drawingChangeHandler(data,socket);
    })
});

//socket io hadlers
const signalingHandler = (data, socket) => {
    const { connUserSocketId, signal } = data;
  
    const signalingData = { signal, connUserSocketId: socket.id };
    io.to(connUserSocketId).emit("conn-signal", signalingData);
};
  
// information from clients which are already in room that They have preapred for incoming connection
const initializeConnectionHandler = (data, socket) => {
    const { connUserSocketId } = data;
  
    const initData = { connUserSocketId: socket.id };
    io.to(connUserSocketId).emit("conn-init", initData);
};
const handleLeave=(socket)=>{
    const user=connectedUsers.find((user)=>user.socketId===socket.id);
    if(user)
    {
        const roomId=user.roomId;
        const room=rooms.find((room)=>room.id===roomId);
        room.connectedUsers=room.connectedUsers.filter((usr)=>usr.socketId!==socket.id);
        socket.leave(roomId);
        if(room.connectedUsers.length>0)
        {
            //emit to all user that user disconnected with it's socket id
            io.to(roomId).emit('user-disconnected',{socketId: socket.id});
            io.to(roomId).emit('room-update',{connectedUsers:room.connectedUsers});
        }
        else{
            rooms=rooms.filter((room)=>room.id!=roomId);
        }
    }
}


const createNewRoomHandler=(data,socket)=>{
    const identity=data.identity;
    const roomId=uuidv4();

    //create_new_user
    const newUser={
        identity,
        id:uuidv4(),
        socketId:socket.id,
        roomId:roomId,
        onlyAudio:data.onlyAudio
    }
    //push user to connected user
    connectedUsers=[...connectedUsers,newUser];

    //create new room
    const newRoom={
        id:roomId,
        connectedUsers:[newUser]
    }

    //joining room in socket.io
    socket.join(roomId);
    //pushing room
    rooms=[...rooms,newRoom];

    //emmit roomId
    socket.emit('roomId',{roomId});

    //emiting connected users
    socket.emit("room-update",{connectedUsers:newRoom.connectedUsers});

}

const joinRoomHandler=(data,socket)=>{
    const {identity,roomId}=data;
    const room=rooms.find((room)=>room.id==roomId);
    if(room)
    {
        const newUser={
            identity,
            id:uuidv4(),
            socketId:socket.id,
            roomId:roomId,
            onlyAudio:data.onlyAudio
        }
        room.connectedUsers=[...room.connectedUsers,newUser];
        socket.join(roomId);
        connectedUsers=[...connectedUsers,newUser];

        //task-1 of webrtc telling all other users to prepare for connection
        room.connectedUsers.forEach((user) => {
            if (user.socketId !== socket.id) {
              const data = {
                connUserSocketId: socket.id,
              };
              io.to(user.socketId).emit("conn-prepare", data);
            }
        });
        io.to(roomId).emit("room-update",{connectedUsers:room.connectedUsers});
    }
}

const directMessgeHandler=(data,socket)=>{

    // if(connectedUsers.find((user)=>user.socketId===data.socketId))
    // {
        
        const receiverData={
            authorSocketId:socket.id,
            messageContent:data.message,
            isAuthor:false,
            identity:data.identity
        }
        socket.to(data.receiverSocketId).emit('direct-message',receiverData);
        const senderData={
            receiverSocketId:data.receiverSocketId,
            isAuthor:true,
            messageContent:data.message,
            identity:data.identity
        }
        socket.emit("direct-message",senderData);
    // }
}

//editor handlers
const codeChangeHandler=(data,socket)=>{
    const user=connectedUsers.find((user)=>user.socketId===socket.id);
    if(user)
    {
        const roomId=user.roomId;
        const room=rooms.find((room)=>room.id===roomId);
        room.connectedUsers.forEach((user) => {
            if (user.socketId !== socket.id) {
              io.to(user.socketId).emit("code-change", data);
            }
        });
    }    
}

const modeChangeHandler=(data,socket)=>{
    // console.log("in mode change handler");
    const user=connectedUsers.find((user)=>user.socketId===socket.id);
    if(user)
    {
        const roomId=user.roomId;
        const room=rooms.find((room)=>room.id===roomId);
        room.connectedUsers.forEach((user) => {
            if (user.socketId !== socket.id) {
              io.to(user.socketId).emit("mode-changed",data);
            }
        });
    }  
}

const outputChangeHandler=(data,socket)=>{
    const user=connectedUsers.find((user)=>user.socketId===socket.id);
    if(user)
    {
        const roomId=user.roomId;
        const room=rooms.find((room)=>room.id===roomId);
        room.connectedUsers.forEach((user) => {
            if (user.socketId !== socket.id) {
              io.to(user.socketId).emit("output-changed",data);
            }
        });
    } 
}

//drawing handler
const drawingChangeHandler=(data,socket)=>{
    const user=connectedUsers.find((user)=>user.socketId===socket.id);
    if(user)
    {
        const roomId=user.roomId;
        const room=rooms.find((room)=>room.id===roomId);
        room.connectedUsers.forEach((user) => {
            if (user.socketId !== socket.id) {
              io.to(user.socketId).emit("drawing",data);
            }
        });
    } 
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(PORT,()=>{
    console.log("app is app and running");
});
