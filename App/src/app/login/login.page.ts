import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // Importa Router para redirigir

@Component({
  selector: 'app-inicio',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class LoginPage implements OnInit {

  username: string='';
  password: string='';
  error: boolean = false; // Agrega una propiedad 'error'

  ngOnInit(): void {
    
  }

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        // Redirige a otra página si el inicio de sesión fue exitoso
        this.router.navigate(['/graphics']); 
      } else {
        // Maneja el inicio de sesión fallido
        this.error = true; // Establece 'error' como true si el inicio de sesión falla

      }
    },
    error => {
      console.error(error);
      this.error = true; // Establece 'error' como true si hay un error en la solicitud
    }
  );
  }

}
