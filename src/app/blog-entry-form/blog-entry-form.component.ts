import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { BlogEntry } from '../Interfaces/BlogEntry';
import { Category } from '../Interfaces/Category';
import { HomeComponent } from "../home/home.component";
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-blog-entry-form',
  standalone: true,
  templateUrl: './blog-entry-form.component.html',
  styleUrls: ['./blog-entry-form.component.css'],
  imports: [HomeComponent, CommonModule,ReactiveFormsModule]
})
export class BlogEntryFormComponent implements OnInit {
  entryForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  entryId: number | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.entryForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]],
      categoryIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verifica si estamos en modo edición o creación
    this.decodeToken();
    this.entryId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    // Cargar categorías para el dropdown
    this.loadCategories();

    // Inicializar el formulario según el modo
  if (this.entryId) {
    this.isEditMode = true;
    this.blogService.getEntryById(this.entryId).subscribe(entry => {
      this.entryForm.patchValue(entry);
      // Si es modo edición, no hacemos categoryIds requerido
      this.entryForm.get('categoryIds')?.clearValidators();
      this.entryForm.get('categoryIds')?.updateValueAndValidity();
    });
  } else {
    // Si es modo creación, mantenemos categoryIds como requerido
    this.entryForm.get('categoryIds')?.setValidators([Validators.required]);
  }
  }
  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('authToken'); 
    console.log(token);
    if (token) {
      const decodedToken = jwtHelper.decodeToken(token);
      this.userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }
  }

  // Cargar categorías desde el servicio
  loadCategories(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    const checked = event.target.checked;
  
    // Obtén los categoryIds actuales
    const categoryIds = this.entryForm.get('categoryIds')?.value || [];
  
    if (checked) {
      // Agrega la categoría al arreglo si está seleccionada
      categoryIds.push(categoryId);
    } else {
      // Elimina la categoría del arreglo si está deseleccionada
      const index = categoryIds.indexOf(categoryId);
      if (index > -1) {
        categoryIds.splice(index, 1);
      }
    }
  
    // Actualiza el control de categoryIds con el nuevo arreglo
    this.entryForm.patchValue({ categoryIds });
  }
  
  onSubmit(): void {
    if (this.entryForm.valid) {
      const blogData = {
        ...this.entryForm.value,  // Incluye los valores del formulario
        userId: this.userId       // Agrega el ID del usuario
      };
      const entryData: BlogEntry = this.entryForm.value;
      
      if (this.isEditMode) {
        // Editar entrada
        this.blogService.updateEntry(this.entryId!, entryData).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        // Crear nueva entrada
        this.blogService.createEntry(blogData).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
