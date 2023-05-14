import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, switchMap, of, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = this.authService.getToken();
      console.log(token);
      
      console.log(!this.isTokenExpired(token));
      
      if (token && !this.isTokenExpired(token)) {
        return true;
      }
      
      return this.authService.refreshClientToken().pipe(
        map((data: any) => {
          localStorage.setItem('token', data.accessToken);
          return true;
        }),
        catchError((error: any) => {
          console.log(error);
          this.authService.logout();
          Swal.fire('Se ha caducado la sesión', 'Por favor, inicia sesión nuevamente', 'info');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
      
  }

  private isTokenExpired(token: string): boolean {
    const expirationDate = this.getExpirationDateFromToken(token);
    const currentTimestamp = Date.now() / 1000;

    return currentTimestamp > expirationDate;
  }

  private getExpirationDateFromToken(token: string): number {

    const decodedToken: any = jwt_decode(token);
    return decodedToken.exp;
  }
  
}
