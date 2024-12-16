import {  Component,  ChangeDetectionStrategy,  ViewChild,  TemplateRef,  OnInit} from '@angular/core';
import {  startOfDay,  endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  CalendarEvent,  CalendarEventAction,  CalendarEventTimesChangedEvent,  CalendarView,} from 'angular-calendar';
import { LevantamientoService } from 'src/app/services/levantamiento.service';
import { OrdenService } from 'src/app/services/orden.service';
import { formatDate, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import localeEs from '@angular/common/locales/es';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  ordenes: {
    primary: "#FF3300",
    secondary: "#FEDCD4"

  },
  levantamientos: {
    primary:  "#9900CC",
    secondary:  "#F2C9FF"
  }

};


@Component({
  selector: 'app-calendario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  locale :String ="Es";
  viewDate: Date = new Date();
  levantamientos: any[]=[];
  ordenes: any[]=[];


  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();


  //Es el array para llenar el calendario
  events: CalendarEvent[] = [];

  //Esta variable es para abrir el dia actual por defecto
  activeDayIsOpen: boolean = false;

  constructor( private sOrden:OrdenService, private sLevantamiento: LevantamientoService, private router : Router) {
    registerLocaleData(localeEs);

  }

  ngOnInit(): void {   

  //var fechaInicio:  Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() +2,0);
 //var fechaFin : Date =new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() -1, 1);

 //console.log("nivel "+localStorage.getItem("level"));
 //console.log("cve_usuario "+localStorage.getItem("id"));


 if(localStorage.getItem('level') == "1"){
  this.getDatosOrdenesAdmin(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
  this.getDatosLevantamientoAdmin(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
  this.refresh.next();
}else if(localStorage.getItem('level') == "5"){
  this.getDatosOrdenesCordi(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
  this.getDatosLevantamientoCordi(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
  this.refresh.next();
}else if(localStorage.getItem('level') == "4"){
  this.getDatosOrdenesInstalador(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
  this.getDatosLevantamientoInstalador(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
}
  }

  //Sirve para llenar los levantamientos con sus deseados
  getDatosLevantamientoAdmin(fechaInicio: Date) {
    this.sLevantamiento.getLevantamientosAdmin(fechaInicio).subscribe((response: any) => {
      this.levantamientos = response;
      for(let x=0; x<this.levantamientos.length; x++){   
        if( new Date(this.levantamientos[x].fecha_creacion).getTime() < new Date(this.levantamientos[x].fecha_programada).getTime()
        || (this.levantamientos[x].fecha_programada == undefined || this.levantamientos[x].fecha_programada == null)){
            this.events.push({
              start: new Date(this.levantamientos[x].fecha_creacion),
              end: new Date(this.levantamientos[x].fecha_programada),
              title: "<b>Levantamiento "+this.levantamientos[x].cve_levantamiento+" - "+this.levantamientos[x].servicio+"</b>"+
              "<br>Estatus: "+ this.stringEstatus(this.levantamientos[x].estatus)+
              "<br>Cliente: "+this.levantamientos[x].cliente+
              "<br>Contacto: "+this.levantamientos[x].contacto, 
              color: colors.levantamientos
           })
            this.refresh.next();
          
        }
      }
    });
  }

  //Sirve para llenar las ordenes con sus deseadas
  getDatosOrdenesAdmin(fechaInicio: Date) {
    this.sOrden.getOrdenesAdmin(fechaInicio).subscribe((response: any) => {
      this.ordenes = response;
      for(let x=0; x<this.ordenes.length; x++){
           if( (this.ordenes[x].fecha_programada == undefined || this.ordenes[x].fecha_programada == null)
            || new Date(this.ordenes[x].fecha_creacion).getTime() < new Date(this.ordenes[x].fecha_programada).getTime()){
            this.events.push(
              {
              start: new Date(this.ordenes[x].fecha_creacion),
              end: new Date(this.ordenes[x].fecha_programada),
              title: "<b>Orden "+this.ordenes[x].cve_orden+" - "+this.ordenes[x].desc_servicio+"</b>"+
              "<br>Estatus: "+ this.stringEstatus(this.ordenes[x].estatus)+
              "<br>Cliente: "+this.ordenes[x].cliente+
              "<br>Contacto: "+this.ordenes[x].contacto,  
              color:colors.ordenes 
              })
              this.refresh.next();
          }
        }

    });
  }

  getDatosOrdenesCordi(fechaInicio: Date){
    this.sOrden.getCordiOrdenCalendario(fechaInicio).subscribe((resp:any) =>{
      this.ordenes = resp;
      console.log(resp);
      for(let x=0; x<this.ordenes.length; x++){   

        //console.log(this.ordenes[x].fecha_creacion+"\n"+this,orde);
        if( (this.ordenes[x].fecha_programada == undefined || this.ordenes[x].fecha_programada == null)
        || new Date(this.ordenes[x].fecha_creacion).getTime() < new Date(this.ordenes[x].fecha_programada).getTime()){
        this.events.push(
          {
          start: new Date(this.ordenes[x].fecha_creacion),
          end: new Date(this.ordenes[x].fecha_programada),
          title: "<b>Orden "+this.ordenes[x].cve_orden+" - "+this.ordenes[x].desc_servicio+"</b>"+
          "<br>Estatus: "+ this.stringEstatus(this.ordenes[x].estatus)+
          "<br>Cliente: "+this.ordenes[x].cliente+
          "<br>Contacto: "+this.ordenes[x].contacto,  
          color:colors.ordenes
          })
          this.refresh.next();
        }
      }
    });
  }
  stringEstatus(estatus : number){
    if(estatus == 1){
      return "ABIERTO";
    }else if(estatus == 2){
      return "ASIGNADO";
    }else if(estatus ==3){
      return "CERRADO";
    }
  }

  getDatosLevantamientoCordi(fechaInicio: Date){
    this.sLevantamiento.getCordiLevantamientoCalendario(fechaInicio).subscribe((resp: any) =>{
      this.levantamientos = resp;
      for(let x=0; x<this.levantamientos.length; x++){   
        if( new Date(this.levantamientos[x].fecha_creacion).getTime() < new Date(this.levantamientos[x].fecha_programada).getTime()
        || (this.levantamientos[x].fecha_programada == undefined || this.levantamientos[x].fecha_programada == null)){
        this.events.push({
          start: new Date(this.levantamientos[x].fecha_creacion),
          end: new Date(this.levantamientos[x].fecha_programada),
          title: "<b>Levantamiento "+this.levantamientos[x].cve_levantamiento+" - "+this.levantamientos[x].servicio+"</b>"+
          "<br>Estatus: "+ this.stringEstatus(this.levantamientos[x].estatus)+
          "<br>Cliente: "+this.levantamientos[x].cliente+
          "<br>Contacto: "+this.levantamientos[x].contacto, 
          color: colors.levantamientos
       })
        this.refresh.next();
      }
    }
  });
}

getDatosOrdenesInstalador(fechaInicio: Date){
  this.sOrden.getInstaladorOrdenInicio(fechaInicio).subscribe((resp:any) =>{
    this.ordenes = resp;
 //   console.log("ORDENES Instalador \nFecha inicio "+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"\nFecha fin "+formatDate(fechaFin,"yyyy-MM-dd","en-US"));
    for(let x=0; x<this.ordenes.length; x++){ 
      if( new Date(this.ordenes[x].fecha_creacion).getTime() < new Date(this.ordenes[x].fecha_programada).getTime() ||
      (this.ordenes[x].fecha_programada == undefined || this.ordenes[x].fecha_programada == null)){
        this.events.push(
          {
          start: new Date(this.ordenes[x].fecha_creacion),
          end: new Date(this.ordenes[x].fecha_programada),
          title: "<b>Orden "+this.ordenes[x].cve_orden+" - "+this.ordenes[x].desc_servicio+"</b>"+
          "<br>Estatus: "+ this.stringEstatus(this.ordenes[x].estatus)+
          "<br>Cliente: "+this.ordenes[x].cliente+
          "<br>Contacto: "+this.ordenes[x].contacto,  
          color:colors.ordenes
          })
          this.refresh.next();
        } 
      }
  });
}

getDatosLevantamientoInstalador(fechaInicio: Date){
  this.sLevantamiento.getInstaladorLevantamientoInicio(fechaInicio).subscribe((resp: any) =>{
    this.levantamientos = resp;
  //  console.log("LEVANTAMIENTOS Instalador \nFecha inicio "+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"\nFecha fin "+formatDate(fechaFin,"yyyy-MM-dd","en-US"));
    console.log(this.levantamientos);

    for(let x=0; x<this.levantamientos.length; x++){   
      if( new Date(this.levantamientos[x].fecha_creacion).getTime() < new Date(this.levantamientos[x].fecha_programada).getTime()
      || (this.levantamientos[x].fecha_programada == undefined || this.levantamientos[x].fecha_programada == null)){
      this.events.push({
        start: new Date(this.levantamientos[x].fecha_creacion),
        end: new Date(this.levantamientos[x].fecha_programada),
        title:  "<b>Levantamiento "+this.levantamientos[x].cve_levantamiento+" - "+this.levantamientos[x].servicio+"</b>"+
        "<br>Estatus: "+ this.stringEstatus(this.levantamientos[x].estatus)+
        "<br>Cliente: "+this.levantamientos[x].cliente+
        "<br>Contacto: "+this.levantamientos[x].contacto, 
        color: colors.levantamientos
     })
      this.refresh.next();
    }
  }
});
}

  //Se acompaña con la variable activityisOpen, es para abrir un dia especificio seleccionado (no es ventana emergente)
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        this.refresh.next();

      } else {
        this.activeDayIsOpen = true;
        this.refresh.next();
      }
      
      this.viewDate = date;
      this.refresh.next();
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
   // this.handleEvent('Dropped or resized', event);
  }

 handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    var cve:string = this.modalData.event.title.split(" ")[1];
    var modalidad:string = this.modalData.event.title.split(" ")[0].substring(3);

    
    if(modalidad == "Orden"){
      this.router.navigate(["/ordenes/abcOrden/"+cve]);
    }else{
      this.router.navigate(["/levantamientos/abcLevantamiento/"+cve]);
    }
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }



  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.events = [];
 
    
    if(localStorage.getItem('level') == "1"){
      this.getDatosOrdenesAdmin(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
      this.getDatosLevantamientoAdmin(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));

      this.refresh.next();
    }else if(localStorage.getItem('level') == "5"){
      this.getDatosOrdenesCordi(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
      this.getDatosLevantamientoCordi(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
      this.refresh.next();
    }else if(localStorage.getItem('level') == "4"){
      this.getDatosOrdenesInstalador(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
      this.getDatosLevantamientoInstalador(new Date(this.viewDate.getFullYear(), this.viewDate.getMonth()));
    }
  }
}
