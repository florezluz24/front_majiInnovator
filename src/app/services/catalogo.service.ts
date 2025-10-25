import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Interfaz para representar una característica de un modelo de celular
 */
export interface CaracteristicaCompletaDTO {
  /** Identificador único de la característica */
  id: number;
  /** Nombre de la característica (ej: "Pantalla", "Memoria RAM") */
  nombre: string;
  /** Valor de la característica (ej: "6.1 pulgadas", "8GB") */
  valor: string;
}

/**
 * Interfaz para representar un modelo de celular completo
 */
export interface ModeloCompletoDTO {
  /** Identificador único del modelo */
  id: number;
  /** Nombre del modelo (ej: "iPhone 15 Pro") */
  nombre: string;
  /** Descripción del modelo */
  descripcion?: string;
  /** Precio del modelo */
  precio: number;
  /** Indica si el modelo está disponible */
  disponible: boolean;
  /** Lista de características del modelo */
  caracteristicas: CaracteristicaCompletaDTO[];
}

/**
 * Interfaz para representar una marca de celular completa
 */
export interface CatalogoCompletoDTO {
  /** Identificador único de la marca */
  id: number;
  /** Nombre de la marca (ej: "Apple", "Samsung") */
  nombre: string;
  /** Descripción de la marca */
  descripcion?: string;
  /** Lista de modelos de la marca */
  modelos: ModeloCompletoDTO[];
}

/**
 * Interfaz para representar una imagen de un modelo
 */
export interface ImagenDTO {
  /** Identificador único de la imagen */
  id: number;
  /** URL completa de la imagen en Azure Storage */
  rutaImagen: string;
  /** Identificador del modelo al que pertenece la imagen */
  modeloId: number;
  /** Nombre del modelo (opcional, para información adicional) */
  nombreModelo?: string;
}

/**
 * Servicio para la gestión del catálogo de productos
 * Maneja la obtención de marcas, modelos, características e imágenes
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  /** URL base del backend API */
  private readonly baseUrl = 'https://localhost:7166/api';

  /**
   * Constructor del servicio de catálogo
   * @param http Cliente HTTP de Angular para realizar peticiones al backend
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene el catálogo completo con todas las marcas, modelos y características
   * @returns Observable con la lista completa del catálogo
   */
  obtenerCatalogoCompleto(): Observable<CatalogoCompletoDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<CatalogoCompletoDTO[]>(`${this.baseUrl}/Catalogo/completo`, { headers });
  }

  /**
   * Obtiene todas las imágenes de un modelo específico
   * @param modeloId Identificador del modelo
   * @returns Observable con la lista de imágenes del modelo
   */
  obtenerImagenesPorModelo(modeloId: number): Observable<ImagenDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<ImagenDTO[]>(`${this.baseUrl}/Catalogo/imagenes/${modeloId}`, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Obtiene todas las imágenes de todos los modelos
   * @returns Observable con la lista completa de imágenes
   */
  obtenerTodasLasImagenes(): Observable<ImagenDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<ImagenDTO[]>(`${this.baseUrl}/Catalogo/imagenes`, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Maneja los errores HTTP y los convierte en mensajes de usuario
   * @param error Error HTTP recibido del backend
   * @returns Observable que emite un error con información estructurada
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Si es un error de conexión (status 0), mostrar mensaje básico
    if (error.status === 0) {
      const errorData = { 
        message: 'No se puede conectar con el servidor. Verifica que esté ejecutándose.', 
        title: 'Error de Conexión' 
      };
      return throwError(() => new Error(JSON.stringify(errorData)));
    }

    // Para otros errores, usar la información del backend
    let errorMessage = 'Error desconocido';
    let errorTitle = 'Error';

    if (error.error) {
      // Si el backend devuelve un mensaje estructurado
      if (error.error.message && error.error.title) {
        errorMessage = error.error.message;
        errorTitle = error.error.title;
      }
      // Si el backend devuelve solo un mensaje
      else if (typeof error.error === 'string') {
        errorMessage = error.error;
        errorTitle = `Error ${error.status}`;
      }
      // Si el backend devuelve un objeto con solo message
      else if (error.error.message) {
        errorMessage = error.error.message;
        errorTitle = `Error ${error.status}`;
      }
    }

    // Fallback si no hay información del backend
    if (errorMessage === 'Error desconocido') {
      errorMessage = `Error del servidor: ${error.status} ${error.statusText}`;
      errorTitle = `Error ${error.status}`;
    }

    const finalError = { message: errorMessage, title: errorTitle };
    
    return throwError(() => new Error(JSON.stringify(finalError)));
  }
}
