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

  
  constructor(private authService: AuthService, private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.getUsers();
  }

  public actionSheetButtons = [
    {
      text: 'Admin Role',
      handler: () => {
        // Lógica para cambiar el rol a admin
      }
    },
    {
      text: 'Disable',
      handler: () => {
        // Lógica para deshabilitar al usuario
      }
    },
    {
      text: 'Enable',
      handler: () => {
        // Lógica para habilitar al usuario
      }
    },
    {
      text: 'Delete',
      role: 'destructive',
      handler: () => {
        // Lógica para eliminar al usuario
      }
    },
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];
  

  async openActionSheet(user: Item) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Admin Role',
          handler: () => {
            // Lógica para cambiar el rol a admin
          }
        },
        {
          text: 'Disable',
          handler: () => {
            this.disableUser(user);
          }
        },
        {
          text: 'Enable',
          handler: () => {
            this.enableUser(user);      
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteUser(user);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  getUsers() {
    this.authService.getUsers()
      .then(users => {
        console.log('Usuarios obtenidos:', users);
        let lista: Item[] = []; // Inicializa lista como una matriz de Item
        users.forEach((user: User) => {
          let item: Item = { // Crea un nuevo objeto Item
            username: user.username,
            isEnabled: user.isEnabled ? 'Yes' : 'No', // Convierte booleano a cadena
            isAdmin: user.isAdmin ? 'admin' : 'employee' // Convierte booleano a cadena
          };
          lista.push(item); // Agrega el nuevo objeto a la lista
        });
        this.users = lista; // Asigna la lista de items a this.users
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }

  deleteUser(user:Item){
    this.authService.deleteUser(user.username)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario eliminado:', user.username);
          this.users = this.users.filter(user => user.username !== user.username);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }

  enableUser(user:Item){
    this.authService.enableUser(user.username)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario eliminado:', user.username);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }

  disableUser(user:Item){
    this.authService.disableUser(user.username)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario actualizado:', user.username);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
  

  onIonInfinite(ev:any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  
}
