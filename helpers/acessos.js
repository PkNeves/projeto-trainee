module.exports = {
    acessos: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        req.flash("error_msg", 'você não tem acesso')
        res.redirect('/usuario/form')
    }
}