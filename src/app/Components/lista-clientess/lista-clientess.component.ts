
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { ClienteModel } from '../../models/cliente.model';

import { LoaderService } from '../../services/loader.service';
import { MatPaginator} from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { longitud } from 'src/app/Components/lista-clientess/spanish-paginator-intl';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PopupComentarioComponent } from '../popup-comentario/popup-comentario.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import ht from 'date-fns/locale/ht';



@Component({
  selector: 'app-lista-clientess',
  templateUrl: './lista-clientess.component.html',
  styleUrls: ['./lista-clientess.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})


export class ListaClientessComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  excel : String [][] = [];
  sub$ = new Subscription();
  subcliente: any;
  subclienteS: any;
  aux:any;
  data : any []=[];
  cliente: ClienteModel;
  ciudades: any;
  ciudad:String;
  estado:String;
  opcionCEfiltro : number;
  
  //variable load, sirve para cargar la tabla cuando esta en true
  load : Boolean =false;
  inicio : number=0;
  fin : number=10;
  displayedColumns = [
    'Clave',
    'Nombre',
    'Colonia',
    'Calle',
    'Num',
    'Celular 1',
    'Celular 2',
    'Ciudad',
    'Estado',
    'Estatus'
  ];
  btn =document.getElementById("btn");
  
  focused: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor(private sService: ClientService, private sLoader: LoaderService,
    public dialog: MatDialog) {
    this.cliente = new ClienteModel();
    this.cargarTodo();
    this.cargarCiudades();
  }

  async cargarCiudades(){
      await this.sService.getciudades(1,"").subscribe(resp=>{
        this.ciudades = resp;
      });
  }

  async cargarTodo(){
   await this.totalClientes();
   await this.cargarInicio();
  }
  async totalClientes(){
    this.subcliente =  await this.sService.getAll().toPromise();
  }

  /** 
   * ESTE ES EL ENCARGADO DE HACER FILTROS CUANDO PRESIONAS NEXT Y PREVIOUS Y TAMBIEN SIRVE 
   * PARA EL INICIO
   */

  async cargarInicio(){
   this.paginator.hidePageSize=true;
   while ( this.inicio <this.fin + 2 && this.inicio < this.subcliente.length) {
    if(this.inicio < this.fin){
      this.data[this.inicio] =(    
          {
            'info.dependent': 'parent',
            'Clave': this.subcliente[this.inicio].idcliente,
            'Nombre': this.subcliente[this.inicio].nombre,
            'Colonia': this.subcliente[this.inicio].colonia,
            'Calle': this.subcliente[this.inicio].calle,
            'Num': this.subcliente[this.inicio].num,
            'Celular 1': this.subcliente[this.inicio].celular1,
            'Celular 2': this.subcliente[this.inicio].celular2,
            'Ciudad':this.subcliente[this.inicio].ciudad,
            'Estado': this.subcliente[this.inicio].estado,
            'Estatus': this.subcliente[this.inicio].estatus,
            nested:[{'Fecha':'','Servicio':'','Saldo':'','Intereses':'', '':''}]
          });
         this.subclienteS = await this.sService.getServicios(this.subcliente[this.inicio].idcliente).toPromise();
           for await(const obj of this.subclienteS) {
            this.data[this.inicio].nested.push (
            {
              'Fecha': obj.clave_serv,
              'Servicio': obj.servicio,
              'Saldo': obj.cantidad,
              'Intereses': obj.interes,
              '': '',
            })
        }
        this.inicio++      
    }else{
      if(this.inicio < this.subcliente.length){
        this.data[this.inicio] =(    
          {
            'info.dependent': 'parent',
            'Clave cliente': "",
            'Nombre': "",
            'Colonia': "",
            'Calle': "",
            'Num': "",
            'Celular 1': "",
            'Celular 2': "",
            'Ciudad': "",
            'Estado': "",
            nested:[{'Fecha':'','Servicio':'','Saldo':'','Intereses':'', '':''}]
          });
        } 
        this.inicio++
      }
    }
    this.load =true;
    longitud(this.subcliente.length);    
    this.dataSource = await new MatTableDataSource(this.data);
    this.displayedColumns =await this.displayedColumns;
    this.dataSource.paginator = await this.paginator;     
  }

  ngOnInit(){ 
  }


  /* CUANDO PRESIONAS EL BOTON DE NEXT Y PREVIOUS */
async pageEvents(event: any) {
  if(event.previousPageIndex > event.pageIndex) {
    this.inicio = (this.inicio-(this.inicio%10)) - 20;
    if(this.inicio < 0){
      this.inicio = 0;
    }
    this.fin =  (this.fin - (this.fin%10)) - 10;
    this.dataSource=null; 
    this.data=[];
    await this.cargarInicio();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 10;
    this.dataSource=null;
    this.data=[];
    await this.cargarInicio();
  }
}




  /* BUSCAR CLAVE DE USUARIO */
async filtrar(valor :String) {
  let iniciof : number =0;
  let id :any;
  this.dataSource=null;
  this.data=[];


  if(valor!==""){
  try{
    id  = await this.sService.id(valor).toPromise();
  for await (const obj of id) {
         this.data[iniciof] =(    
           {
             'info.dependent': 'parent',
             'Clave': obj.idcliente,
             'Nombre': obj.nombre,
             'Colonia': obj.colonia,
             'Calle': obj.calle,
             'Num': obj.num,
             'Celular 1': obj.celular1,
             'Celular 2': obj.celular2,
             'Ciudad':obj.ciudad,
             'Estado': obj.estado,
             'Estatus': obj.estatus,
             nested:[{'Fecha':'','Servicio':'','Saldo':'','Intereses':'', '' : ''}]
           });
          this.subclienteS = await this.sService.getServicios(obj.idcliente).toPromise();
            for await(const obj of this.subclienteS) {
             this.data[iniciof].nested.push (
             {
               'Fecha': obj.clave_serv,
               'Servicio': obj.servicio,
               'Saldo': obj.cantidad,
               'Intereses': obj.interes,
               '' : ''
             })
         }
         iniciof++      
     }
     this.dataSource = await new MatTableDataSource(this.data);
     this.displayedColumns =await this.displayedColumns;
     this.dataSource.paginator = await this.paginator;  

    }catch(Exception){
    }
  }else{
    this.inicio =0;
    this.fin =10;
    this.dataSource = await new MatTableDataSource(this.data);
    this.displayedColumns =await this.displayedColumns;
    this.dataSource.paginator = await this.paginator;  
    await this.cargarInicio();
  }
     
  }
/**CARGA EL EXCEL */
  async onFileChange(evt: any){
  const target : DataTransfer = <DataTransfer>(evt.target);
  if(target.files.length !==1) throw new Error('Cannot use multiple files');
  const reader: FileReader= new FileReader();

  
  reader.onload = async (e: any) =>{
    let p=0;
    const bstr : string = e.target.result;
    const wb : XLSX.WorkBook = XLSX.read(bstr, {type:'binary'});
    const wsname : string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    this.excel = (XLSX.utils.sheet_to_json(ws,{header: 1}));
    /**Insertar dos tablas juntas */
    if(this.excel[0].length == 13){
       for (let p=0; p<this.excel.length; p++) {
        let repetido = await this.sService.getTotalDeServiciosClienteID(this.ExcelDateToJSDate(this.excel[p][9]).toLocaleString(),this.excel[p][0]).toPromise();
        let repetidocliente = await this.sService.clienteRepetido(this.excel[p][0]).toPromise();
         try{
           if(this.excel[p][0] !== undefined  && repetidocliente[0].repetido == 0 || this.excel[p][0] == "" && repetidocliente[0].repetido == 0){
            this.cliente.cve=this.excel[p][0];
            this.cliente.nombre=this.excel[p][1];
            this.cliente.colonia=this.excel[p][2];
            this.cliente.calle=this.excel[p][3];
            this.cliente.num=this.excel[p][4];
            this.cliente.celular1=this.excel[p][5];
            this.cliente.celular2=this.excel[p][6];
            this.cliente.ciudad=this.excel[p][7];
            this.cliente.estado= await this.estadoExcel(this.excel[p][8]);
            await this.sLoader.insertClientes(this.cliente).toPromise();
           }
          }catch(Exception){}
          try{
          if(this.excel[p][9] !== undefined && repetido[0].total ==0 || this.excel[p][9] == "" && repetido[0].total ==0 ){
            await this.sLoader.insertClientesServ(this.excel[p][0], this.ExcelDateToJSDate(this.excel[p][9]).toLocaleString(),this.excel[p][10],this.excel[p][11],this.excel[p][12]).toPromise();
          }
        }catch(Exception){}
         }
        // await location.reload();
          /*Insertar solamente el cliente sin servicios */
        }else if(this.excel[0].length == 9){
        for (let p = 0; p < this.excel.length; p++) {
          if(this.excel[p][0] !== undefined || this.excel[p][0] == "" ){
          }
        }
      }else if(this.excel[0].length == 4){
        for (let h = 1; h<this.excel.length; h++){
          if(this.excel[h][0] !== undefined || this.excel[h][0] == ""){
          }
        }
      }
    };
    await reader.readAsBinaryString(target.files[0]);

  }

  /**calcula la fecha que se introdujo en el excel */
   ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
    var total_seconds = Math.floor(86400 * fractional_day);
    var seconds = total_seconds % 60;
    total_seconds -= seconds;
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()+1, hours, minutes, seconds);
 }
   

 /**metodos para la tabla */
  getKeys(object): string[] {
    return Object.keys(object);
  }

  onItemSelected(idx: number) {
    console.log(idx)
  }


  /**Sirve para que la lista no se active */
  CLICK(event){
    event.stopPropagation();
  }


  /**Proceso de filtracion */
  async CiudadEstado(){
    if(this.estado == "5" && this.ciudad !== "-1" && this.ciudad !==undefined){
      this.opcionCEfiltro = 3;
    }else if(this.ciudad == "-1" && this.estado != "5" && this.estado !==undefined){
      this.opcionCEfiltro = 2;
    }else if(this.estado !==undefined && this.ciudad !==undefined && this.estado !== "5" && this.ciudad !== "-1" ){
      this.opcionCEfiltro = 1;
    }else{
      this.opcionCEfiltro = 4;
    }
  }
  /**Filtro de ciudades */
  async verCiudad(ciudad : String){
    this.ciudad = ciudad;
    if(this.ciudad === undefined){
      this.ciudad ="-1";
    }
  if(this.estado != undefined && this.ciudad != undefined){
    this.dataSource=null; 
    this.data =[];
    this.inicio=0;
    this.fin=10;
    this.paginator.pageIndex = 0;
    await this.CiudadEstado();
    this.subcliente = await this.sService.getciudadesEstados(this.opcionCEfiltro, this.ciudad, this.estado).toPromise();
    await this.cargarInicio()
  }
  }

  /**filtro de estado*/
  async verEstado(estado : String){
    this.estado = estado;  
    if(this.estado !=undefined && this.ciudad != undefined){
      this.dataSource=null; 
      this.data =[];
      this.inicio=0;
      this.fin=10;
      this.paginator.pageIndex = 0;
      await this.CiudadEstado(); 
      this.subcliente = await this.sService.getciudadesEstados(this.opcionCEfiltro, this.ciudad, this.estado).toPromise();
      await this.cargarInicio()
    }
  }

  async modificarEstatus( cve : String, input: String){
    await this.sService.actualizarEstatus_Estado(2,(input? 1:0)+"", cve).toPromise();
    this.subcliente = await this.sService.getciudadesEstados(this.opcionCEfiltro, this.ciudad, this.estado).toPromise();
    await this.cargarInicio()
  }
  
  async modificarEstado( cve : String, input: number){
    var cambiarColor = Array.from(document.getElementsByClassName(""+cve) as HTMLCollectionOf<HTMLElement>)
    for (let i = 0; i <cambiarColor.length; i++) {
    if(input == 1){
      cambiarColor[i].style.background="#4aef4a80";        
    }else if(input == 2){
      cambiarColor[i].style.background="#ff797999";        
    }else if(input == 3){
      cambiarColor[i].style.background="#2591ff42";        
    }else {
      cambiarColor[i].style.background="#ffff0059";        
    }
  }
    
    await this.sService.actualizarEstatus_Estado(1,input+"", cve).toPromise();
    this.subcliente = await this.sService.getciudadesEstados(this.opcionCEfiltro, this.ciudad, this.estado).toPromise();
    await this.cargarInicio();

  }

  estadoExcel(excel : String) : String{
    switch(excel.replace(/\s/g, "").toLowerCase()){
      case "sin":
        excel= "0";
        break;
      case "bueno":
        excel= "1";
        break;
      case "buzon/nosirve":
        excel= "2";
        break;
      case "mensaje":
        excel = "3";
        break;
      case "convenio":
        excel = "4";
        break;
      default:
        excel = "0";
        break;
    }
    return excel
  }

  abrirComentario(clave : String, fecha : String){
    this.dialog.open(PopupComentarioComponent,
    {data: {name: localStorage.getItem("name"), clave: clave, fecha: fecha, email: localStorage.getItem("email")}, height:"600px"});
  }
  //Es para saber si el cliente esta activo o no
  checkbox(a:String){
    console.log(a);

  }
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  filaNombre(e){
    console.log(e)    
  }
 

  applyFilter() {}

  
}

