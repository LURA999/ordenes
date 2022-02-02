import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { ClienteModel } from '../../models/cliente.model';
import { LoaderService } from '../../services/loader.service';
import { MatPaginator} from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PopupComentarioComponent } from '../popup-comentario/popup-comentario.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';

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
  clientesViejo : any;
  clientesViejoS : any;
  aux:any;
  data : any []=[];
  data2 : any []=[];
  cliente: ClienteModel;
  ciudades: any;
  ciudad:String;
  estado:String;
  opcionCEfiltro : number;
  existe : any;
  existeBarra : any;  
  //variable load, sirve para cargar la tabla cuando esta en true
  load : Boolean =false;
  inicio : number=0;
  fin : number=10;
  inicio2 : number=0;
  fin2 : number=10;

  acumClientesCVE : String [] =[];
  displayedColumns2: string[] = ['Id','Cliente', 'Convenio'];
  dataSource2 : any;
  tablaConvenios : any[] = [];


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


  focused: boolean;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  constructor(private sService: ClientService, private sLoader: LoaderService,
    public dialog: NgDialogAnimationService) {
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
    this.subcliente =  await this.sService.getAll(1).toPromise();
    this.clientesViejo =  await this.sService.getAll(0).toPromise();

  }

  /** 
   * ESTE ES EL ENGCARGADO PARA LA TABLA
   * DE HACER FILTROS CUANDO PRsESIONAS NEXT Y PREVIOUS Y TAMBIEN SIRVE 
   * PARA EL INICIO
   */

  async cargarInicio(){
  this.noHayclientes(this.subcliente.length);
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
    this.dataSource = await new MatTableDataSource(this.data);
    this.dataSource.paginator = await this.paginator;    
    this.paginator.hidePageSize= await true;
    this.paginator.length = await this.subcliente.length;


    while ( this.inicio2 <this.fin2 + 2 && this.inicio2 < this.clientesViejo.length) {
      if(this.inicio2 < this.fin2){
        this.data2[this.inicio2] =(    
            {
              'info.dependent': 'parent',
              'Id': this.clientesViejo[this.inicio2].idcliente,
              'Cliente': this.clientesViejo[this.inicio2].nombre,
              'Convenio': this.clientesViejo[this.inicio2].colonia,
              //nested:[{'Fecha':'','Servicio':'','Saldo':'','Intereses':'', '':''}]
            });
        /*   this.clientesViejoS = await this.sService.getServicios(this.clientesViejo[this.inicio].idcliente).toPromise();
             for await(const obj of this.clientesViejoS) {
              this.data2[this.inicio].nested.push (
              {
                'Fecha': obj.clave_serv,
                'Servicio': obj.servicio,
                'Saldo': obj.cantidad,
                'Intereses': obj.interes,
                '': '',
              })
          }*/
          this.inicio2++      
      }else{
     /*   if(this.inicio < this.subcliente.length){
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
          this.inicio++*/
        }
      }

  this.dataSource2 = await new MatTableDataSource(this.data2);
  this.dataSource2.paginator = await this.paginator2;    
  this.paginator2.hidePageSize= await true;
  this.paginator2.length = await this.clientesViejo.length;
  }

  ngOnInit(){ 
    this.existe= document.getElementById("existe").style.display = "none";
    this.existe= document.getElementById("existe-conv").style.display = "block";
    this.existeBarra=document.getElementById("barra-paginator").style.display = "true";  
  }

  /* CUANDO PRESIONAS EL BOTON DE NEXT Y PREVIOUS  */
async pageEvents(event: any,inicio,fin,dataSource,data) {
  if(event.previousPageIndex > event.pageIndex) {
    inicio = (inicio-(inicio%10)) - 20;
    if(inicio < 0){
      inicio = 0;
    }
    fin =  (fin - (fin%10)) - 10;
    dataSource=null; 
    data=[];
    await this.cargarInicio();
  } else {
    inicio = fin;
    fin = this.fin + 10;
    dataSource=null;
    data=[];
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
    if(this.ciudad == "-1" && this.estado == "5" || this.ciudad == undefined && this.estado == undefined){
      id  = await this.sService.id(5,valor,"","").toPromise();
    }else{
      console.log("ciudad: "+this.ciudad+ ", estado: "+this.estado)
      id  = await this.sService.id(0,valor,this.estado,this.ciudad).toPromise();
    }
  
    
    this.noHayclientes(id);
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
              this.acumClientesCVE.push(this.excel[p][0]);
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
        for(let x=0; x<this.acumClientesCVE.length; x++){
         for(let y = 0; y<this.subcliente.length; y++){
          if(this.acumClientesCVE[x] === this.subcliente[y]){
            
          }       
        }

        for(let p=0; p<this.subcliente.length; p++){
          console.log(this.subcliente[p]);
        }
      }


       await location.reload();
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

  /**Sirve para que la lista principal no se active */
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
    }else if(input == 4){
      cambiarColor[i].style.background="#ffff0059";        
    }else if(input == 5){
      cambiarColor[i].style.background="#ff910059";
    }
  }
    
    await this.sService.actualizarEstatus_Estado(1,input+"", cve).toPromise();
    this.subcliente = await this.sService.getciudadesEstados(this.opcionCEfiltro, this.ciudad, this.estado).toPromise();
    await this.cargarInicio();

  }

  estadoExcel(excel : String) : String{
    switch(excel.replace(/\s/g, "").toLowerCase()){
      case "nuevo":
        excel= "0";
        break;
      case "sicontestan":
        excel= "1";
        break;
      case "dejamosrecado":
        excel= "3";
        break;
      case "nocontestan":
        excel = "5";
        break;
      case "nosirve":
        excel = "2";
        break;
      case "convenio":
        excel = "4";
      default:
        throw new Error("no existe el estado");

    }
    return excel
  }
  /*abrir el modulo comentario*/
  abrirComentario(idCliente:String, clave : String, fecha : String){
    this.dialog.open(PopupComentarioComponent,
    {animation: { to: "bottom"},
    data: 
      {
        claveC: idCliente,
        name: localStorage.getItem("name"), 
        clave: clave, 
        fecha: fecha, 
        email: localStorage.getItem("email")
      }
      , height:"80%", width:"75%"
    });
    
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  noHayclientes(cantidad : number){
    if(cantidad == 0){
      this.existe = document.getElementById("existe").style.display = "block";
    }else{
      this.existe = document.getElementById("existe").style.display = "none";
    }
    
  }
}

