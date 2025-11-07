import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DatosPago {
  nombre: string;
  correo: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  numeroTarjeta: string;
  fechaVencimiento: string;
  codigoCCV: string;
  cantidadCuotas: number;
}

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.component.scss']
})
export class PagoModalComponent {
  @Input() mostrar: boolean = false;
  @Input() precioTotal: number = 0;
  @Input() nombreProducto: string = '';
  @Output() cerrar = new EventEmitter<void>();
  @Output() procesarPago = new EventEmitter<DatosPago>();

  datosPago: DatosPago = {
    nombre: '',
    correo: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    codigoCCV: '',
    cantidadCuotas: 1
  };

  opcionesCuotas: number[] = [1, 3, 6, 12, 18, 24, 36];
  procesando: boolean = false;
  errores: { [key: string]: string } = {};

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  formatearNumeroTarjeta(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\s/g, '');
    
    if (valor.length > 16) {
      valor = valor.substring(0, 16);
    }
    
    valor = valor.replace(/(.{4})/g, '$1 ').trim();
    this.datosPago.numeroTarjeta = valor;
  }

  formatearFechaVencimiento(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    
    this.datosPago.fechaVencimiento = valor;
  }

  formatearCCV(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 3) {
      valor = valor.substring(0, 3);
    }
    
    this.datosPago.codigoCCV = valor;
  }

  validarFormulario(): boolean {
    this.errores = {};

    if (!this.datosPago.nombre || this.datosPago.nombre.trim().length < 2) {
      this.errores['nombre'] = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.datosPago.correo || !emailRegex.test(this.datosPago.correo)) {
      this.errores['correo'] = 'Ingrese un correo electrónico válido';
    }

    if (!this.datosPago.direccion || this.datosPago.direccion.trim().length < 5) {
      this.errores['direccion'] = 'La dirección debe tener al menos 5 caracteres';
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (!this.datosPago.telefono || !telefonoRegex.test(this.datosPago.telefono.replace(/\s/g, ''))) {
      this.errores['telefono'] = 'Ingrese un teléfono válido (10 dígitos)';
    }

    if (!this.datosPago.ciudad || this.datosPago.ciudad.trim().length < 2) {
      this.errores['ciudad'] = 'La ciudad debe tener al menos 2 caracteres';
    }

    const numeroTarjetaLimpio = this.datosPago.numeroTarjeta.replace(/\s/g, '');
    if (!numeroTarjetaLimpio || numeroTarjetaLimpio.length !== 16) {
      this.errores['numeroTarjeta'] = 'El número de tarjeta debe tener 16 dígitos';
    }

    if (!this.datosPago.fechaVencimiento || this.datosPago.fechaVencimiento.length !== 5) {
      this.errores['fechaVencimiento'] = 'Ingrese una fecha válida (MM/AA)';
    }

    if (!this.datosPago.codigoCCV || this.datosPago.codigoCCV.length !== 3) {
      this.errores['codigoCCV'] = 'El código CCV debe tener 3 dígitos';
    }

    if (!this.datosPago.cantidadCuotas || this.datosPago.cantidadCuotas < 1) {
      this.errores['cantidadCuotas'] = 'Seleccione una cantidad de cuotas válida';
    }

    return Object.keys(this.errores).length === 0;
  }

  onCerrar(): void {
    this.limpiarFormulario();
    this.cerrar.emit();
  }

  onProcesarPago(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.procesando = true;
    
    const datosPagoLimpio: DatosPago = {
      ...this.datosPago,
      numeroTarjeta: this.datosPago.numeroTarjeta.replace(/\s/g, ''),
      telefono: this.datosPago.telefono.replace(/\s/g, '')
    };

    this.procesarPago.emit(datosPagoLimpio);
  }

  limpiarFormulario(): void {
    this.datosPago = {
      nombre: '',
      correo: '',
      direccion: '',
      telefono: '',
      ciudad: '',
      numeroTarjeta: '',
      fechaVencimiento: '',
      codigoCCV: '',
      cantidadCuotas: 1
    };
    this.errores = {};
    this.procesando = false;
  }

  obtenerMensajeError(campo: string): string {
    return this.errores[campo] || '';
  }

  tieneError(campo: string): boolean {
    return !!this.errores[campo];
  }

  calcularValorCuota(): number {
    if (this.datosPago.cantidadCuotas <= 0) {
      return 0;
    }
    return this.precioTotal / this.datosPago.cantidadCuotas;
  }
}

