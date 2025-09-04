package com.example.tourguide;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
 
@SpringBootApplication
public class TourGuideBackendApplication {
 
    private static long startupTime;
 
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        SpringApplication.run(TourGuideBackendApplication.class, args);
        long end = System.currentTimeMillis();
        startupTime = end - start;
        System.out.println("🚀 Application started in " + startupTime + " ms");
    }
 
    // small REST controller inside
    @RestController
    class StartupTimeController {
        @GetMapping("/startup-time")
        public String getStartupTime() {
            return "Application started in " + startupTime + " ms";
        }
    }
}