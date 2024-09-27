import { Route } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { BlogEntryFormComponent } from './blog-entry-form/blog-entry-form.component';

export const routes: Route[] = [
     { path: 'auth', component: AuthComponent  },
     { path: 'blogEntries', component: BlogEntryFormComponent  },
     { path: 'blogEntries/:id', component: BlogEntryFormComponent },
     { path: 'home', component: HomeComponent, canActivate: [authGuard] },
     { path: '', redirectTo: '/blogEntries', pathMatch: 'full' }, 
     { path: '**', redirectTo: '/auth' } 
  ];
  
