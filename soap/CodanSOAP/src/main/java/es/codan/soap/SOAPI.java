package es.codan.soap;
 
import java.util.List;
 
import javax.jws.WebMethod;
import javax.jws.WebService;

import es.codan.model.Temperature;
 
@WebService
public interface SOAPI {
     
    @WebMethod
    public List<Temperature> getTemperatures();

//    @WebMethod
//    public List<Temperature> getCO2s();
//
//    @WebMethod
//    public List<Temperature> getVolatiles();

}