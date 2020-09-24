import { Component } from "@angular/core"


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
  })


export class NavbarComponent{

    usuario: string = localStorage['name'];
   public testOut() {
      console.log("hovering outside sidebar");
      }
}