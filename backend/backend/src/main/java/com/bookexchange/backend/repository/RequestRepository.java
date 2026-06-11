package com.bookexchange.backend.repository;

import com.bookexchange.backend.model.Book;
import com.bookexchange.backend.model.Request;
import com.bookexchange.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    boolean existsByBookAndSenderAndStatus(
            Book book,
            User sender,
            String status
    );
    boolean existsByBookAndSender(
            Book book,
            User sender
    );
    List<Request> findBySender(User sender);

    List<Request> findByReceiver(User receiver);


}