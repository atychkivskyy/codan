import { Routes } from '@angular/router';

export const routes: Routes = [

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'management',
    loadComponent: () => import('./management/management.page').then( m => m.managementPage)
  },
  {
    path: 'graphics',
    loadComponent: () => import('./graphics/graphics.page').then( m => m.GraphicsPage)
  },  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'tyc',
    loadComponent: () => import('./tyc/tyc.page').then( m => m.TycPage)
  },

  
];
