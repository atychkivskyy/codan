import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AxiosServiceService } from "../axios-service.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class HomePage implements OnInit {

  constructor(private router: Router, private axiosService: AxiosServiceService) { }

  isAdmin: String = 'No';

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true' ? 'Yes' : 'No';
  }

  goToGraphicsPage(){
    this.router.navigate(['/graphics']);
  }

  limpiarLocalStorage() {
    this.axiosService.clearLocalStorage(); // Llama a la función para limpiar el localStorage
  }

}
