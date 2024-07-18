import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes("?")) {
    return null
  }
  return { doesNotContainQuestionMark: true }
}

function emailIsUnique(control: AbstractControl) {
  if(control.value !== 'jivanibhautik@gmail.com') {
    return of(null)
  }

  return of({ notUnique: true })
}

let intialEmailValue = ''
const savedForm = window.localStorage.getItem('saved-login-form')

if (savedForm) {
  const loadedForm = JSON.parse(savedForm)
  intialEmailValue = loadedForm.email
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form  = new FormGroup({
    email: new FormControl(intialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark]
    })
  })

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }

  get passwordIsInvalid() {
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid
  }

  ngOnInit(): void {
    // const savedForm = window.localStorage.getItem('saved-login-form')

    // if(savedForm) {
    //   const loadedForm = JSON.parse(savedForm)
    //   this.form.patchValue({
    //     email: loadedForm.email
    //   })
    // }

    const subscription = this.form.valueChanges.pipe(
      debounceTime(500)
    ).subscribe({
      next: (value) => {
        window.localStorage.setItem('saved-login-form', JSON.stringify({email: value.email}))
      }
    })
  }

  onSubmit() {
    const enteredEmail = this.form.value.email
    const enteredPassword = this.form.value.password

    console.log(enteredEmail, enteredPassword);
    
  }
}