import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { State } from 'src/app/_models/state';
import { District } from 'src/app/_models/district';
import { FormBuilder, Validators } from '@angular/forms';
import { CowinApiService } from 'src/app/_services/cowin-api.service';
import { Session } from 'src/app/_models/session';

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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  states: State[] = [];
  districts: District[] = [];
  days: Array<number> = [1, 2, 3,4,5,6,7,14];
  sessions: Session[]=[];


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
    this.getStates();
    this.cowinApiService.findSlotsTomorrow("307");
    
  }

  onSubmit(): void {
    this.sessions = this.cowinApiService.findSlotsNextDays("307",7);
    console.log("outside");    
    console.log(this.sessions);    
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

