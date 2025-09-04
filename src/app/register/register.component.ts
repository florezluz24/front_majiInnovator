import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UsuarioDTO } from '../services/auth.service';
import { MessageAlertComponent, MessageAlert } from '../shared/message-alert/message-alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageAlertComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  protected readonly title = 'MAJI Innovators S.A.S';
  protected readonly subtitle = 'Sistema Integral de Encuestas y Comercio Electrónico';
  
  protected registerData = {
    nombreCompleto: '',
    cedula: '',
    password: '',
    confirmPassword: ''
  };

  protected isLoading = false;
  protected alert: MessageAlert | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  protected onRegister(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.clearAlert();

    const usuarioDTO: UsuarioDTO = {
      nombre: this.registerData.nombreCompleto.trim(),
      cedula: this.registerData.cedula.trim(),
      password: this.registerData.password.trim()
    };

    this.authService.registrarUsuario(usuarioDTO).subscribe({
      next: (usuario) => {
        this.isLoading = false;
        this.showSuccessMessage('Usuario registrado exitosamente', 'Registro Completado');
        
        // Limpiar formulario
        this.registerData = {
          nombreCompleto: '',
          cedula: '',
          password: '',
          confirmPassword: ''
        };

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        
        try {
          // El servicio ya procesa el error y devuelve un mensaje estructurado
          const errorData = JSON.parse(error.message);
          this.showErrorMessage(errorData.message, errorData.title);
        } catch (parseError) {
          // Fallback si hay algún problema con el parsing
          this.showErrorMessage('Error al procesar la respuesta del servidor', 'Error del Sistema');
        }
      }
    });
  }

  protected onBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  protected onCloseAlert(): void {
    this.clearAlert();
  }





  private validateForm(): boolean {
    // Solo validación básica: campos no vacíos
    if (!this.registerData.nombreCompleto.trim()) {
      this.showErrorMessage('El nombre completo es obligatorio', 'Validación');
      return false;
    }

    if (!this.registerData.cedula.trim()) {
      this.showErrorMessage('La cédula es obligatoria', 'Validación');
      return false;
    }

    if (!this.registerData.password.trim()) {
      this.showErrorMessage('La contraseña es obligatoria', 'Validación');
      return false;
    }

    if (!this.registerData.confirmPassword.trim()) {
      this.showErrorMessage('La confirmación de contraseña es obligatoria', 'Validación');
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showErrorMessage('Las contraseñas no coinciden', 'Validación');
      return false;
    }

    return true;
  }



  private showSuccessMessage(message: string, title?: string): void {
    this.alert = {
      type: 'success',
      message,
      title
    };
    
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  private showErrorMessage(message: string, title?: string): void {
    this.alert = {
      type: 'error',
      message,
      title
    };
    
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  private clearAlert(): void {
    this.alert = null;
  }
}
