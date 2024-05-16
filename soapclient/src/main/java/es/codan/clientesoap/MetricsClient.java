package es.codan.clientesoap;

import java.io.IOException;
import java.util.Properties;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import es.codan.clientesoap.wsdl.GetMeanRequest;
import es.codan.clientesoap.wsdl.GetMeanResponse;

public class MetricsClient extends WebServiceGatewaySupport {

  private static final Logger log = LoggerFactory.getLogger(MetricsClient.class);

  public GetMeanResponse getMean(String sensorid, String metric, String date) {

    GetMeanRequest request = new GetMeanRequest();
    if (sensorid == null) { 
    	sensorid = "";
    }
    request.setSensorId(sensorid);
    request.setMetric(metric);
    XMLGregorianCalendar xmlDate = null;
    if (date != null && !("").equals(date.trim())) {
		try {
			xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar(date);
			request.setDate(xmlDate);
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
		}
    }
	request.setDate(xmlDate);
    log.info("Requesting value for sensor " + sensorid + ", metric " + metric + " and date " + date);

    
    try {
        // Cargar el archivo de propiedades desde el classpath
        Properties properties = PropertiesLoaderUtils.loadProperties(new ClassPathResource("soap.properties"));

        // Acceder a las propiedades
    	String rutaWsdl = properties.getProperty("soap.url")+"/metrics.wsdl";
	    GetMeanResponse response = (GetMeanResponse) getWebServiceTemplate()
	        .marshalSendAndReceive(rutaWsdl, request,
	            new SoapActionCallback(
	                "GetMeanRequest"));

    return response;   	

    } catch (IOException e) {
		e.printStackTrace();
		return null;
	}
  }

}