import { Routes } from '@angular/router';

export const routes: Routes = [

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'graphics',
    loadComponent: () => import('./graphics/graphics.page').then( m => m.GraphicsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./ajustes/settings.page').then( m => m.SettingsPage)
  }
];
