import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from "../../components/table/table.component";
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { GeneralService } from 'src/app/services/general.service';
import { TasksService } from 'src/app/services/tasks.service';
import { PersonsService } from 'src/app/services/persons.service';
import { onSearchChange } from 'src/app/utils/common';
import { SkillsService } from 'src/app/services/skills.service';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TableComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  headers: string[] = ['Name', 'Limit Date', 'Persons'];

  tasksList = computed(() => this.tasksService.tasks());
  personsList = computed(() => this.personsService.persons());
  skillsList = computed(() => this.skillsService.skills());

  avalaiblePersons: any[] = [];
  selectedPersons: any[] = [];
  selectedPersonsTable: any[] = [];
  personsToCreate: any[] = [];
  showPersons: boolean = false;

  avalaibleSkills: any[] = [];
  selectedSkills: any[] = [];
  skillsTable: any[] = [];
  skillsToCreate: any[] = [];
  showSkills: boolean = false;

  managePersons = {
    showExisting: false,
    showNew: false
  }

  manageSkills = {
    showExisting: false,
    showNew: false
  }

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder, private generalService: GeneralService, private tasksService: TasksService, private personsService: PersonsService,
    private skillsService: SkillsService) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      limit_date: ['', Validators.required],
      full_name: [''],
      age: [null, [Validators.min(18)]],
      persons: this.fb.array([], Validators.required),
      skill_name: [''],
      skills: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.tasksService.fetchTasks();
    this.personsService.fetchpersons();
    this.skillsService.fetchSkills();
  }

  get persons(): FormArray {
    return this.taskForm.get('persons') as FormArray;
  }

  get skills(): FormArray {
    return this.taskForm.get('skills') as FormArray;
  }

  addPersonsInTable(): void {
    let newPersons = this.selectedPersons.filter(person => {
      const personId = person.id || person.person_id;
      return !this.selectedPersonsTable.some(selectedPerson => {
        const selectedPersonId = selectedPerson.id || selectedPerson.person_id;
        return selectedPersonId === personId;
      });
    });

    newPersons = newPersons.filter(person => {
      return !this.selectedPersonsTable.some(selectedPerson => selectedPerson.full_name === person.full_name);
    });

    console.log(newPersons)

    this.selectedPersonsTable = [ ...this.selectedPersonsTable, ...newPersons ];
    this.managePersons.showExisting = false;
  }

  addPerson(): void {
    if(this.taskForm.get('age')?.hasError('min') || this.taskForm.get('skills')?.value.length === 0){
      this.taskForm.get('age')?.markAsTouched();
      return;
    }

    const { full_name, age } = this.taskForm.value;

    const exists = this.selectedPersonsTable.some(person => person.full_name === full_name);

    if (!exists) {
      this.selectedPersonsTable.push({ full_name, age, skills: [ ...this.skillsTable] });
      this.personsToCreate.push({ full_name, age, skills: [ ...this.skillsTable] });
      this.persons.push(this.fb.control(''));
      this.managePersons.showNew = false;
    }

    this.taskForm.get('full_name')?.reset();
    this.taskForm.get('age')?.reset();
    this.selectedSkills = [];
    this.skillsTable = [];
  }

  deletePerson(personName: string): void {
    this.selectedPersonsTable = this.selectedPersonsTable.filter(person => person.full_name !== personName);
  }

  addSkillsInTable(): void {
    let newSkills = this.selectedSkills.filter(skill => {
      return !this.skillsTable.some(existingSkill => existingSkill.name === skill.name);
    });

    this.skillsTable = [ ...this.skillsTable, ...newSkills ];
    this.manageSkills.showExisting = false;
  }

  addSkill(): void {
    const { skill_name } = this.taskForm.value;

    if (!skill_name || skill_name.trim().length === 0) {
      this.taskForm.get('skill_name')?.markAsTouched();
      return;
    }

    const exists = this.skillsTable.some(skill => skill.name === skill_name);

    if (!exists) {
      this.skillsTable.push({ skill_name });
      this.skillsToCreate.push({ skill_name });
      this.manageSkills.showNew = false;
    }

    this.taskForm.get('skill_name')?.reset();
  }

  deleteSkill(skillName: string): void {
    this.skillsTable = this.skillsTable.filter(skill => skill.name !== skillName);
  }

  saveTask(): void {
    if (this.taskForm.invalid || this.selectedPersonsTable.length === 0) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { name, limit_date } = this.taskForm.value;

    this.selectedPersons = this.selectedPersons.map(person => person.id || person.person_id);

    if (this.personsToCreate.length) {
      const personsCreate = [...this.personsToCreate];

      const personPromises = personsCreate.map(person => {
        return this.personsService.addPerson({
          full_name: person.full_name,
          age: person.age,
          skill_ids: person.skills.map((skill: any) => skill.id)
        }).toPromise();
      });

      Promise.all(personPromises).then(() => {
        this.personsService.getPersons().subscribe({
          next: (allPersons: any) => {
            console.log(personsCreate, 'create')
            const newPersonIds = personsCreate.map(person => {
              const matchedPerson = allPersons.find((p: any) => p.full_name === person.full_name);
              return matchedPerson ? matchedPerson.person_id : null;
            }).filter(id => id !== null);

            const allPersonIds = [...this.selectedPersons, ...newPersonIds];

            this.tasksService.addTask({
              _limit_date: limit_date,
              _name: name,
              _person_ids: allPersonIds,
              _status: 'pendiente'
            }).subscribe({
              next: () => {
                this.tasksService.fetchTasks();
                this.closeModal();
              }
            });
          },
        })
      }).catch(error => {
        console.error('Error creating persons:', error);
      });
    } else {
      this.tasksService.addTask({_limit_date: limit_date, _name: name,  _person_ids: this.selectedPersons, _status: 'pendiente' }).subscribe({
        next: () => {
          this.tasksService.fetchTasks();
          this.closeModal();
        }
      });
    }


    this.selectedPersonsTable = [];
    this.personsToCreate = [];
    this.skillsToCreate = [];
  }

  onSearchChangePS(event: Event | string): void {
    const resp = onSearchChange(event, this.avalaiblePersons, this.personsList(), this.selectedPersons, this.showPersons);
    this.avalaiblePersons = resp.avalaibleContent;
    this.showPersons = resp.showItems;
  }

  onInputFocusPS(): void {
    this.onSearchChangePS('')
    this.showPersons = this.avalaiblePersons.length > 0;
  }

  onInputBlurPS(): void {
    this.showPersons = false;
  }

  onPersonSelect(person: any): void {
    if (!this.selectedPersons.includes(person)) {
      this.selectedPersons.push(person);
      this.persons.push(this.fb.control(person.person_id));
    }
    this.showPersons = false;
  }

  removePerson(person: any): void {
    const index = this.selectedPersons.indexOf(person);
    if (index >= 0) {
      this.selectedPersons.splice(index, 1);
      this.persons.removeAt(index);
    }
  }

  onSearchChangeSK(event: Event | string): void {
    const resp = onSearchChange(event, this.avalaibleSkills, this.skillsList(), this.selectedSkills, this.showSkills);
    this.avalaibleSkills = resp.avalaibleContent;
    this.showSkills = resp.showItems;
  }

  onInputFocusSK(): void {
    this.onSearchChangeSK('')
    this.showSkills = this.avalaibleSkills.length > 0;
  }

  onInputBlurSK(): void {
    this.showSkills = false;
  }

  onSkillSelect(skill: any): void {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
      this.skills.push(this.fb.control(skill.id));
    }
    this.showSkills = false;
  }

  removeSkill(skill: any): void {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
      this.skills.removeAt(index);
    }
  }

  formAddPerson(exists: boolean): void {
    this.managePersons.showExisting = exists;
    this.managePersons.showNew = !exists;
  }

  formAddSkill(exists: boolean): void {
    this.manageSkills.showExisting = exists;
    this.manageSkills.showNew = !exists;
  }

  getSkillsAsString(skills: any[]): string {
    return skills.map(skill => (skill.name || skill.skill_name)).join(', ');
  }

  openModal(): void {
    this.generalService.openModal();
  }

  closeModal(): void {
    this.managePersons = {
      showExisting: false,
      showNew: false
    }
    this.manageSkills = {
      showExisting: false,
      showNew: false
    }
    this.taskForm.reset();
    this.selectedPersons = [];
    this.selectedSkills = [];
    this.persons.clear();
    this.skills.clear();
    this.selectedPersonsTable = [];
    this.generalService.closeModal();
  }

}
