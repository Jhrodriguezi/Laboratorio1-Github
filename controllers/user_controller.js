const { User, functions_user } = require('../models/user');
const { Log, functions_log } = require('../models/log');
const bcrypt = require('bcrypt');

const user_functions_controller = {
  registrarUsuario: async (req, res) => {
    let newUser = new User(null, req.body.nickname, req.body.email, req.body.password);
    let result;
    try {
      result = await functions_user.insertUser(newUser);
    } catch (err) {
      console.log(err);
      result = undefined;
      res.render("intermedio", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "El correo y/o el nickname ya estan en uso",
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'register-form'
      });
    }
    if (result && result.rowCount == 1) {
      let user;
      try {
        user = (await functions_user.selectByNickOrEmailUser(req.body.nickname))[0];
        let log = new Log(null, user.getNickname, null, 'Insert user', null, 'Se ha registrado un usuario en la pagina web');
        await functions_log.insertLog(log);
      } catch (e) {
        console.log(e);
      }
      req.session.loggedin = true;
      req.session.idusuario = user.getId;
      req.session.name = user.getNickname;
      req.session.role = user.getTipousuario;
      res.render("intermedio", {
        alert: true,
        alertTitle: "Registro exitoso",
        alertMessage: "¡Disfruta de la pagina!",
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 3500,
        ruta: 'home'
      });
    }
  },
  loginUser: async (req, res) => {
    let email_or_nickname = req.body.emailOrNickname;
    let password = req.body.password;
    let users;
    try {
      users = await functions_user.selectByNickOrEmailUser(email_or_nickname);
    } catch (e) {
      console.log("user_controller/loginUser - " + e)
    }
    if (users.length == 0) {
      res.render("intermedio", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Cuenta inexistente",
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: ''
      });
    } else {
      if (!(await bcrypt.compare(password, users[0].password))) {
        res.render("intermedio", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Contraseña incorrecta",
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: ''
        });
      } else {
        req.session.loggedin = true;
        req.session.idusuario = users[0].getId;
        req.session.name = users[0].getNickname;
        req.session.role = users[0].getTipousuario;

        try{
          let log = new Log(null, users[0].getNickname, null, 'Read user', null, 'Ha ingresado un usuario a la pagina web');
          await functions_log.insertLog(log);
        }catch(err){
          console.log('controllers/user_controller/loginUser - '+err);
        }
        let home_page=""
        switch (users[0].getTipousuario) {
          case "user":
            home_page="home";
            break;
          
          case "analyst":
            home_page=""
            break;
          
          case "admin":
            home_page="admin"
            break;

          default:
            break;
        }
        res.render("intermedio", {
          alert: true,
          alertTitle: "Conexión exitosa",
          alertMessage: "¡Bienvenido!",
          alertIcon: 'success',
          showConfirmButton: false,
          timer: 3000,
          ruta: home_page
        });
      }
    }
  },
};

module.exports = user_functions_controller;
