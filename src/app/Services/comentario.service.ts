import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  local=environment.api;

  constructor(private http : HttpClient) { }
  insertComentario(cve:  String, clave_serv : String, comentario : String, nombre :String, correo :String, categoria : number){
    return this.http.post(this.local+'Comentarios.php?cve='+cve+'&clave_serv='+clave_serv+'&comentario='+comentario+'&nombre='+nombre+'&correo='+correo+'&tipo='+categoria,  {responseType: 'text'});
  }

  getAllServCliente(cve:String, fecha:String){
    return this.http.get(this.local+'Comentarios.php?cve='+cve+'&fecha='+fecha);
  }

  updateComentario(comentario : String,idcomentario:String,clave_serv:String,fecha:String){
    return this.http.patch(this.local+'Comentarios.php?comentario='+comentario+'&idcomentario='+idcomentario+'&clave_serv='+clave_serv+'&fecha='+fecha,  {responseType: 'text'});
  }

  deleteComentario(idcomentario:String,clave_serv:String,fecha:String){
    return this.http.delete(this.local+'Comentarios.php?idcomentario='+idcomentario+'&clave_serv='+clave_serv+'&fecha='+fecha,  {responseType: 'text'});
  }
}
