import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ValidarAccesoDTO } from '../services/auth.service';
import { MessageAlertComponent } from '../shared/message-alert/message-alert.component';

/**
 * Componente para el inicio de sesión de usuarios
 * Permite a los usuarios autenticarse en el sistema
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageAlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /** Título de la empresa */
  protected readonly title = 'MAJI Innovators S.A.S';
  /** Subtítulo descriptivo del sistema */
  protected readonly subtitle = 'Sistema Integral de Encuestas y Comercio Electrónico';
  
  /** Datos del formulario de login */
  protected loginData: ValidarAccesoDTO = {
    cedula: '',
    password: ''
  };

  /** Estado de carga del formulario */
  protected isLoading = false;
  /** Mensaje de error local del formulario */
  protected errorMessage = '';

  /**
   * Constructor del componente de login
   * @param router Servicio de navegación de Angular
   * @param authService Servicio de autenticación
   */
  constructor(
    private router: Router,
    protected authService: AuthService
  ) {}

  /**
   * Inicialización del componente
   * Se suscribe a los mensajes del servicio de autenticación
   */
  ngOnInit(): void {
    // Suscribirse a los mensajes del servicio
    this.authService.message$.subscribe(mensaje => {
      if (mensaje) {
        // Los mensajes se muestran automáticamente por el servicio
        // Solo necesitamos limpiar el mensaje de error local si es un mensaje de éxito
        if (mensaje.type === 'success') {
          this.errorMessage = '';
        }
      }
    });
  }

  /**
   * Procesa el formulario de login
   * Valida los datos y autentica al usuario
   */
  protected onLogin(): void {
    // Validar que los campos no estén vacíos
    if (!this.loginData.cedula.trim()) {
      this.errorMessage = 'La cédula es obligatoria';
      return;
    }

    if (!this.loginData.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria';
      return;
    }

    // Validar que la cédula sea numérica
    if (!/^\d+$/.test(this.loginData.cedula.trim())) {
      this.errorMessage = 'La cédula debe ser numérica';
      return;
    }

    // Limpiar mensaje de error previo
    this.errorMessage = '';
    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.validarAcceso(this.loginData).subscribe({
      next: (usuario) => {
        this.isLoading = false;
        
        // Mostrar mensaje de éxito
        this.authService.mostrarMensajeExito(
          `Bienvenido ${usuario.nombre}`,
          'Acceso exitoso'
        );

        // Guardar información del usuario usando el servicio
        this.authService.login(usuario);

        // Redirigir según el rol del usuario
        setTimeout(() => {
          if (usuario.rol === 'Administrador') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/menu']);
          }
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        // El error ya se muestra automáticamente por el servicio
        // Solo necesitamos manejar el estado local
        
        // Limpiar contraseña por seguridad
        this.loginData.password = '';
        
        // Mostrar mensaje de error local si es necesario
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.title === 'Error de Conexión') {
            this.errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
          }
        } catch {
          // Si no se puede parsear el error, usar mensaje genérico
          this.errorMessage = 'Error al intentar iniciar sesión';
        }
      }
    });
  }

  /**
   * Navega a la página de registro
   */
  protected onRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Limpia el mensaje de error local
   */
  protected limpiarError(): void {
    this.errorMessage = '';
  }

  /**
   * Se ejecuta cuando cambia el campo de cédula
   * Limpia errores para mejorar la experiencia del usuario
   */
  protected onCedulaChange(): void {
    if (this.errorMessage) {
      this.limpiarError();
    }
  }

  /**
   * Se ejecuta cuando cambia el campo de contraseña
   * Limpia errores para mejorar la experiencia del usuario
   */
  protected onPasswordChange(): void {
    if (this.errorMessage) {
      this.limpiarError();
    }
  }
}
