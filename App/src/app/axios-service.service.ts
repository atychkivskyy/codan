import { Injectable } from '@angular/core';
import axios, {AxiosRequestConfig, AxiosResponse} from "axios"

@Injectable({
  providedIn: 'root'
})
export class AxiosServiceService {

  constructor() { 
    axios.defaults.baseURL = "http://localhost:8826";
    axios.defaults.headers['Content-Type'] = "application/json";
    axios.interceptors.request.use(
      (config:any) =>{
        const token = this.getToken();
        if(token){
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`
        }
        return config;
      }
    );
  }

  getToken(): string |null{
    return localStorage.getItem('token');
  }

  removeToken(){
    localStorage.removeItem('token')
  }

  public get(url: string, config?: AxiosRequestConfig):Promise<AxiosResponse<any>>{
    return axios.get(url, config);
  }

  public post(url: string, data: any, config?: AxiosRequestConfig):Promise<AxiosResponse<any>>{
    return axios.post(url, data, config);
  }

  public patch(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
    return axios.patch(url, data, config);
  }
  
  public delete(url: string,config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
    return axios.delete(url,  config);
  }


}
