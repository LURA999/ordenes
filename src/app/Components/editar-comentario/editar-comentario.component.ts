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
    console.log(this.data)
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

    
   // console.log("Comentario "+e+"\nfecha "+fecha+"\ncantidad "+cantidad+"\nselectValue "+selectValue)
  //  console.log(" opcion: "+this.data.opc+"\n comentario: "+e+"\n idcomentario: "+this.data.idcomentario+"\n clave_Serv: "+this.data.clave_serv+"\n fecha: "+this.data.fecha+"\n fecha: "+fecha+"\n cantidad: "+cantidad+"\n idconvenio "+this.data.idconvenio)

    switch(this.data.opc){
      case 10:
       await this.serviceComent.updateComentario(this.data.opc,e,this.data.idcomentario,this.data.clave_serv,this.data.fecha,"0:00:00","0","").toPromise();
      break;
      case 1:
        await this.serviceComent.updateComentario(this.data.opc,e,this.data.idcomentario,this.data.clave_serv,this.data.fecha,fecha+" 0:00:00",cantidad,this.data.idconvenio).toPromise();
      break;
      default:
        console.log("OPCION: "+this.data.opc+"\ncomentario: "+e+"\nidcomentario: "+this.data.idcomentario+"\nclaveServicio: "+this.data.clave_serv+"\nFecha de publicacion: "+this.data.cantidad+"\nFecha nueva: "+fecha+" 0:00:00"+"\nCantidad: "+cantidad+"\nSelect: "+selectValue)
        await this.serviceComent.updateComentario(this.data.opc,e,this.data.idcomentario,this.data.clave_serv,this.data.cantidad,fecha+" 0:00:00",cantidad,selectValue).toPromise();
    }

    this.dialogoRef.close({data:"Comentario: "+e+" \nFecha: "+ fecha+"\nCantidad: "+cantidad+"\nSelect: "+selectValue+""})
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
