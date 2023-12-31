import { Component, OnInit } from '@angular/core';
import { LoginApiService } from '../service/login-api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoginUIVisible: boolean = true;

  constructor(
    private loginApiService: LoginApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login() {
    this.loginApiService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (data) => {
          alert('login successsfully!');
          this.isLoginUIVisible = false;
          this.router.navigate(['/emi']);
        },
        error: (err) => {
          if (
            err.status === 404 &&
            err.error &&
            err.error.message === 'Username does not exist'
          ) {
            this.isLoginUIVisible = false;
            this.router.navigate(['/register']);
          } else if (
            err.status === 401 &&
            err.error &&
            err.error.message === 'Invalid email address'
          ) {
            this.isLoginUIVisible = false;
            this.router.navigate(['/register']);
          } else {
            alert('invalid credentials!');
            console.error('Login error', err.error.message);
          }
        },
      });
  }
}
