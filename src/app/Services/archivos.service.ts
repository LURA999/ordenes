import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  local='http://localhost';
 //local='';
  constructor(private http : HttpClient) { }

  
  insertarArchivo(archivo:FormData, cve_comentario:string){
    return this.http.post(this.local+'/API3.1/archivos.php?cve_comentario='+cve_comentario, archivo, {responseType: 'text'});
  }

  insertarArchivoLevantamiento(archivo:FormData, cve_levantamiento:string){
    return this.http.post(this.local+'/API3.1/archivosLevantamiento.php?cve_levantamiento='+cve_levantamiento, archivo, {responseType: 'text'});
  }

  getDocumentos(cve_comentario:string){
    return this.http.get(this.local+'/API3.1/archivos.php?cve_comentario='+cve_comentario);
  }

  getDocumentosLevantamiento(cve_levantamiento:string){
    return this.http.get(this.local+'/API3.1/archivosLevantamiento.php?cve_levantamiento='+cve_levantamiento);
  }

  getFile(imageName:string){
    return this.http.get(this.local+'/API3.1/archivos.php?nombre='+imageName);
  }
}
