package es.codan.influxdb;

import com.influxdb.client.InfluxDBClient;

public class MetricsDao {

    public static String selectMean(String sensor, String metric, String date) {

    	String result = "";
    	
        InfluxDBConnectionClass inConn = new InfluxDBConnectionClass();
        InfluxDBClient influxDBClient = inConn.buildConnection();
        
        result = inConn.queryMean(influxDBClient, sensor, metric, date);

        influxDBClient.close();
        
        return result; 
    }
    
}