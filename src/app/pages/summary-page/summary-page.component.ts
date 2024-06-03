import { DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-page',
  standalone: true,
  imports: [DatePipe,TitleCasePipe],
  templateUrl: './summary-page.component.html',
  styleUrl: './summary-page.component.scss'
})
export class SummaryPageComponent  implements OnInit{

  fullName: string = '';
  email: string = '';
  country: string = '';
  flag: string = '';
  currency: string = '';
  birthDay: Date;

  constructor(private router: Router){

  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    if(this.email === ''){
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    this.fullName = localStorage.getItem('fullName') || '';
    this.country = localStorage.getItem('country') || '';
    this.flag = localStorage.getItem('flag') || '';
    this.currency = localStorage.getItem('currency') || '';
    let birthDate = localStorage.getItem('birthDate') || '';
    let birthNumber = Date.parse(birthDate);
    this.birthDay = new Date(birthNumber);
    
  }

}
