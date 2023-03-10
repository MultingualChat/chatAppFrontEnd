import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, take, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMenuCollapsed = true;

  loginForm!: FormGroup;
  submittedForm: boolean = false;

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(data: any) {
    console.log('Hola');
    this.submittedForm = true;
    if (this.loginForm.invalid) {
      alert('Please, complete all the required fields before submitting.');
      return;
    }
    this.authService
      .login(data.email, data.password)
      .pipe(
        take(1),
        catchError((err: HttpErrorResponse) => {
          alert(
            'Error:' + err.status + '\nInvalid submission, please try again.'
          );
          return throwError(() => err);
        })
      )
      .subscribe((user) => {
        if (this.authService.isAuthenticated()) {
          this.router.navigateByUrl('/profile');
        }
      });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
