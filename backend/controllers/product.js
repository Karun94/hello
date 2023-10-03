import { db } from "../connect.js";


export const postProduct =  (req, res) => {
  const { s_no, name, quantity, price, entered_date, enteredBy_id } = req.body;

  const sql = 'INSERT INTO products ( s_no,name, quantity, price, entered_date, enteredBy_id) VALUES ( ?,?, ?, ?, ?, ?)';

  db.query(sql, [s_no,name, quantity, price, entered_date, enteredBy_id], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
};

export const updateProducts = (req, res) => {
  const productId = req.params.id;
  const { quantity, price ,editedBy_id,modified_date} = req.body;

  const sql = 'UPDATE products SET quantity = ?, price = ? , editedBy_id = ? ,modified_date = ? WHERE id = ?';

  db.query(sql, [quantity, price, editedBy_id,modified_date,productId], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Error updating product' });
    } else {
      console.log('Product updated successfully');
      res.status(200).json({ message: 'Product updated successfully' });
    }
  });
};


// Assuming you already have a MySQL database connection established as 'db'

export const getProducts = (req, res) => {
  // Retrieve the date parameter from the request URL
  const date = req.query.date;

  // Construct an SQL query to select products by date and include user details for the entered and edited users (if editedBy_id is not null)
  const sql = `
    SELECT products.*, 
           entered_users.name AS enteredBy, 
           CASE 
             WHEN products.editedBy_id IS NOT NULL THEN edited_users.name
             ELSE NULL
           END AS editedBy
    FROM products
    LEFT JOIN users AS entered_users ON products.enteredBy_id = entered_users.id
    LEFT JOIN users AS edited_users ON products.editedBy_id = edited_users.id
    WHERE products.entered_date = ?
  `;

  // Execute the SQL query with the provided date parameter
  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error('Error fetching products by date:', err);
      res.status(500).json({ error: 'Error fetching products by date' });
    } else {
      console.log('Products fetched successfully');
      res.status(200).json(results); // Send the products with entered and edited user details as JSON response
    }
  });
};




