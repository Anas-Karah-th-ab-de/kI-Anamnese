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
  maxQuestions = 5;
  patientGender = 'male';
  constructor(private apiService: ApiService) {}
  sendToDoctorVisible(): boolean {
    return this.answers.length >= 5 && this.allQuestionsAnswered();
  }
  changeLanguage() {
    if (this.selectedLanguage === 'de') {
      document.documentElement.lang = 'de';
    } else {
      document.documentElement.lang = 'en';
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
  
  
  
  generateQuestions(patientText: string, patientAge: number | null, selectedLanguage: string, patientGender: string): void {
    this.apiService.generateQuestions(patientText, patientAge, selectedLanguage, patientGender).subscribe(
      (response: any) => {
        this.questions = response.questions;
        this.answers = new Array(this.questions.length).fill('');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  nextQuestion(): void {
    if (this.currentQuestionIndex >= this.maxQuestions - 1) {
      return;
    }
  
    const currentAnswer = this.answers[this.currentQuestionIndex];
  
    if (this.currentQuestionIndex === this.maxQuestions - 2) {
      this.currentQuestionIndex++;
      this.questions.push("Möchten Sie dem Arzt weitere Mitteilungen geben?");
      this.answers.push('');
    } else {
      this.apiService.generateFollowUpQuestions(this.questions[this.currentQuestionIndex], currentAnswer).subscribe(
        (response: any) => {
          this.currentQuestionIndex++;
          this.questions.push(response.follow_up_question);
          this.answers.push('');
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  restart(): void {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.answers = [];
  }
  
  
}  
