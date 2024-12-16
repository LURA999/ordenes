import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  local='http://localhost';
  //local='';
  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get(this.local+'/API3.1/Catalogos/tipoDocumento.php');
  }

  insert(tipo:string){
    return this.http.post(this.local+'/API3.1/Catalogos/tipoDocumento.php',{tipo:tipo},{responseType:'text'});
  }

  deleteTipoDocumento(cve_tipo:number){
    return this.http.delete(this.local+'/API3.1/Catalogos/tipoDocumento.php?cve_tipo='+cve_tipo);
  }

  obtenerActividades(){
    return this.http.get(this.local+'/API3.1/Catalogos/tipoActividad.php');
  }

  borrarActividad(cve_actividad:number){
    return this.http.delete(this.local+'/API3.1/Catalogos/tipoActividad.php?cve_actividad='+cve_actividad);
  }

  insertarActividad(actividad:string){
    return this.http.post(this.local+'/API3.1/Catalogos/tipoActividad.php',{actividad:actividad},{responseType:'text'});
  }

  obtenerCiudades(){
    return this.http.get(this.local+'/API3.1/Catalogos/ciudades.php');
  }

  obtenerUsuarioCiudades(cve_usuario:number){
    return this.http.get(this.local+'/API3.1/Catalogos/ciudades.php?usuariociudades=1&cve_usuario='+cve_usuario);
  }


  insertarCiudad(ciudad:string){
    return this.http.post(this.local+'/API3.1/Catalogos/ciudades.php',{nombre:ciudad},{responseType: 'text'});
  }

 
  obtenerVehiculos(){
    return this.http.get(this.local+'/API3.1/Catalogos/vehiculos.php');
  }

  insertarVehiculo(descripcion:string,placa:string,cve_ciudad:number){
    return this.http.post(this.local+'/API3.1/Catalogos/vehiculos.php',{descripcion:descripcion,placa:placa,ciudad:cve_ciudad},{responseType: 'text'});
  }

  eliminarVehiculo(cve_vehiculo:number){
    return this.http.delete(this.local+'/API3.1/Catalogos/vehiculos.php?cve_vehiculo='+cve_vehiculo);
  }

  actualizarEstatusVehiculo(cve_vehiculo:number, estatus:number){
    return this.http.patch(this.local+'/API3.1/Catalogos/vehiculos.php',{cve_vehiculo:cve_vehiculo,estatus:estatus},{responseType:'text'});
  }


}

