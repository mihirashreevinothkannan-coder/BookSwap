package com.bookexchange.backend.controller;

import com.bookexchange.backend.model.Book;
import com.bookexchange.backend.model.User;
import com.bookexchange.backend.repository.BookRepository;
import com.bookexchange.backend.service.BookService;
import com.bookexchange.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add/{userId}")
    public Book addBook(@RequestBody Book book,
                        @PathVariable Long userId) {

        User owner = userRepository.findById(userId).orElse(null);

        book.setOwner(owner);

        return bookService.addBook(book);
    }

    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/my/{userId}")
    public List<Book> getMyBooks(@PathVariable Long userId) {

        User owner = userRepository.findById(userId).orElse(null);

        return bookService.getBooksByOwner(owner);
    }
    @GetMapping("/borrowed/{userId}")
    public List<Book> getBorrowedBooks(@PathVariable Long userId) {
        return bookRepository.findBorrowedBooksByUser(userId);
    }
    @PutMapping("/return/{bookId}")
    public String returnBook(@PathVariable Long bookId) {

        Book book = bookRepository.findById(bookId).orElseThrow();

        book.setAvailability("AVAILABLE");

        bookRepository.save(book);

        return "Book Returned Successfully";
    }
}