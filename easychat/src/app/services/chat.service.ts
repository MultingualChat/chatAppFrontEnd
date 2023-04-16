import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { UserService } from './user.service';
import { Language } from '../models/language';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  spToEnUrl = 'https://b152-35-224-0-158.ngrok.io';
  enToSpUrl = 'https://8617-34-85-219-120.ngrok.io';

  url = window.location.pathname.split('/')[2];
  socketUrl = 'wss://easychat-8wvu.onrender.com/socket/ws/' + this.url;

  private socket$!: WebSocketSubject<any>;
  public receivedMsg: any[] = [];

  user: any;
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    const token = localStorage.getItem('token');
    this.user = this.userService.getDecodedAccessToken(token);
  }

  invokeNewMsg = new EventEmitter();

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.socketUrl);

      this.socket$.subscribe((data: any) => {
        if (
          data.message.user.language != this.user.language &&
          this.user.language === Language.EN
        ) {
          this.spToEn(data.message.msg).subscribe((res: any) => {
            data.message.msg = res.data;
            this.receivedMsg.push(data);
            this.invokeNewMsg.emit();
          });
        } else if (
          data.message.user.language != this.user.language &&
          this.user.language === Language.ES
        ) {
          this.enToSp(data.message.msg).subscribe((res: any) => {
            data.message.msg = res.data;
            this.receivedMsg.push(data);
            this.invokeNewMsg.emit();
          });
        } else {
          this.receivedMsg.push(data);
          this.invokeNewMsg.emit();
        }
      });
    }
  }

  sendMessage(message: any) {
    this.socket$.next({ message });
  }

  close() {
    this.socket$.complete();
  }

  getStorage() {
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }

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
