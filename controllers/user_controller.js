const User = require('../models/user');
const bcrypt = require('bcrypt');

const user_functions = {
    registrarUsuario: async (req, res) => {
        let newUser = new User(null, req.body.nickname, req.body.email, req.body.password);
        let result = undefined;
        try{
            result = await newUser.insertUser();
        }catch(err){
            result = undefined;
        }
        if(result){
            if(result.rowCount==1)
                res.render("register", {
                    alert: true,
                    alertTitle: "Registration",
                    alertMessage: "Succesful registration!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 3500,
                    ruta: ''
                });
        }
        res.render("register", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Es probable que el correo y/o el nickname ya esten en uso",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'register-form'
        });
    },
    loginUser: async (req, res) => {
        let emailOrNickname = req.body.emailOrNickname;
        let password = req.body.password;
        let getUsers = new User();
        let flag = true;
        let users = await getUsers.selectByNickOrEmailUser(emailOrNickname);
        if(users.length==0 || !(await bcrypt.compare(password, users[0].password))){
            res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Nickname/correo y/o password incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login-form'
            });
        }else{
            req.session.loggedin = true;
            req.session.id = users[0].getId;
            req.session.name = users[0].getNickname;
            res.render("login", {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "¡Bienvenido!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 3000,
                ruta: ''
            });
        }
    }
};

module.exports = user_functions;