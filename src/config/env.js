const env = {
    database: 'db_shopping',
    username: 'root',
    password: 'minhquang96',
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        require: 300000,
        idle: 10000
    }
};

export default env;