import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Encuesta, RespuestaEncuestaDTO, UsuarioRespuesta } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-responder-encuestas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './responder-encuestas.html',
  styleUrls: ['./responder-encuestas.scss']
})
export class ResponderEncuestasComponent implements OnInit {
  protected encuestas: Encuesta[] = [];
  protected respuestas: string[] = [];
  protected isLoading$: Observable<boolean>;
  protected errorMessage = '';
  protected successMessage = '';
  private currentUser: UsuarioRespuesta | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoading$ = this.authService.loading$;
  }

  ngOnInit(): void {
    this.verifyUserAccess();
    this.loadCurrentUser();
    this.cargarEncuestas();
  }

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

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  private cargarEncuestas(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.obtenerEncuestas().subscribe({
      next: (encuestas) => {
        this.encuestas = encuestas;
        this.respuestas = new Array(encuestas.length).fill('');
        this.authService.setLoading(false);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las encuestas';
      }
    });
  }

  protected onEnviarEncuesta(): void {
    if (!this.currentUser) {
      this.errorMessage = 'Usuario no encontrado';
      return;
    }

    // Validar que todas las preguntas tengan respuesta
    const respuestasVacias = this.respuestas.some(respuesta => !respuesta.trim());
    if (respuestasVacias) {
      this.errorMessage = 'Debes responder todas las preguntas';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    // Crear respuestas para cada pregunta
    const respuestasEncuesta: RespuestaEncuestaDTO[] = this.encuestas.map((encuesta, index) => ({
      usuarioId: this.currentUser!.id,
      pregunta: encuesta.pregunta,
      respuesta: this.respuestas[index]
    }));

    // Enviar cada respuesta
    let respuestasEnviadas = 0;
    const totalRespuestas = respuestasEncuesta.length;

    respuestasEncuesta.forEach((respuesta, index) => {
      this.authService.crearRespuestaEncuesta(respuesta).subscribe({
        next: (respuestaCreada) => {
          respuestasEnviadas++;
          if (respuestasEnviadas === totalRespuestas) {
            this.successMessage = '¡Encuesta enviada exitosamente! Gracias por tu participación.';
            this.limpiarFormulario();
          }
        },
        error: (error) => {
          this.errorMessage = 'Error al enviar la encuesta';
        }
      });
    });
  }

  private limpiarFormulario(): void {
    this.respuestas = new Array(this.encuestas.length).fill('');
  }

  protected onVolverMenu(): void {
    this.router.navigate(['/menu']);
  }

  protected onReintentar(): void {
    this.cargarEncuestas();
  }

  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }
}