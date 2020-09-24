import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler,  } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent   {

  usuarios: any[] = [] ;
  public cve : number;
 

  constructor(private route:Router, private userService: UserService ) { 
    this.userService.getAll().subscribe((result:any)=>{ this.usuarios = result});
 }

  public borrar(cve_usuario:number, nombre:string){
    var confirmacion = confirm("¿Desea eliminar el usuario "+nombre+"?");
    if(confirmacion){
     this.userService.delete(cve_usuario).subscribe();
     window.location.reload();
    }
  }


  
}
