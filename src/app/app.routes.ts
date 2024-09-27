import { Route } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';

export const routes: Route[] = [
     { path: 'auth', component: AuthComponent  },
     { path: 'home', component: HomeComponent, canActivate: [authGuard] },
     { path: '', redirectTo: '/home', pathMatch: 'full' }, 
     { path: '**', redirectTo: '/auth' } 
  ];
  
