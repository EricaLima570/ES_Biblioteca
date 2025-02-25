import pool from "../config/db.js";

// Obter todos os livros
export const getAllBooksService = async () => {
    const result = await pool.query("SELECT * FROM books");
    return result.rows;
};

// Obter um livro por ID
export const getBookByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    return result.rows[0];
};

// Criar um livro com a URL da imagem
export const createBookService = async (title, author, quantity, genre, description, publishedYear, image) => {
    const result = await pool.query(
        "INSERT INTO books (title, author, quantity, genre, description, published_year, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [title, author, quantity, genre, description, publishedYear, image]
    );
    return result.rows[0];
};

// Atualizar um livro (mantendo a URL da imagem)
export const updateBookService = async (id, title, author, quantity, genre, description, publishedYear, imageUrl) => {
    const result = await pool.query(
        "UPDATE books SET title=$1, author=$2, quantity=$3, genre=$4, description=$5, published_year=$6, image_url=$7 WHERE id=$8 RETURNING *",
        [title, author, quantity, genre, description, publishedYear, imageUrl, id] // Apenas URL da imagem
    );
    return result.rows[0];
};

// Excluir um livro
export const deleteBookService = async (id) => {
    const result = await pool.query(
        "DELETE FROM books WHERE id =$1 RETURNING *",
        [id]
    );
    return result.rows[0];
};
