import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ChangeDetectionStrategy } from '@angular/core'; // import
import Pusher from 'pusher-js';
import { ChatService } from 'src/app/services/chat.service';
import { Language } from 'src/app/models/language';
import { Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatForm!: FormGroup;
  submittedChat: boolean = false;
  sendIcon = faPaperPlane;
  user: any;
  msgs: any = [];
  userMsg: { user: any; msg: string[] }[] = [];
  storageArray: any = [];

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public chatService: ChatService
  ) {
    this.chatService.connect();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.user = this.userService.getDecodedAccessToken(token);
    this.chatForm = this.fb.group({
      msg: ['', Validators.required],
    });
    this.storageArray = this.chatService.getStorage();
    this.subscription.add(
      this.chatService.invokeNewMsg.subscribe(() => {
        this.scrollToBottom();
      })
    );
  }

  sendMsg() {
    this.chatService.sendMessage({ user: this.user, msg: this.msgs });

    this.storageArray = this.chatService.getStorage();
    this.storageArray.push({ user: this.user, msg: this.msgs });

    this.chatService.setStorage(this.storageArray);
    this.msgs = [];
  }

  onEnter(data: any) {
    this.submittedChat = true;
    this.msgs.push(data.msg);
    this.chatForm.reset();
    this.sendMsg();
  }

  get newMsg(): any[] {
    return this.chatService.receivedMsg;
  }

  scrollToBottom(): void {
    console.log(this.myScrollContainer.nativeElement.scrollHeight);
    this.myScrollContainer.nativeElement.scrollTop =
      this.myScrollContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.chatService.close();
  }
}
