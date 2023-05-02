import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000';
  patientsDataUpdated = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }

  generateQuestions(patientText: string, patientAge: number | null, language: string, patientGender: string) {
    const url = `${this.apiUrl}/generate_questions`;
    const body = { patient_text: patientText, patient_age: patientAge, language: language, patient_gender: patientGender };
    return this.http.post<any>(url, body).pipe(
      map(response => {
        response.questions = response.questions.slice(0, 9);
        response.questions.push("Möchten Sie dem Arzt weitere Mitteilungen geben?");
        response.questions.push("Bitte drüken sie send to Doctor um die Daten zu senden ");
        return response;
      })
    );
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
  // Hinzufügen der translateText-Methode
  translateText(text: string, targetLanguage: string): Observable<any> {
    const body = {
      text: text,
      target_language: targetLanguage,
    };

    return this.http.post<any>(`${this.apiUrl}/translate_text`, body);
  }
  // Zusammenfassungsfunktion
summarizeText(text: string): Observable<any> {
  const body = { text: text };
  return this.http.post<any>(`${this.apiUrl}/summarize_text`, body);
}

// Diagnosevorschlagsfunktion
suggestDiagnosis(patient: any): Observable<any> {
  const body = { patient: patient };
  return this.http.post<any>(`${this.apiUrl}/suggest_diagnosis`, body);
}

// Medikationsvorschlagsfunktion
suggestMedication(patient: any): Observable<any> {
  const body = { patient: patient };
  return this.http.post<any>(`${this.apiUrl}/suggest_medication`, body);
}

}
