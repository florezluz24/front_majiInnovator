import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioRespuesta } from '../services/auth.service';

/**
 * Componente del menú principal para administradores
 * Proporciona acceso a las funcionalidades administrativas del sistema
 */
@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-menu.html',
  styleUrls: ['./admin-menu.scss']
})
export class AdminMenuComponent implements OnInit {
  /** Usuario administrador actualmente autenticado */
  protected currentUser: UsuarioRespuesta | null = null;

  /**
   * Constructor del componente de menú de administrador
   * @param router Servicio de navegación de Angular
   * @param authService Servicio de autenticación
   */
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Inicialización del componente
   * Verifica el acceso de administrador y carga los datos del usuario
   */
  ngOnInit(): void {
    this.verifyAdminAccess();
    this.loadCurrentUser();
  }

  /**
   * Verifica que el usuario sea administrador
   * Redirige a login si no está autenticado o a menú de usuario si no es admin
   */
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

  /**
   * Carga los datos del administrador actualmente autenticado
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Navega a la página de gestión de encuestas
   */
  protected onVisualizarEncuestas(): void {
    this.router.navigate(['/admin/encuestas']);
  }

  /**
   * Navega a la página de gestión de usuarios
   */
  protected onVisualizarUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  /**
   * Navega a la página de resultados (funcionalidad pendiente de implementar)
   */
  protected onVerResultados(): void {
    // TODO: Implementar navegación a ver resultados
    console.log('Navegar a ver resultados');
  }

  /**
   * Exporta los datos del sistema (funcionalidad pendiente de implementar)
   */
  protected onExportar(): void {
    // TODO: Implementar funcionalidad de exportar
    console.log('Exportar datos');
  }

  /**
   * Recarga la página actual
   * @param event Evento del click para prevenir comportamiento por defecto
   */
  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }

  /**
   * Cierra la sesión del administrador actual
   * Muestra confirmación antes de proceder
   */
  protected onLogout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}