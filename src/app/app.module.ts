import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AbcOrdenComponent } from './Components/abc-orden/abc-orden.component';
import { ListaOrdenesComponent } from './Components/lista-ordenes/lista-ordenes.component'

//Modulos
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HomeComponent } from './Components/home/home.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { ListaUsuariosComponent } from './Components/lista-usuarios/lista-usuarios.component';
import { AbcUsuarioComponent } from './Components/abc-usuario/abc-usuario.component';
import { ListaClientesComponent } from './Components/lista-clientes/lista-clientes.component';
import { OrdenDetallesComponent } from './Components/orden-detalles/orden-detalles.component';
import { AbcTipoDocumentoComponent } from './Components/abc-tipo-documento/abc-tipo-documento.component';
import { AbcTipoActividadComponent } from './Components/abc-tipo-actividad/abc-tipo-actividad.component';
import { AbcClienteComponent } from './Components/abc-cliente/abc-cliente.component';
import { DetalleClienteComponent } from './Components/detalle-cliente/detalle-cliente.component';
import { AbcLevantamientoComponent } from './Components/abc-levantamiento/abc-levantamiento.component';
import { ListaLevantamientosComponent } from './Components/lista-levantamientos/lista-levantamientos.component';
import { DetalleLevantamientoComponent } from './Components/detalle-levantamiento/detalle-levantamiento.component';
import { ListaCiudadesComponent } from './Components/lista-ciudades/lista-ciudades.component';
import { ListaVehiculosComponent } from './Components/lista-vehiculos/lista-vehiculos.component';
import { VistaAdministradorComponent } from './Components/vista-administrador/vista-administrador.component';
import { CalendarioComponent } from './Components/calendario/calendario.component';
import { NavbarService } from './services/navbar.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    CalendarioComponent,
    AbcOrdenComponent,
    ListaOrdenesComponent,
    HomeComponent,
    LogoutComponent,
    ListaUsuariosComponent,
    AbcUsuarioComponent,
    ListaClientesComponent,
    OrdenDetallesComponent,
    AbcTipoDocumentoComponent,
    AbcTipoActividadComponent,
    AbcClienteComponent,
    DetalleClienteComponent,
    AbcLevantamientoComponent,
    ListaLevantamientosComponent,
    DetalleLevantamientoComponent,
    ListaCiudadesComponent,
    ListaVehiculosComponent,
    VistaAdministradorComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [NavbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
