import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login.component';
import { NavbarComponent } from './Components/Navbar/navbar.component';
import { AbcOrdenComponent } from './Components/abc-orden/abc-orden.component';
import { ListaOrdenesComponent } from './Components/lista-ordenes/lista-ordenes.component'

//Modulos
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './Components/home/home.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { ListaUsuariosComponent } from './Components/lista-usuarios/lista-usuarios.component';
import { AbcUsuarioComponent } from './Components/abc-usuario/abc-usuario.component';
import { ListaClientesComponent } from './Components/lista-clientes/lista-clientes.component';
import { OrdenDetallesComponent } from './Components/orden-detalles/orden-detalles.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AbcOrdenComponent,
    ListaOrdenesComponent,
    HomeComponent,
    LogoutComponent,
    ListaUsuariosComponent,
    AbcUsuarioComponent,
    ListaClientesComponent,
    OrdenDetallesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
