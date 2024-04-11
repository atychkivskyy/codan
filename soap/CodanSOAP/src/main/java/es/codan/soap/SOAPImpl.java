package es.codan.soap;
 
import java.util.List;
 
import javax.jws.WebService;

import es.codan.model.Temperature;
 
@WebService(endpointInterface = "es.codan.soap.SOAPI")
public class SOAPImpl implements SOAPI{
 
    @Override
    public List<Temperature> getTemperatures() {
        return Temperature.getTemperatures();
    }

//    @Override
//    public List<Temperature> getCO2s() {
//        return Temperature.getCO2s();
//    }
    
}