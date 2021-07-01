import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Districts } from '../_models/district';
import { Session, Slots } from '../_models/session';
import { State, States } from '../_models/state';

@Injectable({
  providedIn: 'root'
})
export class CowinApiService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStates() {
    return this.http.get<States>(this.baseUrl + 'admin/location/states');
  }

  getDistricts(state_id: string) {
    return this.http.get<Districts>(this.baseUrl + 'admin/location/districts/' + state_id);
  }

  findSlotByDistrict(district_id: string, date: string) {
    return this.http.get<Slots>(this.baseUrl + 'appointment/sessions/public/findByDistrict?district_id=' + district_id + '&date=' + date);
  }

  findSlotsTomorrow(district_id: string) {
    this.findSlotByDistrict(district_id, this.getDateNextDay(1)).subscribe(slots => {
      console.log(slots);
    })
  }

  findSlotsNextDays(district_id: string,count: number) {

    let i = 0;
    let dataArr : Observable<Slots>[] = [];
    while(i<count){

      let data = this.findSlotByDistrict(district_id, this.getDateNextDay(i));
      dataArr.push(data);
      i++;
    }
    
    let multicall = forkJoin(dataArr);

    multicall.subscribe(slots => {

      let result: Session[] = [];

      slots.forEach(slot => {
        result = result.concat(slot.sessions);
      })

      console.log(result);

    })
  }

  getDateToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var result = mm + '-' + dd + '-' + yyyy;
    return result;
  }

  getDateNextDay(count: number) {
    var day = new Date();
    day.setDate(day.getDate() + count);
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = day.getFullYear();

    var result = dd + '-' + mm + '-' + yyyy;
    return result;
  }

}
