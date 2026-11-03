
import express from 'express';

const app = express();

app.use(express.json());

// Sample books
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        category: "Fiction"
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 450,
        category: "Self Help"
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 550,
        category: "Programming"
    }
];

// GET: Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET: Retrieve book by ID
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    res.status(200).json(book);
});

// POST: Add a new book
app.post('/books', (req, res) => {
    const { id, title, author, price, category } = req.body;

    if (
        id === undefined ||
        !title || !author ||
        price === undefined || price === null ||
        title.trim() === '' || author.trim() === ''
    ) {
        return res.status(400).json({
            message: 'All required book details must be provided'
        });
    }

    if (books.some(b => b.id === Number(id))) {
        return res.status(409).json({
            message: 'Book ID already exists'
        });
    }

    const newBook = {
        id: Number(id),
        title,
        author,
        price,
        category: category || "General"
    };

    books.push(newBook);

    res.status(201).json({
        message: 'Book added successfully',
        book: newBook
    });
});

// PUT: Update book details
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const { title, author, price, category } = req.body;

    if (
        (title !== undefined &&
         (typeof title !== 'string' || !title.trim())) ||
        (author !== undefined &&
         (typeof author !== 'string' || !author.trim())) ||
        (price !== undefined &&
         (typeof price !== 'number' || !Number.isFinite(price)))
    ) {
        return res.status(400).json({
            message: 'Invalid book details'
        });
    }

    Object.assign(book, {
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(price !== undefined && { price }),
        ...(category !== undefined && { category })
    });

    res.status(200).json({
        message: 'Book updated successfully',
        book
    });
});

// DELETE: Delete book
app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: 'Book deleted successfully',
        book: deletedBook[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
