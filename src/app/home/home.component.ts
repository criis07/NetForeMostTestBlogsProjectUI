import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, private authService: AuthService) {}
  isOpen: boolean = false;
  isMoreOpen: boolean = false;

  logout() {
    this.authService.logout();  
    this.router.navigate(['/auth']);
  }
}
