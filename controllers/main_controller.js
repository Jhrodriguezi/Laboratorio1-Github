const main_functions = {
    cerrarSesion: (req, res) =>{
        req.session.destroy(() => {
            res.redirect('/login-form');
        })
    },
    cargarFormularioRegistro: (req, res)=>{
        res.render("register");
    },
    cargarFormularioLogin: (req, res)=>{
        res.render("login");
    },
}

module.exports = main_functions;