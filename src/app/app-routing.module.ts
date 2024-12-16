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
import { AbcTipoDocumentoComponent } from './Components/abc-tipo-documento/abc-tipo-documento.component';
import { AbcTipoActividadComponent } from './Components/abc-tipo-actividad/abc-tipo-actividad.component';
import { ListaClientesComponent } from './Components/lista-clientes/lista-clientes.component';
import { AbcClienteComponent } from './Components/abc-cliente/abc-cliente.component';
import { DetalleClienteComponent } from './Components/detalle-cliente/detalle-cliente.component';
import { AbcLevantamientoComponent } from './Components/abc-levantamiento/abc-levantamiento.component';
import { ListaLevantamientosComponent } from './Components/lista-levantamientos/lista-levantamientos.component';
import { ListaCiudadesComponent } from './Components/lista-ciudades/lista-ciudades.component';
import { ListaVehiculosComponent } from './Components/lista-vehiculos/lista-vehiculos.component';
import { CalendarioComponent } from './Components/calendario/calendario.component';


const routes: Routes = [
  {path:'clientes', component:ListaClientesComponent, canActivate: [ AuthGuard ]}, 
  {path:'clientes/abcCliente/agregar', component:AbcClienteComponent, canActivate: [ AuthGuard ]}, 
  {path:'clientes/:id', component:DetalleClienteComponent, canActivate: [ AuthGuard ]}, 
  {path:'actividades', component:AbcTipoActividadComponent, canActivate: [ AuthGuard ]}, 
  {path:'tipoDocumento', component:AbcTipoDocumentoComponent, canActivate: [ AuthGuard ]}, 
  {path:'login', component:LoginComponent}, 
  {path:'logout', component:LogoutComponent}, 
  {path:'home', component:HomeComponent, canActivate: [ AuthGuard ]},
  {path:'usuarios', component:ListaUsuariosComponent, canActivate: [ AuthGuard ]},
  {path:'usuarios/abcUsuario', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 
  {path:'usuarios/abcUsuario/:id', component:AbcUsuarioComponent, canActivate: [ AuthGuard ]}, 
  {path:'ciudades', component:ListaCiudadesComponent, canActivate: [ AuthGuard ]},
  {path:'vehiculos', component:ListaVehiculosComponent, canActivate: [ AuthGuard ]},
  {path:'ordenes', component:ListaOrdenesComponent, canActivate: [ AuthGuard ]},
  {path:'ordenes/abcOrden/:id', component:AbcOrdenComponent, canActivate: [ AuthGuard ]}, 
  {path:'ordenes/abcOrden', component:AbcOrdenComponent, canActivate: [ AuthGuard ]}, 
  {path:'levantamientos', component: ListaLevantamientosComponent, canActivate:[ AuthGuard] },
  {path:'levantamientos/abcLevantamiento', component: AbcLevantamientoComponent, canActivate:[ AuthGuard] },
  {path:'levantamientos/abcLevantamiento/:id', component: AbcLevantamientoComponent, canActivate:[ AuthGuard] },
  {path:'calendario', component: CalendarioComponent, canActivate:[ AuthGuard] },
  {path:'', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
