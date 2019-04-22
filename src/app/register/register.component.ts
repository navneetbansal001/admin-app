import { AlertService } from './../services/alert.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserService } from './../services/user.service';
import { User } from 'src/app/models/User';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AbstractControl } from "@angular/forms";

function minimumAge(c: AbstractControl): { [key: string]: boolean } | null {
  if (c.value !== null && c.value < 18) {
    return { 'minimumValue': true };
  }
  return null;
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');
  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  currentUser: any;
  loading = false;
  submitted = false;
  userForm: FormGroup;
  user = new User();
  users: User[] = [];
  constructor(private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
  }

  get addresses(): FormArray {
    return <FormArray>this.userForm.get('addresses'); // cast from AbstarctControl to FormArray
  }

  ngOnInit() {
    // this.userForm = new FormGroup({
    //   firstName : new FormControl(),
    //   lastName  : new FormControl(),
    //   email : new FormControl(),
    // });
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validator: emailMatcher }),
      phone: ['', Validators.required],
      age: [null, [Validators.required, minimumAge]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  register() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    this.user.firstName = this.userForm.get('firstName').value;
    this.user.lastName = this.userForm.get('lastName').value;
    this.user.email = this.userForm.get('emailGroup.email').value;
    this.user.phone = this.userForm.get('phone').value;
    this.user.age = this.userForm.get('age').value;
    this.user.password = this.userForm.get('password').value;

    this.userService.register(this.user).pipe(first()).subscribe(
      (data: any) => {
        if (data && data.id) {
          this.alertService.success('Registration is successful', true);
          this.router.navigate(['/login']);
        }
        else {
          this.alertService.error("SignUp not successfull");
          this.loading = false;
        }
      },
      (error : any) => {
        this.alertService.error(error.error.message);
        this.loading = false;
      }
    );
  }

  // populate() : void {
  //   this.userForm.setValue({    // setValue is used to populate all formControls of Form
  //   })

  //   this.userForm.patchValue({  // patchValue is used to populate partial formControld of Form

  //   })
  // }

}
