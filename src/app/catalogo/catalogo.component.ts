import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogoService, CatalogoCompletoDTO, ModeloCompletoDTO, ImagenDTO } from '../services/catalogo.service';
import { AuthService } from '../services/auth.service';

/**
 * Componente para mostrar el catálogo de productos
 * Permite visualizar marcas, modelos, características e imágenes de celulares
 */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  /** Lista completa del catálogo */
  protected catalogo: CatalogoCompletoDTO[] = [];
  /** Estado de carga del catálogo */
  protected isLoading = false;
  /** Mensaje de error local */
  protected errorMessage = '';
  /** Modelo seleccionado para mostrar detalles */
  protected modeloSeleccionado: ModeloCompletoDTO | null = null;
  /** Imágenes del modelo seleccionado */
  protected imagenesModelo: ImagenDTO[] = [];
  /** Estado de carga de imágenes */
  protected cargandoImagenes = false;

  /**
   * Constructor del componente de catálogo
   * @param catalogoService Servicio para obtener datos del catálogo
   * @param authService Servicio de autenticación
   * @param router Servicio de navegación
   */
  constructor(
    private catalogoService: CatalogoService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Inicialización del componente
   * Verifica el acceso del usuario y carga el catálogo
   */
  ngOnInit(): void {
    this.verifyUserAccess();
    this.cargarCatalogo();
  }

  /**
   * Verifica que el usuario tenga acceso a esta página
   * Redirige a login si no está autenticado
   */
  private verifyUserAccess(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
  }

  /**
   * Carga el catálogo completo desde el backend
   */
  private cargarCatalogo(): void {
    console.log('Iniciando carga del catálogo...');
    this.isLoading = true;
    this.errorMessage = '';

    this.catalogoService.obtenerCatalogoCompleto().subscribe({
      next: (catalogo) => {
        console.log('Catálogo recibido:', catalogo);
        this.catalogo = catalogo;
        this.isLoading = false;
        console.log('Estado de carga actualizado a false');
      },
      error: (error) => {
        console.error('Error al cargar catálogo:', error);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el catálogo. Intenta nuevamente.';
      }
    });
  }

  /**
   * Selecciona un modelo para mostrar sus detalles e imágenes
   * @param modelo Modelo seleccionado
   */
  protected seleccionarModelo(modelo: ModeloCompletoDTO): void {
    this.modeloSeleccionado = modelo;
    this.cargarImagenesModelo(modelo.id);
  }

  /**
   * Carga las imágenes de un modelo específico
   * @param modeloId Identificador del modelo
   */
  private cargarImagenesModelo(modeloId: number): void {
    this.cargandoImagenes = true;
    this.imagenesModelo = [];

    this.catalogoService.obtenerImagenesPorModelo(modeloId).subscribe({
      next: (imagenes) => {
        this.imagenesModelo = imagenes;
        this.cargandoImagenes = false;
      },
      error: (error) => {
        this.cargandoImagenes = false;
        console.error('Error al cargar imágenes:', error);
      }
    });
  }

  /**
   * Cierra el modal de detalles del modelo
   */
  protected cerrarDetalles(): void {
    this.modeloSeleccionado = null;
    this.imagenesModelo = [];
  }

  /**
   * Formatea el precio para mostrar con formato de moneda
   * @param precio Precio a formatear
   * @returns Precio formateado como moneda
   */
  protected formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  /**
   * Navega de vuelta al menú principal
   */
  protected volverAlMenu(): void {
    this.router.navigate(['/menu']);
  }

  /**
   * Recarga el catálogo
   */
  protected recargarCatalogo(): void {
    this.cargarCatalogo();
  }

  /**
   * Obtiene la clase CSS para el estado de disponibilidad
   * @param disponible Estado de disponibilidad del modelo
   * @returns Clase CSS correspondiente
   */
  protected getDisponibilidadClass(disponible: boolean): string {
    return disponible ? 'text-success' : 'text-danger';
  }

  /**
   * Obtiene el texto para el estado de disponibilidad
   * @param disponible Estado de disponibilidad del modelo
   * @returns Texto correspondiente al estado
   */
  protected getDisponibilidadText(disponible: boolean): string {
    return disponible ? 'Disponible' : 'Agotado';
  }

  /**
   * Método para debuggear el estado del componente
   */
  protected debugEstado(): void {
    console.log('=== ESTADO DEL COMPONENTE ===');
    console.log('isLoading:', this.isLoading);
    console.log('errorMessage:', this.errorMessage);
    console.log('catalogo:', this.catalogo);
    console.log('catalogo.length:', this.catalogo.length);
    console.log('modeloSeleccionado:', this.modeloSeleccionado);
    console.log('cargandoImagenes:', this.cargandoImagenes);
    console.log('imagenesModelo:', this.imagenesModelo);
    console.log('imagenesModelo.length:', this.imagenesModelo.length);
    console.log('============================');
  }
}
