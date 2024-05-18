import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import axios from 'axios';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfluxDBService {
  getDataFromInfluxDB(field: string, time: string): Observable<any> {
    const url = `http://localhost:8826/api/metrics?field=${field}&time=${time}`;
    const token = localStorage.getItem('token');

    return new Observable(observer => {
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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
    return data.map(entry => ({
      id: entry.sensor_id,
      value: entry._value,
      startTime: entry._start,
      field: entry._field
    }));
  }
}



