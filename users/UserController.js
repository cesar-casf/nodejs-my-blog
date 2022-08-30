const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")

const adminAuth = require("../middlewares/adminAuth")

const User = require("./User")

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/users/index.ejs", {users: users})
    })
})

router.get("/admin/users/new", adminAuth, (req, res) => {
    res.render("admin/users/create.ejs")
})


router.post("/user/create", adminAuth, (req, res) => {
    var name = req.body.name 
    var email = req.body.email
    var password = req.body.password

    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    User.create({
        name: name,
        email: email,
        password: hash
    }).then(() => {
        res.redirect("/admin/users/new")
    }).catch((err) => {
        if (err.name == 'SequelizeUniqueConstraintError') {
            res.send(`<script>alert("Esse e-mail já está cadastrado."); window.location.href = "/admin/users/new";</script>`);
        } else {
            res.send(`<script>alert("Houve um erro ao se cadastrar."); window.location.href = "/admin/users/new";</script>`);
        }
            
    })
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user != undefined) {
            var correct_pass = bcrypt.compareSync(password, user.password)
            if (correct_pass) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            } else {
                res.redirect("/login")
            }

        } else {
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router