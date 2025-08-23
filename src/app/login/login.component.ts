import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  protected readonly title = 'MAJI Innovators S.A.S';
  protected readonly subtitle = 'Sistema Integral de Encuestas y Comercio Electrónico';
  
  protected loginData = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  protected onLogin(): void {
    // Aquí irá la lógica de inicio de sesión
    console.log('Iniciando sesión:', this.loginData);
  }

  protected onRegister(): void {
    // Navegar al registro
    this.router.navigate(['/register']);
  }
}
