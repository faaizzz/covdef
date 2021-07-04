import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { State } from 'src/app/_models/state';
import { District } from 'src/app/_models/district';
import { FormBuilder, Validators } from '@angular/forms';
import { CowinApiService } from 'src/app/_services/cowin-api.service';
import { Session } from 'src/app/_models/session';
import { formatDate } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['date', 'name', 'pincode', 'min_age_limit', 'vaccine', 'available_capacity_dose1', 'available_capacity_dose2', 'fee'];
  dataSource: MatTableDataSource<Session>;

  states: State[] = [];
  districts: District[] = [];
  days: Array<number> = [1, 2, 3, 4, 5, 6, 7, 14];
  vaccineTypes: Array<string> = ["COVAXIN", "COVISHIELD", "SPUTNIK", "PFIZER"];
  ages: Array<number> = [18, 40, 45];
  timeIntervals: Array<number> = [2,3,5, 10, 15, 20, 30, 60];
  sessions: Session[] = [];
  todaysDataTime = '';
  timer: number = 0;
  selectedVaccineTypes: Array<string> = [];
  selectedAges: Array<number> = [];
  dose1: boolean = true;
  dose2: boolean = true;
  age18: boolean = true;
  age40: boolean = true;
  age45: boolean = true;
  feesFree: boolean = true;
  feesPaid: boolean = true;




  searchForm = this.fb.group({
    state: [17, Validators.required],
    district: [307, Validators.required],
    day: 7,
    dose1: true,
    dose2: true,
    vaccineType: [],
    timeInterval: 5,
  });



  hasUnitNumber = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private fb: FormBuilder, private cowinApiService: CowinApiService) {
  }

  ngOnInit(): void {
    this.reset();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {

    } this.dataSource.paginator.firstPage();
  }

  onSubmit(): void {
    // console.log(this.searchForm);
    // console.log(this.selectedVaccineTypes);
    // console.log(this.selectedAges);
    this.stopTimer();
    if(this.searchForm.status == "VALID"){
      this.autoSearch();
      this.accordion.closeAll();
    }
    // this.search();

  }

  reset(){
    this.stopTimer();

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.searchForm.patchValue(
      {
        state: 17,
        district: 307,
        day: 7,
        dose1: true,
        dose2: true,
        vaccineType: [],
        timeInterval: 5
      }
    )
    this.getStates();
    this.getDistricts(this.searchForm.value.state);
    this.sessions = [];
    this.todaysDataTime = '';
    this.timer = 0;
    this.selectedVaccineTypes = [];
    this.selectedAges= [];
    this.dose1= true;
    this.dose2 = true;
    this.age18 = true;
    this.age40 = true;
    this.age45 = true;
    this.feesFree = true;
    this.feesPaid = true;

  }

  autoSearch() {
    let today = new Date();
    this.todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    this.findSlotsNextDays(this.searchForm.value.district, this.searchForm.value.day);
    this.timer = window.setInterval(() => {
      this.search();
    }, (1000 * this.searchForm.value.timeInterval));
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  search() {
    let today = new Date();
    this.findSlotsNextDays(this.searchForm.value.district, this.searchForm.value.day);
    today = new Date();
    this.todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
  }

  getStates() {
    this.cowinApiService.getStates().subscribe(States => {
      this.states = States.states;

    })
  }

  getDistricts(districtId: string) {
    this.cowinApiService.getDistricts(districtId).subscribe(Districts => {
      this.districts = Districts.districts;
    })
  }

  onStateChanged(event: any) {
    this.searchForm.patchValue(
      {
        district: null
      }
    )
    // console.log(event.value);
    this.getDistricts(event.value);

  }

  onDose1Changed(event: any) {
    this.dose1 = event.checked;
  }

  onDose2Changed(event: any) {
    this.dose2 = event.checked;
  }

  onAge18Changed(event: any) {
    this.age18 = event.checked;
  }

  onAge40Changed(event: any) {
    this.age40 = event.checked;
  }

  onAge45Changed(event: any) {
    this.age45 = event.checked;
  }

  onFeesFreeChanged(event: any) {
    this.feesFree = event.checked;
  }

  onFeesPaidChanged(event: any) {
    this.feesPaid = event.checked;
  }

  findSlotsNextDays(district_id: string, count: number) {
    this.cowinApiService.findSlotsNextDays(district_id, count).subscribe(slots => {
      this.sessions = [];
      slots.forEach(slot => {
        let filtredSlots = slot.sessions
          .filter(
            x => x.available_capacity > 0
            // && x.fee == "0"
            // && x.vaccine == "COVISHIELD"
            // && x.max_age_limit == 45
          );
        this.sessions = this.sessions.concat(filtredSlots);
        this.sessions = this.sessions.sort((a, b) => (b.available_capacity - a.available_capacity));

        // Filter vaccine
        if (this.selectedVaccineTypes.length > 0) {
          this.sessions = this.sessions.filter(
            x => this.selectedVaccineTypes.includes(x.vaccine)
          );

        }

        // Filter Age
        if (this.selectedAges.length > 0) {
          this.sessions = this.sessions.filter(
            x => this.selectedAges.includes(x.min_age_limit)
          );

        }


        // Filter Dose

        if (this.dose1 && this.dose2) {
          this.sessions = this.sessions.filter(
            x => x.available_capacity > 0
          );
        } else if (this.dose1) {
          this.sessions = this.sessions.filter(
            x => x.available_capacity_dose1 > 0
          );
        } else if (this.dose2) {
          this.sessions = this.sessions.filter(
            x => x.available_capacity_dose2 > 0
          );
        } else {
          this.sessions = [];
        }

        // Filter Fee Type

        if (this.feesFree && this.feesPaid) {
        } else if (this.feesFree) {
          this.sessions = this.sessions.filter(
            x => x.fee_type == "Free"
          );
        } else if (this.feesPaid) {
          this.sessions = this.sessions.filter(
            x => x.fee_type == "Paid"
          );
        } else {
          this.sessions = [];
        }


        // console.log(this.sessions);

        this.dataSource = new MatTableDataSource<Session>(this.sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })

    })

  }


}

