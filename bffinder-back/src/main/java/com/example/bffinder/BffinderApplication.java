package com.example.bffinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BffinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(BffinderApplication.class, args);
	}

}
