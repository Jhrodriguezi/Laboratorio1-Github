const main_functions = {
    cerrarSesion: (req, res) =>{
        req.session.destroy(() => {
            res.redirect('/');
        })
    },
    cargarFormularioRegistro: (req, res)=>{
      if(req.session.loggedin){
            res.redirect('/home');
      }else{
        res.render("register");
      }
    },
    cargarFormularioLogin: (req, res)=>{
        if(req.session.loggedin){
            res.redirect('/home');
        }else{
          res.render("login");
        }
    },
}

module.exports = main_functions;