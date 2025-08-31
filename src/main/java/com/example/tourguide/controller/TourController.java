package com.example.tourguide.controller;

import com.example.tourguide.model.Tour;
import com.example.tourguide.service.TourService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*") // allow frontend calls
public class TourController {
    private final TourService service;

    public TourController(TourService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tour> getAllTours() {
        return service.getAllTours();
    }

    @PostMapping
    public Tour addTour(@RequestBody Tour tour) {
        return service.addTour(tour);
    }

    @PutMapping("/{id}")
    public Tour updateTour(@PathVariable Long id, @RequestBody Tour tour) {
        tour.setId(id);
        return service.updateTour(tour);
    }

    @DeleteMapping("/{id}")
    public void deleteTour(@PathVariable Long id) {
        service.deleteTour(id);
    }
}
