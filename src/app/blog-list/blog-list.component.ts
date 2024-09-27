import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogEntry } from '../Interfaces/BlogEntry';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: BlogEntry[] = [];
  filteredBlogs: BlogEntry[] = [];
  showDeleteModal = false;
  blogIdToDelete: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 6; // Cambia este valor según tus necesidades
  totalItems: number = 0;
  selectedCategory: string = '';

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogEntries().subscribe({
      next: (data) => {
        this.blogs = data;
        this.filteredBlogs = data; // Inicializa los blogs filtrados
        this.totalItems = this.filteredBlogs.length;
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      }
    });
  }

  editBlog(blog: any) {
    console.log("Hola desde el enroute");
    this.router.navigate(['/blogEntries', blog.blogId]);
  }

  openDeleteModal(blogId: number) {
    this.blogIdToDelete = blogId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.blogIdToDelete = null;
  }

  confirmDelete() {
    if (this.blogIdToDelete !== null) {
      this.blogService.deleteEntry(this.blogIdToDelete).subscribe(() => {
        this.filteredBlogs = this.filteredBlogs.filter(blog => blog.blogId !== this.blogIdToDelete);
        this.closeDeleteModal();
        this.totalItems = this.filteredBlogs.length; // Actualiza el total de elementos
      });
    }
  }

  filterByCategory(event: Event) {
    const target = event.target as HTMLSelectElement; // Asegúrate de que el evento sea un HTMLSelectElement
    this.selectedCategory = target.value; // Obtén el valor del select
    this.filteredBlogs = this.blogService.filterBlogsByCategory(this.blogs, this.selectedCategory);
    this.currentPage = 1; // Reinicia a la primera página
    this.totalItems = this.filteredBlogs.length; // Actualiza el total de elementos filtrados
  }
  

  get paginatedBlogs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBlogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
