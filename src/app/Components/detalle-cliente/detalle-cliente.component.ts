import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteModel } from 'src/app/models/cliente.model';
import { ContactoModel } from 'src/app/models/contacto.model';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { SucursalModel } from 'src/app/models/sucursal.model';
import Swal from 'sweetalert2';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {
idprospecto : number;
nombre : string;
nombreSucursal: string = "Sucursal";
cliente : ClienteModel;
sucursal : SucursalModel;
contacto : ContactoModel = new ContactoModel;
sucursales : any[];
contactos : any[] = [];
nuevaSucursal : FormGroup;
nuevoContacto : FormGroup;

  constructor(private sCliente : ClientService, private aRoute : ActivatedRoute, private fb: FormBuilder, private fbc: FormBuilder) { 

    this.nuevaSucursal = this.fb.group({
      nombre: new FormControl('', Validators.required),
      calle : new FormControl('', Validators.required),
      colonia : new FormControl('', Validators.required),
      numero : new FormControl('', Validators.required),
      ciudad : new FormControl('', Validators.required),
      estado : new FormControl('', Validators.required),
      cp: new FormControl('', Validators.required),
      rsocial : new FormControl('', Validators.required),
      servicio: new FormControl('', Validators.required),
      coordenadas : new FormControl('', [Validators.required])
    });

    this.nuevoContacto = this.fbc.group({
      nombre: new FormControl('', Validators.required),
      telefono: new FormControl(''),
      extension: new FormControl(''),
      correo: new FormControl(''),
      idsucursal: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.cliente = new ClienteModel();
    if(this.aRoute.snapshot.paramMap.has('id')){
      this.idprospecto = parseInt(this.aRoute.snapshot.paramMap.get('id'));
      this.sCliente.buscarCliente(this.idprospecto).subscribe((resp:any)=>{
        var json = JSON.parse(resp);
        this.cliente.nombre = json[0]['nombre'];
        this.cliente.estado = json[0]['estadodomicilio'];
        this.cliente.ciudad = json[0]['ciudad'];
        this.cliente.colonia = json[0]['colonia'];
        this.cliente.calle = json[0]['calle'];
        this.cliente.cp = json[0]['cp'];
        this.cliente.coordenadas = json[0]['coordenadas'];
        this.cliente.propietario = json[0]['dueno'];
        this.cliente.persona_acargo = json[0]['IngeCargo'];
      });
    }
    this.sucursales = [];
    this.sCliente.getSucursales(this.idprospecto.toString()).subscribe((resp:any)=>{
      this.sucursales = resp;
    });
  }

  cargarContactos(idsucursal:string){
    this.sCliente.getContactos(idsucursal).subscribe((resp:any)=>{
      this.contactos = resp;
    });

  }

  cargarFormaContacto(idsucursal:string, nombre:string){
    // console.log(nombre);
    // console.log(idsucursal);
    this.contacto.idsucursal = parseInt(idsucursal);
    this.nombreSucursal = nombre;
  }

  public onSubmit(){
    this.sucursal = new SucursalModel();
    if(this.nuevaSucursal.valid){
      this.sucursal.nombre = this.nuevaSucursal.controls['nombre'].value;
      this.sucursal.calle = this.nuevaSucursal.controls['calle'].value;
      this.sucursal.numero = this.nuevaSucursal.controls['numero'].value;
      this.sucursal.colonia = this.nuevaSucursal.controls['colonia'].value;
      this.sucursal.ciudad =  this.nuevaSucursal.controls['ciudad'].value;
      this.sucursal.estado = this.nuevaSucursal.controls['estado'].value;
      this.sucursal.cp = this.nuevaSucursal.controls['cp'].value; 
      this.sucursal.servicio = this.nuevaSucursal.controls['servicio'].value;
      this.sucursal.idcliente = this.idprospecto;
      // this.sucursal.rsocial = this.nuevaSucursal.controls['rsocial'].value;
      this.sucursal.coordenadas = this.nuevaSucursal.controls['coordenadas'].value;
      this.sCliente.crearSucursal(this.sucursal).subscribe((resp:any)=>{
        console.log(resp);
        if(resp[0] == undefined){
          Swal.fire({
            icon: 'success',
            text : 'Sucursal dada de alta'
          });
          location.reload();
        }else{
          Swal.close();
          Swal.fire({
            icon: 'error',
            text : 'Error en datos'
          });
        }
      });
    }
  }

  crearContacto(){
    console.log(this.contacto.idsucursal);
    if(this.nuevoContacto.valid){
      this.contacto.nombre = this.nuevoContacto.controls['nombre'].value ,
      this.contacto.telefono = this.nuevoContacto.controls['telefono'].value == undefined ? "0": this.nuevoContacto.controls['telefono'].value;
      this.contacto.extension = this.nuevoContacto.controls['extension'].value == undefined ? "0": this.nuevoContacto.controls['extension'].value;
      this.contacto.correo = this.nuevoContacto.controls['correo'].value == undefined ? "sin correo": this.nuevoContacto.controls['correo'].value;
      this.sCliente.agregarContacto(this.contacto).subscribe((resp:any)=>{
        
         console.log(resp);
         location.reload();
      }); 
    }else{
      alert("Error en datos requeridos");
    }
  }
}
