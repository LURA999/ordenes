import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  local=environment.api;

  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get(this.local+'Cliente/Cliente.php?todo='+true);
  }

  /**Esta consulta puede consultar todas las ciudades registras, 
   * y tambien todos los usuarios de una ciudad */
  getciudades(opc:number,nombreCiudad:String){
    return this.http.get(this.local+'Cliente/Cliente.php?ciudades='+true+'&opc='+opc+'&nombre='+nombreCiudad);
  }

  getciudadesEstados(opc:number,ciudad:String,estado:String){
    console.log(this.local+'Cliente/Cliente.php?ciudadesEstados='+true+'&opc='+opc+'&ciudad='+ciudad+'&estado='+estado);
    return this.http.get(this.local+'Cliente/Cliente.php?ciudadesEstados='+true+'&opc='+opc+'&ciudad='+ciudad+'&estado='+estado);
  }

  getServicios(id_servicio:String){
    return this.http.get(this.local+'Cliente/Cliente.php?id_servicio='+id_servicio);
  }

  getTotalDeServiciosCliente(cve:String){
    return this.http.get(this.local+'Cliente/Cliente.php?contador=true&cve='+cve);
  }

  insertClientes(cve:String,nombre:String,colonia:String,calle:String,num:String,celular1:String,celular2:String,ciudad:String,estado:String){
    return this.http.post(this.local+'Cliente/Cliente.php?insertarExcel1=1'
    +"&cve="+cve+"&nombre="+nombre+"&colonia="+colonia+"&calle="+calle+"&num="+num+"&celular1="+celular1+"&celular2="+celular2+"&ciudad="+ciudad+"&estado="+estado
    , {responseType: 'text'});
  }
  
  insertClientesServ(cve,clave_serv,servicio,cantidad,interes){
    return this.http.post(this.local+'Cliente/Cliente.php?insertarExcel2=1'+"&cve="+cve+"&clave_serv="+clave_serv+"&servicio="+servicio+"&cantidad="+cantidad+"&interes="+interes
    , {responseType: 'text'});
  }

  getTotalDeServiciosClienteID(cveserv:String,cve:String){
    return this.http.get(this.local+'Cliente/Cliente.php?idcliente='+cve+'&idserv='+cveserv+'&buscarIDserv=true');
  }
  
  id(opc:number,cve:String, estado:String, ciudad:String){
    return this.http.get(this.local+'Cliente/Cliente.php?opc='+opc+'&id=true&cve='+cve+'&estado='+estado+'&ciudad='+ciudad);
  }

  actualizarEstatus_Estado(opc: number,estatus: String, cve : String){
    return this.http.patch(this.local+'Cliente/Cliente.php?estatus2='+opc+'&cve='+cve+'&estatus='+estatus,{responseType: 'text'});
  }

  clienteRepetido(cve : String){
    return this.http.get(this.local+'Cliente/Cliente.php?repetidosClientes=true&cve='+cve);
  }

}
