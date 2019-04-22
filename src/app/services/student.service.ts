import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './../models/Student';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { catchError } from "rxjs/internal/operators/catchError";
import { map } from "rxjs/internal/operators/map";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
    handleError: any;

  constructor(private httpClient : HttpClient) { }

  onBoard(student : Student) {
      return this.httpClient.post(`${environment.apiUrl}/students/onBoard`,student); 
  }

  getStudents() : Observable<Student[]>{
    return this.httpClient.get<Student[]>(`${environment.apiUrl}/students`).pipe(
                tap(data => console.log('All ' + JSON.stringify(data) )),
                catchError(this.handleError)
    );
  }

  getStudent(id : number): Observable<Student> {
    return this.httpClient.get<Student>(`${environment.apiUrl}/students/${id}`).
              pipe(
                tap(data => console.log(`getProduct: `+ JSON.stringify(data))),
                catchError(this.handleError)
              );
  } 

  updateStudentDetails(student : Student) :Observable<Student>{
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.httpClient.put<Student>(`${environment.apiUrl}/students/${student.id}`,student,{headers:headers}).
            pipe(
              tap(()=> console.log(`updated student: `+ student.id)),
              map(() => student),
              catchError(this.handleError)
            );
  }

  delete(id : number) : Observable<{}>{
     const headers = new HttpHeaders({'Content-Type':'application/json'});
     return  this.httpClient.delete<Student>(`${environment.apiUrl}/students/${id}`,{headers:headers});
  } 
}
