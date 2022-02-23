import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent   {

  usuarios: any[] = [] ;
  public cve : number;
  sub$ = new Subscription();
  constructor(private route:Router, private userService: UserService ) { 
    this.sub$.add(this.userService.getAll().subscribe((result:any)=>{ this.usuarios = result.container}));
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
        this.sub$.add(this.userService.delete(parseInt(cve_usuario)).subscribe());
     window.location.reload();
    }
    });
  }

ngOnDestroy(): void {
  this.sub$.unsubscribe();
}
  
}