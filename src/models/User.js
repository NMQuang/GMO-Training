import DataTypes from 'sequelize';
import {
    sequelize
} from '../config/database';

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
    }

}, {
    timestamps: false,
});

export {
    User
} ;