package es.codan.influxdb;

//import java.time.Instant;
//import java.time.OffsetDateTime;
//import java.time.temporal.ChronoUnit;
//import java.util.ArrayList;
import java.util.List;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.InfluxDBClientOptions;
//import com.influxdb.annotations.Column;
//import com.influxdb.annotations.Measurement;
import com.influxdb.client.QueryApi;
//import com.influxdb.client.WriteApiBlocking;
//import com.influxdb.client.domain.WritePrecision;
//import com.influxdb.client.write.Point;
//import com.influxdb.exceptions.InfluxException;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

public class InfluxDBConnectionClass {

//    private String token;
//    private String bucket;
//    private String org;
//
//    private String url;

//    public InfluxDBClient buildConnection(String url, String token, String bucket, String org) {
//        setToken(token);
//        setBucket(bucket);
//        setOrg(org);
//        setUrl(url);
//        
//        InfluxDBClient cliente = InfluxDBClientFactory.create(getUrl(), getToken().toCharArray(), getOrg(), getBucket());
//        InfluxDBClient cliente2 = InfluxDBClientFactory.create(InfluxDBClientOptions.builder()
//                .url(url)
//                .org(org)
//                .authenticate("radmin", "radminradmin".toCharArray())
//                .build());
//        InfluxDBClient cliente3 = InfluxDBClientFactory.create(url, "admin", "adminadmin".toCharArray());
//
//        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
//        	    .loadProperties()
//        	    .build();
//        InfluxDBClient cliente4 = InfluxDBClientFactory.create(options);
//        
//        return cliente;       		
//    }

    public InfluxDBClient buildConnection() {

        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
        	    .loadProperties()
        	    .build();
        InfluxDBClient cliente = InfluxDBClientFactory.create(options);
        
        return cliente;
        		
    }
    
//    public String getToken() {
//        return token;
//    }
//
//    public void setToken(String token) {
//        this.token = token;
//    }
//
//    public String getBucket() {
//        return bucket;
//    }
//
//    public void setBucket(String bucket) {
//        this.bucket = bucket;
//    }
//
//    public String getOrg() {
//        return org;
//    }
//
//    public void setOrg(String org) {
//        this.org = org;
//    }
//
//    public String getUrl() {
//        return url;
//    }
//
//    public void setUrl(String url) {
//        this.url = url;
//    }
//
////    @Measurement(name = "sensor_data")
////    private static class Sensor {
////
////        @Column(tag = true)
////        String sensor_id;
////
////        @Column
////        String measurement;
////
////        @Column
////        String model_number;
////
////        @Column(timestamp = true)
////        Instant last_inspected;
////    }
//
//    public List<String> queryData(InfluxDBClient influxDBClient) {
//        
//    	List<String> result = null;
//    	
////    	String flux = "from(bucket:\"metrics\") "
////    			+ "|> range(start:0) "
////    			+ "|> filter(fn: (r) => r[\"_measurement\"] == \"sensor\") "
////    			+ "|> filter(fn: (r) => r[\"sensor_id\"] == \"TLM0100\"or r[\"sensor_id\"] == \"TLM0101\" or r[\"sensor_id\"] == \"TLM0103\" or r[\"sensor_id\"] == \"TLM0200\") "
////    			+ "|> sort() |> yield(name: \"sort\")";
//        // from(bucket: "myFirstBucket")
//        // |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
//        // |> filter(fn: (r) => r["_measurement"] == "sensor")
//        // |> filter(fn: (r) => r["_field"] == "model_number")
//        // |> filter(fn: (r) => r["sensor_id"] == "TLM0100" or r["sensor_id"] ==
//        // "TLM0101" or r["sensor_id"] == "TLM0103" or r["sensor_id"] == "TLM0200")
//        // |> sort()
//        // |> yield(name: "sort")
//    	
//    	String flux = "from(bucket:\"metrics\") "
//    			+ "|> range(start:0) "
//    			+ "|> filter(fn: (r) => r[\"_measurement\"] == \"sensor_data\") "
//    			+ "|> filter(fn: (r) => r[\"sensor_id\"] == \"1\"or r[\"sensor_id\"] == \"2\") "
//    			+ "|> sort() |> yield(name: \"mean\")";
//        // from(bucket: "myFirstBucket")//    	from(bucket: "metrics")
////    	  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
////    	  |> filter(fn: (r) => r["_measurement"] == "sensor_data")
////    	  |> filter(fn: (r) => r["_field"] == "co2")
////    	  |> filter(fn: (r) => r["sensor_id"] == "1" or r["sensor_id"] == "2")
////    	  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
////    	  |> yield(name: "mean")
//
//        QueryApi queryApi = influxDBClient.getQueryApi();
//
//        List<FluxTable> tables = queryApi.query(flux);
//        for (FluxTable fluxTable : tables) {
//            List<FluxRecord> records = fluxTable.getRecords();
//            for (FluxRecord fluxRecord : records) {
//                System.out.print("sensor_id : " + fluxRecord.getValueByKey("sensor_id") + " | ");
//                System.out.print("field : " + fluxRecord.getValueByKey("_field") + " | ");
//                System.out.println("value : " + fluxRecord.getValueByKey("_value") + " | ");
//            }
//        }
//        
//        return result;
//    }
    
    public String queryMean(InfluxDBClient influxDBClient, String sensor, String metric) {
    	
    	String result = "";
    	
    	String flux = "from(bucket:\"metrics\") "
    			+ "|> range(start:0) "
    			+ "|> filter(fn: (r) => r[\"_measurement\"] == \"sensor_data\") "
    			+ "|> filter(fn: (r) => r[\"sensor_id\"] == \""+sensor+"\")"
    			+ "|> filter(fn: (r) => r[\"_field\"] == \""+metric+"\")"
		    	+ "|> mean()"
		    	;
		
    	QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = queryApi.query(flux);
        for (FluxTable fluxTable : tables) {
            List<FluxRecord> records = fluxTable.getRecords();
            for (FluxRecord fluxRecord : records) {
                System.out.print("sensor_id : " + fluxRecord.getValueByKey("sensor_id") + " | ");
                System.out.print("metric : " + fluxRecord.getValueByKey("_field") + " | ");
                System.out.println("mean : " + fluxRecord.getValueByKey("_value") + " | ");
                result = fluxRecord.getValueByKey("_value").toString();
            }
        }
        
        return result;
    }

}