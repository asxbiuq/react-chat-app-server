class Users {
  users: User[] = []

  getUser(id:string){
    return this.users.find((user) => user.id === id)
  }

  getUsersInRoom(room:string){
    this.users.filter((user) => user.room === room)
  }

  addUser({ id, name, room }:GetUser){
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()
  
    if(!name || !room) {
      throw new Error('用户名和房间是必需的。')
    }

    const existingUser = this.users.find((user) => user.room === room && user.name === name)
  
    if(existingUser) {
      throw new Error('用户名已存在。')
    }
  
    const user = { id, name, room }
  
    this.users.push(user)
    console.log(`add ${user.name} success`)
    return  user 
  }

  removeUser(id:string){
    const index = this.users.findIndex((user) => user.id === id)

    if(index !== -1) {
      return this.users.splice(index, 1)[0]
    }
  }
}

const users = new Users()

export default users