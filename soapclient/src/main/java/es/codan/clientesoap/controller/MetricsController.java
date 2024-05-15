package es.codan.clientesoap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import es.codan.clientesoap.MetricsClient;
import es.codan.clientesoap.wsdl.GetMeanResponse;


@Controller
public class MetricsController {

    @Autowired
    private MetricsClient metricsClient; // Suponiendo que tienes un servicio para interactuar con el cliente SOAP

    @GetMapping("/consultar-metricas")
    public String consultarMetricasGet(@RequestParam("sensorId") String sensorId,
                                    @RequestParam("metric") String metric,
                                    @RequestParam("date") String date,
                                    Model model) {
        // Llamar al servicio para obtener la respuesta del cliente SOAP
    	GetMeanResponse response = metricsClient.getMean(sensorId, metric, date);

        // Agregar los datos de la respuesta al modelo para mostrarlos en la vista
//        model.addAttribute("response", response);
    	model.addAttribute("response", response);

        // Devolver el nombre de la vista que mostrará los datos
        return "resultado";
    }

    @PostMapping("/consultar-metricas")
    public String consultarMetricasPost(@RequestParam("sensorId") String sensorId,
                                    @RequestParam("metric") String metric,
                                    @RequestParam("date") String date,
                                    Model model) {
        // Devolver el nombre de la vista que mostrará los datos
        return consultarMetricasGet(sensorId, metric, date, model);
    }

    
}