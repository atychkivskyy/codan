import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Importa Router para redirigir

@Component({
  selector: 'app-registro',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  username:string=''
  name:string=''
  mail:string=''
  password:string=''
  password2:string=''

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    if (this.password !== this.password2) {
      // Manejar error: contraseñas no coinciden
      return;
    }

    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(this.username, this.name, this.mail, this.password)
      .subscribe(
        response => {
          // Registro exitoso, redirigir al usuario a la página de inicio de sesión
          this.router.navigate(['/graphics']);
        },
        error => {
          // Manejar error de registro
        }
      );
  }
}

  

