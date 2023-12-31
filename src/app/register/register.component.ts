import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginApiService } from '../service/login-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  name: string = '';
  username: string = '';
  password: string = '';
  isRegisterUIVisible: boolean = true;

  constructor(private apiService: LoginApiService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    this.apiService
      .register({
        name: this.name,
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (data) => {
          alert('register successfully!');
          this.isRegisterUIVisible = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.router.navigate(['/register']);
        },
      });
  }
}
