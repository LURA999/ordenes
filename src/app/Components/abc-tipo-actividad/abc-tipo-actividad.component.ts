import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CatalogueService } from 'src/app/services/catalogue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abc-tipo-actividad',
  templateUrl: './abc-tipo-actividad.component.html',
  styleUrls: ['./abc-tipo-actividad.component.css']
})
export class AbcTipoActividadComponent {
  actividades : any[] = [];
  titulo = "Actividades";
  valido = true;

  constructor(private servicioCatalogo: CatalogueService) { 
    servicioCatalogo.obtenerActividades().subscribe((response:any)=>{
      this.actividades= response;
    });
  }

  alta(){
    var actividad;
      Swal.fire({
      title: 'Agregar actividad',
      input: 'text',
      inputValue: actividad,
      showDenyButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Escribe algo';
        }else{
          this.servicioCatalogo.insertarActividad(value).subscribe((response:any)=>{
            window.location.reload();
          });
        }
      }
    });
  }

  borrar(cve_actividad: string) {
    Swal.fire({
      icon: 'question',
      title: '¿Desea eliminar este elemento?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this.servicioCatalogo.borrarActividad(parseInt(cve_actividad)).subscribe((response:any)=>{
          window.location.reload();
        });
      }
    });
  }

}
