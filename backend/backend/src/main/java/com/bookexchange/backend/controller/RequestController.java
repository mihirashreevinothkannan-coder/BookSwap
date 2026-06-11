package com.bookexchange.backend.controller;

import com.bookexchange.backend.model.Book;
import com.bookexchange.backend.model.Request;
import com.bookexchange.backend.model.User;
import com.bookexchange.backend.repository.BookRepository;
import com.bookexchange.backend.repository.RequestRepository;
import com.bookexchange.backend.repository.UserRepository;
import com.bookexchange.backend.service.RequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/send")
    public Request sendRequest(
            @RequestParam Long bookId,
            @RequestParam Long senderId) {

        Book book = bookRepository.findById(bookId).orElse(null);

        User sender = userRepository.findById(senderId).orElse(null);

        if (book.getOwner().getId().equals(senderId)) {
            throw new RuntimeException("You cannot request your own book");
        }
        if (requestRepository.existsByBookAndSenderAndStatus(
                book,
                sender,
                "PENDING")) {

            throw new RuntimeException(
                    "Request already exists");
        }
        if (requestRepository.existsByBookAndSender(book, sender)) {
            throw new RuntimeException("Request already exists");
        }
        book.setAvailability("REQUESTED");
        bookRepository.save(book);

        User receiver = book.getOwner();

        Request request = new Request();

        request.setBook(book);
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");

        return requestService.sendRequest(request);
    }
    @PutMapping("/accept/{requestId}")
    public Request acceptRequest(@PathVariable Long requestId) {

        Request request = requestService.getById(requestId);

        request.setStatus("ACCEPTED");
        request.setAcceptedDate(LocalDateTime.now());
        request.setDueDate(LocalDateTime.now().plusDays(7));

        Book book = request.getBook();
        book.setAvailability("BORROWED");

        bookRepository.save(book);

        return requestService.save(request);
    }

    @GetMapping("/sent/{userId}")
    public List<Request> getSentRequests(@PathVariable Long userId) {

        User sender = userRepository.findById(userId).orElse(null);

        return requestService.getSentRequests(sender);
    }

    @GetMapping("/received/{userId}")
    public List<Request> getReceivedRequests(@PathVariable Long userId) {

        User receiver = userRepository.findById(userId).orElse(null);

        return requestService.getReceivedRequests(receiver);
    }

    @PutMapping("/reject/{requestId}")
    public Request rejectRequest(@PathVariable Long requestId) {

        Request request = requestService.getById(requestId);

        request.setStatus("REJECTED");
        request.getBook().setAvailability("AVAILABLE");
        return requestService.save(request);
    }
}
