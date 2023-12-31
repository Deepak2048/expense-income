import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/login', userData);
  }

  register(userData: any): Observable<any> {
    console.log('register data', userData);

    return this.http.post(this.apiUrl + '/user/register', userData);
  }

  addBasicInformation(basicData: any): Observable<any> {
    return this.http.post('basicInfoDetails', basicData);
  }
}
