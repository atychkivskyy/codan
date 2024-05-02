import {AxiosServiceService} from "./axios-service.service"; 
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import {BehaviorSubject, from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private isAdmin = new BehaviorSubject<boolean>(false);
  private currentUsername = new BehaviorSubject<string>(localStorage.getItem('username') || '');
  
  constructor(private axiosService: AxiosServiceService, private router: Router) { 

  }

  initializeAuthState(){
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    this.isAuthenticated.next(!!token);
    this.isAdmin.next(isAdmin);
  }

  login(username: string, password: string): Observable<boolean | string> {
    this.axiosService.removeToken();
    return from(
      this.axiosService.post('/login', { username, password })
        .then(response => {
          const isAdmin = response.data.isAdmin == true;
          localStorage.setItem('token', 'true');
          localStorage.setItem('username', 'true');
          localStorage.setItem('isAdmin', isAdmin.toString());
          this.isAuthenticated.next(true);
          this.isAdmin.next(isAdmin);
          this.currentUsername.next(response.data.username)
          return true;
        })
        .catch(error => {
          console.error(error);
          if (error.response.status === 404) {
            return 'Usuario o contraseña incorrectos';
          } else {
            return 'Error interno del servidor';
          }
        })
    );
  }

  getUsers() {
    return this.axiosService.get('/getUsers')
      .then(response => response.data)
      .catch(error => {
        console.error('Error al obtener la lista de usuarios:', error);
        throw error;
      });
  }
  

  createUser(username: string,password: string): Observable<boolean> {
    return from(
      this.axiosService.post('/createUser', {username, password})
        .then(()=>{
          return true;
        })
        .catch(error =>{
          console.log(error);
          return false; 
        })
    );
  }

  checkUsername(username: string): Observable<boolean |string> {
    return from(this.axiosService.post('/user', {username})
    .then(() =>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      if (error.response && error.response.status === 404) {
        return 'Usuario no existente';
      } else {
        return 'Error interno del servidor';
      }
    }));
  }

  checkUserEnabled(username: string): Observable<boolean |string> {
    return from(this.axiosService.post('/isEnabled', {username})
    .then(response =>{
      const isAdmin= response.data.isAdmin == true;
      return true; 
    })
    .catch(error =>{
      console.error(error);
          if (error.response.status === 404) {
            return 'Usuario o contraseña incorrectos';
          } else {
            return 'Error interno del servidor';
          }
    }));
  }

  enableUser(username:string): Observable<boolean>{
    return from(this.axiosService.post('/enableUser', {username})
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));

  }

  disableUser(username:string): Observable<boolean>{
    return from(this.axiosService.post('/disableUser', {username})
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));
  }

  deleteUser(username:string):Observable<boolean>{
    return from(this.axiosService.post('/deleteUser', {username})
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));

  }
}

 


