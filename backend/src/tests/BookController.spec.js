import { createBook, getAllBooks } from '../controllers/bookController.js';
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