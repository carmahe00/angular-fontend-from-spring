import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor(private _authService:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  public get authService(){
    return this._authService;
  }

  logout():void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `Cliente ${username}, has cerrado sesión con éxito!`,
      showConfirmButton: false,
      timer: 1500
    })
    this.router.navigate(['/login']);
  }
}
