import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_pages/home/home.component';
import { SettingsComponent } from './_pages/settings/settings.component';
import { SlotBookingComponent } from './_pages/slot-booking/slot-booking.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'settings', component: SettingsComponent },
  {path: 'slot-booking', component: SlotBookingComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
