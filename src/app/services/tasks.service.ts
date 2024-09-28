import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.REST_API_URL;
  private API_KEY = environment.API_KEY;
  private tasksList = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  getTasks(): any {
    return this.http.get(`${this.API_URL}/task_with_persons`, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  fetchTasks(): void {
    this.getTasks().subscribe({
      next: (tasks: any) => {
        this.tasksList.set(tasks);
      }
    });
  }

  addTask(data: any): any {
    return this.http.post(`${this.API_URL}/rpc/add_task_with_persons`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  updateTask(data: any): any {
    return this.http.post(`${this.API_URL}/rpc/update_task_with_persons`, data, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  deleteTask(id: string): any {
    return this.http.post(`${this.API_URL}/rpc/delete_task_with_dependencies`, { _task_id: id }, {
      headers: {
        apikey: this.API_KEY
      }
    });
  }

  get tasks() {
    return this.tasksList;
  }
}
