import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CatalogueService } from 'src/app/services/catalogue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abc-tipo-documento',
  templateUrl: './abc-tipo-documento.component.html',
  styleUrls: ['./abc-tipo-documento.component.css']
})
export class AbcTipoDocumentoComponent {

  tipos : any[];
  titulo = "Tipos de documento";
  descripcion = "";
  valido = true;

  constructor(private catalogoServ : CatalogueService) { 
    this.catalogoServ.getAll().subscribe((resp:any)=>{
      this.tipos = resp;
    });
  }

  alta(){
    var actividad;
      Swal.fire({
      title: 'Agregar tipo documento',
      input: 'text',
      inputValue: actividad,
      showDenyButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Escribe algo';
        }else{
          this.catalogoServ.insert(value).subscribe(resp=>{
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
        this.catalogoServ.deleteTipoDocumento(parseInt(cve_actividad)).subscribe((response: any) => {
          window.location.reload();
        });
      }
    });
  }
  
}
