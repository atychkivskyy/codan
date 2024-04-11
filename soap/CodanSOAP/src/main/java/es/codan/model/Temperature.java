package es.codan.model;
 
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
 
//import javax.xml.bind.annotation.XmlAttribute;
//import javax.xml.bind.annotation.XmlValue;
 
public class Temperature implements Serializable {
 
    private static final long serialVersionUID = 1L;
 
    public static List<Temperature> temperatures = new ArrayList<>(Arrays.asList (
            new Temperature("Sensor1", "20.5"), 
            new Temperature("Sensor2", "24.5"), 
            new Temperature("Sensor3", "27.3")));
     
    public String sensor;
    public String value;
 
    public Temperature() {
        super();
    }
     
    public Temperature(String sensor, String value) {
        super();
        this.sensor = sensor;
        this.value = value;
    }
 
    public void setSensor(String sensor) {
        this.sensor = sensor;
    }
 
    public void setValue(String value) {
        this.value = value;
    }
     
     public static List<Temperature> getTemperatures()
     {
         return temperatures;
     }
 
}