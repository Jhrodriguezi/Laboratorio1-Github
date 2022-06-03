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
            res.render("register", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "El correo y/o el nickname ya estan en uso",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register-form'
            });
        }
        if(result){
            if(result.rowCount==1){
                req.session.loggedin = true;
                req.session.id = (await newUser.selectByNickOrEmailUser(req.body.nickname))[0].getId;
                req.session.name = req.body.nickname;
                res.render("register", {
                    alert: true,
                    alertTitle: "Registro exitoso",
                    alertMessage: "¡Disfruta de la pagina!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 3500,
                    ruta: 'home'
                });
            }
        }
        
    },
    loginUser: async (req, res) => {
        let emailOrNickname = req.body.emailOrNickname;
        let password = req.body.password;
        let getUsers = new User();
        let users = await getUsers.selectByNickOrEmailUser(emailOrNickname);
        if(users.length==0){
            res.render("login", {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Cuenta inexistente",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }else{
            if(!(await bcrypt.compare(password, users[0].password))){
                res.render("login", {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Nickname/correo y/o password incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
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
                    ruta: 'home'
                });
            }
        }
    },

    verificarLogin: (req, res)=>{
        if(req.session.loggedin){
            res.render("grid", {
                login: true,
                name: req.session.name
            });
        }else{
            res.render("grid", {
                login: false,
                name: "??",
                alert: true,
                alertTitle: "Login requerido",
                alertMessage: "Debe identificarse para acceder a la pagina",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } 
    }   
};

module.exports = user_functions;