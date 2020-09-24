import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import {AuthGuard } from './guards/auth.guard'
import { LoginComponent } from './Components/Login/login.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { ListaUsuariosComponent } from './Components/lista-usuarios/lista-usuarios.component';
import { AbcUsuarioComponent } from './Components/abc-usuario/abc-usuario.component';
import { ListaOrdenesComponent } from './Components/lista-ordenes/lista-ordenes.component';
import { AbcOrdenComponent } from './Components/abc-orden/abc-orden.component';

const routes: Routes = [
  {path:'abcOrden/:id', component:AbcOrdenComponent, canActivate: [ AuthGuard ]}, 
  {path:'abcOrden', component:AbcOrdenComponent, canActivate: [ AuthGuard ]}, 
  {path:'abcUsuario', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 
  {path:'abcUsuario/:id', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 
  {path:'login', component:LoginComponent}, 
  {path:'logout', component:LogoutComponent}, 
  {path:'home', component:HomeComponent, canActivate: [ AuthGuard ]},
  {path:'listaUsuarios', component:ListaUsuariosComponent, canActivate: [ AuthGuard ]},
  {path:'listaOrdenes', component:ListaOrdenesComponent, canActivate: [ AuthGuard ]},
  {path:'', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
