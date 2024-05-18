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
      this.axiosService.post('api/login', { username, password })
        .then(response => {
          const isAdmin = response.data.isAdmin == true;
          const isEnabled = response.data.isEnabled == true;
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('isAdmin', isAdmin.toString());
          localStorage.setItem('isEnabled',isEnabled.toString())
          this.isAuthenticated.next(true);
          this.isAdmin.next(isAdmin);
          this.currentUsername.next(response.data.username)
          return true;
        })
        .catch(error => {
          console.error(error);
          if (error.response.status === 404) {
            return 'User not found';
          } 
          if (error.response.status === 403) {
            return 'Account is disabled';
          }
          if(error.response.status === 400){
            return 'Invalid credentials';
          }

          return 'Server internal error';

        })
    );
  }

  getUsers() {
    const token = localStorage.getItem('token'); 
    return this.axiosService.get('api/users', {
      headers: {
        Authorization: `Bearer ${token}` ,
        Admin: true
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error al obtener la lista de usuarios:', error);
      throw error;
    });
  }

  
  

  createUser(username: string,password: string): Observable<boolean> {
    return from(
      this.axiosService.post('api/register', {username, password})
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

  

  enableUser(id: number): Observable<boolean> {

    return from(
      this.axiosService.patch(`api/users/${id}`, { 
        "isEnabled": true
      })
      .then(() => true)
      .catch(error => {
        console.error(error);
        return false;
      })
    );
  }

  disableUser(id:number): Observable<boolean>{

    return from(
      this.axiosService.patch(`api/users/${id}`, { 
        "isEnabled":false
      })
      .then(() => true)
      .catch(error => {
        console.error(error);
        return false;
      })
    );
  }

  deleteUser(id:number):Observable<boolean>{
    return from(this.axiosService.delete(`/api/users/${id}`)
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));

  }

  grantRoleUser(id:number):Observable<boolean>{
    return from(this.axiosService.patch(`/api/users/${id}`,{
      "isAdmin":true
    }
      
     )
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));

  }

  removeRoleUser(id:number):Observable<boolean>{
    return from(this.axiosService.patch(`/api/users/${id}`,{
      "isAdmin":false
    })
    .then(()=>{
      return true; 
    })
    .catch(error =>{
      console.log(error);
      return false;
    }));

  }
}

 


