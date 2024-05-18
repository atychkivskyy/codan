import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tyc',
  templateUrl: './tyc.page.html',
  styleUrls: ['./tyc.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TycPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
