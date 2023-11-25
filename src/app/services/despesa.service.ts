import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Despesa, DespesaConsulta, DespesaItem, DespesaPagamento, DespesaParcelada } from '../models/Despesa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  buscarTodos(skip: number, limit: number, idCategoria: number, pesquisa: string, inicio: string, fim: string): Observable<DespesaConsulta>{
    return this._http.get<DespesaConsulta>(`${this.apiUrl}/despesas/?skip=${skip}&limit=${limit}&categoria=${idCategoria}&pesquisa=${pesquisa}&inicio=${inicio}&fim=${fim}`)
  }

  buscar(id_despesa: number): Observable<DespesaItem>{
    return this._http.get<DespesaItem>(this.apiUrl + `/despesas/despesa/${id_despesa}`)
  }

  add(despesa: Despesa): Observable<{}>{
    return this._http.post<{}>(this.apiUrl + "/despesas/", despesa)
  }

  addParcelada(despesaParcelada: DespesaParcelada): Observable<{}>{
    return this._http.post<{}>(`${this.apiUrl}/despesas/parceladas`, despesaParcelada)
  }

  pagamento(id_despesa: number, despesa: DespesaPagamento): Observable<{}>{
    return this._http.patch<{}>(`${this.apiUrl}/despesas/pagamento/${id_despesa}`, despesa)
  }

  editar(id_despesa: number, despesa: Despesa): Observable<{}>{
    return this._http.put<{}>(this.apiUrl + `/despesas/${id_despesa}`, despesa)
  }

  remover(id_despesa: number): Observable<{}>{
    return this._http.delete<{}>(`${this.apiUrl}/despesas/${id_despesa}`)
  }

  buscarDisponivel(): Observable<DespesaConsulta[]>{
    return this._http.get<DespesaConsulta[]>(this.apiUrl + `/despesas/disponivel`)
  }

}
