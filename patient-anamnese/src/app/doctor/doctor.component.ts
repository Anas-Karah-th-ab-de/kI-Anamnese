import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  patientsData: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPatientsData();
  }

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
}
