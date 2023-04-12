import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// Register the German locale data
registerLocaleData(localeDe, 'de');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Angular App';
  patientName = '';
  patientAge: number | null = null;
  patientText = '';
  questions: string[] = [];
  currentQuestionIndex = 0;
  answers: string[] = [];
  selectedLanguage = 'en';

  constructor(private apiService: ApiService) { }

  generateQuestions(patientText: string, patientAge: number | null, language: string) {
    this.apiService.generateQuestions(patientText, patientAge, language).subscribe(response => {
      console.log(response);
      this.questions = response.questions.split('\n');
      this.currentQuestionIndex = 0;
      this.answers = new Array(this.questions.length).fill('');
    });
  }
  

  
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
      questions: this.questions,
      answers: this.answers
    };
    console.log('Sending patient data to doctor:', patientData);
    // Hier können Sie den Code zum Senden der Patientendaten an die Arztanwendung hinzufügen
  }
}
