import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasicInfoServiceService {
  constructor(private httpClient: HttpClient) {}

  addBasicInformation(data: any): Observable<any> {
    return this.httpClient.post('http://localhost:3000/basicinformation', data);
  }

  listBasicInformation(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/basicinformation');
  }

  deleteBasicInformation(id: number): Observable<any> {
    return this.httpClient.delete(
      `http://localhost:3000/basicinformation/${id}`
    );
  }
}
