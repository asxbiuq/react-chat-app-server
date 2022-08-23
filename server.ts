import { Server } from "socket.io"
import { handleError } from "./handleError"
import users from './User'

const io = new Server(8080)
console.log('Server...')


io.on("connect", (socket) => {
  console.log(`connect ${socket.id}`)

  socket.on('join', ({ name, room }) => {
    console.log(`${name} is in ${room}`)
    let user:User
    try {
       user = users.addUser({ id: socket.id, name, room })
       socket.join(user.room)
       socket.emit('message', { 
            user: '管理员', 
            text: `${user.name}, 欢迎来到 ${user.room}.`
        })

       socket.broadcast.to(user.room).emit('message', { 
        user: '管理员', 
        text: `${user.name} 加入房间!`
      })

       io
        .to(user.room)
        .emit('roomData', { 
            room: user.room, 
            users: users.getUsersInRoom(user.room) 
          })
    } catch (error:unknown) {
      handleError(error)
    }
  })

  socket.on('sendMessage', (message) => {
    const user = users.getUser(socket.id)

    if (user) {
       io
        .to(user.room)
        .emit('message', { 
            user: user.name,
            text: message 
        })
    }
  })

  socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`)
  })
})


// const users = [];

// const addUser = ({ id, name, room }) => {
//   name = name.trim().toLowerCase();
//   room = room.trim().toLowerCase();

//   const existingUser = users.find((user) => user.room === room && user.name === name);

//   if(!name || !room) return { error: 'Username and room are required.' };
//   if(existingUser) return { error: 'Username is taken.' };

//   const user = { id, name, room };

//   users.push(user);

//   return { user };
// }

// const removeUser = (id) => {
//   const index = users.findIndex((user) => user.id === id);

//   if(index !== -1) return users.splice(index, 1)[0];
// }

// const getUser = (id) => users.find((user) => user.id === id);

// const getUsersInRoom = (room) => users.filter((user) => user.room === room);