import DataTypes from 'sequelize';
import {
    sequelize
} from '../config/database';
import sequelizePaginate  from 'sequelize-paginate';

const Product = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

}, {
    timestamps: false,
});

sequelizePaginate.paginate(Product);

export default Product;