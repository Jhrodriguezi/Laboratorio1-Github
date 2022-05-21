const User = require('../models/user');
const bcrypt = require('bcrypt');

const user_functions = {
    registrarUsuario: async (nickname, email, password) => {
        let newUser = new User(null, nickname, email, password);
        let result = await newUser.insertUser();
        if(result){
            if(result.rowCount==1)
            return true;
        }
        return false;
    },
    loginUser: async (email, password) => {
        let getUsers = new User();
        let users = await getUsers.selectAllUsers();
        users.forEach(u => {
            if(u.email==email && await bcrypt.compare(password, u.password)){
                return true;
            }
        })
        return false;
    }
};

module.exports = user_functions;