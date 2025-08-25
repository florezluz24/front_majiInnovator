import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageAlert } from '../shared/message-alert/message-alert.component';

export interface UsuarioDTO {
  nombre: string;
  cedula: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  password: string;
  rol: string;
}

export interface ErrorResponse {
  message: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://localhost:7166/api'; // URL del backend
  
  // BehaviorSubject para manejar mensajes de alerta
  private messageSubject = new BehaviorSubject<MessageAlert | null>(null);
  public message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Métodos para mostrar diferentes tipos de mensajes
  mostrarMensajeExito(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'success',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  mostrarMensajeError(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'error',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  mostrarMensajeAdvertencia(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'warning',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  mostrarMensajeInfo(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'info',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  // Método para limpiar mensajes
  limpiarMensaje(): void {
    this.messageSubject.next(null);
  }

  // Registrar nuevo usuario
  registrarUsuario(usuario: UsuarioDTO): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Usuario>(`${this.baseUrl}/Usuario`, usuario, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Obtener todos los usuarios (para pruebas)
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/Usuario`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Obtener usuario por ID
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuario/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Manejo simple de errores - solo pasa la información del backend
  private handleError(error: HttpErrorResponse): Observable<never> {
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
