//
// Este archivo ha sido generado por Eclipse Implementation of JAXB v3.0.0 
// Visite https://eclipse-ee4j.github.io/jaxb-ri 
// Todas las modificaciones realizadas en este archivo se perderán si se vuelve a compilar el esquema de origen. 
// Generado el: 2024.04.25 a las 12:12:31 AM CEST 
//


package es.codan.springsoap.gen;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlType;


/**
 * <p>Clase Java para anonymous complex type.
 * 
 * <p>El siguiente fragmento de esquema especifica el contenido que se espera que haya en esta clase.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="mean" type="{http://www.codan.es/springsoap/gen}mean"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "mean"
})
@XmlRootElement(name = "getMeanResponse")
public class GetMeanResponse {

    @XmlElement(required = true)
    protected Mean mean;

    /**
     * Obtiene el valor de la propiedad mean.
     * 
     * @return
     *     possible object is
     *     {@link Mean }
     *     
     */
    public Mean getMean() {
        return mean;
    }

    /**
     * Define el valor de la propiedad mean.
     * 
     * @param value
     *     allowed object is
     *     {@link Mean }
     *     
     */
    public void setMean(Mean value) {
        this.mean = value;
    }

}
