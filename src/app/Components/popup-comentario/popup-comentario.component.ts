import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
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
  contadorFecha=0;
  comentarios : any []=[];
  comentariosMostrar : any []=[];
  listaConvenios : String []=[];
  categoria : number=0;
  tabCategoria : number=0;
  tamanoReal : any []=[];
  btnNext: boolean;
  btnPrev: boolean;
  actualPage: number;
  totalPages: number;
  currentElement: number;
  lastElement: number;
  nivel =localStorage.getItem("level") 
  @ViewChild('inputFecha') inputFecha;
  @ViewChild('picker') calendario;
  @ViewChild('inputPago') inputPago;
  @ViewChild('select') select;
  comentario : String;
  dialogRef   : any;
  atras : Boolean = true;
  adelante : Boolean;
/**Variable para controlar los tipos de comentarios */
  activo : Boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private serviceComent :ComentarioService,
  public dialog: MatDialog){
    /**Para llenar la tabla */
    this.todosServCliente(this.tabCategoria);
  }

  ngOnInit(): void {

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
  
  /**Cuenta las veces que tecleas */
  onKey(e:String, pago:String,fecha:String, select:String){
    this.contador = e.length
    this.condicionesRadioButton(pago,fecha,select)
   }

  /**Es para habilitar o deshabilitar para mas campos*/
  radiobutton(e){
    switch(e){
      /**Los 3 primeros son para el calendario, los otros son dos son para el pago, el ultimo parametro espara el select */
      case "Comentario":
        this.categoria = 0;
        this.card(true,true,"-disabled",true,"-disabled",true);
        break;
      case "Pago":
        this.categoria = 1;
        this.card(false,false,"",false,"",false);
        break;
      case "Convenio":
        this.categoria = 2;
        this.card(false,false,"",false,"",true);
        break;
    }
  }

/**Metodo que ayuda a activar o desactivar y variantes de los inputs inactivos */
  card(calendario:Boolean, fecha:Boolean, fecha2:String, pago:Boolean,pago2 : String, select :Boolean){
    this.calendario.disabled = calendario;
    this.inputFecha._inputContainerRef.nativeElement.firstChild.disabled=fecha;
    this.inputFecha._elementRef.nativeElement.className = "mat-form-field convenio ng-tns-c42-8 mat-accent mat-form-field-type-mat-input mat-form-field-appearance-legacy mat-form-field-can-float mat-form-field-should-float mat-form-field-has-label mat-form-field"+fecha2;
    this.inputPago._elementRef.nativeElement.className = "mat-form-field cantidad ng-tns-c42-10 mat-accent mat-form-field-type-mat-input mat-form-field-appearance-legacy mat-form-field-can-float mat-form-field-should-float mat-form-field-has-label mat-form-field"+pago2;
    this.inputPago._inputContainerRef.nativeElement.firstChild.disabled = pago;
    this.select._disabled = select;
  }

  async todosServCliente(opc : number){
     await this.serviceComent.getAllServCliente(opc,this.data.clave, this.data.fecha).subscribe((resp :any) =>{
     this.comentarios = resp;
     this.comentariosMostrar = [];
     this.paginar(this.comentarios)
   });
   if(this.tabCategoria == 1 || this.tabCategoria == 0){
    await this.serviceComent.getAllServCliente(1,this.data.clave, this.data.fecha).subscribe((resp :any) =>{
      this.listaConvenios = resp;
    });
  }
  }

  /**Para cargar cada pestaña cuando se elige */
 async tab(opc: number){
    switch(opc){
      case 0:
        this.tabCategoria = 0;
        await this.todosServCliente(0)
        break;
      case 1:
        this.tabCategoria = 3;
        await this.todosServCliente(3)
        break;
      case 2:
        this.tabCategoria = 1;
       await this.todosServCliente(1)
        break;
      case 3:
        this.tabCategoria = 10;
        await this.todosServCliente(10)
        break;
    }
  }

  /**Esta funcion ayuda a insertar un comentario nuevo y actualiza los campos del modulo para mostrar  */
  async actualizarComentarios(textArea : String, pago:String,fecha:String, select:String){
    await this.serviceComent.insertComentario(this.data.clave,this.data.fecha,textArea,this.data.name, this.data.email, this.categoria
      ,select,fecha+" 0:00:00",pago).toPromise();
      this.todosServCliente(this.tabCategoria);
  }

  async editarComentario(e:String,idcomentario : String,clave_serv : String,fecha : String, cantidad :String,idconvenio : String, cantidadc : String){
    if(this.tabCategoria != 10){
      fecha = fecha.split(" ")[0];
      var fecha2 = fecha.split('/');
      fecha = fecha2[2]+"/"+fecha2[1]+"/"+fecha2[0]
      }
      console.log("Comenntario "+e +"\nid "+idcomentario +"\nclave serv "+clave_serv+"\nfecha "+fecha+"\nCantidad "+ cantidad +"\nidconv "+idconvenio+"\ncantidad pagada "+cantidadc)

     this.dialogRef = this.dialog.open(EditarComentarioComponent, 
      {data: {opc : this.tabCategoria,mensaje: e, idcomentario: idcomentario, clave_serv: clave_serv, fecha: fecha ,cantidad:cantidad, listaConvenios:this.listaConvenios, idconvenio:idconvenio, cantidadc:cantidadc},width:"500px",
      panelClass: ['animate__animated','animate__slideInLeft']});
      this.dialogRef.afterClosed().subscribe(result => {
   

        this.todosServCliente(this.tabCategoria)
      });


 }


  async deleteComentario(idcomentario : String,clave_serv : String,fecha : String){
    let titulo : String;
    if(this.tabCategoria == 1){
      titulo = "Si borras este convenio, borraras todos los pagos relacionados.\n\n¿Estas seguro?"
    }else{
      titulo = "¿Esta seguro de eliminarlo?"
    }
    Swal.fire({
      icon: 'question',
      title: titulo,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showDenyButton: true,
      denyButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
       this.eliminarComentario(this.tabCategoria,idcomentario,clave_serv,fecha);
    }
    });
  }

/**Se separo este metodo del metodo delete comentario, para que funcionara */
  async eliminarComentario(opc:number,idcomentario,clave_serv,fecha){
    await this.serviceComent.deleteComentario(opc,idcomentario,clave_serv,fecha).toPromise();
    await this.todosServCliente(this.tabCategoria);
  }

/**Para que no supere el numero de renglones en la pagina */
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
  /**Este sirve para que respete los radiobutton*/
  condicionesRadioButton(pago:String,fecha:String,select:String){
    switch(this.categoria){
      case 0:
        if(this.contador == 0){
          this.activo = true;
        }else{
          this.activo = false;
        }
      break;
      case 1:
        if(this.contador == 0 || pago == ""  || select == undefined || this.contador == 0 || pago == undefined ||select == "" 
        || fecha == "" || fecha == undefined){
          this.activo = true;
        }else{
          this.activo = false;
        }
      break;
      case 2:
        if(this.contador == 0 || pago == "" || pago == undefined || fecha == "" || fecha == undefined){
          this.activo = true;
        }else{
          this.activo = false;
        }
      break;   
    }
  }
}
