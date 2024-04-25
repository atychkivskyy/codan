import axios from 'axios';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

  login(username: string, password: string): Observable<any> {
    const url = 'http://localhost:826/login'; // Reemplaza 'URL_DEL_BACKEND' con la URL real de tu backend
    const body = { username, password };
    
    return new Observable(observer => {
      axios.post(url, body)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  register(username: string, name: string, mail: string, password: string): Observable<any> {
    const url = 'http://localhost:826/register'; // Ruta de registro en el backend
    const body = { username, name, mail, password };

    return new Observable(observer => {
      axios.post(url, body)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

 
}

