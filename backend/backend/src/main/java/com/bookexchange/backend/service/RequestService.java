package com.bookexchange.backend.service;

import com.bookexchange.backend.model.Request;
import com.bookexchange.backend.model.User;
import com.bookexchange.backend.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    public Request sendRequest(Request request) {
        return requestRepository.save(request);
    }

    public List<Request> getSentRequests(User sender) {
        return requestRepository.findBySender(sender);
    }

    public List<Request> getReceivedRequests(User receiver) {
        return requestRepository.findByReceiver(receiver);
    }

    public Request save(Request request) {
        return requestRepository.save(request);
    }

    public Request getById(Long id) {
        return requestRepository.findById(id).orElse(null);
    }
}