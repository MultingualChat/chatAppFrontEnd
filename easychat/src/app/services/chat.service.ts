import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../models/language';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  spToEnUrl = 'https://3385-34-68-111-239.ngrok.io';
  enToSpUrl = 'https://3385-34-68-111-239.ngrok.io';

  constructor(private httpClient: HttpClient) {}

  language: Language = Language.EN;

  spToEn(form: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.spToEnUrl}/translate/spa_to_eng`,
      form
    );
  }

  enToSp(form: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.enToSpUrl}/translate/eng_to_spa`,
      form
    );
  }
}
