package es.codan.springsoap;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import es.codan.influxdb.MetricsDao;
import es.codan.springsoap.gen.GetMeanRequest;
import es.codan.springsoap.gen.GetMeanResponse;
import es.codan.springsoap.gen.Mean;

@Endpoint
public class MeanEndpoint {

    private static final String NAMESPACE_URI = "http://www.codan.es/springsoap/gen";

//    private MetricRepository metricRepository;
//
//    @Autowired
//    public MetricEndpoint(MetricRepository metricRepository) {
//        this.metricRepository = metricRepository;
//    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getMeanRequest")
    @ResponsePayload
    public GetMeanResponse getMetric(@RequestPayload GetMeanRequest request) {
        GetMeanResponse response = new GetMeanResponse();
//        response.setMetric(metricRepository.findMetric(request.getSensorId()));

        String value = MetricsDao.selectMean(request.getSensorId(), request.getMetric());
        
        Mean mean = new Mean();
        mean.setSensorId(request.getSensorId());
        mean.setMetric(request.getMetric());
        mean.setValue(value);
        
        response.setMean(mean);

        return response;
    }
}