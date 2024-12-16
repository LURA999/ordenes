import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  local='http://localhost';
  //local='';
  constructor(private http : HttpClient) { }

  reporteInstaladores(fechaInicio:string, fechaFin:string){
    return this.http.get(this.local+'/API3.1/Reporte.php?fechaInicio='+fechaInicio+'&fechaFin='+fechaFin);
  }

}
