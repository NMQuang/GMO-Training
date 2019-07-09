const productsSQL = {};

productsSQL.findAndPaginationProduct = `
    SELECT 
        product.name,
        product.price,
        product.status,
        brand.name as brand,
        brand.company
    FROM
        products product
    LEFT JOIN brands brand ON product.brandId = brand.id
    WHERE
        product.name LIKE :query
    LIMIT :offset, :limit`;

export default productsSQL;