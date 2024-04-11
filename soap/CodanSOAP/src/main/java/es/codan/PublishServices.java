package es.codan;
 
import javax.xml.ws.Endpoint;

import es.codan.soap.SOAPImpl;
 
public class PublishServices {
 
    public static void main(String[] args) {
             
        /*
         *  Se publican los servicios a través de un servidor virtual. 
            El puerto puede ser cualquiera.
            Un vez ejecutada la aplicación, se publica el contrato WSDL
          */
          
        Endpoint.publish("http://localhost:80/WS/Metrics", new SOAPImpl());
 
    }
}