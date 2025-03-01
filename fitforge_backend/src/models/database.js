const dbconfig = require('../config/config');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbconfig.database, dbconfig.user, dbconfig.password, {
    host: dbconfig.host,
    dialect: dbconfig.dialect
});

sequelize.authenticate()
.then(() => console.log('Database connected successfully!'))
.catch(err => console.log(error));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/User')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
.then(() => console.log('Database synced successfully!'))
.catch((error) => console.error('error during connection', error));

module.exports = db;