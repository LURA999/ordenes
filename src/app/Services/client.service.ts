import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {
  local=environment.api;

  constructor(private http : HttpClient) { }
/**Se instalo nueva API */
  getAll(opc:number){
    return this.http.get(this.local+'API/Customers/customers.php?opc='+opc);
  }

  /**Esta consulta puede consultar todas las ciudades registras, 
   * y tambien todos los usuarios de una ciudad */

  /**Se instalo nueva API */
  getciudades(opc:number,nombreCiudad:String){
    return this.http.get(this.local+'API/Cities/cities.php?ciudades='+nombreCiudad+'&opc='+opc+'&cve=false');
  }

  getciudadesEstados(opc:number,ciudad:String,estado:String){
    return this.http.get(this.local+'API/Cities/citiesState.php?opc='+opc+'&ciudad='+ciudad+'&estado='+estado);
  }
  /**Se instalo nueva API */
  getServiciosCve(id_servicio : String){
    return this.http.get(this.local+'API/Customers/customerServices.php?cve='+id_servicio);
  }

  /**Se instalo nueva API */
  getServiciosAll(){
    return this.http.get(this.local+'API/Services/serviceAgreements.php');
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
    return this.http.get(this.local+'API/services_client.php?cve='+cve+'&cveserv='+cveserv);
  }
  
  id(opc:number,cve:String, estado:String, ciudad:String){
    return this.http.get(this.local+'API/Customers/customerSearch.php?opc='+opc+'&cve='+cve+'&estado='+estado+'&ciudad='+ciudad);
  }

  actualizarEstatus_Estado(estatus2: number,estatus: String, cve : String){
    return this.http.patch(this.local+'API/Customers/customers.php',{estatus2:estatus2,cve:cve,estatus:estatus},{responseType: 'text'});
  } 
  
  actualizarCliente(opc :number,cve : String){
    return this.http.patch(this.local+'Comentarios.php?opc='+opc+'&cve='+cve+'&clientes=false',  {responseType: 'text'});
  }

  clienteRepetido(cve : String){
    return this.http.get(this.local+'API/services_client.php?cve_cliente='+cve);
  }

}
