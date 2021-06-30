import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Districts } from '../_models/district';
import { Slots } from '../_models/session';
import { State, States } from '../_models/state';

@Injectable({
  providedIn: 'root'
})
export class CowinApiService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStates(){
    return this.http.get<States>(this.baseUrl + 'admin/location/states');
  }

  getDistricts(state_id: string){
    return this.http.get<Districts>(this.baseUrl + 'admin/location/districts/' + state_id);
  }

  findSlotByDistrict(district_id: string, date: string ){
    return this.http.get<Slots>(this.baseUrl + 'appointment/sessions/public/findByDistrict?district_id=' + district_id + '&date=' + date);
  }

  findSlotsTomorrow(){
    this.findSlotByDistrict("307",this.getDateNextDay(1)).subscribe(slots => {
      console.log(slots);
    })
  }

  // findSlotsNextDays(count:number){
  //   let weekSlot : Slots = {} as Slots;
  //   this.findSlotByDistrict("307",this.getDateToday()).subscribe(slots => {
  //     weekSlot.sessions = slots.sessions;      
  //     console.log(weekSlot.sessions);
      
  //   })

  //   let i = 1;
  //   while(i<count){

  //     this.findSlotByDistrict("307",this.getDateNextDay(i)).subscribe(slots => {
  //       console.log(slots.sessions);
  //       if(weekSlot?.sessions){        
  //         weekSlot.sessions.push(...slots.sessions);
  //       }

  //       if(i== count){
  //         console.log("completed");
  //         console.log(slots.sessions);

  //       }
  //     })
  //       i++;


  //   }

    
  // }

  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var result = mm + '-' + dd + '-' + yyyy;
    return result;
  }

  getDateNextDay(count:number){
    var day = new Date() ;
    day.setDate(day.getDate() + count);
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = day.getFullYear();
    
    var result = dd + '-' + mm + '-' + yyyy;
    return result;
  }

}
