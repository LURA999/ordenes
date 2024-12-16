import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model'
import { timestamp } from 'rxjs/operators';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abc-cliente',
  templateUrl: './abc-cliente.component.html',
  styleUrls: ['./abc-cliente.component.css']
})
export class AbcClienteComponent implements OnInit {
  public formaCliente: FormGroup;
  cliente: ClienteModel;

  constructor(private fb: FormBuilder, private Scliente : ClientService, private route : Router) {
    console.log("Si llego a ABC CLIENTE");
    this.formaCliente = fb.group({
      nombre: new FormControl('', [Validators.required]),
      dueno: new FormControl(''),
      coordenadas: new FormControl(''),
      estado: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      colonia: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      codigoPostal: new FormControl('', [Validators.required]),
      rfc: new FormControl(''),
      numero: new FormControl('', [Validators.required]),
      vendedor: new FormControl('', [Validators.required]),
      encargado: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.cliente = new ClienteModel();
    if (this.formaCliente.valid) {
      this.cliente.nombre = this.formaCliente.controls['nombre'].value;
      this.cliente.rfc = this.formaCliente.controls['rfc'].value == undefined ? 
      "" : this.formaCliente.controls['rfc'].value;
      this.cliente.estado = this.formaCliente.controls['estado'].value;
      this.cliente.calle = this.formaCliente.controls['calle'].value;
      this.cliente.numero = this.formaCliente.controls['numero'].value;
      this.cliente.ciudad = this.formaCliente.controls['ciudad'].value;
      this.cliente.colonia = this.formaCliente.controls['colonia'].value;
      this.cliente.cp = this.formaCliente.controls['codigoPostal'].value;
      this.cliente.fecha_creacion = this.fechaAhora();
      this.cliente.id_usuario = 1;
      this.cliente.id_origen = 2;
      this.cliente.id_estado = 1;
      this.cliente.descripcion = '';
      this.cliente.coordenadas = this.formaCliente.controls['coordenadas'].value;
      this.cliente.estatus = 2;
      this.cliente.ultimo_movimiento = this.fechaAhora();
      this.cliente.alerta = 0
      this.cliente.propietario = 
      this.formaCliente.controls['dueno'].value  == undefined ? "" : this.formaCliente.controls['dueno'].value;
      this.cliente.persona_acargo = this.formaCliente.controls['encargado'].value;
      this.cliente.vendedor = this.formaCliente.controls['vendedor'].value;
      this.cliente.color = "#197cdf";
      this.Scliente.crearCliente(this.cliente).subscribe((resp:any)=>{
        this.route.navigate(['/','clientes',], {skipLocationChange: false});
      }, err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: err
        });
      });
    }
  }

  fechaAhora() : string{
    var fecha = new Date().toLocaleDateString('fr-CA');
    return fecha;
  }
}
