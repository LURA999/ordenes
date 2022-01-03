import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler,  } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
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

  borrar(cve_usuario: string) {
    Swal.fire({
      icon: 'question',
      title: '¿Desea eliminar este elemento?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
     this.userService.delete(parseInt(cve_usuario)).subscribe();
     window.location.reload();
    }
    });
  }


  
}