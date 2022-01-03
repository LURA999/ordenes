import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard } from './guards/auth.guard'
import { LoginComponent } from './Components/Login/login.component';
import { ListaClientessComponent } from './Components/lista-clientess/lista-clientess.component';
import { LogoutComponent } from './Components/logout/logout.component';

import { ListaUsuariosComponent } from './Components/lista-usuarios/lista-usuarios.component';
import { AbcUsuarioComponent } from "./Components/abc-usuario/abc-usuario.component";

const routes: Routes = [
  {path:'login', component:LoginComponent}, 
  {path:'logout', component:LogoutComponent}, 
  {path:'home', component:ListaClientessComponent, canActivate: [ AuthGuard ]},
  {path:'listaclientes',component:ListaClientessComponent,canActivate:[AuthGuard]},
  {path:'usuarios', component:ListaUsuariosComponent, canActivate: [ AuthGuard ]},
  {path:'', component:LoginComponent},
  {path:'usuarios/abcUsuario', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 
  {path:'usuarios/abcUsuario/:id', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
