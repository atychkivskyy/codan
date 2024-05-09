package es.codan.influxdb;

import java.util.List;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.InfluxDBClientOptions;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

public class InfluxDBConnectionClass {

    public InfluxDBClient buildConnection() {

        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
        	    .loadProperties()
        	    .build();
        InfluxDBClient cliente = InfluxDBClientFactory.create(options);
        
        return cliente;
        		
    }
        
    public String queryMean(InfluxDBClient influxDBClient, String sensor, String metric, String date) {
    	
    	String result = "";
    	
    	StringBuilder flux = new StringBuilder ("from(bucket:\"metrics\") ");
    	flux.append("|> range(start:0) ");
    	flux.append("\n|> filter(fn: (r) => r[\"_measurement\"] == \"sensor_data\") ");

    	if (sensor != null && !"".equals(sensor)) {
    		flux.append("\n|> filter(fn: (r) => r[\"sensor_id\"] == \""+sensor+"\") ");
    	}
    	
    	if (metric != null && !"".equals(metric)) {
    		flux.append("\n|> filter(fn: (r) => r[\"_field\"] == \""+metric+"\") ");
    	}
    	if (date != null && !"".equals(date)) {
    		flux.append(filterDate(date));
    	}
    	flux.append("\n|> mean()");
		
    	QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = queryApi.query(flux.toString());
        for (FluxTable fluxTable : tables) {
            List<FluxRecord> records = fluxTable.getRecords();
            for (FluxRecord fluxRecord : records) {
                System.out.print("sensor_id : " + fluxRecord.getValueByKey("sensor_id") + " | ");
                System.out.print("metric : " + fluxRecord.getValueByKey("_field") + " | ");
                System.out.print("date : " + fluxRecord.getValueByKey("_date") + " | ");
                System.out.println("mean : " + fluxRecord.getValueByKey("_value") + " | ");
                result = fluxRecord.getValueByKey("_value").toString();
            }
        }
        
        return result;
    }
    
    private static String filterDate(String date) {
    	    	    	
    	String result = "\n|> filter(fn: (r) => r[\"_time\"] >= "+date+"T00:00:00Z and r[\"_time\"] <= " +date+ "T23:59:59Z)";
    	    	
    	return result;
    	
    	
    }

}