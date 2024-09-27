import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [HomeComponent, CommonModule,ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit{
  userForm: FormGroup;
  isEditMode = true; // Suponemos que siempre estamos en modo edición
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {

    this.decodeToken();
    
    // Cargar los datos del usuario
    this.loadUserData();
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('authToken'); 
    console.log(token);
    if (token) {
      const decodedToken = jwtHelper.decodeToken(token);
      console.log(decodedToken);
      this.userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }
  }
  
  loadUserData(): void {
    // Aquí deberías obtener los datos del usuario por su ID
    console.log(this.userId);
    this.authService.getUserById(this.userId!).subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;

      // Actualizar el usuario a través del servicio
      this.authService.updateUser(this.userId!, updatedUser).subscribe(() => {
        this.router.navigate(['/home']); // Redirigir después de actualizar
      });
    }
  }
  onDelete(): void {
    if (this.userId) {
      if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        this.authService.deleteUser(this.userId).subscribe(() => {
          alert('Usuario eliminado con éxito');
          this.authService.logout();  
          this.router.navigate(['/auth']); // Redirigir después de borrar
        }, error => {
          console.error('Error al eliminar el usuario:', error);
          alert('Ocurrió un error al intentar eliminar el usuario.');
        });
      }
    }
  }
  
}
