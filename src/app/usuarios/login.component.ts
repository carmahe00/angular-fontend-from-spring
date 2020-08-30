import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from './usuario';
import { AuthService } from './auth.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por favor Sign In!';
  usuario:Usuario;
  constructor(private authService:AuthService, private router:Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal.fire({
        position: 'top-end',
        icon: 'info',
        title: `Cliente ${this.authService.usuario.username}, ya inicio sesión!`,
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/clietes'])
    }
  }

  login(){
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire({ title: 'Error Login', text: 'Username o password', icon: 'error' });
      return;
    }
    this.authService.login(this.usuario).subscribe(response =>{
      console.log(response);
      
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario:Usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Cliente ${usuario.username}, has iniciado sesión con éxito!`,
        showConfirmButton: false,
        timer: 1500
      })
    }, err => {
      if(err.status == 400){
        swal.fire({ title: 'Error Login', text: 'usuario o clave incorrectas!', icon: 'error' });
      }
    });
  }

}
