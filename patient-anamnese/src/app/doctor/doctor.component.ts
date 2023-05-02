import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  patientsData: any[] = [];
  selectedPatient: any;
  selectedActionText: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPatientsData();
    this.apiService.patientsDataUpdated.subscribe((updated) => {
      if (updated) {
        this.getPatientsData();
        this.apiService.patientsDataUpdated.next(false);
      }
    });
  }
  selectedLanguage = 'en';
  languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Türky' },
    // Fügen Sie weitere Sprachen hinzu
  ];
  
  getPatientsData(): void {
    this.apiService.getPatientsData().subscribe(
      (response: any) => {
        this.patientsData = response.patients_data;
      },
      (error) => {
        console.error('Error fetching patients data:', error);
      }
    );
  }
  showDetails(patient: any): void {
    this.selectedPatient = patient;
    this.selectedActionText = '';
  }
  // In der doctor.component.ts
  translate(patient: any): void {
    this.apiService.translateText(patient.patient_text, this.selectedLanguage).subscribe(
      (response: any) => {
        patient.patient_text = response.translated_text;
  
        // Übersetzen der Fragen
        const questionsToTranslate = patient.questions.join('|||');
        this.apiService.translateText(questionsToTranslate, this.selectedLanguage).subscribe(
          (questionsResponse: any) => {
            patient.questions = questionsResponse.translated_text.split('|||');
          },
          (error) => {
            console.error('Error translating questions:', error);
          }
        );
  
        // Übersetzen der Antworten
        const answersToTranslate = patient.answers.join('|||');
        this.apiService.translateText(answersToTranslate, this.selectedLanguage).subscribe(
          (answersResponse: any) => {
            patient.answers = answersResponse.translated_text.split('|||');
          },
          (error) => {
            console.error('Error translating answers:', error);
          }
        );
  
        // Übersetzen des Aktionstextes
        const actionTextToTranslate = this.selectedActionText;
        this.apiService.translateText(actionTextToTranslate, this.selectedLanguage).subscribe(
          (actionTextResponse: any) => {
            this.selectedActionText = actionTextResponse.translated_text;
          },
          (error) => {
            console.error('Error translating action text:', error);
          }
        );
        // Übersetzen der Zusammenfassung
if (patient.summary) {
  this.apiService.translateText(patient.summary, this.selectedLanguage).subscribe(
    (summaryResponse: any) => {
      patient.summary = summaryResponse.translated_text;
    },
    (error) => {
      console.error('Error translating summary:', error);
    }
  );
}

// Übersetzen der vorgeschlagenen Diagnose
if (patient.diagnosis) {
  this.apiService.translateText(patient.diagnosis, this.selectedLanguage).subscribe(
    (diagnosisResponse: any) => {
      patient.diagnosis = diagnosisResponse.translated_text;
    },
    (error) => {
      console.error('Error translating diagnosis:', error);
    }
  );
}

// Übersetzen der vorgeschlagenen Medikation
if (patient.medication) {
  this.apiService.translateText(patient.medication, this.selectedLanguage).subscribe(
    (medicationResponse: any) => {
      patient.medication = medicationResponse.translated_text;
    },
    (error) => {
      console.error('Error translating medication:', error);
    }
  );
}
      },
      (error) => {
        console.error('Error translating text:', error);
      }
    );
  }
  
  
  summarize(patient: any): void {
    this.apiService.summarizeText(patient.patient_text).subscribe(
      (response: any) => {
        patient.summary = response.summary; // Speichern der Zusammenfassung im Patientenobjekt
      },
      (error) => {
        console.error('Error summarizing text:', error);
      }
    );
  }
  
  
  suggestDiagnosis(patient: any): void {
    this.apiService.suggestDiagnosis(patient).subscribe(
      (response: any) => {
        patient.diagnosis = response.diagnosis; // Speichern der vorgeschlagenen Diagnose im Patientenobjekt
      },
      (error) => {
        console.error('Error suggesting diagnosis:', error);
      }
    );
  }
  
  
  medication(patient: any): void {
    this.apiService.suggestMedication(patient).subscribe(
      (response: any) => {
        patient.medication = response.medication; // Speichern der vorgeschlagenen Medikation im Patientenobjekt
      },
      (error) => {
        console.error('Error suggesting medication:', error);
      }
    );
  }
  
  
  

}
