import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private API_URL = environment.REST_API_URL;
  private API_KEY = environment.API_KEY;
  private skillsList = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  getSkills(): any {
    return this.http.get(`${this.API_URL}/skills`, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  fetchSkills(): void {
    this.getSkills().subscribe({
      next: (skills: any) => {
        this.skillsList.set(skills);
      }
    });
  }

  addSkill(data: any): any {
    return this.http.post(`${this.API_URL}/skills`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  updateSkill(data: any, id: string): any {
    return this.http.patch(`${this.API_URL}/skills?id=eq.${id}`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  deleteSkill(id: string): any {
    return this.http.delete(`${this.API_URL}/skills?id=eq.${id}`, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  get skills() {
    return this.skillsList;
  }
}
