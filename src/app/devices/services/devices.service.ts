import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Device } from '../interfaces/device';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private baseURL = `${environment.hostAndPort}/api/v1/device`;

  constructor(
    private http: HttpClient
  ) { }

  public addDevice(device: Device): Promise<Device> {
    const obj = {
      data: {
        color: device.color,
        categoryId: device.categoryId,
        partNumber: device.partNumber
      }
    };
    return this.http.post<Device>(this.baseURL, obj).toPromise();
  }

  public getDevices(): Promise<Device[]> {
    return this.http.get<Device[]>(this.baseURL).toPromise();
  }

  public deleteDevice(device: Device): Promise<Device> {
    const obj = {
      data: device
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: obj,
    };
    return this.http.delete<Device>(this.baseURL, options).toPromise();
  }
}
