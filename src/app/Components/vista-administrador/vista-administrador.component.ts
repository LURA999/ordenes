import { Component, OnInit } from '@angular/core';
import { OrdenService } from 'src/app/services/orden.service';
import { ChartOptions, ChartType, ChartDataSets, Tooltip, ChartLegendLabelOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { CatalogueService } from 'src/app/services/catalogue.service';
import { LevantamientoService } from 'src/app/services/levantamiento.service';
import {formatDate} from '@angular/common';
import { NONE_TYPE } from '@angular/compiler';


@Component({
  selector: 'app-vista-administrador',
  templateUrl: './vista-administrador.component.html',
  styleUrls: ['./vista-administrador.component.css']
})
export class VistaAdministradorComponent implements OnInit {
  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  auxOrdenes: number[];
  auxOabiertas: number[];
  auxOasignadas: number[];
  auxOcerradas: number[];
  auxLevantamiento: number[];
  auxLabiertas: number[];
  auxLasignadas: number[];
  auxLcerradas: number[];
  auxContador: number=+"";
  
  auxCcerradas:number;
  auxCabiertas:number;
  auxCasignadas:number;

  cities:any[];
  levantamientos: any[];
  ordenes: any[];
  date= new Date();
  fecha : string = formatDate(Date.now(),'yyyy-MM-dd','en-US');
  fechaInicio: Date;
  fechaFin: Date;

  longitud: number=0;
  contadorCerradaL:number=0;
  contadorAbiertaL:number=0;
  contadorAsignadaL:number=0;
  contadorCerradaO:number=0;
  contadorAbiertaO:number=0;
  contadorAsignadaO:number=0;

 contadorDoughnutC:number =0;
 contadorDoughnutAs:number =0;
 contadorDoughnutAb:number =0;

//Grafica del doughnut
  chartData : ChartDataSets[] =[{
    data: [],
    
    backgroundColor: [
    "#FFFFFF",  
    '#f20808',
    "#FFFFFF",
    '#4fD860',
    "#FFFFFF",
    '#fff00f'
    ],
    borderWidth: 1
    }];
  chartDataLabels: Label[] = [
    "Cerrada",
    "",
    "Abierta",
    "",
    "Asignada",
    ""
  ];


  chartOptions: ChartOptions = {
    responsive: true,
    
    tooltips: {
        callbacks:{
       label:function(tooltipItem, item){
          if(tooltipItem.index==1){
            return "Cerrado";
          }else if(tooltipItem.index==3){
            return "Abierto";
          }else if(tooltipItem.index==5){
            return "Asignado";
          }
       }
       }
    },
    legend:{
      position:"left",
      onClick(){}
      
    }
    
  };


  //Creando grafica de barras

  barChartOptions: ChartOptions = {
    responsive: true,
    legend:{
      position:"bottom"
    }
  };
  barChartData: ChartDataSets[] = [
    { data: [], label: 'Ordenes', backgroundColor: '#FF3300',hoverBackgroundColor: '#000000'},
    { data: [], label: 'Abiertas',backgroundColor: '#009900',hoverBackgroundColor: '#000000' },
    { data: [], label: 'Asignadas',backgroundColor: '#FFCC00',hoverBackgroundColor: '#000000' },
    { data: [], label: 'Cerradas',backgroundColor: '#CC0000',hoverBackgroundColor: '#000000'},
    { data: [], label:'Levantamientos',backgroundColor: '#9900CC',hoverBackgroundColor:'#000000' },
    { data: [], label: 'Abiertas',backgroundColor: '#0000FF',hoverBackgroundColor: '#000000'},
    { data: [], label: 'Asignadas',backgroundColor: '#0099FF',hoverBackgroundColor: '#000000'},
    { data: [], label: 'Cerradas',backgroundColor: '#FF0099',hoverBackgroundColor: '#000000'},
  ];
  
  constructor(private sCatalogo:CatalogueService, private sOrden:OrdenService, private sLevantamiento: LevantamientoService
    ){

  }

  
//inicializando barras por default
  ngOnInit(): void {
   
    //ajustando tamaño de  ordenes y levantamientos
    this.sLevantamiento.getTodosLevantamientos().subscribe((leva:any) =>{      
    for(let x= 0; x<leva.length; x++){
      this.longitud+=1;
    }
  });

  this.sOrden.getTodosOrden().subscribe((ord:any) =>{  
    for(let x= 0; x<ord.length; x++){
      this.longitud+=1;
    }
  });

    this.getCities();
    this.getOrdenes(new Date(this.date.getFullYear(), this.date.getMonth() + 1,0), new Date(this.date.getFullYear(), this.date.getMonth(), 1));
    this.getLevantamientos(new Date(this.date.getFullYear(), this.date.getMonth() + 1,0),new Date(this.date.getFullYear(), this.date.getMonth(), 1));

  
  }

//filtro del horario
  filtrar(){
    
    if (this.fechaInicio != undefined && this.fechaFin != undefined) {
        if( !(""+this.fechaFin === "") && !(""+this.fechaInicio === "")){
        if (this.fechaInicio < this.fechaFin) {

          this.contadorDoughnutAb=0;
          this.contadorDoughnutAs=0;
          this.contadorDoughnutC=0;
          this.getOrdenes( new Date(this.fechaFin+" 23:59:00"), new Date(this.fechaInicio+" 23:59:00"));
          this.getLevantamientos( new Date(this.fechaFin+" 23:59:00"), new Date(this.fechaInicio+" 23:59:00"));
        }else{
          alert("La fecha de inicio no puede ser mayor a la fecha final.")
        } 
          }else{
            alert("Te falto seleccionar las fechas");
          }
      }else{
        alert("Te falto seleccionar una fecha");
      }
    

  }
//obteniendo resultados de las ordenes para la tabla
  getOrdenes(fechaInicio:Date, fechaFin: Date){
    if(localStorage.getItem('level') == "5"){
      console.log("Nivel 5 - Coordinador - Ordenes");

      this.sOrden.getCordiOrdenInicio(this.fechaInicio
      ,this.fechaFin).subscribe((resp:any) =>{

      this.ordenes = resp;
      console.log(this.ordenes);

      for(let x=0; x<this.ordenes.length; x++){
        for(let y=0; y<this.barChartLabels.length; y++){
         if(this.barChartLabels[y] == this.ordenes[x].Ciudad){
           //aqui se estan llenando todas las ordenes/levantamientos existentes
          this.auxContador = this.auxOrdenes[y];
          this.auxOrdenes[y]=this.auxContador+1; 
          //estamos separando las  ordenes/levantamientos, segun su estatus
          if(this.ordenes[x].estatus+"" === 3+""){
            this.auxContador = this.auxOcerradas[y];
            this.auxOcerradas[y]=this.auxContador+1;
            this.contadorCerradaO++;
            this.contadorDoughnutC++;
          }else if(this.ordenes[x].estatus+"" === 2+""){
            this.auxContador = this.auxOasignadas[y];
            this.auxOasignadas[y]=this.auxContador+1;
            this.contadorAsignadaO++;
            this.contadorDoughnutAs++;
          }else if(this.ordenes[x].estatus+"" === 1+""){
            this.auxContador = this.auxOabiertas[y];
            this.auxOabiertas[y]=this.auxContador+1;
            this.contadorAbiertaO++;
            this.contadorDoughnutAb++;

          }
         }
        }
      }

      //aqui se llena la tabla por default
      for(let x =0; x<this.auxOrdenes.length; x++){
        this.barChartData[0].data[x]=this.auxOrdenes[x];
        this.barChartData[1].data[x]=this.auxOabiertas[x];
        this.barChartData[2].data[x]=this.auxOasignadas[x];
        this.barChartData[3].data[x]=this.auxOcerradas[x];
      }

      this.chartData[0].data[0]=0;
      this.chartData[0].data[1]=this.contadorDoughnutC;
      this.chartData[0].data[2]=0;
      this.chartData[0].data[3]=this.contadorDoughnutAb;
      this.chartData[0].data[4]=0;
      this.chartData[0].data[5]=this.contadorDoughnutAs;  
        this.chartDataLabels[1]=
        ((this.contadorDoughnutC/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%";
        this.chartDataLabels[3]=
        ((this.contadorDoughnutAb/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
        this.chartDataLabels[5]=
        ((this.contadorDoughnutAs/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
    });
   } else if(localStorage.getItem('level') == "1"){

    this.sOrden.getTodosOrden().subscribe((resp:any) =>{
      console.log("Nivel 1 - Administrador - Ordenes");

      this.ordenes = resp;
          this.contadorCerradaO=0;
          this.contadorAbiertaO=0;
          this.contadorAsignadaO=0;

      //vaciando arreglos para el filtro
      this.getCities();

      for(let x=0; x<this.ordenes.length; x++){
        console.log(this.ordenes[x].fecha_creacion +"  - "+this.ordenes[x].estatus)

          for(let y=0; y<this.barChartLabels.length; y++){
           if(this.barChartLabels[y] == this.ordenes[x].ciudadNombre 
            && new Date(this.ordenes[x].fecha_creacion).getTime() >= fechaFin.getTime()
            && new Date(this.ordenes[x].fecha_creacion).getTime() <= fechaInicio.getTime()){
             //aqui se estan llenando todas las ordenes/levantamientos existentes
            this.auxContador = this.auxOrdenes[y];
            this.auxOrdenes[y]=this.auxContador+1; 
            //estamos separando las  ordenes/levantamientos, segun su estatus
            if(this.ordenes[x].estatus+"" === 3+""){
              this.auxContador = this.auxOcerradas[y];
              this.auxOcerradas[y]=this.auxContador+1;
              this.contadorCerradaO++;
              this.contadorDoughnutC++;
            }else if(this.ordenes[x].estatus+"" === 2+""){
              this.auxContador = this.auxOasignadas[y];
              this.auxOasignadas[y]=this.auxContador+1;
              this.contadorAsignadaO++;
              this.contadorDoughnutAs++;
            }else if(this.ordenes[x].estatus+"" === 1+""){
              this.auxContador = this.auxOabiertas[y];
              this.auxOabiertas[y]=this.auxContador+1;
              this.contadorAbiertaO++;
              this.contadorDoughnutAb++;

            }

            }
          }
        }
        //aqui se llena la tabla por default
        for(let x =0; x<this.auxOrdenes.length; x++){
          this.barChartData[0].data[x]=this.auxOrdenes[x];
          this.barChartData[1].data[x]=this.auxOabiertas[x];
          this.barChartData[2].data[x]=this.auxOasignadas[x];
          this.barChartData[3].data[x]=this.auxOcerradas[x];
        }

        this.chartData[0].data[0]=0;
        this.chartData[0].data[1]=this.contadorDoughnutC;
        this.chartData[0].data[2]=0;
        this.chartData[0].data[3]=this.contadorDoughnutAb;
        this.chartData[0].data[4]=0;
        this.chartData[0].data[5]=this.contadorDoughnutAs;  
        this.chartDataLabels[1]=
        ((this.contadorDoughnutC/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%";
        this.chartDataLabels[3]=
        ((this.contadorDoughnutAb/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
        this.chartDataLabels[5]=
        ((this.contadorDoughnutAs/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
    
      });
    }
    
    
  }
//es lo mismo que ordenes
  getLevantamientos(fechaInicio:Date, fechaFin: Date){
    if(localStorage.getItem('level') == "1"){
    this.sLevantamiento.getTodosLevantamientos().subscribe((resp: any) =>{
      console.log("Nivel 1 - Administrador - Levantamientos");

      this.levantamientos = resp;
      console.log(this.levantamientos);
      this.contadorCerradaL=0;
          this.contadorAbiertaL=0;
          this.contadorAsignadaL=0;
      this.getCities();
   
      for(let x=0; x<this.levantamientos.length; x++){   
        for(let y=0; y<this.barChartLabels.length; y++){
         if(this.barChartLabels[y] == this.levantamientos[x].ciudadNombre
          && new Date(this.levantamientos[x].fecha_creacion).getTime() >= fechaFin.getTime()
          && new Date(this.levantamientos[x].fecha_creacion).getTime() <= fechaInicio.getTime()){

           this.auxContador = this.auxLevantamiento[y];
           this.auxLevantamiento[y]=this.auxContador+1;
           
            if(this.levantamientos[x].estatus+"" === 3+""){
              this.auxContador = this.auxLcerradas[y];
              this.auxLcerradas[y]=this.auxContador+1;
              this.contadorCerradaL++;
              this.contadorDoughnutC++;

            }else
             if(this.levantamientos[x].estatus+"" === 2+""){
              this.auxContador = this.auxLasignadas[y];
              this.auxLasignadas[y]=this.auxContador+1;
              this.contadorAsignadaL++;
              this.contadorDoughnutAs++;

            }else
             if(this.levantamientos[x].estatus+"" === 1+""){
              this.auxContador = this.auxLabiertas[y];
              this.auxLabiertas[y]=this.auxContador+1;
              this.contadorAbiertaL++;
              this.contadorDoughnutAb++;
            }

          }
        }
      }    
    
      
      for(let x =0; x<this.auxLevantamiento.length; x++){
        this.barChartData[4].data[x]=this.auxLevantamiento[x];
        this.barChartData[5].data[x]=this.auxLabiertas[x];
        this.barChartData[6].data[x]=this.auxLasignadas[x];
        this.barChartData[7].data[x]=this.auxLcerradas[x];
     
      }
      this.chartData[0].data[0]=0;
      this.chartData[0].data[1]=this.contadorDoughnutC;
      this.chartData[0].data[2]=0;
      this.chartData[0].data[3]=this.contadorDoughnutAb;
      this.chartData[0].data[4]=0;
      this.chartData[0].data[5]=this.contadorDoughnutAs;   

      this.chartDataLabels[1]=
      ((this.contadorDoughnutC/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%";
      this.chartDataLabels[3]=
      ((this.contadorDoughnutAb/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
      this.chartDataLabels[5]=
      ((this.contadorDoughnutAs/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
      })

    }else if(localStorage.getItem('level') == "5"){
      this.sLevantamiento.getCordiLevantamientoInicio(this.fechaInicio,this.fechaFin).subscribe((resp: any) =>{
          console.log("Nivel 5 - Coordinador - Levantamientos");

      this.levantamientos = resp;
      console.log(this.levantamientos);

      this.contadorCerradaL=0;
      this.contadorAbiertaL=0;
      this.contadorAsignadaL=0;
      this.getCities();
    for(let x=0; x<this.levantamientos.length; x++){   
      for(let y=0; y<this.barChartLabels.length; y++){
       if(this.barChartLabels[y] == this.levantamientos[x].Ciudad){

       this.auxContador = this.auxLevantamiento[y];
       this.auxLevantamiento[y]=this.auxContador+1;
       
        if(this.levantamientos[x].estatus+"" === 3+""){
          this.auxContador = this.auxLcerradas[y];
          this.auxLcerradas[y]=this.auxContador+1;
          this.contadorCerradaL++;
          this.contadorDoughnutC++;

        }else
         if(this.levantamientos[x].estatus+"" === 2+""){
          this.auxContador = this.auxLasignadas[y];
          this.auxLasignadas[y]=this.auxContador+1;
          this.contadorAsignadaL++;
          this.contadorDoughnutAs++;

        }else
         if(this.levantamientos[x].estatus+"" === 1+""){
          this.auxContador = this.auxLabiertas[y];
          this.auxLabiertas[y]=this.auxContador+1;
          this.contadorAbiertaL++;
          this.contadorDoughnutAb++;
        }
        }
        }
    }

    for(let x =0; x<this.auxLevantamiento.length; x++){
      this.barChartData[4].data[x]=this.auxLevantamiento[x];
      this.barChartData[5].data[x]=this.auxLabiertas[x];
      this.barChartData[6].data[x]=this.auxLasignadas[x];
      this.barChartData[7].data[x]=this.auxLcerradas[x];
   
    }
    this.chartData[0].data[0]=0;
      this.chartData[0].data[1]=this.contadorDoughnutC;
      this.chartData[0].data[2]=0;
      this.chartData[0].data[3]=this.contadorDoughnutAb;
      this.chartData[0].data[4]=0;
      this.chartData[0].data[5]=this.contadorDoughnutAs;      
    
        this.chartDataLabels[1]=
        ((this.contadorDoughnutC/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%";
        this.chartDataLabels[3]=
        ((this.contadorDoughnutAb/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"
        this.chartDataLabels[5]=
        ((this.contadorDoughnutAs/(this.contadorDoughnutC+this.contadorDoughnutAb+this.contadorDoughnutAs))*100).toFixed(2)+"%"

    });
  }
}
  
  getCities(){

    //llenando grafica
    this.sCatalogo.obtenerCiudades().subscribe((resp:any)=>{
      this.cities = resp;
      var aux = [];

      this.cities.forEach(city => {
         aux.push(city["Nombre"]);
      });
      this.barChartLabels = aux;
      this.auxOrdenes = new Array(this.longitud);
      this.auxOasignadas=new Array(this.longitud);
      this.auxOcerradas=new Array(this.longitud);
      this.auxOabiertas=new Array(this.longitud);

      this.auxLevantamiento = new Array(this.longitud);
      this.auxLabiertas=new Array(this.longitud);
      this.auxLasignadas=new Array(this.longitud);
      this.auxLcerradas=new Array(this.longitud);

      for(let y=0; y<this.longitud; y++){
        this.auxLevantamiento[y]=0;
        this.auxLabiertas[y]=0;
        this.auxLasignadas[y]=0;
        this.auxLcerradas[y]=0;

        this.auxOrdenes[y]=0;
        this.auxOasignadas[y]=0;
        this.auxOcerradas[y]=0;
        this.auxOabiertas[y]=0;
      }

    });
  }

}
