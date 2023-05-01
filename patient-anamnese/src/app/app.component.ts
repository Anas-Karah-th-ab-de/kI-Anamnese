// app.component.ts

import { ApiService } from './api.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
// Register the German locale data
registerLocaleData(localeDe, 'de');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent {
  title = 'patient-anamnese';
 // Change this line
  // Rest of the code
}
