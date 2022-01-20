import { Component, OnInit, Inject } from '@angular/core';
import { ComentarioService } from 'src/app/services/comentario.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-editar-comentario',
  templateUrl: './editar-comentario.component.html',
  styleUrls: ['./editar-comentario.component.css']
})
export class EditarComentarioComponent implements OnInit {
  contador:number=0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private serviceComent: ComentarioService) { }
  textarea :number;
  ngOnInit(): void {
    this.textarea= document.getElementById("texto").innerHTML= this.data.mensaje;
    this.contador = this.data.mensaje.length;
  }
  onKey(e){
    this.contador = e.target.value.length;
  }
 async editar(e:String){
  await this.serviceComent.updateComentario(e,this.data.idcomentario,this.data.clave_serv,this.data.fecha).toPromise();
  }

}
