import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComentarioService } from 'src/app/services/comentario.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-editar-comentario',
  templateUrl: './editar-comentario.component.html',
  styleUrls: ['./editar-comentario.component.css']
})
export class EditarComentarioComponent implements OnInit {
  contador:number=0;  
  date1 : FormControl
  date2 : FormControl
  @ViewChild("fecha") fecha;
  @ViewChild("fechaValue") fecha2;


  fechaSin : String = this.data.fecha.split(" ",1) ;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogoRef: MatDialogRef<EditarComentarioComponent>,
  private serviceComent: ComentarioService) {
   }

  ngOnInit(): void {
    this.date1 = new FormControl(new Date(this.data.fecha)) 
    this.date2 = new FormControl(new Date(this.data.fecha)) 


    if(this.data.opc ==10){
        this.contador = this.data.mensaje.length;
    }else{
        this.contador = this.data.mensaje.length;
    }
  }  

  onKey(e){
    this.contador = e.target.value.length;
  }

  async editar(e:String, fecha:String, cantidad:String,selectValue:String){
    let splitted = [] ;
    switch(this.data.opc){
      case 3:
       await this.serviceComent.updateComment(e,this.data.idcomentario,this.data.clave_serv,this.data.fecha," 00:00:00","0","").toPromise();
      break;
      case 2:
         splitted =  fecha.split("/");
        fecha = splitted[2]+"-"+splitted[1]+"-"+splitted[0];
        await this.serviceComent.updateCommentAgreement(e,this.data.idcomentario,this.data.clave_serv,this.data.fecha,fecha+" 00:00:00",cantidad,this.data.idconvenio).toPromise();
      break;
      case 1:
         splitted =  fecha.split("/");
        fecha = splitted[2]+"-"+splitted[1]+"-"+splitted[0];
        await this.serviceComent.updateCommentPay(e,this.data.idcomentario,this.data.clave_serv,this.data.cantidad,fecha+" 00:00:00",cantidad,selectValue).toPromise();
      break;
    }


  //  this.dialogoRef.close({data:"Comentario: "+e+" \nFecha: "+ fecha+"\nCantidad: "+cantidad+"\nSelect: "+selectValue+""})
  }

  dateChange(e,valor){
    let splitted =  valor.split("-");
    let fecha 
    let dia :number
    let diaFecha 
    let diaFechaNumero : number

    if(splitted.length ==3){
       fecha = new Date(splitted[1]+"-"+splitted[0]+"-"+splitted[2])
       dia  =splitted[0];
       diaFecha = (fecha+"").split(" ", 3)
       diaFechaNumero = +diaFecha[2]
      if( diaFechaNumero == dia){
        e.target.value = fecha; 
      }else{
        e.target.value = ""
      }
    }else{
      let splitted2 =  valor.split("/");
       fecha = new Date(splitted2[1]+"/"+splitted2[0]+"/"+splitted2[2])
       dia  =splitted2[0];
       diaFecha = (fecha+"").split(" ", 3)
       diaFechaNumero = +diaFecha[2]
      if( diaFechaNumero == dia){
        e.target.value = fecha; 
      }else{
        e.target.value = "";
      }
    }

  }

}
