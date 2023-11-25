import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria, CategoriaConsulta } from '../models/Categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  buscarTodos(): Observable<CategoriaConsulta[]>{
    return this._http.get<CategoriaConsulta[]>(this.apiUrl + `/categorias/`)
  }

  buscar(id_categoria: number): Observable<CategoriaConsulta>{
    return this._http.get<CategoriaConsulta>(this.apiUrl + `/categorias/categoria/${id_categoria}`)
  }

  add(categoria: Categoria): Observable<{}>{
    return this._http.post<{}>(this.apiUrl + "/categorias/", categoria)
  }

  editar(id_categoria: number, categoria: Categoria): Observable<{}>{
    return this._http.put<{}>(this.apiUrl + `/categorias/${id_categoria}`, categoria)
  }

  buscarDisponivel(): Observable<CategoriaConsulta[]>{
    return this._http.get<CategoriaConsulta[]>(this.apiUrl + `/categorias/disponivel`)
  }

}
