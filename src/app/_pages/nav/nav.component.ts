import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy  {

  todaysDataTime = '';
  timer: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
    this.startTimer();
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer() {
    let today = new Date();
    this.todaysDataTime = formatDate(today, 'hh:mm:ss a', 'en-US', '+0530');
    this.timer = window.setInterval(() => {
      today = new Date();
      this.todaysDataTime = formatDate(today, 'hh:mm:ss a', 'en-US', '+0530');
    }, (1000));
  }

  stopTimer() {
    clearInterval(this.timer);
  }

}
