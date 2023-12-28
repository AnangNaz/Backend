import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";


const users = db.define('users', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refreshToken: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true
});

export default users