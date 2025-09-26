import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminMenuComponent } from './admin-menu/admin-menu';
import { VisualizarEncuestasComponent } from './visualizar-encuestas/visualizar-encuestas';
import { VisualizarUsuariosComponent } from './visualizar-usuarios/visualizar-usuarios';
import { MenuUsuarioComponent } from './menu-usuario/menu-usuario';
import { ResponderEncuestasComponent } from './responder-encuestas/responder-encuestas';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminMenuComponent },
  { path: 'admin/encuestas', component: VisualizarEncuestasComponent },
  { path: 'admin/usuarios', component: VisualizarUsuariosComponent },
  { path: 'menu', component: MenuUsuarioComponent },
  { path: 'menu/encuestas', component: ResponderEncuestasComponent },
  { path: '**', redirectTo: '' }
];
