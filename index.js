const express = require("express")
const session = require("express-session")

const connection = require("./database/database.js")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const userController = require("./users/UserController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

const log = console.log
const app = express()

connection
    .authenticate()
    .then(() => {
            log("DB Connection Success")
    })
        .catch((err) => {
             log(err)
        })


app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

app.use(session({
    secret: "dkDOKD057cc",
    cookie: {
        maxAge: 24*60*60*1000
    },
    resave: true,
    saveUninitialized: true
}))

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", userController)

app.get("/", (req, res) => {
    const result = {
        page: 1
    }
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render("index", {articles: articles, categories: categories, result: result})
        })
    })
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined)
            Category.findAll().then((categories) => {
                res.render("article", { article: article, categories: categories })
            })
        else
            res.redirect("/")
    }).catch((err) => {
        log(err)
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    const result = {
        page: 1
    }
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then((category) => {
        if (category != undefined) {
            Category.findAll().then((categories) => {
                res.render("index", {articles: category.articles, categories: categories, result: result})
            })
        } else {
            res.redirect("/")
        }
    }).catch((err) => {
        log(err)
        res.redirect("/")
    })
})

app.listen(8080, () => {
    log("Node Server started: 8080")
})