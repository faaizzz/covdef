import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Districts } from '../_models/district';
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

}
