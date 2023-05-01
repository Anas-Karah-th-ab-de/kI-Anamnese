import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// Register the German locale data
registerLocaleData(localeDe, 'de');

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent {
  patientName = '';
  patientAge: number | null = null;
  patientText = '';
  questions: string[] = [];
  currentQuestionIndex = 0;
  answers: string[] = [];
  selectedLanguage = 'en';
  
  constructor(private apiService: ApiService) {}

  changeLanguage() {
    if (this.selectedLanguage === 'de') {
      document.documentElement.lang = 'de';
    } else {
      document.documentElement.lang = 'en';
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  allQuestionsAnswered(): boolean {
    return this.answers.every(answer => answer !== undefined && answer !== '');
  }

  sendToDoctor(): void {
    const patientData = {
      name: this.patientName,
      age: this.patientAge,
      patient_text: this.patientText, // Add this line to include "patient_text"
      questions: this.questions,
      answers: this.answers
    };
    console.log('Sending patient data to doctor:', patientData);
    this.apiService.submitToDoctor(patientData).subscribe(
      (response) => {
        alert("Data submitted successfully");
      },
      (error) => {
        alert("Error submitting data");
      }
    );
  }
  
  
  generateQuestions(patientText: string, patientAge: number | null, selectedLanguage: string): void {
    this.apiService.generateQuestions(patientText, patientAge, selectedLanguage).subscribe(
      (response: any) => {
        this.questions = response.questions;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
