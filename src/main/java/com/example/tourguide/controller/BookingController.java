package com.example.tourguide.controller;

import com.example.tourguide.model.Booking;
import com.example.tourguide.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return service.getAllBookings();
    }

    @PostMapping
    public Booking bookTour(@RequestBody Booking booking) {
        return service.bookTour(booking);
    }
}
