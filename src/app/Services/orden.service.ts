import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdenModel } from '../models/orden.model';
import { formatDate } from '@angular/common';
import { ordenInstaladores } from '../models/ordenInstaladores.model';
@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  local='http://localhost/API3.1/';
  //local='';
  constructor(private http: HttpClient) { }

  getTodosOrden(){
    return this.http.get(this.local+'OrdenServicio.php?grafica='+true);
  }
  getOrdenesAdmin(fechaInicio: Date){
    return this.http.get(this.local+'OrdenServicio.php?fechaInicio='+formatDate(fechaInicio, "yyyy-MM-dd","en-US")+'&inicioAdmin='+true);
  }
  getCordiOrdenInicio(fechaInicio:Date,fechaFin:Date, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    if(!fechaInicio && !fechaFin || !fechaFin){
      return this.http.get(this.local+'OrdenServicio.php?cve_usuario='+id+'&nivel='+nivel+"&inicioCordi="+true);
    }else{
      return this.http.get(this.local+'OrdenServicio.php?cve_usuario='+id+'&nivel='+
      nivel+"&fechaInicio="+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"&inicioCordi="+true);
    }
  }

  getCordiOrdenCalendario(fechaInicio:Date, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'OrdenServicio.php?cve_usuario='+id+'&nivel='+
      nivel+"&fechaInicio="+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"&calendarioCordi="+true);
  }

  getInstaladorOrdenInicio(fechaInicio:Date,id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'OrdenServicio.php?cve_usuario='+id+'&nivel='+
    nivel+"&fechaInicio="+formatDate(fechaInicio,"yyyy-MM-dd","en-US")+"&inicioInstalador="+true);
}

  getAllOrders(status:number = 0){
    return this.http.get(this.local+'OrdenServicio.php?id='+localStorage.getItem('id')+'&nivel='+
    localStorage.getItem('level')+'&cve_orden=0&estatus='+status);
  }

  getServicios(){
    return this.http.get(this.local+'Catalogos/servicios.php');
  }

  getOrdersFilter(fechaInicio:Date, fechaFin:Date,estatus : number = 0, id:number = parseInt(localStorage.getItem('id')), nivel : number = parseInt(localStorage.getItem('level'))){
    return this.http.get(this.local+'OrdenServicio.php?cve_usuario='+id+'&nivel='+
    localStorage.getItem('level')+'&cve_orden=0&estatus='+estatus+'&fechaInicio='+fechaInicio+'&fechaFin='+fechaFin);
  }

  getOrder(cve_orden:number){   
    return this.http.get(this.local+'OrdenServicio.php?id_orden='+cve_orden);
  }

  getInstallers(){
    return this.http.get(this.local+'Instalador.php');
  }

  insertInstaladoresDeOrden(cve_instalador){
    return this.http.patch(this.local+"OrdenServicio.php?agregarInsta=true",{cve_instalador:cve_instalador}, {responseType:'text'});
  }

  insertMasInstaladoresDeOrden(ordenInfo){
    return this.http.post(this.local+'OrdenServicio.php?masInsta=true', ordenInfo, {responseType:"text"});
    
  }

  obtenerultimaorden(){   
    return this.http.get(this.local+'OrdenServicio.php?ultima='+true);
  }
  mostrarInstaladoresDeOrden(cve_orden:number){
    return this.http.get(this.local+"OrdenServicio.php?opcion=2&cve_orden="+cve_orden);
  }

  deleteInstaladorDeOrden(cveOrd:number, cveInsta:number){
    return this.http.delete(this.local+"OrdenServicio.php?eli=true&cveOrd="+cveOrd+"&cveInsta="+cveInsta);
  }

  selectListaInstaldoresOrden(cve : number){
    return this.http.get(this.local+"OrdenServicio.php?lista=true&cve="+cve);
  }

  getCantidadOrden(id:number) {
    return this.http.get(this.local+'OrdenServicio.php?cantidad=true&cv='+id);
  }


  createOrder(orden : OrdenModel){
    return this.http.post(this.local+'OrdenServicio.php', orden,{responseType: 'text'});
  }

  updateDate(cve_orden:number, fecha:Date, hora:string){
    return this.http.patch(this.local+'OrdenServicio.php',{cve_orden:cve_orden, fechaProgramadaNueva:fecha, hora:hora}, {responseType:'text'});
  }

  getComentarios(cve_orden:number){
    return this.http.get(this.local+'OrdenServicio.php?comentario=1&cve_orden='+cve_orden);
  }

  insertComentarios(cve_orden:number, cve_usuario:number, comentario:string){
    return this.http.patch(this.local+'OrdenServicio.php',{cve_usuario:cve_usuario, comentario:comentario, cve_orden:cve_orden}, {responseType:'text'});
  }
  updateInstaller(cve_orden:number, id_instalador:number){
    return this.http.patch(this.local+'OrdenServicio.php',{cve_orden:cve_orden, instalador:id_instalador}, {responseType:'text'});
  }

  updateVehiculo(cve_orden:number, cve_vehiculo:number){
    return this.http.patch(this.local+'Catalogos/vehiculos.php',{cve_orden:cve_orden, cve_vehiculo:cve_vehiculo}, {responseType:'text'});
  }


  addDocument(file:any){
    return this.http.post(this.local+'Catalogos/DetallesOrden.php', file);
  }

  delete(cve_orden:number){
    return this.http.delete(this.local+'OrdenServicio.php?cve_orden='+cve_orden);
  }

  cerrarOrden(cve_orden:number){
    return this.http.patch(this.local+'OrdenServicio.php',{cerrar:1,cve_orden: cve_orden}, {responseType:'text'});
  }


}
