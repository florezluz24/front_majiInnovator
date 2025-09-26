import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageAlert } from '../shared/message-alert/message-alert.component';

/**
 * Interfaz para los datos de registro de usuario
 * Contiene solo los campos necesarios para crear un nuevo usuario
 */
export interface UsuarioDTO {
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de cédula del usuario (debe ser numérico) */
  cedula: string;
  /** Contraseña del usuario (mínimo 5 caracteres) */
  password: string;
}

/**
 * Interfaz para validar credenciales de acceso
 * Usada en el proceso de login
 */
export interface ValidarAccesoDTO {
  /** Número de cédula del usuario */
  cedula: string;
  /** Contraseña del usuario */
  password: string;
}

/**
 * Interfaz completa de usuario con todos los campos
 * Incluye información sensible como contraseña
 */
export interface Usuario {
  /** Identificador único del usuario */
  id: number;
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de cédula del usuario */
  cedula: string;
  /** Número de teléfono del usuario */
  telefono: string;
  /** Contraseña del usuario (se almacena en texto plano) */
  password: string;
  /** Rol del usuario en el sistema */
  rol: string;
}

/**
 * Interfaz de usuario para respuestas de la API
 * No incluye información sensible como contraseña
 */
export interface UsuarioRespuesta {
  /** Identificador único del usuario */
  id: number;
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de cédula del usuario */
  cedula: string;
  /** Número de teléfono del usuario */
  telefono: string;
  /** Rol del usuario en el sistema */
  rol: string;
}

/**
 * Interfaz para respuestas de error del servidor
 */
export interface ErrorResponse {
  /** Mensaje de error descriptivo */
  message: string;
  /** Título del error */
  title: string;
}

/**
 * Interfaz para representar una pregunta de encuesta
 */
export interface Encuesta {
  /** Texto de la pregunta */
  pregunta: string;
  /** Lista de opciones de respuesta disponibles */
  respuestas: string[];
}

/**
 * Interfaz completa de usuario para operaciones administrativas
 * Incluye todos los campos del usuario
 */
export interface UsuarioCompleto {
  /** Identificador único del usuario */
  id: number;
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de cédula del usuario */
  cedula: string;
  /** Número de teléfono del usuario */
  telefono: string;
  /** Contraseña del usuario */
  password: string;
  /** Rol del usuario en el sistema */
  rol: string;
}

/**
 * Interfaz para crear una respuesta de encuesta
 */
export interface RespuestaEncuestaDTO {
  /** ID del usuario que responde */
  usuarioId: number;
  /** Pregunta que se está respondiendo */
  pregunta: string;
  /** Respuesta seleccionada */
  respuesta: string;
}

/**
 * Interfaz para representar una respuesta de encuesta almacenada
 */
export interface RespuestaEncuesta {
  /** Identificador único de la respuesta */
  id: number;
  /** ID del usuario que respondió */
  usuarioId: number;
  /** Pregunta que se respondió */
  pregunta: string;
  /** Respuesta seleccionada */
  respuesta: string;
}

/**
 * Servicio de autenticación y comunicación con el backend
 * Maneja el login, registro, gestión de usuarios y encuestas
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL base del backend API */
  private readonly baseUrl = 'https://localhost:7166/api';
  
  /** Clave para almacenar el usuario actual en localStorage */
  private readonly STORAGE_KEY = 'currentUser';
  
  /** Subject para manejar mensajes de alerta globales */
  private messageSubject = new BehaviorSubject<MessageAlert | null>(null);
  /** Observable público para suscribirse a los mensajes */
  public message$ = this.messageSubject.asObservable();

  /** Subject para manejar el estado de carga global */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /** Observable público para suscribirse al estado de carga */
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Constructor del servicio de autenticación
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
   * Muestra un mensaje de advertencia al usuario
   * @param mensaje Texto del mensaje de advertencia
   * @param titulo Título opcional del mensaje
   */
  mostrarMensajeAdvertencia(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'warning',
      message: mensaje,
      title: titulo
    };
    this.messageSubject.next(alerta);
  }

  /**
   * Muestra un mensaje informativo al usuario
   * @param mensaje Texto del mensaje informativo
   * @param titulo Título opcional del mensaje
   */
  mostrarMensajeInfo(mensaje: string, titulo?: string): void {
    const alerta: MessageAlert = {
      type: 'info',
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

  // ==================== MÉTODOS DE AUTENTICACIÓN ====================
  
  /**
   * Valida las credenciales de acceso de un usuario
   * @param credenciales Datos de cédula y contraseña del usuario
   * @returns Observable con los datos del usuario si las credenciales son válidas
   */
  validarAcceso(credenciales: ValidarAccesoDTO): Observable<UsuarioRespuesta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<UsuarioRespuesta>(`${this.baseUrl}/Usuario/validar-acceso`, credenciales, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param usuario Datos del usuario a registrar
   * @returns Observable con los datos del usuario creado
   */
  registrarUsuario(usuario: UsuarioDTO): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Usuario>(`${this.baseUrl}/Usuario`, usuario, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }


  // ==================== MÉTODOS DE GESTIÓN DE USUARIOS ====================
  
  /**
   * Obtiene un usuario específico por su ID
   * @param id Identificador único del usuario
   * @returns Observable con los datos del usuario
   */
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/Usuario/${id}`)
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

  // ==================== MÉTODOS DE GESTIÓN DE SESIÓN ====================
  
  /**
   * Verifica si localStorage está disponible en el navegador
   * @returns true si localStorage está disponible, false en caso contrario
   */
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /**
   * Inicia sesión del usuario guardando sus datos en localStorage
   * @param usuario Datos del usuario que inicia sesión
   */
  login(usuario: UsuarioRespuesta): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
    }
  }

  /**
   * Cierra la sesión del usuario eliminando sus datos de localStorage
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns true si hay un usuario logueado, false en caso contrario
   */
  isAuthenticated(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    const user = localStorage.getItem(this.STORAGE_KEY);
    return user !== null;
  }

  /**
   * Obtiene los datos del usuario actualmente autenticado
   * @returns Datos del usuario o null si no hay sesión activa
   */
  getCurrentUser(): UsuarioRespuesta | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }
    const user = localStorage.getItem(this.STORAGE_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  /**
   * Obtiene el rol del usuario actualmente autenticado
   * @returns Rol del usuario o null si no hay sesión activa
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.rol : null;
  }

  /**
   * Verifica si el usuario actual es administrador
   * @returns true si el usuario es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'Administrador';
  }

  // ==================== MÉTODOS DE ENCUESTAS ====================
  
  /**
   * Obtiene todas las encuestas disponibles en el sistema
   * @returns Observable con la lista de encuestas
   */
  obtenerEncuestas(): Observable<Encuesta[]> {
    this.setLoading(true);
    return this.http.get<Encuesta[]>(`${this.baseUrl}/Encuesta`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Obtiene todos los usuarios registrados en el sistema
   * @returns Observable con la lista completa de usuarios
   */
  obtenerUsuarios(): Observable<UsuarioCompleto[]> {
    this.setLoading(true);
    return this.http.get<UsuarioCompleto[]>(`${this.baseUrl}/Usuario`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Crea una nueva respuesta de encuesta
   * @param respuesta Datos de la respuesta a crear
   * @returns Observable con la respuesta creada
   */
  crearRespuestaEncuesta(respuesta: RespuestaEncuestaDTO): Observable<RespuestaEncuesta> {
    this.setLoading(true);
    return this.http.post<RespuestaEncuesta>(`${this.baseUrl}/RespuestaEncuesta`, respuesta)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
