import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class InfluxDBService {

  constructor() { }

  getDataFromInfluxDB(): Observable<any> {
    const url = 'http://localhost:826/influx-data';

    return new Observable(observer => {
      axios.get(url)
        .then(response => {
          const transformedData = this.transformData(response.data);
          observer.next(transformedData);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    }).pipe(
      catchError(err => {
        console.error('Error fetching data from InfluxDB:', err);
        return throwError('Error fetching data from InfluxDB');
      })
    );
  }

  private transformData(data: any[]): any[] {
    const transformedData: any[] = [];

    data.forEach(entry => {
      const sensorId = entry.sensor_id;
      const value = entry._value;
      const startTime = entry._start;
      const endTime = entry._stop;
      const field = entry._field;

      transformedData.push({
        id: sensorId,
        value: value,
        startTime: startTime,
        endTime: endTime,
        field: field
      });
    });

    return transformedData;
  }
}


