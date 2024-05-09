package es.codan.springsoap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WsdlController {

    @GetMapping("/metrics.wsdl")
    public String redirectWsdl() {
    	System.out.println("Redirijo");
        return "redirect:/metrics.wsdl";
    }
}