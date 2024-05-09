package es.codan.clientesoap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import es.codan.clientesoap.wsdl.GetMeanResponse;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        // No asignes valores a args[0] aquí
        SpringApplication.run(Application.class, args);
    }

}