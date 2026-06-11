package com.bookexchange.backend.repository;

import com.bookexchange.backend.model.Book;
import com.bookexchange.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByOwner(User owner);
    @Query("SELECT b FROM Book b WHERE b.owner.id = :userId AND b.availability = 'BORROWED'")
    List<Book> findBorrowedBooksByUser(@Param("userId") Long userId);
    List<Book> findByAvailability(String availability);

}