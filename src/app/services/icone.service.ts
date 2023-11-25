import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Icone } from '../models/Icone';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IconeService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient, private _authService: AuthService) { }

  iconesDisponiveis(): Observable<Icone[]> {
    const token = this._authService.getToken();



    return this._http.get<Icone[]>(this.apiUrl + "/icones/disponiveis",)
  }


}
