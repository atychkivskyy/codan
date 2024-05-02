import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ActionSheetController } from '@ionic/angular';


interface User {
  username: string;
  isEnabled: boolean;
  isAdmin: boolean;
}

interface Item{
  username: string;
  isEnabled: string;
  isAdmin: string;
}

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.page.html',
  styleUrls: ['./prueba.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PruebaPage implements OnInit {
  users: Item[] = []; 

  public actionSheetButtons = [
    {
      text: 'Admin Role',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Disable',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Enable',
      data: {
        action: 'share',
      },
    },
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  constructor(private authService: AuthService, private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers()
      .then(users => {
        console.log('Usuarios obtenidos:', users);
        let lista: Item[] = []; // Inicializa lista como una matriz de Item
        users.forEach((user: User) => {
          let item: Item = { // Crea un nuevo objeto Item
            username: user.username,
            isEnabled: user.isEnabled ? 'habilitado' : 'no habilitado', // Convierte booleano a cadena
            isAdmin: user.isAdmin ? 'admin' : 'no admin' // Convierte booleano a cadena
          };
          lista.push(item); // Agrega el nuevo objeto a la lista
        });
        this.users = lista; // Asigna la lista de items a this.users
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }
  

  onIonInfinite(ev:any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: this.actionSheetButtons,
    });
    await actionSheet.present();
  }
}
