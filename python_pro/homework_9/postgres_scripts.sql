INSERT INTO products
VALUES (?, ?, ?, ?);

SELECT *
FROM orders
WHERE order_date > (
    SELECT CURRENT_TIMESTAMP - INTERVAL '30 days'
);

UPDATE products
SET quantity = 180
WHERE id = 2;

DELETE FROM products
WHERE quantity = 0;

SELECT count(id)
FROM order_item
WHERE ord.order_date > (
    SELECT CURRENT_TIMESTAMP - INTERVAL '30 days'
)
GROUP BY ord.id;

SELECT sum(oi.quantity * p.price)
FROM order_items AS oi
LEFT JOIN products AS p ON p.id = oi.product_id
GROUP BY oi.ord.id;