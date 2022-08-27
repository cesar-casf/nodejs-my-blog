const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")
const { ARRAY } = require("sequelize")

const Article = connection.define("article", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Article.belongsTo(Category)
Category.hasMany(Article)

module.exports = Article