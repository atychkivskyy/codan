package es.codan.influxdb;

import java.util.List;

import com.influxdb.client.InfluxDBClient;

public class MetricsDao {
    // private static Result oneResult;

//    public static List<String> select() {
//
//    	List <String> result = null;
//    	
//        String token = "6jFEZZcQkAXokUNl4tS25lEJ1BdBsfpfWLOoPYHKH9zxiM43KhLCTngAeQFIqSRMIahlisT8kdi7pBnR61q77g==";
//        String bucket = "metrics";
//        String org = "codan";
//        String url = "http://localhost:8086";
//
//        InfluxDBConnectionClass inConn = new InfluxDBConnectionClass();
////        InfluxDBClient influxDBClient = inConn.buildConnection(url, token, bucket, org);
//        InfluxDBClient influxDBClient = inConn.buildConnection();
//
//        result = inConn.queryData(influxDBClient);
//
//        influxDBClient.close();
//        
//        return result; 
//    }

    public static String selectMean(String sensor, String metric) {

    	String result = "";
    	
//        String token = "6jFEZZcQkAXokUNl4tS25lEJ1BdBsfpfWLOoPYHKH9zxiM43KhLCTngAeQFIqSRMIahlisT8kdi7pBnR61q77g==";
//        String bucket = "metrics";
//        String org = "codan";
//        String url = "http://localhost:8086";

        InfluxDBConnectionClass inConn = new InfluxDBConnectionClass();
//        InfluxDBClient influxDBClient = inConn.buildConnection(url, token, bucket, org);
        InfluxDBClient influxDBClient = inConn.buildConnection();
        
        result = inConn.queryMean(influxDBClient, sensor, metric);

        influxDBClient.close();
        
        return result; 
    }
    
}