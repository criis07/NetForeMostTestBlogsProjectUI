import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { BlogEntry } from '../interfaces/BlogEntry';
import { Category } from '../interfaces/Category';

@Component({
  selector: 'app-blog-entry-form',
  templateUrl: './blog-entry-form.component.html',
  styleUrls: ['./blog-entry-form.component.css']
})
export class BlogEntryFormComponent implements OnInit {
  entryForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  entryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.entryForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      publicationDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verifica si estamos en modo edición o creación
    this.entryId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;

    // Cargar categorías para el dropdown
    this.loadCategories();

    if (this.entryId) {
      this.isEditMode = true;
      this.blogService.getEntryById(this.entryId).subscribe(entry => {
        this.entryForm.patchValue(entry);
      });
    }
  }

  // Cargar categorías desde el servicio
  loadCategories(): void {
    this.blogService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.entryForm.valid) {
      const entryData: BlogEntry = this.entryForm.value;
      
      if (this.isEditMode) {
        // Editar entrada
        this.blogService.updateEntry(this.entryId!, entryData).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        // Crear nueva entrada
        this.blogService.createEntry(entryData).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
