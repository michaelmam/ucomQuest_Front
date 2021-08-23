import { Injectable } from '@angular/core';
import { LocationProps } from 'src/app/pages/admin-page/location/location.component';
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private apiService: ApiService) { }

  newLocation(location: LocationProps) {
    return this.apiService.post('location', location)
  }
  editLocation(location: LocationProps) {
    return this.apiService.putOnlyObject('location', location)
  }
  getLocations() {
    return this.apiService.get('location')
  }

  removeLocation(id: string) {
    return this.apiService.delete('location', id)
  }

  addGameToLocation(data: any) {
    return this.apiService.post('location/addGameToLocation', data)
  }
  openLocationInMap(location: string) {
    window.open(`http://maps.google.com/maps?daddr=${location.replace(', ', ',')}`, "_blank");
  }
}

