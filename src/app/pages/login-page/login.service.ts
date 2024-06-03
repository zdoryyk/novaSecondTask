import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {

  }

  getCountry(countryName: string): Observable<boolean> {
    return this.http.get<any>(`https://restcountries.com/v3.1/name/${countryName}`);
  }
  

}
