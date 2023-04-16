import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Language } from 'src/app/models/language';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  edit = faPenToSquare;
  isEditing: boolean = false;
  isLoading: boolean = false;

  languages = Language;

  submittedForm: boolean = false;
  profileForm!: FormGroup;
  joinRoom: boolean = false;
  joinForm!: FormGroup;

  user!: User;

  avatars = [
    'colombia.png',
    'canada.png',
    'india.png',
    'girl.png',
    'boy.png',
    'koala.png',
    'chameleon.png',
    'monster.png',
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.user = this.userService.getDecodedAccessToken(token);
    console.log(
      'token decode: ',
      this.userService.getDecodedAccessToken(token)
    );
    this.profileForm = this.fb.group({
      nickname: [{ value: '', disabled: true }, Validators.required],
      avatar: [{ value: '', disabled: true }, Validators.required],
      language: [{ value: '', disabled: true }, Validators.required],
    });
    this.joinForm = this.fb.group({
      esToEn: ['', Validators.required],
      enToEs: ['', Validators.required],
    });
  }

  onJoinRoom(data: any) {
    this.joinRoom = true;
    if (this.joinForm.invalid) {
      alert(
        'Please, complete all the required fields before entering to the room.'
      );
      return;
    }
    this.chatService.enToSpUrl = data.enToEs;
    this.chatService.spToEnUrl = data.esToEn;
    this.router.navigateByUrl('/chat');
  }

  onUpdateProfile(data: any) {
    this.submittedForm = true;
    if (this.profileForm.invalid) {
      alert('Please, complete all the required fields before submitting.');
      return;
    }
    this.userService.updateUser(data).subscribe({
      error: (error) => {
        console.error('There was an error!', error);
        alert('An error has occurred, please try again!');
        return;
      },
      next: () => {
        alert('Your request has been successfully submitted.');
        this.ngOnInit();
        location.reload();
        this.isLoading = false;
      },
    });
  }

  onCheckChange(event: any) {}

  onEdit() {
    if (this.isEditing) {
      this.profileForm.controls['nickname'].enable();
      this.profileForm.controls['avatar'].enable();
      this.profileForm.controls['language'].enable();
    } else {
      this.profileForm.controls['nickname'].disable();
      this.profileForm.controls['avatar'].disable();
      this.profileForm.controls['language'].disable();
    }
  }
}
