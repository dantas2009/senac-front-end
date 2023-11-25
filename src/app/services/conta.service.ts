import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioEditar } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  buscar(): Observable<Usuario>{
    return this._http.get<Usuario>(this.apiUrl + `/conta`)
  }

  editar(usuario: UsuarioEditar): Observable<{}>{
    return this._http.put<{}>(this.apiUrl + `/conta`, usuario)
  }

}
