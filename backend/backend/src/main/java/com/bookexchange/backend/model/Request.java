package com.bookexchange.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonIgnoreProperties({"books"})
    private Book book;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonIgnoreProperties({"books"})
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonIgnoreProperties({"books"})
    private User receiver;

    private String status;

    private LocalDateTime requestDate;

    private LocalDateTime acceptedDate;

    private LocalDateTime dueDate;

    public Request() {
    }

    @PrePersist
    public void prePersist() {
        this.requestDate = LocalDateTime.now();

        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    public Long getId() {
        return id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public LocalDateTime getAcceptedDate() {
        return acceptedDate;
    }

    public void setAcceptedDate(LocalDateTime acceptedDate) {
        this.acceptedDate = acceptedDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}