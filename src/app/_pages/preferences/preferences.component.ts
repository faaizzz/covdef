import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { District } from 'src/app/_models/district';
import { State, States } from 'src/app/_models/state';
import { CowinApiService } from 'src/app/_services/cowin-api.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent  implements OnInit {

  states: State[] = [];
  districts: District[] = [];


  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    district: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder,private cowinApiService: CowinApiService) {

  }
  ngOnInit(): void {
    this.getStates();
  }

  onSubmit(): void {
    console.log(this.cowinApiService.getStates());
    alert('Thanks!');
  }

  getStates() {
    this.cowinApiService.getStates().subscribe(States => {
      this.states = States.states;
    })
  }

  getDistricts(districtId : string) {
    this.cowinApiService.getDistricts(districtId).subscribe(Districts => {
      this.districts = Districts.districts;
    })
  }

  onStateChanged(event : any)  {
    console.log(event.value);
    this.getDistricts(event.value);
    
  }

}
