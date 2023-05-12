/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule as DoctorAppModule } from './app doctor/app.module';
import { AppModule as PatientAppModule } from './app patient/app.module';

enableProdMode();

const isDoctor = true; // Set this variable to determine whether it's the doctor or patient application

const AppModule = isDoctor ? DoctorAppModule : PatientAppModule;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
