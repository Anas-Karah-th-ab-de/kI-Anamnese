import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent {
  constructor(private http: HttpClient) { }

  generateQuestions(patientText: string) {
    const apiUrl = 'http://localhost:5000/generate_questions';
    this.http.post<{questions: string}>(apiUrl, { patient_text: patientText }).subscribe(response => {
      console.log(response.questions);
    });
  }
}
