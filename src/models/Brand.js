import DataTypes from 'sequelize';
import {
    sequelize
} from '../config/database';
import Product from './Product';

const Brand = sequelize.define('brands', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
    },
    rate: {
        type: DataTypes.INTEGER,
    }
}, {
    timestamps: false,
});

Brand.hasMany(Product, {
    foreignKey: 'brandId',
    sourceKey: 'id'
});
Product.belongsTo(Brand, {
    foreignKey: 'brandId',
    targetKey: 'id'
});

export default Brand;