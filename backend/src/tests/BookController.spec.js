import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from '../controllers/bookController.js';
import { createBookService } from '../models/bookModel.js';
import { validateBook } from '../middlewares/inputValidator.js';
import * as bookService from "../models/bookModel.js";

jest.mock('../models/bookModel.js');

describe('Create Book', () => {
  it('Deve retornar status 201 ao criar um livro com sucesso', async () => {
    const req = {
      body: {
        title: 'Livro Teste',
        author: 'Autor Teste',
        price: 130.99,
        quantity: 3,
        genre: 'Ficção',
        description: 'Descrição Teste',
        published_year: 2022,
        image_url: 'http://example.com/livro.jpg'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    validateBook(req, res, next);

    createBookService.mockResolvedValue(req.body);

    await createBook(req, res, next);

    expect(next).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);

    //console.log('res' + res.status)

    expect(res.json).toHaveBeenCalledWith({
      status: 201,
      message: 'Livro criado com sucesso',
      data: req.body
    });
  });

  it('Deve chamar next com erro em caso de falha', async () => {
    const req = { body: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);

    createBookService.mockRejectedValue(new Error('Falha ao criar o livro'));

    await createBook(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Falha ao criar o livro'));
  });
});

describe('Get All Books', () => {
  it('deve retornar uma lista de livros com status 200', async () => {
    const mockBooks = [
      {
        title: 'Livro Teste1',
        author: 'Autor Teste1',
        price: 130.99,
        quantity: 3,
        genre: 'Ficção',
        description: 'Descrição Teste1',
        published_year: 2022,
        image_url: 'http://example.com/livro.jpg'
      }, 
      {
        title: 'Livro Teste2',
        author: 'Autor Teste2',
        price: 30.99,
        quantity: 2,
        genre: 'Ficção',
        description: 'Descrição Teste2',
        published_year: 2022,
        image_url: 'http://example.com/livro.jpg'
      }
    ];

    jest.spyOn(bookService, 'getAllBooksService').mockResolvedValue(mockBooks);

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await getAllBooks(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Livros encontrados com sucesso',
      data: mockBooks,
    });
  });
});

describe('Get Book By Id', () => {
  it('Deve retornar um livro com status 200', async () => {
    const mockBook = [
      {
        id: 1,
        title: 'Livro Teste1',
        author: 'Autor Teste1',
        price: 130.99,
        quantity: 3,
        genre: 'Ficção',
        description: 'Descrição Teste1',
        published_year: 2022,
        image_url: 'http://example.com/livro.jpg'
      }
    ];

    jest.spyOn(bookService, 'getBookByIdService').mockResolvedValue(mockBook);

    const req = { params: { id: 1 } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await getBookById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Livro encontrado com sucesso',
      data: mockBook,
    });
  });

  it('Deve retornar 404 se o livro não for encontrado', async () => {
    jest.spyOn(bookService, 'getBookByIdService').mockResolvedValue(null);

    const req = { params: { id: 1 } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await getBookById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Livro não encontrado',
      data: null
    });
  });
});

describe('Update Book', () => {
  it('Deve atualizar um livro com sucesso', async () => {
    const mockUpdatedBook = {
      id: 1,
      title: 'Livro Teste1',
      author: 'Autor Teste1',
      price: 130.99,
      quantity: 3,
      genre: 'Ficção',
      description: 'Descrição Teste1',
      published_year: 2022,
      image_url: 'http://example.com/livro.jpg'
    };

    jest.spyOn(bookService, 'updateBookService').mockResolvedValue(mockUpdatedBook);

    const req = { 
      params: { id: 1 }, 
      body: { title: 'Novo Título' } 
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await updateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: "Livro atualizado com sucesso",
      data: mockUpdatedBook,
    });
  });

  it('Deve retornar 404 se o livro não for encontrado', async () => {
    jest.spyOn(bookService, 'updateBookService').mockResolvedValue(null);

    const req = { 
      params: { id: 1 }, 
      body: {} 
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await updateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Livro não encontrado',
      data: null
    });
  });
});

describe('Delete Book', () => {
  it('Deve deletar um livro com sucesso', async () => {
    const mockDeletedBook  = [
      {
        id: 1,
        title: 'Livro Teste1',
        author: 'Autor Teste1',
        price: 130.99,
        quantity: 3,
        genre: 'Ficção',
        description: 'Descrição Teste1',
        published_year: 2022,
        image_url: 'http://example.com/livro.jpg'
      }
    ];

    jest.spyOn(bookService, 'deleteBookService').mockResolvedValue(mockDeletedBook);

    const req = { params: { id: 1 } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await deleteBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Livro deletado com sucesso',
      data: mockDeletedBook,
    });
  });

  it('Deve retornar 404 se o livro não for encontrado', async () => {
    jest.spyOn(bookService, 'deleteBookService').mockResolvedValue(null);

    const req = { params: { id: 1 } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    const next = jest.fn();

    await deleteBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Livro não encontrado',
      data: null
    });
  });
});