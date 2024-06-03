import {  HttpClientModule } from '@angular/common/http';
import { Component,  inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, map, of, takeUntil } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownFilterOptions, DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginService } from './login.service';




@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule,CalendarModule,FloatLabelModule,DropdownModule,FormsModule,CheckboxModule],
  providers:[LoginService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent  {

  selectedCountry: string | undefined;
  filterValue: string | undefined = '';

  private fb = inject(FormBuilder)
  public form: any;

  date: Date | undefined;


  constructor(private loginService: LoginService,private router: Router) {
    this.form = this.fb.group({
      email: new FormControl(null, [Validators.required,Validators.email]),
      fullName: new FormControl(null, [Validators.required, Validators.pattern('\\w+\\s\\w+')]),
      country: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [this.countryValidator()],
        updateOn: 'blur'
      }),
      birthDate:  new FormControl(null, [Validators.required,this.ageValidator(18)]),
      isButtonPressed: new FormControl(false, [Validators.requiredTrue]),
    })
  }


  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; 
      }
  
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return { age: { requiredAge: minAge, actualAge: age - 1 } };
      }
  
      return age >= minAge ? null : { age: { requiredAge: minAge, actualAge: age } };
    };
  }

  countryValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      const country = control.value.toLowerCase();
      return this.loginService.getCountry(country).pipe(
        map(response => {
          const countryFlag = response['0']['flags']['png'];
          const countryCurrency = this.getCurrencyName(response);
          localStorage.setItem('flag',countryFlag);
          localStorage.setItem('currency',countryCurrency);
          return response ? null : { invalidCountry: true };
        }),
        catchError((error) => {
          return of({ invalidCountry: true });
        })
      );
    };
  }

  getCurrencyName(response: any): string {
    const currencies = response['0']['currencies'];
    const currencyCode = Object.keys(currencies)[0];
    const currencyName = currencies[currencyCode].name; 
    return currencyName;
  }

  onLogin() {
     if(this.form.invalid){
        return;
     }
     localStorage.setItem('email',this.form.value.email);
     localStorage.setItem('fullName',this.form.value.fullName);
     localStorage.setItem('country',this.form.value.country);
     localStorage.setItem('birthDate',this.form.value.birthDate);

     this.router.navigate(['/summary']);
  }
}
