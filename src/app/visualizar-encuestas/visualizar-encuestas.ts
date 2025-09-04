import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, Encuesta } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-visualizar-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-encuestas.html',
  styleUrls: ['./visualizar-encuestas.scss']
})
export class VisualizarEncuestasComponent implements OnInit {
  protected encuestas: Encuesta[] = [];
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
    this.cargarEncuestas();
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

  private cargarEncuestas(): void {
    this.errorMessage = '';

    this.authService.obtenerEncuestas().subscribe({
      next: (encuestas) => {
        this.encuestas = encuestas;
        this.authService.setLoading(false);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las encuestas';
      }
    });
  }

  protected onVolverAdmin(): void {
    this.router.navigate(['/admin']);
  }

  protected onReintentar(): void {
    this.cargarEncuestas();
  }

  protected onVerEstadisticas(encuesta: Encuesta, index: number): void {
    alert(`Estadísticas para: "${encuesta.pregunta}"`);
  }

  protected onExportarEncuestas(): void {
    alert('Funcionalidad de exportación');
  }

  protected onVerTodasEstadisticas(): void {
    alert('Estadísticas generales');
  }

  protected onRefresh(event: Event): void {
    event.preventDefault();
    window.location.reload();
  }
}