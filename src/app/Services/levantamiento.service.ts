import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LevantamientoModel } from '../models/levantamiento.model';
import { FormGroup } from '@angular/forms';
import { AbsoluteSourceSpan, tokenReference } from '@angular/compiler';
import { AbcTipoActividadComponent } from '../Components/abc-tipo-actividad/abc-tipo-actividad.component';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LevantamientoService {
  local='http://localhost/API3.1/';
  //local='';
  constructor(private http : HttpClient) { }

  mostrarInstaladoresDeLevantamiento(cve_levantamiento:number){
    return this.http.get(this.local+"Levantamiento.php?opcion=2&cve_levantamiento="+cve_levantamiento);
  }
  insertMasInstaladoresDeLevantamiento(ordenInfo){
    return this.http.post(this.local+'Levantamiento.php?masInsta=true', ordenInfo, {responseType:"text"});
    
  }
  deleteInstaladorDeLevantamiento(cveOrd:number, cveInsta:number){
    return this.http.delete(this.local+"Levantamiento.php?eli=true&cveOrd="+cveOrd+"&cveInsta="+cveInsta);
  }
  getTodosLevantamientos(){
    return this.http.get(this.local+'Levantamiento.php?grafica='+true);
  }
  getLevantamientosAdmin(fechaInicio: Date){
    return this.http.get(this.local+'Levantamiento.php?fechaInicio='+formatDate(fechaInicio, "yyyy-MM-dd","en-US")+'&inicioAdmin='+true);
  }
  selectListaInstaldoresLevantamiento(cve: number){
    return this.http.get(this.local+"Levantamiento.php?lista=true&cve="+cve);
  }
  getCantidadLevantamiento(id:number) {
    return this.http.get(this.local+'Levantamiento.php?cantidad=true&cv='+id);
  }
  insertInstaladoresDeLevantamiento(cve_instalador:number){
    return this.http.patch(this.local+"Levantamiento.php",{cve_instalador:cve_instalador}, {responseType:"text"});
  }

  getCordiLevantamientoInicio(fechaInicio:Date, fechaFin:Date, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    if(!fechaInicio && !fechaFin || !fechaInicio){
      return this.http.get(this.local+'Levantamiento.php?cve_usuario='+id+'&nivel='+nivel+"&inicioCordi="+true);
    }else{
      return this.http.get(this.local+'Levantamiento.php?cve_usuario='+id+'&nivel='+
      nivel+"&fechaInicio="+fechaInicio+"&inicioCordi="+true);
    }
  }

  getCordiLevantamientoCalendario(fechaInicio:Date, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'Levantamiento.php?cve_usuario='+id+'&nivel='+
    nivel+"&fechaInicio="+formatDate(fechaInicio,"yyyy,MM,dd","en-US")+"&calendarioCordi="+true);
  }


  getInstaladorLevantamientoInicio(fechaInicio:Date,id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'Levantamiento.php?cve_usuario='+id+'&nivel='+
    nivel+"&fechaInicio="+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"&inicioInstalador="+true);
    }
  
  getRepetidoras(){
    return this.http.get(this.local+'Catalogos/repetidora.php');
  }

  getServicios(){
    return this.http.get(this.local+'Catalogos/servicios.php');
  }
  
  getMegas(){
    return this.http.get(this.local+'Catalogos/megas.php');
  }

  getLevantamientos(cve_usuario:number, estatus:number , nivel:number){
    return this.http.get(this.local+'Levantamiento.php?cve_usuario='+cve_usuario+'&estatus='+estatus+
    '&nivel='+nivel);
  }

  getLevantamientosId(cve_levantamiento){
    return this.http.get(this.local+'Levantamiento.php?cve_levantamiento='+cve_levantamiento);
  }

  getLevantamientosFiltro(fechaInicio:Date, fechaFin:Date,estatus : number = 0, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'Levantamiento.php?cve_usuario='+id+'&nivel='+
    nivel+'&estatus='+estatus+'&fechaInicio='+fechaInicio+'&fechaFin='+fechaFin);
  }

  insertLevantamiento(levantamiento : LevantamientoModel){
    return this.http.post(this.local+'Levantamiento.php', levantamiento,{responseType:'text'});
  }

  delete(cve_levantamiento : number){
    return this.http.delete(this.local+'Levantamiento.php?cve_levantamiento='+cve_levantamiento);
  }

  cambiarInstalador(levantamientoInstalador){
    return this.http.post(this.local+'Levantamiento.php?agregarInsta=true',levantamientoInstalador, {responseType:'text'});
  }  

  cambiarFecha(cve_levantamiento:number, fecha: Date, hora: string){
    return this.http.patch(this.local+'Levantamiento.php',{cve_levantamiento:cve_levantamiento, fechaProgramadaNueva:fecha, hora:hora}, {responseType:'text'});
  }  

  cambiarVehiculo(cve_levantamiento:number, cve_vehichulo:number){
    return this.http.patch(this.local+'Levantamiento.php',{cve_levantamiento:cve_levantamiento, cve_vehiculo:cve_vehichulo}, {responseType:'text'});
  }  


  actualizarLevantamiento(altura:number,tipo:string,tipoTecho:string,torre:string,repetidora:number,rack:number,linea:number,descripcion:string,energia:number,cve_levantamiento:number){
    return this.http.patch(this.local+'Levantamiento.php',{altura:altura, tipo:tipo,
  tipoTecho:tipoTecho,torre:torre,repetidora:repetidora,rack:rack,linea:linea,
descripcion:descripcion,energia:energia,cve_levantamiento:cve_levantamiento}, {responseType:'text'});
  }  
    obtenerultimolevantamiento(){
    return this.http.get(this.local+'Levantamiento.php?ultima='+true);
  }
}
