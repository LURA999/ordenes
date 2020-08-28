import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login.component';
import { SidebarComponent } from './Components/Sidebar/sidebar.component'
import { AbcUsuarioComponent } from './Components/abc-usuario/abc-usuario.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    AbcUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
