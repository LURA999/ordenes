import { Component, OnInit } from '@angular/core';
import {LevantamientoService} from '../../services/levantamiento.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lista-levantamientos',
  templateUrl: './lista-levantamientos.component.html',
  styleUrls: ['./lista-levantamientos.component.css']
})
export class ListaLevantamientosComponent implements OnInit {
  levantamientos: any[] = [];
  levantamientosMostrar: any[] = [];
  ordenesMostrar: any[] = [];
  estatus: number = 0;
  fechaInicio: Date;
  fechaFin: Date;
  btnNext: boolean;
  btnPrev: boolean;
  totalPages: number;
  showPages: number;
  actualPage: number;
  lastElement: number;
  currentElement: number;
  cve_levantamiento: number;
  instalador:string;
  nivel : number = localStorage['level'];
  constructor(private sLevantamiento : LevantamientoService) {
    this.populate();
   }

  ngOnInit(): void {

  }

  filtrar() {
    if (this.fechaInicio != undefined && this.fechaFin != undefined && this.estatus !=undefined) {
      if (this.fechaInicio > this.fechaFin) {
        alert("La fecha de inicio no puede ser mayor a la fecha final.");
      } else {
        if( !(""+this.fechaFin === "") && !(""+this.fechaInicio === "")){
        this.sLevantamiento.getLevantamientosFiltro(this.fechaInicio, this.fechaFin, this.estatus).subscribe((response: any) => {
          this.levantamientos = response;
          this.levantamientosMostrar = [];
          this.paginar(this.levantamientos);
        });
      }else{
      this.sLevantamiento.getLevantamientos(parseInt(localStorage['id']),this.estatus,parseInt( localStorage['level'])).subscribe((response: any) => {
        this.levantamientos = response;
        this.levantamientosMostrar = [];
        this.paginar(this.levantamientos);
      });
    }
    }
  }else{
    this.sLevantamiento.getLevantamientos(parseInt(localStorage['id']),this.estatus,parseInt( localStorage['level'])).subscribe((response: any) => {
      this.levantamientos = response;
      this.levantamientosMostrar = [];
      this.paginar(this.levantamientos);
    });
  }
  }

  populate(){
    this.sLevantamiento.getLevantamientos(parseInt(localStorage['id']),0,parseInt( localStorage['level'])).subscribe((resp:any)=>{
      this.levantamientos = resp;
      this.paginar(this.levantamientos);
    });
  }

  paginar(arreglo:any[]){
    if(arreglo.length <= 10){
      this.levantamientosMostrar = arreglo;
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
          this.levantamientosMostrar.push(arreglo[i]);
          this.currentElement = i;
      }
    }
  }

  public siguiente(){
    this.actualPage += 1;
    if(this.actualPage  == this.totalPages){
      this.btnNext=false;
      this.btnPrev=true;
      this.levantamientosMostrar = [];
      for(let i = this.currentElement; i < this.lastElement; i++){
        this.levantamientosMostrar.push(this.levantamientos[i+1]);
      }
      this.currentElement = this.lastElement;
    }else{
      this.btnPrev=true;
      this.levantamientosMostrar = [];
      for(let i = 0; i <=  9; i++){
        this.levantamientosMostrar.push(this.levantamientos[this.currentElement + 1]);
        this.currentElement ++;
      }
    }
  }

  public previo(){
      this.actualPage -= 1;
      this.btnNext = true;
      if(this.actualPage == 1){
        this.levantamientosMostrar = [];
        this.btnPrev = false;
        for(let i = 0; i<=9; i++){
          this.levantamientosMostrar.push(this.levantamientos[i]);
          this.currentElement = i ;
        }
      }else{
        this.currentElement = this.currentElement - (this.levantamientosMostrar.length+10);
        this.levantamientosMostrar = [];
        for(let i = 0; i<=9; i++){
          this.levantamientosMostrar.push(this.levantamientos[this.currentElement+1]);
          this.currentElement ++;
        }
      }
  }

  public borrar(cve_levantamiento : number){
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro de eliminar el levantamiento?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
     this.sLevantamiento.delete(cve_levantamiento).subscribe((resp:any)=>{
        window.location.reload();
     });
    }
    });
  }




}
