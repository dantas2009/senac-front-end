import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/auth/Login';
import { HttpClient } from '@angular/common/http';
import { Token } from '../models/auth/Token';
import { Usuario } from '../models/Usuario'
import { Recuperar } from '../models/auth/Recuperar';
import { NovaSenha } from '../models/auth/NovaSenha';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getToken(){
    return localStorage.getItem('token');
  }

  removeToken(){
    localStorage.removeItem('token');
    window.location.reload();
  }

  cadastro(usuario: Usuario): Observable<Token>{
    return this.http.post<Token>(this.apiUrl + "/auth/cadastro", usuario)
  }

  login(login: Login): Observable<Token>{
    return this.http.post<Token>(this.apiUrl + "/auth/login", login)
  }

  logout(){
    //this.http.get<Token>(this.apiUrl + "/auth/logout")
  }

  recuperar(recuperar: Recuperar): Observable<{}>{
    return this.http.post<{}>(this.apiUrl + "/auth/recuperar/mail", recuperar)
  }

  novaSenha(novasenha: NovaSenha): Observable<Token>{
    return this.http.post<Token>(this.apiUrl + "/auth/recuperar/senha", novasenha)
  }
}
