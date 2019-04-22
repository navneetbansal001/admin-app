import { logging } from 'protractor';
import { User } from 'src/app/models/User';
import { environment } from './../../environments/environment';
import { UserService } from './../services/user.service';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpClient, HttpRequest, HttpHandler, HttpSentEvent, HttpEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import { mergeMap } from "rxjs/internal/operators/mergeMap";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { materialize } from "rxjs/internal/operators/materialize";
import { dematerialize } from "rxjs/internal/operators/dematerialize";
import { delay ,map} from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class BackendInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
    let students : any [] = JSON.parse(localStorage.getItem('students')) || [];

    return of(null).pipe(mergeMap(() => {

      //get User
      if (request.url.endsWith('/users/authentication') && request.method === 'GET') {

        let loginEmail = request.params.get("email");
        let loginPassword = request.params.get("password");
        
        let filteredUser = users.filter(user => {
                    return user.username === loginEmail && user.password === loginPassword;
                });


        request = request.clone({
          url: `${environment.apiUrl}/users`
        })

        return next.handle(request).pipe( map(event =>{
          if (event instanceof HttpResponse && event.body.length){
               let responsebody = {
                id: event.body.entries().next().value[1].id,
                email: event.body.entries().next().value[1].email,
                firstName: event.body.entries().next().value[1].firstName,
                lastName: event.body.entries().next().value[1].lastName,
                token: 'fake-jwt-token'
              };
              event = event.clone({body :responsebody }) 
          }
          return event;
        }));
      }

      // register user
      if (request.url.endsWith('/users/reg') && request.method === 'POST') {
        // get new user object from post body 
        let newUser = request.body;

        // validation
        let duplicateEmailUser = users.filter(user => { return user.email === newUser.email; }).length;
        if (duplicateEmailUser) {
          return throwError({ error: { message: 'email ' + newUser.email + ' is already taken' } });
        }

        // save new user
        newUser.id = users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // respond 200 OK
        request = request.clone({
          url: `${environment.apiUrl}/users/`
        })
        return next.handle(request).pipe(map(event => {
          return event;
        }));
      }  

      if(request.url.endsWith('/students/onBoard') && request.method === 'POST'){
       if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
         let newStudent = request.body;
         let duplicateStudent =   students.filter(student => { return student.onBoardNumber === newStudent.onBoardNumber; }).length;
        if (duplicateStudent) {
          return throwError({ error: { message: 'OnBoardNumber "' + newStudent.onBoardNumber + '" is already taken' } });
        }

        // save new student
        newStudent.id = students.length + 1;
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));

        // respond 200 OK
        request = request.clone({
          url: `${environment.apiUrl}/students/`
        })

         return next.handle(request).pipe(map(event => {
               return event;
         }));
       }
       else{
          return throwError({ status: 401, error: { message: 'Unauthorised' } });
       }   
      }  

      // pass through any requests not handled above
      return next.handle(request);

    }))
      // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: BackendInterceptorService,
  multi: true
};