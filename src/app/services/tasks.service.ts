import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.REST_API_URL;

  constructor(private http: HttpClient) { }
}
