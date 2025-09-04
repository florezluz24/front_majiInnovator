import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioCompleto } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-visualizar-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-usuarios.html',
  styleUrls: ['./visualizar-usuarios.scss']
})
export class VisualizarUsuariosComponent implements OnInit {
  protected usuarios: UsuarioCompleto[] = [];
  protected isLoading$: Observable<boolean>;
  protected errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoading$ = this.authService.loading$;
  }

  ngOnInit(): void {
    this.verifyAdminAccess();
    this.cargarUsuarios();
  }

  private verifyAdminAccess(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    const userRole = this.authService.getUserRole();
    if (userRole !== 'Administrador') {
      this.router.navigate(['/menu']);
      return;
    }
  }

  private cargarUsuarios(): void {
    this.errorMessage = '';

    this.authService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.authService.setLoading(false);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los usuarios';
      }
    });
  }

  protected onVolverAdmin(): void {
    this.router.navigate(['/admin']);
  }

  protected onReintentar(): void {
    this.cargarUsuarios();
  }

  protected onEditarUsuario(usuario: UsuarioCompleto): void {
    alert(`Editar usuario: ${usuario.nombre}\n\nEsta funcionalidad se implementará próximamente.`);
  }

  protected onEliminarUsuario(usuario: UsuarioCompleto): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${usuario.nombre}"?`)) {
      alert(`Usuario ${usuario.nombre} eliminado.\n\nEsta funcionalidad se implementará próximamente.`);
    }
  }

  protected onExportarUsuarios(): void {
    alert('Funcionalidad de exportación de usuarios');
  }

  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }
}