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
  error: string = ''; 

  ngOnInit(): void {
    
  }

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if(this.username==''){
      this.error = 'Rellena todos los datos';
      return;
    }else if(this.password==''){
      this.error = 'Rellena todos los datos';
      return;
    }
    this.authService.login(this.username, this.password).subscribe(
      (response: boolean | string) => {
      if (response === true) {
        this.router.navigate(['/graphics']);
      } else {
        this.error = "Error al iniciar sesión";
      }
      },
      (error) => {
        console.error(error);
        this.error = 'Error al iniciar sesión';
      }
    );
  }
  
}
