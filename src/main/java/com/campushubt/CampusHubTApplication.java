package com.campushubt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = "com.campushubt")
public class CampusHubTApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusHubTApplication.class, args);
    }
}