package com.kindora.kindora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KindoraApplication {

	public static void main(String[] args) {
		SpringApplication.run(KindoraApplication.class, args);
		System.out.println("http://localhost:8080");
	}

}
