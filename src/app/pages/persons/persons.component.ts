import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

import { ModalComponent } from 'src/app/components/modal/modal.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { PersonsService } from 'src/app/services/persons.service';
import { SkillsService } from 'src/app/services/skills.service';
import { onSearchChange } from 'src/app/utils/common';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, ModalComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit{

  headers: string[] = ['Full Name', 'Age', 'Skills'];

  personsList = computed(() => this.personsService.persons());
  skillsList = computed(() => this.skillsService.skills());
  personId: string = '';

  avalaibleSkills: any[] = [];
  selectedSkills: any[] = [];
  showSkills: boolean = false;
  isEdit: boolean = false;

  personForm! :FormGroup;

  constructor(private fb: FormBuilder, private personsService: PersonsService, private skillsService: SkillsService,
    private generalService: GeneralService)
  {
    this.personForm = this.fb.group({
      full_name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      skills: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.personsService.fetchpersons();
    this.skillsService.fetchSkills();
  }

  get skills(): FormArray {
    return this.personForm.get('skills') as FormArray;
  }

  addOrEditperson(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    const { full_name, age, skills } = this.personForm.value;

    if (this.isEdit) {
      this.personsService.updatePerson({ _person_id: this.personId, _full_name: full_name, _age: age, _skill_ids: skills}).subscribe({
        next: () => {
          this.personsService.fetchpersons();
          this.closeModal();
        }
      })
    } else {
      this.personsService.addPerson({ full_name, age, skill_ids: skills}).subscribe({
        next: () => {
          this.personsService.fetchpersons();
          this.closeModal();
        }
      })
    }

    this.isEdit = false;
  }

  receiveData(event: any): void {
    const item = { ...event.item };
    console.log(item)
    this.personForm.patchValue({
      full_name: item.full_name,
      age: item.age,
      skills: item.skills.map((skill: any) => skill.id)
    });
    this.selectedSkills = item.skills;
    this.personId = item.person_id;
    this.isEdit = true;
  }

  onSearchChange(event: Event | string): void {
    const resp = onSearchChange(event, this.avalaibleSkills, this.skillsList(), this.selectedSkills, this.showSkills);
    this.avalaibleSkills = resp.avalaibleContent;
    this.showSkills = resp.showItems;
  }

  onInputFocus(): void {
    this.onSearchChange('')
    this.showSkills = this.avalaibleSkills.length > 0;
  }

  onInputBlur(): void {
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

  openModal(): void {
    this.generalService.openModal();
  }

  closeModal(): void {
    this.personForm.reset();
    this.selectedSkills = [];
    this.personId = '';
    this.generalService.closeModal();
  }
}
