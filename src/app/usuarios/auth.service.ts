import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario:Usuario;
  private _token:string;

  constructor(private http:HttpClient) { }

  /**
   * @method usuario() devuelve el usuario, sino existe devuelve uno vacio
   */
  public get usuario():Usuario{
    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  /**
   * @method token() devuelve el token, sino existe devuleve null
   */
  public get token():string{
    if(this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('usuario') != null){
      this._token = sessionStorage.getItem('usuario');
      return this._token;
    }
    return null;
  }

  /**
   * método para iniciar sesión
   * @param usuario es username y contraseña que pasamos desde el comonente LoginComponent
   * @method btoa() ecnriptar la credenciales para enviar base64 a oauth2
   * indicar el tipo de cabecera con los paámetros convertidos a string( params.toString())
   */
  login(usuario:Usuario):Observable<any>{
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    //encriptar Base64
    const credenciales = btoa('angularapp' +':' +'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic '+ credenciales});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(urlEndpoint, params.toString(), {headers:httpHeaders});
  }

  /**
   * método para guardar el usuario en sessionStorage
   * @param accesToken  token completo con header, payload y firma
   */
  guardarUsuario(accesToken:string){
    let payload = this.obtenerDatosToken(accesToken);
    this._usuario = new Usuario();
    this._usuario.nombre =  payload.nombre;
    this._usuario.apellido =  payload.apellido;
    this._usuario.email =  payload.email;
    this._usuario.username =  payload.user_name;
    this._usuario.roles =  payload.authorities;
    sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
  }

  /**
   * método guardar token en el sessionStorage
   * @param accesToken string para guardar sesión
   */
  guardarToken(accesToken:string){
    this._token = accesToken;
    sessionStorage.setItem('token',accesToken);
  }

  /**
   * método para devolver el token convertido a JSON
   * @param acessToken es de tipo string desencriptado y convertido a JSON
   */
  obtenerDatosToken(acessToken:string):any{
    if(acessToken != null){
      return JSON.parse(atob(acessToken.split(".")[1])); 
    }
    return null;
  }

  /**
   * método para verificar que exista el token
   */
  isAuthenticated():boolean{
     let payload = this.obtenerDatosToken(this.token);
     if (payload != null && payload.user_name && payload.user_name.length > 0) {
        return true;
     }
     return false
  }

  /**
   * método para verificar si tiene rol
   * @param role rol de usuario
   */
  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  /**
   * método para cerrar sesión
   * limpiar el _token y _usuario
   * limpiar la sesión 
   */
  logout():void{
    this._token =null;
    this._usuario =null;
    sessionStorage.clear();    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
