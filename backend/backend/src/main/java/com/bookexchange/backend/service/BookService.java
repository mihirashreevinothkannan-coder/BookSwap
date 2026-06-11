package com.bookexchange.backend.service;

import com.bookexchange.backend.model.Book;
import com.bookexchange.backend.model.User;
import com.bookexchange.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Book> getBooksByOwner(User owner) {
        return bookRepository.findByOwner(owner);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book save(Book book) {
        return bookRepository.save(book);
    }
}