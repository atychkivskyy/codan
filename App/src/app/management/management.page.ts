import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class managementPage implements OnInit {

  username1: string ='';
  username2: string = '';
  username3: string = '';
  password: string='';
  password2: string='';
  message1:string='';
  message2:string='';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  createUser(){
    if (this.password !== this.password2) {   
      this.message1 = 'Las contraseñas no coinciden'; 
      return; 
    }
    this.authService.checkUsername(this.username1).subscribe(
      (response: boolean |string) =>{
        if(response==='Usuario no existente'){
          this.authService.createUser(this.username1, this.password).subscribe(
            (response: boolean) =>{
              if(response===true){
                this.message1='Usuario creado exitosamente';
              }else {
                this.message1 = 'Error al crear el usuario. Por favor, inténtelo de nuevo más tarde.';
              }
            }
          );
        }else {
          this.message1 = 'Usuario existente'; 
        }
      }
    )
    
  }

  enableUser(){
    this.authService.checkUsername(this.username2).subscribe(
      (response: boolean |string) =>{
        if(response==='Usuario no existente'){
          this.message2=response;
        }else {
          this.authService.enableUser(this.username2).subscribe(
            (response: boolean |string) =>{
              if(response===true){
                this.message2='Usuario habilitado';
              }
            }
          )
        }
      }
    )
  }

  disenableUser(){

    
  }
}

  

