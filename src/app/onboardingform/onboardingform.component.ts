import { AlertService } from './../services/alert.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { StudentService } from './../services/student.service';
import { Student } from './../models/Student';
import { AbstractControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboardingform',
  templateUrl: './onboardingform.component.html',
  styleUrls: ['./onboardingform.component.css']
})
export class OnboardingformComponent implements OnInit {
  isSave = true;
  isclicked = false;
  isDisabled = false ;
  student = new Student();
  toDisplayStudent = new Student();
  isInternational: boolean = true;
  onBoardingForm: FormGroup;
  loading = false;
  private sub: Subscription;
  errorMessage: any;
  currentUser : any;

  constructor(private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService : AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.onBoardingForm = this.fb.group({
      onBoardNumber: ['', [Validators.required]],
      studentName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      documents: this.fb.group({
        domicile: ['', [Validators.required]],
        birthCertificate: ['', [Validators.required]],
        markSheets: ['', [Validators.required]],
        policeClearance: '',
        passport: '',
        declaration: ['', [Validators.required]]
      }),
      dateOfBirth: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      lastClassScore: ''
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        const flag = params.get('flag');
        const boolFlag = JSON.parse(flag);  
        this.getStudent(id,boolFlag);
      });

    // watching the changes to notification formControl and reacting accordingly
    this.onBoardingForm.get('category').valueChanges.subscribe(
      value => this.setDocumentsFilter(value)
    );
  }

  ngOnDestry(): void {
    this.isclicked = false;
    this.sub.unsubscribe();
  }

  getStudent(id: number , flag : boolean) {
    this.studentService.getStudent(id).subscribe(
      student => this.displayStudent(student,flag),
      error => this.errorMessage = <any>error
    );
  }

  displayStudent(student: Student , flag : boolean) {
    if (this.onBoardingForm) {
      this.onBoardingForm.reset;
    }
    this.toDisplayStudent = student;

    this.onBoardingForm.patchValue({
      onBoardNumber: this.toDisplayStudent.onBoardNumber,
      studentName: this.toDisplayStudent.name,
      category: this.toDisplayStudent.category,
      dateOfBirth: this.toDisplayStudent.dateOfBirth,
      fatherName: this.toDisplayStudent.fatherName,
      motherName: this.toDisplayStudent.motherName,
      lastClassScore: this.toDisplayStudent.lastClassScore
    })

    this.onBoardingForm.setControl('documents', this.fb.group({
      domicile: this.toDisplayStudent.domicile,
      birthCertificate: this.toDisplayStudent.birthCertificate,
      markSheets: this.toDisplayStudent.markSheets,
      policeClearance: this.toDisplayStudent.policeClearance,
      passport: this.toDisplayStudent.passport,
      declaration: this.toDisplayStudent.declaration
    }))
    this.isSave = false;
    this.isDisabled = flag;
    if(flag){
      this.onBoardingForm.disable();
    }
    this.isclicked = true;

  }

  setDocumentsFilter(value: string): void {
    const policeClearanceControl = this.onBoardingForm.get('documents.policeClearance');
    const passportControl = this.onBoardingForm.get('documents.policeClearance');
    if (value === 'international') {
      policeClearanceControl.setValidators(Validators.required);
      passportControl.setValidators(Validators.required);
      this.isInternational = true;
    }
    else {
      policeClearanceControl.clearValidators();
      passportControl.clearValidators();
      this.isInternational = false;
    }
    policeClearanceControl.updateValueAndValidity();
    passportControl.updateValueAndValidity();
  }

  onBoard() {
    if (this.onBoardingForm.invalid) {
      return
    }
    this.loading = true;

    this.student.onBoardNumber = this.onBoardingForm.get('onBoardNumber').value;
    this.student.name = this.onBoardingForm.get('studentName').value;
    this.student.category = this.onBoardingForm.get('category').value;
    this.student.domicile = this.onBoardingForm.get('documents.domicile').value;
    this.student.birthCertificate = this.onBoardingForm.get('documents.birthCertificate').value;
    this.student.markSheets = this.onBoardingForm.get('documents.markSheets').value;
    this.student.policeClearance = this.onBoardingForm.get('documents.policeClearance').value;
    this.student.passport = this.onBoardingForm.get('documents.passport').value;
    this.student.declaration = this.onBoardingForm.get('documents.declaration').value;
    this.student.dateOfBirth = this.onBoardingForm.get('dateOfBirth').value;
    this.student.fatherName = this.onBoardingForm.get('fatherName').value;
    this.student.motherName = this.onBoardingForm.get('motherName').value;
    this.student.lastClassScore = this.onBoardingForm.get('lastClassScore').value;

    this.studentService.onBoard(this.student).
      pipe(first()).subscribe(
      (data:any) => {
        if(data && data.id){
        this.router.navigate(['/studentlist']);
        this.alertService.success("student onboard is successful");
        this.loading = false;
      }
      else{
        this.alertService.error("student onboard is not successful");
        this.loading = false;
      }
      },
      (error:any) => {
         this.alertService.error(error.error.message);
        this.loading = false;
      })
  }

  updateStudentDetails(): void {
    if (this.onBoardingForm.invalid || !this.onBoardingForm.dirty) {
      return;
    }
    else{ 
    this.toDisplayStudent.onBoardNumber = this.onBoardingForm.get('onBoardNumber').value;
    this.toDisplayStudent.name = this.onBoardingForm.get('studentName').value;
    this.toDisplayStudent.category = this.onBoardingForm.get('category').value;
    this.toDisplayStudent.domicile = this.onBoardingForm.get('documents.domicile').value;
    this.toDisplayStudent.birthCertificate = this.onBoardingForm.get('documents.birthCertificate').value;
    this.toDisplayStudent.markSheets = this.onBoardingForm.get('documents.markSheets').value;
    this.toDisplayStudent.policeClearance = this.onBoardingForm.get('documents.policeClearance').value;
    this.toDisplayStudent.passport = this.onBoardingForm.get('documents.passport').value;
    this.toDisplayStudent.declaration = this.onBoardingForm.get('documents.declaration').value;
    this.toDisplayStudent.dateOfBirth = this.onBoardingForm.get('dateOfBirth').value;
    this.toDisplayStudent.fatherName = this.onBoardingForm.get('fatherName').value;
    this.toDisplayStudent.motherName = this.onBoardingForm.get('motherName').value;
    this.toDisplayStudent.lastClassScore = this.onBoardingForm.get('lastClassScore').value;


      this.studentService.updateStudentDetails(this.toDisplayStudent).
            subscribe(
              () => this.router.navigate(['/studentlist']),
              (error:any) => this.errorMessage = <any>error
            );
    }
  }

  onBack(){
    this.router.navigate(['/studentlist']);
  }

    onCancel(){
     if(confirm(`Navigate away and lose all the changes to form`))
                   this.router.navigate(['/studentlist']);
  }
}
