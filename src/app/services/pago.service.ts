import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageAlert } from '../shared/message-alert/message-alert.component';

/**
 * Interfaz para crear un pago
 */
export interface PagoDTO {
  /** ID del usuario que realiza el pago */
  usuarioId: number;
  /** Valor del pago */
  valor: number;
  /** Últimos 4 dígitos de la tarjeta de crédito */
  ultimosCuatroDigitosTarjeta: string;
  /** Estado del pago (por defecto "Completado") */
  estado?: string;
}

/**
 * Interfaz para la respuesta de un pago creado
 */
export interface PagoRespuestaDTO {
  /** Identificador único del pago */
  id: number;
  /** ID del usuario que realizó el pago */
  usuarioId: number;
  /** Valor del pago */
  valor: number;
  /** Últimos 4 dígitos de la tarjeta de crédito */
  ultimosCuatroDigitosTarjeta: string;
  /** Fecha del pago */
  fechaPago: string;
  /** Estado del pago */
  estado: string;
}

/**
 * Servicio para la gestión de pagos
 * Maneja la creación de pagos en el sistema
 */
@Injectable({
  providedIn: 'root'
})
export class PagoService {
  /** URL base del backend API */
  private readonly baseUrl = 'https://localhost:7166/api';

  /** Subject para manejar mensajes de alerta globales */
  private messageSubject = new BehaviorSubject<MessageAlert | null>(null);
  /** Observable público para suscribirse a los mensajes */
  public message$ = this.messageSubject.asObservable();

  /** Subject para manejar el estado de carga global */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Observable público para suscribirse al estado de carga */
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Constructor del servicio de pago
   * @param http Cliente HTTP de Angular para realizar peticiones al backend
   */
  constructor(private http: HttpClient) { }

  // ==================== MÉTODOS DE MENSAJES ====================
  
  /**
   * Muestra un mensaje de éxito al usuario
   * @param mensaje Texto del mensaje a mostrar
   * @param titulo Título opcional del mensaje
   */
  mostrarMensajeExito(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'success',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  /**
   * Muestra un mensaje de error al usuario
   * @param mensaje Texto del mensaje de error
   * @param titulo Título opcional del mensaje
   */
  mostrarMensajeError(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'error',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  /**
   * Limpia el mensaje actual de la pantalla
   */
  limpiarMensaje(): void {
    this.messageSubject.next(null);
  }

  // ==================== MÉTODOS DE ESTADO DE CARGA ====================
  
  /**
   * Establece el estado de carga global
   * @param loading true para mostrar indicador de carga, false para ocultarlo
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Obtiene el estado actual de carga
   * @returns true si está cargando, false en caso contrario
   */
  getLoading(): boolean {
    return this.loadingSubject.value;
  }

  // ==================== MÉTODOS DE PAGO ====================

  /**
   * Crea un nuevo pago en el sistema
   * @param pago Datos del pago a crear
   * @returns Observable con la respuesta del pago creado
   */
  crearPago(pago: PagoDTO): Observable<PagoRespuestaDTO> {
    this.setLoading(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PagoRespuestaDTO>(`${this.baseUrl}/Pago`, pago, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // ==================== MÉTODOS DE MANEJO DE ERRORES ====================
  
  /**
   * Maneja los errores HTTP y los convierte en mensajes de usuario
   * @param error Error HTTP recibido del backend
   * @returns Observable que emite un error con información estructurada
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);
    
    // Si es un error de conexión (status 0), mostrar mensaje básico
    if (error.status === 0) {
      const errorData = { 
        message: 'No se puede conectar con el servidor. Verifica que esté ejecutándose.', 
        title: 'Error de Conexión' 
      };
      this.mostrarMensajeError(errorData.message, errorData.title);
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
    
    // Mostrar el mensaje de error automáticamente
    this.mostrarMensajeError(finalError.message, finalError.title);
    
    return throwError(() => new Error(JSON.stringify(finalError)));
  }
}

