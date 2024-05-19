import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  currentUser: any;
  isAdmin: String = 'No';

  constructor() { }

  ngOnInit() {
    this.currentUser = {
      username: localStorage.getItem('username'),
      isEnabled: localStorage.getItem('isEnabled'), // Ajusta esto según cómo almacenes el estado de activación del usuario
      isAdmin: localStorage.getItem('isAdmin') === 'true' ? 'Yes' : 'No', // Convierte el valor de isAdmin a "Yes" o "No"
      createdAt: localStorage.getItem('createdAt')
    };
    this.isAdmin = localStorage.getItem('isAdmin') === 'true' ? 'Yes' : 'No';
  }

}
