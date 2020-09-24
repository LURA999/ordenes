
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientService } from '../../Services/client.service';
import { OrdenModel } from '../../Models/orden.model';
import { OrdenService } from 'src/app/Services/orden.service';
import { ActivatedRoute } from '@angular/router';
import { OrdenDetallesComponent } from '../orden-detalles/orden-detalles.component';

@Component({
  selector: 'app-abc-orden',
  templateUrl: './abc-orden.component.html',
  styleUrls: ['./abc-orden.component.css']
})
export class AbcOrdenComponent {
  titulo: string = "Nueva orden de servicio";
  esDetalle: boolean = false;
  cve_orden: number;
  orden: OrdenModel;
  clientes: any[];
  sucursales: any[];
  contactos: any[];
  instaladores: any[];
  cliente: string;
  numero: string;
  fecha: string;
  clienteValido: boolean = false;
  sucursalValida: boolean = false;

  constructor(private clientServ: ClientService, private ordenServ: OrdenService, private aroute: ActivatedRoute) {
    this.orden = new OrdenModel();
    if (aroute.snapshot.paramMap.has('id')) {
      this.cve_orden = parseInt(this.aroute.snapshot.paramMap.get('id'));
      this.titulo = "Detalle orden " + this.cve_orden;
      this.esDetalle = true;
    } else {
      this.nuevaOrden();
    }
  }



  nuevaOrden() {
    this.clientServ.getAll().subscribe((resp: any) => {
      this.clientes = resp;
    });
    this.ordenServ.getInstallers().subscribe((resp: any) => {
      this.instaladores = resp;
    });
  }


  public cargarSucursal(e: any) {
    let name = e.target.value;
    if (name != '') {
      let id = this.clientes.filter(x => x.nombre === name)[0];
      if (id != undefined) {
        this.orden.idCliente = id.idprospecto;
        this.clientServ.getSucursales(id.idprospecto).subscribe((resp: any) => {
          this.sucursales = resp;
          if (this.sucursales.length > 0) {
            this.clienteValido = true;
            this.orden.idSucursal = null;
          } else {
            this.clienteValido = false;
          }
        });
      } else {
        alert("El cliente no esta registrado");
        this.cliente = "";
        this.orden.idSucursal = null;
        this.orden.idContacto = null;
        this.clienteValido = false;
      }
    } else {
      this.orden.idSucursal = null;
      this.orden.idContacto = null;
      this.clienteValido = false;
    }
  }

  public cargarContactos() {
    if (this.orden.idSucursal == null || this.orden.idSucursal == undefined) {
      this.orden.idSucursal = 0;
      this.sucursalValida = false;
      this.numero = "";
      this.orden.idSucursal = null;
    }

    this.clientServ.getContactos(this.orden.idSucursal.toString()).subscribe((resp: any) => {
      this.contactos = resp;
      if (this.contactos.length > 0) {
        this.sucursalValida = true;
      } else {
        this.sucursalValida = false;
      }

    });

  }

  public cargarTelefono() {
    let contacto = this.contactos.filter(x => x.idcontacto == this.orden.idContacto)[0];
    this.numero = contacto.Telefono;
  }

  onSubmit(forma: NgForm) {
    if (forma.invalid) {
      alert("Datos en rojo obligatorios");
    } else {
      if(this.orden.idInstalador == undefined){
        this.orden.idInstalador = 0;
      }

      if(this.orden.fechaProgramada == undefined){
        this.orden.fechaProgramada = null;
      }

      this.orden.idUsuario = parseInt(localStorage.getItem('id'));
      this.ordenServ.createOrder(this.orden).subscribe((resp: any) => {
        window.location.replace('/listaOrdenes');
      }, error => {
        console.log(error);
      });
    }
  }

}
