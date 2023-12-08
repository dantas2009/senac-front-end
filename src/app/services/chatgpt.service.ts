import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Despesa } from '../models/Despesa';
import { ChatgptInput } from '../models/ChatgptInput';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  chatgpt(input: ChatgptInput): Observable<Despesa>{
    return this._http.post<Despesa>(`${this.apiUrl}/chatgpt/`, input)
  }
}
