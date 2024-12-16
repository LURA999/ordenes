import { Component } from '@angular/core';
import { OrdenService } from '../../services/orden.service'

import Swal from 'sweetalert2';


@Component({
  selector: 'app-lista-ordenes',
  templateUrl: './lista-ordenes.component.html',
  styleUrls: ['./lista-ordenes.component.css']
})
export class ListaOrdenesComponent {

  contador : number=0; 
  ordenes: any[] = [];
  ordenesMostrar: any[] = [];
  ordenesMostrar2 = new Array(6);
  estatus: number;
  fechaInicio: Date;
  fechaFin: Date;
  btnNext: boolean;
  btnPrev: boolean;
  totalPages: number;
  showPages: number;
  actualPage: number;
  lastElement: number;
  currentElement: number;
  instaladores: any []= [];
  nombre:String="";
  nombre2:String="";
  instaOrd:number;
  c:number=0;
  norepetir:number=0;
  nivel : number = localStorage['level'];



  constructor( private ordenServ: OrdenService) {
    this.estatus = 0;
    this.populate();
  }


  populate() {  
    this.ordenServ.getAllOrders(this.estatus).subscribe((response: any) => {
      this.ordenes = response;
      this.paginar(this.ordenes);
      this.llamarOrden();

    });

  }

  contar(){
    this.c = this.c+1;
  }

   llamarOrden(){
     for (let i = 0; i < this.ordenes.length; i++) {
     this.ordenServ.selectListaInstaldoresOrden(this.ordenes[i].cve_orden).subscribe((Response :any)=>{
       for(let x =0; x<Response.length; x++){
        this.instaladores.push(Response[x]);
       }
      });

     }

  }
  cantidad(cve:number){
   var c=0;
   var salir =false;

    while( salir == false && this.instaladores.length > c){
      if(this.instaladores[c].orden === cve){
        salir = true;
        return "Hay "+this.instaladores[c].cantidad +" instalador(es)";
      }
      c++;
    }
    return "No hay asignado";

}

  reiniciar(){
    this.c = 0;
  }

  ngOnInit(): void {

  }

  filtrar() {
    if (this.estatus != undefined && this.fechaInicio != undefined && this.fechaFin != undefined ) {
      if (this.fechaInicio > this.fechaFin) {
        alert("La fecha de inicio no puede ser mayor a la fecha final.");
      } else {
        if( !(""+this.fechaFin === "") && !(""+this.fechaInicio === "")){
        this.ordenServ.getOrdersFilter(this.fechaInicio, this.fechaFin, this.estatus).subscribe((response: any) => {
            this.ordenes = response;
            this.ordenesMostrar = [];
            this.paginar(this.ordenes);

          });
      }else{
          this.ordenServ.getAllOrders(this.estatus).subscribe((response: any) => {
            this.ordenes = response;
            this.ordenesMostrar = [];
            this.paginar(this.ordenes);

          });
      
        }
      }
      }else{
        this.ordenServ.getAllOrders(this.estatus).subscribe((response: any) => {
          this.ordenes = response;
          this.ordenesMostrar = [];
          this.paginar(this.ordenes);

        });
      }
    }


   borrar(cve_orden : number){
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro de eliminar la orden?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
     this.ordenServ.delete(cve_orden).subscribe((resp:any)=>{
        window.location.reload();
     });
    }
    });
  }

  paginar(arreglo:any[]){
    if(arreglo.length <= 10){
      this.ordenesMostrar = arreglo;
      this.btnNext = false;
      this.btnPrev = false;
      if(arreglo.length == 0){
        this.actualPage = 0;
        this.totalPages = 0;
      }else{
        this.actualPage = 1;
        this.totalPages = 1;
      }
    }else{
      this.btnNext = true;
      this.btnPrev = false;
      this.lastElement = arreglo.length-1;
      this.actualPage = 1;
      this.totalPages = arreglo.length/10;
      if((this.totalPages - Math.trunc(this.totalPages))>0 ){
        this.totalPages -= (this.totalPages - Math.trunc(this.totalPages));
        this.totalPages += 1;
      }
      for(let i=0; i <= 9; i++ ){
          this.ordenesMostrar.push(arreglo[i]);
          this.currentElement = i;
      }
    }
  }

  public siguiente(){
    this.actualPage += 1;
    if(this.actualPage  == this.totalPages){
      this.btnNext=false;
      this.btnPrev=true;
      this.ordenesMostrar = [];
      for(let i = this.currentElement; i < this.lastElement; i++){
        this.ordenesMostrar.push(this.ordenes[i+1]);
      }
      this.currentElement = this.lastElement;
    }else{
      this.btnPrev=true;
      this.ordenesMostrar = [];
      for(let i = 0; i <=  9; i++){
        this.ordenesMostrar.push(this.ordenes[this.currentElement + 1]);
        this.currentElement ++;
      }

    }
  }

  public previo(){
      this.actualPage -= 1;
      this.btnNext = true;
      if(this.actualPage == 1){
        this.ordenesMostrar = [];
        this.btnPrev = false;
        for(let i = 0; i<=9; i++){
          this.ordenesMostrar.push(this.ordenes[i]);
          this.currentElement = i ;
        }
      }else{
        this.currentElement = this.currentElement - (this.ordenesMostrar.length+10);
        this.ordenesMostrar = [];
        for(let i = 0; i<=9; i++){
          this.ordenesMostrar.push(this.ordenes[this.currentElement+1]);
          this.currentElement ++;
        }
      }

  }

}

