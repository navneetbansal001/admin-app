import { AlertService } from './../services/alert.service';
import { Router } from '@angular/router';
import { Student } from './../models/Student';
import { StudentService } from './../services/student.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  currentUser: any;
  studentListForm: FormGroup;
  students: Student[];
  filteredStudents: Student[];
  errorMessage: any;

  constructor(private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {

    this.studentListForm = this.fb.group({
      category: 'all',
      searchByName: ''
    });

    //get all students
    this.studentService.getStudents().subscribe(
      students => {
        this.students = students;
        this.filteredStudents = students;
      },
      error => this.errorMessage = <any>error
    );

    // watching the changes to category filter
    this.studentListForm.get('category').valueChanges.subscribe(
      value => this.filterStudentsOnCategoryBase(value)
    );

    this.studentListForm.get('searchByName').valueChanges.subscribe(
      value => this.filterStudentsByName(value)
    );

  }

  filterStudentsOnCategoryBase(category: string): void {
    let filterBy = this.studentListForm.get('searchByName').value;
    filterBy = filterBy.toLocaleLowerCase();
    if (category === 'international') {
      this.filteredStudents = this.students.filter(student => { return (student.name.toLocaleLowerCase().indexOf(filterBy) !== -1 && student.category === 'international') });
    }
    else if (category === 'local') {
      this.filteredStudents = this.students.filter(student => { return (student.name.toLocaleLowerCase().indexOf(filterBy) !== -1 && student.category === 'local') });
    }
    else {
      this.filteredStudents = this.students.filter(student => { return student.name.toLocaleLowerCase().indexOf(filterBy) !== -1 });
    }
  }

  filterStudentsByName(filterBy: string): void {
    filterBy = filterBy.toLocaleLowerCase();
    let category = this.studentListForm.get('category').value;
    if (filterBy) {
      if (category === 'all') {
        this.filteredStudents = this.students.filter(student => { return student.name.toLocaleLowerCase().indexOf(filterBy) !== -1 });
      }
      else {
        this.filteredStudents = this.students.filter(student => { return (student.name.toLocaleLowerCase().indexOf(filterBy) !== -1 && student.category === category) });
      }

    }
    else {
      if (category === 'international' || category === 'local') {
        this.filteredStudents = this.students.filter(student => { return student.category === category });
      }
      else {
        this.filteredStudents = this.students;
      }
    }
  }

  delete(student: Student) {
    if (confirm(`do you really want to delete the student : ${student.name}`))
      this.studentService.delete(student.id).subscribe(
        () => this.onDelete(student.id),
        (error: any) => this.errorMessage = <any>error)
  }

  onDelete(id: number): void {
    this.studentService.getStudents().subscribe(
      (students: any) => {
        this.students = students;
        this.filteredStudents = students;
      },
      (error: any) => {
        this.alertService.error(error.error.message);
        this.errorMessage = <any>error
      }
    );
  }
  save(){
    //do nothing
  }

}
