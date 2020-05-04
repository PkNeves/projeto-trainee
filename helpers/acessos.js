module.exports = {
    acessos: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next;
        }
        
        req.flash('você não tem acesso')
        console.log('voce não tem acesso')
        res.redirect('/')
    }
}