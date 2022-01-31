import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/Login/login.component';
import { NavbarComponent } from './Components/navbar/navbar.component';

//Modulos
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './Components/home/home.component';
import { NavbarService } from './services/navbar.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ListaClientessComponent } from './Components/lista-clientess/lista-clientess.component';
import { getSpanishPaginatorIntl } from './Components/lista-clientess/spanish-paginator-intl';
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule  } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSelectModule  } from "@angular/material/select";
import { MatButtonModule  } from "@angular/material/button";
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

//components;
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loarder.interceptor';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { ListaUsuariosComponent } from "./Components/lista-usuarios/lista-usuarios.component";
import { AbcUsuarioComponent } from "./Components/abc-usuario/abc-usuario.component";
import { PopupComentarioComponent } from './Components/popup-comentario/popup-comentario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditarComentarioComponent } from './Components/editar-comentario/editar-comentario.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    ListaClientessComponent,
    LoaderComponent,
    ListaUsuariosComponent,
    AbcUsuarioComponent,
    PopupComentarioComponent,
    EditarComentarioComponent,
  ],
  entryComponents:[PopupComentarioComponent],
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
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    HttpClientModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [NgDialogAnimationService,
    NavbarService,    
    MatDatepickerModule,

    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }, 
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass:LoaderInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }    ],

  bootstrap: [AppComponent]
})
export class AppModule { }
