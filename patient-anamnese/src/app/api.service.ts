import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  generateQuestions(patientText: string): Observable<any> {
    const requestBody = { patient_text: patientText };
    return this.http.post<any>(`${this.apiUrl}/generate_questions`, requestBody);
  }
}
