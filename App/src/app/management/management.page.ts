import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertInput, IonicModule } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';


interface User {
  username: string;
  isEnabled: boolean;
  isAdmin: boolean;
}

interface Item{
  username: string;
  isEnabled: boolean;
  isAdmin: boolean;
}

@Component({
  selector: 'app-prueba',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class managementPage implements OnInit {

  users: Item[] = []; 

  public alertButtons = ['Create User'];
  public alertInputs: AlertInput[] = [
    {
      name:'username',
      placeholder: 'username (max 8 characters)',
      type:'text',
      attributes: {
        maxlength: 8,
      },
    },
    {
      name:'password',
      placeholder: 'password (max 12 characters)',
      type:'password',
      attributes: {
        maxlength: 12,
      },
    },
    {
      name:'password2',
      placeholder: 'repeate password (max 12 characters)',
      type:'password',
      attributes: {
        maxlength: 12,
      },
    },
    
  ];
  
  constructor(private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
    this.getUsers();
  }

  async openAlert() {
    const alert = await this.alertController.create({
      header: 'Add new user',
      inputs: this.alertInputs,
      buttons: [
        {
          text: 'OK',
          handler: (data) => {
            this.createUser(data);
          }
        }
      ]
    });

    await alert.present();
  }

  createUser(data:any){
    this.authService.createUser(data.username,data.password)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario creado:', data.user);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al eliminar el usuario:', error);
      }
    );

  }

  
  getUsers() {
    this.authService.getUsers()
      .then(users => {
        console.log('Usuarios obtenidos:', users);
        let lista: Item[] = []; // Inicializa lista como una matriz de Item
        users.forEach((user: User) => {
          let item: Item = { // Crea un nuevo objeto Item
            username: user.username,
            isEnabled: user.isEnabled, 
            isAdmin: user.isAdmin 
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
          console.log('Usuario al actualizar usuario', user.username);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al actualizar usuario:', error);
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
        console.error('Error al actualizar  usuario:', error);
      }
    );
  }

  removeRoleUser(user:Item){
      this.authService.removeRoleUser(user.username)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario actualizado:', user.username);
          this.getUsers();
        }
      },
      error => {
        console.error('Error al actualizar  usuario:', error);
      }
    );
  }

  grantRoleUser(user:Item){
    this.authService.grantRoleUser(user.username)
  .subscribe(
    (response: boolean) => {
      if(response){
        console.log('Usuario actualizado:', user.username);
        this.getUsers();
      }
    },
    error => {
      console.error('Error al actualizar  usuario:', error);
    }
  );
  
}

  toggleUserEnabled(user: Item) {
    const newStatus = user.isEnabled;
    if (newStatus) {
      this.enableUser(user);
    } else {
      this.disableUser(user);
    }
  }

  toggleUserAdmin(user: Item){
    const newStatus = user.isAdmin;
    if (newStatus) {
      this.grantRoleUser(user);
    } else {
      this.removeRoleUser(user);
    }
  }
  

  onIonInfinite(ev:any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  
}
