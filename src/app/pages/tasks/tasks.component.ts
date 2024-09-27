import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from "../../components/table/table.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

}
