import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogEntry } from '../Interfaces/BlogEntry';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: BlogEntry[] = [];
  showDeleteModal = false;
  blogIdToDelete: number | null = null;
  
  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.loadBlogs();
    
  }

  loadBlogs(): void {
    this.blogService.getBlogEntries().subscribe({
      next: (data) => {
        this.blogs = data;
      },
      error: (error) => {
        console.error('Error fetching blogs:', error);
      }
    });
  }
  editBlog(blog: any) {
    console.log("Hola desde el enroute");
    // Aquí asumo que la ruta de edición es '/blogEntries/:id'
    this.router.navigate(['/blogEntries', blog]);
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
        // Eliminar el blog de la lista
        this.blogs = this.blogs.filter(blog => blog.blogId !== this.blogIdToDelete);
        this.closeDeleteModal();
      });
    }
  }
}
