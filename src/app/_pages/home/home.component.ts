import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { State } from 'src/app/_models/state';
import { District } from 'src/app/_models/district';
import { FormBuilder, Validators } from '@angular/forms';
import { CowinApiService } from 'src/app/_services/cowin-api.service';
import { Session } from 'src/app/_models/session';
import { formatDate } from '@angular/common';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit  {

  displayedColumns: string[] = ['date','name', 'pincode','min_age_limit','vaccine', 'available_capacity_dose1','available_capacity_dose2','fee'];
  dataSource = ELEMENT_DATA;

  states: State[] = [];
  districts: District[] = [];
  days: Array<number> = [1, 2, 3,4,5,6,7,14];
  sessions: Session[]=[];
  todaysDataTime = '';

  searchForm = this.fb.group({
    state: [null, Validators.required],
    district: [null, Validators.required],
    day: 1,    
    city: [null, Validators.required],
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    dose: ['dose1', Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder,private cowinApiService: CowinApiService) {

  }
  ngOnInit(): void {
    // this.getStates();
    this.autoSearch();
    // this.cowinApiService.findSlotsTomorrow("307");    
  }

  onSubmit(): void {

  }

  autoSearch(){
    let today= new Date();
    this.todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    this.findSlotsNextDays("307",7);
    setInterval(() => {
      this.findSlotsNextDays("307",7);
      today= new Date();
      this.todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    }, 5000);
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

  findSlotsNextDays(district_id: string,count: number){
    this.cowinApiService.findSlotsNextDays(district_id,count).subscribe(slots => {
      this.sessions = [];
      slots.forEach(slot => {
        let filtredSlots = slot.sessions
        .filter(
          x=>x.available_capacity > 0
          && x.fee == "0"
          && x.vaccine == "COVISHIELD"
          // && x.max_age_limit == 45
          ); 
        this.sessions = this.sessions.concat(filtredSlots);
        this.sessions = this.sessions.sort((a,b)=> (b.available_capacity - a.available_capacity));
      })
      
      console.log("Inside subscribe");      
      console.log(this.sessions);
    })

  }


}

