package es.codan.clientesoap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

@Configuration
public class MeanConfiguration {

  @Bean
  public Jaxb2Marshaller marshaller() {
    Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
    // this package must match the package in the <generatePackage> specified in
    // pom.xml
    marshaller.setContextPath("es.codan.clientesoap.wsdl");
    return marshaller;
  }

  @Bean
  public MetricsClient metricsClient(Jaxb2Marshaller marshaller) {
    MetricsClient client = new MetricsClient();
    client.setDefaultUri("http://localhost:8080/");
    client.setMarshaller(marshaller);
    client.setUnmarshaller(marshaller);
    return client;
  }

}