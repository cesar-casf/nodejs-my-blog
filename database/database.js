const Sequelize = require("sequelize")
const sequelize = require("sequelize")

const DATABASE_NAME = 'blog'
const DB_USER = 'postgres'
const DB_PASSWORD = 'postgres'
const DB_HOST = 'localhost'

const connection = new Sequelize(DATABASE_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres",
    timezone: "-03:00"
})

module.exports = connection

