import { Component } from '@angular/core';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent  {

  usuarios:any[] = [];
  public cont : number = 0;
  public cve : number;

 

  constructor(private http: HttpClient, private route:Router ) { 
    this.http.get('http://localhost/Usuario.php?cve=0')
    .subscribe((resp:any)=>{
      this.usuarios = resp;
    });
  }

  public borrar(cve_usuario:number){
    this.http.delete('http://localhost/Usuario.php?cve='+cve_usuario ).subscribe(resp=>{});
    window.location.reload();
  }
}
