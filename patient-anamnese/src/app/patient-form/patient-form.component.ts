import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent {
  constructor(private http: HttpClient) { }

  generateQuestions(patientText: string) {
    console.log("generateQuestions called with:", patientText);
    const apiUrl = 'http://localhost:5000/generate_questions';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type':  'application/json'
      })
    };
      
    this.http.post(apiUrl, {
      patient_text: patientText
    }, httpOptions).subscribe(response => {
      console.log("Generated questions:", response);
    });
  }  
}
