import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  ComentarioService } from "src/app/services/comentario.service";
import Swal from 'sweetalert2';
import { EditarComentarioComponent } from '../editar-comentario/editar-comentario.component';

@Component({
  selector: 'app-popup-comentario',
  templateUrl: './popup-comentario.component.html',
  styleUrls: ['./popup-comentario.component.css']
})
export class PopupComentarioComponent implements OnInit {
  contador =0;
  comentarios : any []=[];
  comentariosMostrar : any []=[];
  listaConvenios : String []=[];
  tamanoReal : any []=[];
  limite=0;
  limite2=0;
  aux2 =0;
  btnNext: boolean;
  btnPrev: boolean;
  actualPage: number;
  totalPages: number;
  currentElement: number;
  lastElement: number;
  nombre = localStorage.getItem('name')
  nivel = localStorage.getItem('level')
  email = localStorage.getItem('email')

  comentario : String;
  dialogRef   : any;
  atras : Boolean = true;
  adelante : Boolean;


  onKey(e){
    this.contador = e.target.value.length;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private serviceComent :ComentarioService,
  public dialog: MatDialog){
    this.todosServCliente();
  }

  ngOnInit(): void {
      
  }

  async todosServCliente(){
   await this.serviceComent.getAllServCliente(this.data.clave, this.data.fecha).subscribe((resp :any) =>{
     this.comentarios = resp;
     this.comentariosMostrar = [];
     this.paginar(this.comentarios)
   });
  
  }

  async actualizarComentarios(c : String){
    await this.serviceComent.insertComentario(this.data.clave,this.data.fecha,c,this.data.name, this.email).toPromise();
    await this.serviceComent.getAllServCliente(this.data.clave, this.data.fecha).subscribe((resp :any) =>{
      this.comentarios = resp;
      this.comentariosMostrar = [];
      this.paginar(this.comentarios)
    });
  }

  async editarComentario(e:String,idcomentario : String,clave_serv : String,fecha : String){
     this.dialogRef = this.dialog.open(EditarComentarioComponent, 
      {data: {mensaje: e, idcomentario: idcomentario, clave_serv: clave_serv, fecha: fecha},width:"500px",
      panelClass: ['animate__animated','animate__slideInLeft']});

      this.dialogRef.afterClosed().subscribe(result => {
        this.todosServCliente()
      });
      
    
 }


  async deleteComentario(idcomentario : String,clave_serv : String,fecha : String){
    Swal.fire({
      icon: 'question',
      title: '¿Esta seguro de eliminar el comentario?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
      this.eliminarComentario(idcomentario,clave_serv,fecha);
    }
    });
  }

  async eliminarComentario(idcomentario,clave_serv,fecha){
    await this.serviceComent.deleteComentario(idcomentario,clave_serv,fecha).toPromise();
    await this.todosServCliente();
  }


  paginar(arreglo:any[]){
    if(arreglo.length <= 4){
      this.comentariosMostrar = arreglo;
      this.btnNext = false;
      this.btnPrev = false;
      if(arreglo.length == 0){
        this.actualPage = 0;
        this.totalPages = 0;
      }else{
        this.actualPage = 1;
        this.totalPages = 1;
      }
    }else{
      this.btnNext = true;
      this.btnPrev = false;
      this.lastElement = arreglo.length-1;
      this.actualPage = 1;
      this.totalPages = arreglo.length/4;
      if((this.totalPages - Math.trunc(this.totalPages))>0 ){
        this.totalPages -= (this.totalPages - Math.trunc(this.totalPages));
        this.totalPages += 1;
      }
      for(let i=0; i <= 3; i++ ){
          this.comentariosMostrar.push(arreglo[i]);
          this.currentElement = i;
      }
    }
  }

  public siguiente(){
    this.actualPage += 1;
    if(this.actualPage  == this.totalPages){
      this.btnNext=false;
      this.btnPrev=true;
      this.comentariosMostrar = [];
      for(let i = this.currentElement; i < this.lastElement; i++){
        this.comentariosMostrar.push(this.comentarios[i+1]);
      }
      this.currentElement = this.lastElement;
    }else{
      this.btnPrev=true;
      this.comentariosMostrar = [];
      for(let i = 0; i <=  3; i++){
        this.comentariosMostrar.push(this.comentarios[this.currentElement + 1]);
        this.currentElement ++;
      }
    }
  }

  public previo(){
      this.actualPage -= 1;
      this.btnNext = true;
      if(this.actualPage == 1){
        this.comentariosMostrar = [];
        this.btnPrev = false;
        for(let i = 0; i<=3; i++){
          this.comentariosMostrar.push(this.comentarios[i]);
          this.currentElement = i ;
        }
      }else{
        this.currentElement = this.currentElement - (this.comentariosMostrar.length+4);
        this.comentariosMostrar = [];
        for(let i = 0; i<=3; i++){
          this.comentariosMostrar.push(this.comentarios[this.currentElement+1]);
          this.currentElement ++;
        }
      }
  }
    
}
