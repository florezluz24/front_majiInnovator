import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioRespuesta } from '../services/auth.service';

/**
 * Componente del menú principal para usuarios normales
 * Proporciona acceso a las funcionalidades disponibles para usuarios regulares
 */
@Component({
  selector: 'app-menu-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-usuario.html',
  styleUrls: ['./menu-usuario.scss']
})
export class MenuUsuarioComponent implements OnInit {
  /** Usuario actualmente autenticado */
  protected currentUser: UsuarioRespuesta | null = null;

  /**
   * Constructor del componente de menú de usuario
   * @param router Servicio de navegación de Angular
   * @param authService Servicio de autenticación
   */
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Inicialización del componente
   * Verifica el acceso del usuario y carga sus datos
   */
  ngOnInit(): void {
    this.verifyUserAccess();
    this.loadCurrentUser();
  }

  /**
   * Verifica que el usuario tenga acceso a esta página
   * Redirige a login si no está autenticado o a admin si es administrador
   */
  private verifyUserAccess(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    const userRole = this.authService.getUserRole();
    if (userRole === 'Administrador') {
      this.router.navigate(['/admin']);
      return;
    }
  }

  /**
   * Carga los datos del usuario actualmente autenticado
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Navega a la página de responder encuestas
   */
  protected onResponderEncuestas(): void {
    this.router.navigate(['/menu/encuestas']);
  }

  /**
   * Navega al catálogo de productos
   */
  protected onIrCatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  /**
   * Cierra la sesión del usuario actual
   * Muestra confirmación antes de proceder
   */
  protected onLogout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Recarga la página actual
   * @param event Evento del click para prevenir comportamiento por defecto
   */
  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }
}