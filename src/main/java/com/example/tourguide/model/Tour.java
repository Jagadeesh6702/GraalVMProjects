package com.example.tourguide.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private double price;
    private String description;
    @Column(name = "location_type")
    private String locationType;
    @Column(name = "photo_url")
    private String photoUrl;
    @Column(name = "best_time_to_visit")
    private String best_time_to_visit;
    @Column(name = "duration_of_stay")
    private String duration_of_stay;

}
