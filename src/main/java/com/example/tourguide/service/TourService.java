package com.example.tourguide.service;

import com.example.tourguide.model.Tour;
import com.example.tourguide.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourService {
    private final TourRepository repo;

    public TourService(TourRepository repo) {
        this.repo = repo;
    }

    public List<Tour> getAllTours() {
        return repo.findAll();
    }

    public Tour addTour(Tour tour) {
        return repo.save(tour);
    }

    public Tour updateTour(Tour tour) {
        return repo.save(tour);
    }

    public void deleteTour(Long id) {
        repo.deleteById(id);
    }
}
