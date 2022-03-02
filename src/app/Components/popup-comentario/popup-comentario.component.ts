import { Component, OnInit, Inject, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { window } from 'rxjs/operators';
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
  sub$ = new Subscription();
  comentarios : String [] = [];
  comentariosMostrar : any [] = [];
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
  id =localStorage.getItem("id") 

  nivel =localStorage.getItem("level") 
  nuevoComentario :String;
  nuevaFechap : String;
  nuevaCantidad :number;
  @ViewChild('inputFecha') inputFecha;
  @ViewChild('picker') calendario;
  @ViewChild('inputPago') inputPago;
  @ViewChild('select') select;
  @ViewChild('escribir') escribir ;
  @ViewChild('alert') alert ;

  comentario : String;
  dialogRef   : any;
  atras : Boolean = true;
  adelante : Boolean;
/**Variable para controlar los tipos de comentarios */
  activo : Boolean = true;
  tabInicial : number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private serviceComent :ComentarioService,
  public dialog: MatDialog,private rendered2 : Renderer2){
    /**Para llenar la tabla */
    if(this.data.idBuscar >=0){
      this.tabInicial = this.data.tab;
      this.tab(this.data.tab);
      this.todosServCliente2(this.data.tab, this.data.idBuscar);
    }else{
      this.todosServCliente(0);
    }

  }

  ngOnInit(): void { 
    
    this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave, this.data.fecha,0).subscribe((resp :any) =>{
      this.listaConvenios = resp.container;
    }));
    console.log(this.data)
  }
  
  ngAfterViewInit(): void {
    if(this.data.idBuscar > 0){
      this.escribir.nativeElement.value = this.data.idBuscar;
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
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

    switch(opc){
      case 0:
        await this.sub$.add(this.serviceComent.getAllServClient(this.data.clave,this.data.fecha).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)
        }));
      break;
      case 1:
        await this.sub$.add(this.serviceComent.getAllServClientPayments(this.data.clave, this.data.fecha).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)
        }));
      break;
      case 2:
        await this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave, this.data.fecha,0).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)

        }));
      break;
      case 3:
        await this.sub$.add(this.serviceComent.getAllServClientComments(this.data.clave, this.data.fecha).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)

        }));
      break;
      case 4:
        await this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave,this.data.fecha,1).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)
        }));
      break;
      case 5:
        await this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave, this.data.fecha,2).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios)
        }));
      break;
    }
  }

  async todosServCliente2(opc : number, id : number){
    switch(opc){
      case 0:
        await this.sub$.add(this.serviceComent.buscarIdTodos(this.data.clave, this.data.fecha, id).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
      case 1:
        await this.sub$.add(this.serviceComent.buscarIdPagos(this.data.clave, this.data.fecha, id).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
      case 2:
        await this.sub$.add(this.serviceComent.buscarIdConvenios(this.data.clave, this.data.fecha, id, 0).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
      case 3:
        await this.sub$.add(this.serviceComent.buscarIdComentarios(this.data.clave, this.data.fecha, id).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
      case 4:
        await this.sub$.add(this.serviceComent.buscarIdConvenios(this.data.clave, this.data.fecha, id, 1).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
        case 5:
        await this.sub$.add(this.serviceComent.buscarIdConvenios(this.data.clave, this.data.fecha, id, 2).subscribe((resp :any) =>{
          this.comentarios = resp.container;
          this.comentariosMostrar = [];
          this.paginar(this.comentarios);
        }))
        break;
    }
 }

  /**Para cargar cada pestaña cuando se elige */
 async tab(opc: number){
   this.tabCategoria = opc;
  await this.todosServCliente(opc)
  }

  /**Esta funcion ayuda a insertar un comentario nuevo */
  async actualizarComentarios(textArea : String, pago:String,fecha:String, select:String){
    let fechaof = fecha.split(" ")[0].split("/");    
    fecha  = fechaof[2]+"-"+fechaof[1]+"-"+fechaof[0]+" 00:00:00";

    switch(this.categoria){
      case 0:
        select = "0";
        pago ="0";
        fecha = "0";
        await this.serviceComent.insertComment(this.data.clave,this.data.fecha,textArea,this.data.name, this.data.email, this.categoria
          ,select,fecha+" 0:00:00",pago).toPromise();
          break;
      case 1:
        await this.serviceComent.insertCommentPay(this.data.clave,this.data.fecha,textArea,this.data.name, this.data.email, this.categoria
          ,select,fecha,pago).toPromise();
        break;
      case 2:
        select = "0";
        await this.serviceComent.insertCommentAgreement(this.data.clave,this.data.fecha,textArea,this.data.name, this.data.email, this.categoria
          ,select,fecha,pago).toPromise();
          this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave, this.data.fecha,0).subscribe((resp :any) =>{
            this.listaConvenios = resp.container;
          }));
        break;
    }
    
   const alert = this.alert.nativeElement;
   this.rendered2.setStyle(alert, 'display', 'block')
    this.todosServCliente(this.tabCategoria);

   setTimeout(() =>{
    this.rendered2.setStyle(alert, 'display', 'none')
  }, 3000 );
  }

  async editarComentario(e:String,idcomentario : String,clave_serv : String,fecha : String, cantidad :String,idconvenio : String, cantidadc : String,id:String){
    if(this.tabCategoria != 10){
      fecha = fecha.split(" ")[0];
      var fecha2 = fecha.split('-');
      fecha = fecha2[2]+"/"+fecha2[1]+"/"+fecha2[0]
      }

     this.dialogRef = this.dialog.open(EditarComentarioComponent, 
      {data: {opc : this.tabCategoria,mensaje: e, idcomentario: idcomentario, clave_serv: clave_serv, fecha: fecha ,cantidad:cantidad, listaConvenios:this.listaConvenios, idconvenio:idconvenio, cantidadc:cantidadc},width:"500px",
      panelClass: ['animate__animated','animate__slideInLeft']});
      this.sub$.add(this.dialogRef.afterClosed().subscribe(result => {
        for (const key in result) {
          if (Object.prototype.hasOwnProperty.call(result, key)) {
            const element = result[key];
          }
        }
      this.todosServCliente(this.tabCategoria)
      }));


 }


  async deleteComentario(idcomentario : String,clave_serv : String){
    let titulo : String;

    if(this.tabCategoria == 2){
      titulo = "Si borras este convenio, borraras todos los pagos relacionados.\n\n¿Estas seguro?"
    }else if(this.tabCategoria == 1 || this.tabCategoria == 3) {
      titulo = "¿Esta seguro de eliminarlo?"
    }else{
      titulo = "¿Esta seguro que desea restaurarlo?"
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
       this.eliminarComentario(this.tabCategoria,idcomentario,clave_serv);
    }
    });
  }

/**Se separo este metodo del metodo delete comentario, para que funcionara */
  async eliminarComentario(opc:number,idcomentario,clave_serv){
    if(opc == 1){
      await this.serviceComent.deleteCommentPay(idcomentario,clave_serv).toPromise();
      await this.todosServCliente(this.tabCategoria);
    } else if (opc ==2 || opc == 4 || opc==5){
      await this.serviceComent.deleteCommentAgreement(idcomentario,clave_serv).toPromise();
      await this.todosServCliente(this.tabCategoria);
      this.sub$.add(this.serviceComent.getAllServClientAgreements(this.data.clave, this.data.fecha,0).subscribe((resp :any) =>{
        this.listaConvenios = resp.container;
      }));

    } else {
      await this.serviceComent.deleteCommentNormal(idcomentario).toPromise();
      await this.todosServCliente(this.tabCategoria);
    }
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
    if(this.contador == 0){
      const alert = this.alert.nativeElement;
      this.rendered2.setStyle(alert, 'display', 'none')
    }
  }

  async filtrar(e){
    if(e == " " || e == undefined || e==""){
      this.todosServCliente(this.tabCategoria)
    }else{
    await this.todosServCliente2(this.tabCategoria, e)

    }

  }
}
