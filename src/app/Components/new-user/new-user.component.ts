import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription }    from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import {UserData } from '../../models/user-data.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  userId: string;
  userData : UserData;
  subscriptions = new Subscription();
  statusList = ['active', 'inactive'];
  typeList = ['basic', 'lite','premium', 'ultimate']; //hardcoded for now, incase some more types and statuses can be defined
                                          // then they can be fetched from backend
  typeDescription = {
    'basic': 'The Basics Package',
    'lite': 'The Lite Package',
    'premium': 'The Premium Package',
    'ultimate': 'The Ultimate Package'
  }

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedroute:ActivatedRoute,
              private usersService : UsersService
              ) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.createForm();
    this.subscriptions.add(this.activatedroute.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if(this.userId){
        this.subscriptions.add(this.usersService.getUser(this.userId).subscribe( user => {
          this.userData = user;
          this.setFormValues(this.userData);
        }));
      }
    }));

    this.subscriptions.add(this.formGroup.controls['type'].valueChanges.subscribe( change => {
      this.formGroup.controls['description'].patchValue(this.typeDescription[change]);
    }));
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'name': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'age': [null, Validators.required],
      'type': [null, Validators.required],
      'status': [null, Validators.required],
      'description': [null, Validators.required],
      'conferenceCalling': ['',[]],
      'callWaiting': ['',[]],
      'voicemail': ['',[]]
    });
  }

  setFormValues(userData){
    this.formGroup.setValue({
      'name': userData.name,
      'email': userData.email,
      'age': userData.age,
      'type': userData.plan.type,
      'status': userData.plan.status,
      'description': userData.plan.description,
      'conferenceCalling': userData.plan.features.conferenceCalling,
      'callWaiting': userData.plan.features.callWaiting,
      'voicemail': userData.plan.features.voicemail
    });
    console.log(this.formGroup);
  }


  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Field is required' :
      this.formGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  getCheckBoxValue(value){
    return !!value;
  }

  formatFormData(userData){
    if(!this.userId)
    {
      this.userId = Math.random().toString(36).substr(2, 12); ;
    }
    let data = {
              'id': this.userId,
              'name': userData.name,
              'email': userData.email,
              'age': userData.age,
              'plan':{
                'type': userData.type,
                'status': userData.status,
                'description': userData.description,
                'features': {
                  'conferenceCalling': this.getCheckBoxValue(userData.conferenceCalling),
                  'callWaiting': this.getCheckBoxValue(userData.callWaiting),
                  'voicemail': this.getCheckBoxValue(userData.voicemail)
                }

              }

            }

    return data;
  }

  onSubmit(formData) {
    let post = this.formatFormData(formData);
    if(this.userData){
      console.log(post);
      this.subscriptions.add(this.usersService.updateUser(post).subscribe( user => {
        console.log("User successfully updated", user);
        this.submitSuccessful();
      }));
    }
    else{
      console.log(post);
      this.subscriptions.add(this.usersService.addUser(post).subscribe( user => {
        console.log("User successfully added", user);
        this.submitSuccessful();
      }));
    }
  }

  private submitSuccessful() {
    this.formGroup.reset();
    this.router.navigate(['']);
  }

  cancel(){
    this.router.navigate(['']);
  }


}
