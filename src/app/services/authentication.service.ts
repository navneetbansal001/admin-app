import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    debugger
    let parameters = new HttpParams().set("email", email).set("password", password);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    debugger
    return this.httpClient.get(`${environment.apiUrl}/users/authentication`, { headers: headers, params: parameters })
      .pipe(map((responseBody:any) => {
        // login successful if there's a jwt token in the response\
        console.log(responseBody);
        if ( responseBody && responseBody.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(responseBody));
        }
          return responseBody;
      }));
  }

  logout() : void {
    localStorage.removeItem('currentUser');
  }
}
