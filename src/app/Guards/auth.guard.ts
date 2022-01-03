import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  now:number;
  constructor(private auth: AuthService, private router: Router){

  }
  canActivate():  boolean  {
    if(this.auth.autenticado()){
      // this.now = new Date().getTime();
      // if(this.now < parseInt(localStorage.getItem('endSeason'))){
      //   return true;
      // }else{
      //   this.router.navigateByUrl('/logout');
      //   return false;
      // }
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  
}
