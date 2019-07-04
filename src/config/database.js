import Sequelize from 'sequelize';
import env from './env.js';

const sequelize = new Sequelize(
    env.database,
    env.username,
    env.password, {
        dialect: env.dialect,
        host: env.host,
        operatorsAliases: env.operatorsAliases,
        pool: env.pool
    }
);
const Op = Sequelize.Op;
export {
    sequelize,
    Op
}