package com.example.tourguide.service;

import com.example.tourguide.model.Booking;
import com.example.tourguide.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }

    public Booking bookTour(Booking booking) {
        return repo.save(booking);
    }
}
