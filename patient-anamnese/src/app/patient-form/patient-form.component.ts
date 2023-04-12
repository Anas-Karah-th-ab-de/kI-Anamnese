import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


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
      headers: {
        'Content-Type':  'application/json'
      }
    };
    
    const payload = { patient_text: patientText };
    console.log("Sending payload:", payload);
  
    this.http.post<{questions: string}>(apiUrl, payload, httpOptions).subscribe(response => {
      console.log("Generated questions:", response.questions);
    });
  }
  
  
}
