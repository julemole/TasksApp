import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  private API_URL = environment.REST_API_URL;
  private API_KEY = environment.API_KEY;
  private personsList = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  getPersons(): any {
    return this.http.get(`${this.API_URL}/person_with_skills`, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  fetchpersons(): void {
    this.getPersons().subscribe({
      next: (persons: any) => {
        this.personsList.set(persons);
      }
    });
  }

  addPerson(data: any): any {
    return this.http.post(`${this.API_URL}/rpc/add_person_with_skills`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  updatePerson(data: any): any {
    return this.http.post(`${this.API_URL}/rpc/update_person_with_skills`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  deletePerson(id: string): any {
    return this.http.post(`${this.API_URL}/rpc/delete_person_with_skills`, { _person_id: id }, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  get persons() {
    return this.personsList;
  }
}
