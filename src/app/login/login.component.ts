import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loginForm: FormGroup;
  constructor(private authService: AuthService, private router: Router,
    private formBuilder: FormBuilder,
  ) { 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.login(this.credentials).subscribe((response: any) => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/dashboard']);
    });
  }

  loginWithGoogle(){
    this.authService.loginWithGoogle();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.credentials).subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      })
    }
  }
}