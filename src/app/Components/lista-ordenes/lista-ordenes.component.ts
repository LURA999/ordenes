import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-lista-ordenes',
  templateUrl: './lista-ordenes.component.html',
  styleUrls: ['./lista-ordenes.component.css']
})
export class ListaOrdenesComponent  {

  ordenes:any[] = [];

  constructor(private http: HttpClient ) { 
    this.http.get('http://localhost/OrdenServicio.php')
    .subscribe((resp:any)=>{
      this.ordenes = resp;

    });

  }


}
