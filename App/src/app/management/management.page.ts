import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertInput, IonicModule } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';


interface User {
  id:number,
  username: string;
  isEnabled: boolean;
  isAdmin: boolean;
}

interface Item{
  id:number,
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
      placeholder: 'Nombre de usuario (max 16 caracteres)',
      type:'text',
      attributes: {
        maxlength: 16,
      },
    },
    {
      name:'password',
      placeholder: 'Contraseña (max 12 caracteres)',
      type:'password',
      attributes: {
        maxlength: 12,
      },
    },
    {
      name:'password2',
      placeholder: 'Repetir contraseña',
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

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async openAlert() {
    const alert = await this.alertController.create({
      header: 'Añade un nuevo usuario',
      inputs: this.alertInputs,
      buttons: [
        {
          text: 'Confirmar',
          handler: (data) => {
            // Verificar que se rellenen todos los datos
          if (data.username && data.password && data.password2) {
            // Verificar que las contraseñas coincidan
            if (data.password === data.password2) {
              // Crear el usuario
              this.createUser(data);
            } else {
              // Contraseñas no coinciden, mostrar mensaje de error
              this.showAlert('Error', 'Las contraseñas no coinciden');
            }
          } else {
            // Faltan datos, mostrar mensaje de error
            this.showAlert('Error', 'Por favor, rellene todos los campos');
          }
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAlert(id:number) {
    const alert = await this.alertController.create({
      header: '¿De verdad quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.deleteUser(id);
          }
        },
        {
          text: 'No',
          handler: () => {
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
          let item: Item = { 
            id: user.id,
            username: user.username,
            isEnabled: user.isEnabled, 
            isAdmin: user.isAdmin 
          };
          lista.push(item); 
        });
        this.users = lista; 
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }

  deleteUser(id:number){

    this.authService.deleteUser(id)
    .subscribe(
      (response: boolean) => {
        if(response){
          console.log('Usuario eliminado:', id);
          this.users = this.users.filter(user => user.id !== id);
          this.getUsers();
        }
        
      },
      error => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }

  enableUser(user:Item){
    this.authService.enableUser(user.id)
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
    this.authService.disableUser(user.id)
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
      this.authService.removeRoleUser(user.id)
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
    this.authService.grantRoleUser(user.id)
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
