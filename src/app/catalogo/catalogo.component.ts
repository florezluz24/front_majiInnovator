import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  /** ID del modelo expandido actualmente */
  protected modeloExpandido: number | null = null;
  /** Map de imágenes por modelo */
  protected modeloImagenes: { [key: number]: ImagenDTO[] } = {};

  /**
   * Constructor del componente de catálogo
   * @param catalogoService Servicio para obtener datos del catálogo
   * @param authService Servicio de autenticación
   * @param router Servicio de navegación
   * @param cdr Servicio de detección de cambios de Angular
   */
  constructor(
    private catalogoService: CatalogoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Inicialización del componente
   * Verifica el acceso del usuario y carga el catálogo
   */
  ngOnInit(): void {
    const isAuthenticated = this.verifyUserAccess();
    if (isAuthenticated) {
      this.cargarCatalogo();
    }
  }

  /**
   * Verifica que el usuario tenga acceso a esta página
   * Redirige a login si no está autenticado
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  private verifyUserAccess(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  /**
   * Carga el catálogo completo desde el backend
   */
  private cargarCatalogo(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.catalogoService.obtenerCatalogoCompleto().subscribe({
      next: (catalogo) => {
        this.catalogo = catalogo;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.cargarImagenesParaModelos();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el catálogo. Intenta nuevamente.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Alterna la expansión de un modelo para mostrar sus detalles
   * @param modelo Modelo seleccionado
   */
  protected alternarExpansionModelo(modelo: ModeloCompletoDTO): void {
    if (this.modeloExpandido === modelo.id) {
      // Si ya está expandido, colapsar
      this.modeloExpandido = null;
      this.modeloSeleccionado = null;
    } else {
      // Expandir nuevo modelo
      this.modeloExpandido = modelo.id;
      this.modeloSeleccionado = modelo;
    }
  }

  /**
   * Verifica si un modelo está expandido
   * @param modeloId ID del modelo a verificar
   * @returns true si el modelo está expandido
   */
  protected esModeloExpandido(modeloId: number): boolean {
    return this.modeloExpandido === modeloId;
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.cargandoImagenes = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Cierra la expansión del modelo actual
   */
  protected cerrarDetalles(): void {
    this.modeloExpandido = null;
    this.modeloSeleccionado = null;
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
   * Carga las imágenes para todos los modelos del catálogo
   */
  private cargarImagenesParaModelos(): void {
    this.catalogo.forEach(marca => {
      marca.modelos.forEach(modelo => {
        this.catalogoService.obtenerImagenesPorModelo(modelo.id).subscribe({
          next: (imagenes) => {
            this.modeloImagenes[modelo.id] = imagenes;
          },
          error: () => {
            this.modeloImagenes[modelo.id] = [];
          }
        });
      });
    });
  }

  /**
   * Selecciona un modelo y carga sus detalles incluyendo imágenes
   * @param modelo Modelo seleccionado
   */
  protected seleccionarModelo(modelo: ModeloCompletoDTO): void {
    this.modeloSeleccionado = modelo;
    this.imagenesModelo = [];
    this.cargarImagenesModelo(modelo.id);
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
