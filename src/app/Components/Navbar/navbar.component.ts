import { Component } from "@angular/core";
import { NavbarService } from "src/app/services/navbar.service";


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
  })


export class NavbarComponent{

  constructor(public nav: NavbarService){

  }
  
  nivel: number = localStorage['level'];
  usuario: string = localStorage['name'];
   public testOut() {
      console.log("hovering outside sidebar");
      }
}