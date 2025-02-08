const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json()); // Fix JSON middleware

// Configure MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mohammad54321",
    database: "library"
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
});

// Add a new book
app.post("/books", (req, res) => {
    const { id, name, title } = req.body;
    const query = "INSERT INTO books (id, name, title) VALUES (?, ?, ?)";

    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding new book", details: err.message });
        }
        res.status(201).json({ message: "Book has been added" });
    });
});

// Get all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the books", details: err.message });
        }
        res.json(results);
    });
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";

    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the book", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(results[0]);
    });
});

// Update book by ID
app.put("/books/:id", (req, res) => {
    const { name, title } = req.body;
    const query = "UPDATE books SET name = ?, title = ? WHERE id = ?";

    connection.query(query, [name, title, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been updated" });
    });
});

// Delete book by ID
app.delete("/books/:id", (req, res) => {
    const query = "DELETE FROM books WHERE id = ?";

    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been deleted" });
    });
});

// Update translation by book ID
app.patch("/books/:id/translation", (req, res) => {
    const { language } = req.body; // Fixed typo

    if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "Invalid or missing language" });
    }

    const query = "UPDATE books SET title = CONCAT(title, ' - (', ?, ')') WHERE id = ?";

    connection.query(query, [language, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating translation", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book translation has been updated" });
    });
});



//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
                            //START THE TASK//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
app.get("/bookshop/:shop_id", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE shop_id = ?";

    connection.query(query, [req.params.shop_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "bookshop not found" })
        }
        res.json(results[0]);
    });
});


app.get("/bookshop/city/:city", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE city = ?";

    connection.query(query, [req.params.city], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No bookshops found in this city" });
        }
        res.json(results);
    });
});




app.get("/bookshop/name/:name", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE name = ?";

    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No bookshop found with this name" });
        }
        res.json(results);
    });
});




app.get("/bookshop/email/:email", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE email = ?";

    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No bookshop found with this email" });
        }
        res.json(results);
    });
});




app.patch("/bookshop/name", (req, res) => {
    const { oldName, newName } = req.body;

    if (!oldName || !newName) return res.status(400).json({ message: "Both oldName and newName are required" });

    connection.query("UPDATE bookshop SET name = ? WHERE name = ?", [newName, oldName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.affectedRows) return res.status(404).json({ message: "Bookshop not found" });
        res.json({ message: "Bookshop name updated successfully" });
    });
});




app.patch("/bookshop/email", (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) return res.status(400).json({ message: "Both oldEmail and newEmail are required" });

    connection.query("UPDATE bookshop SET email = ? WHERE email = ?", [newEmail, oldEmail], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.affectedRows) return res.status(404).json({ message: "Bookshop not found" });
        res.json({ message: "Bookshop email updated successfully" });
    });
});



app.post("/bookshop/oneshop", (req, res) => {
    const { name, email, city, contactNumber } = req.body;

    if (!name || !email || !city || !contactNumber) {
        return res.status(400).json({ message: "Name, email, city, and contactNumber are required" });
    }

    const query = "INSERT INTO bookshop (name, email, city, contactNumber) VALUES (?, ?, ?, ?)";

    connection.query(query, [name, email, city, contactNumber], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Bookshop added successfully", id: results.insertId });
    });
});





app.delete("/bookshop/oneshop", (req, res) => {
    const { shop_id, name } = req.body;

    if (!shop_id && !name) {
        return res.status(400).json({ message: "Either shop_id or name is required" });
    }

    const query = shop_id ? "DELETE FROM bookshop WHERE shop_id = ?" : "DELETE FROM bookshop WHERE name = ?";
    const value = shop_id || name;

    connection.query(query, [value], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.affectedRows) return res.status(404).json({ message: "Bookshop not found" });
        res.json({ message: "Bookshop deleted successfully" });
    });
});


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
                            //END THE TASK//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////






app.get("/", (req, res) => {
    res.send("Welcome to the Library API!");
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
});