import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioRespuesta } from '../services/auth.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-menu.html',
  styleUrls: ['./admin-menu.scss']
})
export class AdminMenuComponent implements OnInit {
  protected currentUser: UsuarioRespuesta | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verifyAdminAccess();
    this.loadCurrentUser();
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

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  protected onVisualizarEncuestas(): void {
    this.router.navigate(['/admin/encuestas']);
  }

  protected onVisualizarUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  protected onVerResultados(): void {
    // TODO: Implementar navegación a ver resultados
    console.log('Navegar a ver resultados');
  }

  protected onExportar(): void {
    // TODO: Implementar funcionalidad de exportar
    console.log('Exportar datos');
  }

  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }

  protected onLogout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}