import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { DashboardCards, DashboardLineAno, DashboardPieAno, DashboardPieMes } from '../models/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  buscarCards(): Observable<DashboardCards>{
    return this._http.get<DashboardCards>(`${this.apiUrl}/dashboard/cards`)
  }

  buscarDespesasAno(): Observable<DashboardLineAno>{
    return this._http.get<DashboardLineAno>(`${this.apiUrl}/dashboard/line_ano`)
  }

  buscarDespesasCategoriaMes(): Observable<DashboardPieMes>{
    return this._http.get<DashboardPieMes>(`${this.apiUrl}/dashboard/pie_mes`)
  }

  buscarDespesasCategoriaAno(): Observable<DashboardPieAno>{
    return this._http.get<DashboardPieAno>(`${this.apiUrl}/dashboard/pie_ano`)
  }
  
}
