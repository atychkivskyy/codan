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
    this.authService.login(this.username, this.password).subscribe(
      (response: boolean | string) => {
        if (response === true) {
          this.authService.checkUserEnabled(this.username).subscribe(
            (response) => {
              if (response === true) {
                this.router.navigate(['/graphics']);
              } else {
                this.error = response as string;
              }
            },
          );
        } else {
          this.error = response as string;
        }
      },
      (error) => {
        console.error(error);
        this.error = 'Error interno del servidor';
      }
    );
  }
  
}
