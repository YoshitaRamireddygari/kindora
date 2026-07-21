package com.kindora.kindora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.kindora.kindora.repository.NgoRepository;
import com.kindora.kindora.entity.NGO;
import com.kindora.kindora.entity.NgoStatus;

@SpringBootApplication
public class KindoraApplication {

	public static void main(String[] args) {
		SpringApplication.run(KindoraApplication.class, args);
		System.out.println("http://localhost:8080");
	}

	@Bean
	CommandLineRunner initDatabase(NgoRepository ngoRepository) {
		return args -> {
			if (ngoRepository.findByEmail("ngo@kindora.com").isEmpty()) {
				NGO ngo = new NGO();
				ngo.setEmail("ngo@kindora.com");
				ngo.setPassword("ngo123");
				ngo.setOrganizationName("Helping Hands NGO");
				ngo.setContactNumber("9876543210");
				ngo.setAddress("123 NGO Street");
				ngo.setStatus(NgoStatus.VERIFIED);
				ngoRepository.save(ngo);
				System.out.println("Seeded test NGO account: ngo@kindora.com / ngo123");
			}
		};
	}
}
