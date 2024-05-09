package es.codan.clientesoap;

import java.util.GregorianCalendar;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

import es.codan.clientesoap.wsdl.GetMeanRequest;
import es.codan.clientesoap.wsdl.GetMeanResponse;

public class MetricsClient extends WebServiceGatewaySupport {

  private static final Logger log = LoggerFactory.getLogger(MetricsClient.class);

  public GetMeanResponse getMean(String sensorid, String metric, String date) {

    GetMeanRequest request = new GetMeanRequest();
    request.setSensorId(sensorid);
    request.setMetric(metric);
    XMLGregorianCalendar xmlDate;
	try {
		xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar(date);
		request.setDate(xmlDate);
	} catch (DatatypeConfigurationException e) {
		e.printStackTrace();
	}

    log.info("Requesting value for sensor " + sensorid + ", metric " + metric + " and date " + date);

    GetMeanResponse response = (GetMeanResponse) getWebServiceTemplate()
        .marshalSendAndReceive("http://localhost:8080/metrics.wsdl", request,
            new SoapActionCallback(
                "GetMeanRequest"));

    return response;
  }

}