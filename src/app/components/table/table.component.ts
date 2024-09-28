import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsService } from 'src/app/services/skills.service';
import { GeneralService } from 'src/app/services/general.service';
import { PersonsService } from 'src/app/services/persons.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input() contentType: string = '';
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Output() item: EventEmitter<any> = new EventEmitter();

  constructor(private skillsService: SkillsService, private personsService: PersonsService, private tasksService: TasksService, private generalService: GeneralService) {}

  loadItem(item: any): void {
    this.item.emit( { item, content: this.contentType } );
  }

  deleteItem(id: string): void {
    switch (this.contentType) {
      case 'skill':
        this.skillsService.deleteSkill(id).subscribe({
          next: () => {
            this.skillsService.fetchSkills();
          }
        });
        break;
      case 'person':
        this.personsService.deletePerson(id).subscribe({
          next: () => {
            this.personsService.fetchpersons();
          }
        });
        break;
      case 'task':
        this.tasksService.deleteTask(id).subscribe({
          next: () => {
            this.tasksService.fetchTasks();
          }
        });
        break;
      default:
        break;
    }
  }

  getSkillsAsString(skills: { name: string }[]): string {
    return skills.map(skill => skill.name).join(', ');
  }

  getPersonAsString(person: { age: number, full_name: string, skills: { name: string }[] }): string {
    const skillsString = this.getSkillsAsString(person.skills);
    return ` - ${person.full_name} (${person.age}) skills: ${skillsString}`;
  }

  getPersonsAsString(persons: { age: number, full_name: string, skills: { name: string }[] }[]): string {
    return persons.map(person => this.getPersonAsString(person)).join('\n');
  }

  openModal(): void {
    this.generalService.openModal();
  }

  closeModal(): void {
    this.generalService.closeModal();
  }
}
