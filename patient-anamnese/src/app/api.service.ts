import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000';
  patientsDataUpdated = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }

  generateQuestions(patientText: string, patientAge: number | null, language: string) {
    const url = `${this.apiUrl}/generate_questions`;
    const body = { patient_text: patientText, patient_age: patientAge, language: language };
    return this.http.post<any>(url, body);
  }

  submitToDoctor(patientData: any): Observable<any> {
    const url = `${this.apiUrl}/submit_to_doctor`;
    return this.http.post<any>(url, patientData);
  }

  // Fügen Sie die getPatientsData()-Methode hinzu
  getPatientsData() {
    return this.http.get(`${this.apiUrl}/get_patients_data`);
  }
  // Fügen Sie diese Funktion in Ihrer ApiService Klasse hinzu
  generateFollowUpQuestions(prevQuestion: string, patientAnswer: string): Observable<any> {
    const url = `${this.apiUrl}/generate_follow_up_questions`;
    const body = { prev_question: prevQuestion, patient_answer: patientAnswer };
    return this.http.post<any>(url, body);
  }

}
