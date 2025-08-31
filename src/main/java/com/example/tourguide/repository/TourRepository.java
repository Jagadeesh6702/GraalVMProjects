package com.example.tourguide.repository;

import com.example.tourguide.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Long> {}
