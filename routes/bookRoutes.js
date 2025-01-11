const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener todos los libros
router.get('/books', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Books');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Agregar un nuevo libro
router.post('/books', async (req, res) => {
    const { title, author, year, status } = req.body;
    try {
        await sql.query`INSERT INTO Books (Title, Author, Year, Status) VALUES (${title}, ${author}, ${year}, ${status})`;
        res.status(201).send('Book added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar un libro
router.put('/books/:id', async (req, res) => {
    const { title, author, year, status } = req.body;
    const { id } = req.params;
    try {
        await sql.query`UPDATE Books SET Title=${title}, Author=${author}, Year=${year}, Status=${status} WHERE Id=${id}`;
        res.send('Book updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Eliminar un libro
router.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Books WHERE Id=${id}`;
        res.send('Book deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for books in the library
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Id:
 *                     type: integer
 *                   Title:
 *                     type: string
 *                   Author:
 *                     type: string
 *                   Year:
 *                     type: integer
 *                   Status:
 *                     type: string
 */

