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
  },
  
];
