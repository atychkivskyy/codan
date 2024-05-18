import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Importa Router para redirigir

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class RegisterPage implements OnInit {

  username: string='';
  email: string='';
  password: string='';
  password2: string='';
  error: string = ''; 

  ngOnInit(): void {
    
  }

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if(this.username==''){
      this.error = 'Rellena todos los datos';
      return;
    }else if(this.email==''){
      this.error = 'Rellena todos los datos';
      return;
    }else if(this.password==''){
      this.error = 'Rellena todos los datos';
      return;
    }else if(this.password2==''){
      this.error = 'Rellena todos los datos';
      return;
    }
    if (this.password !== this.password2) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.createUser(this.username, this.password)
    .subscribe(success => {
      if (success) {
        // Registro exitoso, redirigir a la página de inicio de sesión
        this.error = 'Tu cuenta ha sido creada. Contacta con el administrador para activarla';
      } else {
        // Error en el registro, mostrar mensaje de error
        this.error = 'Error al registrarse';
      }
    });

  }
  
  
}
