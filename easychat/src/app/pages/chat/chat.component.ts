import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatForm!: FormGroup;
  submittedChat: boolean = false;
  sendIcon = faPaperPlane;
  user: any;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.user = this.userService.getDecodedAccessToken(token);
    this.chatForm = this.fb.group({
      msg: ['', Validators.required],
    });
  }

  msgs: any = [];

  onEnter(data: any) {
    this.submittedChat = true;
    this.msgs.push(data.msg);
    this.chatForm.reset();
    console.log('msg: ', this.msgs);
  }
}
