import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Language } from 'src/app/models/language';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  isLoading: boolean = false;

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

  languages = Language;

  submittedForm: boolean = false;
  signupForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      nickname: ['', Validators.required],
      avatar: ['', Validators.required],
      language: ['', Validators.required],
    });
  }

  onCheckChange(event: any) {}

  onSignup(data: User) {
    console.log('data: ', data);
    this.submittedForm = true;
    if (this.signupForm.invalid) {
      alert('Please, complete all the required fields before submitting.');
      return;
    }
    this.userService.signUp(data).subscribe({
      error: (error) => {
        console.error('There was an error!', error);
        alert('An error has occurred, please try again!');
        return;
      },
      next: () => {
        alert('Your request has been successfully submitted.');
        this.ngOnInit();
        this.router.navigateByUrl('/');
        this.isLoading = false;
      },
    });
  }
}
