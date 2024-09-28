import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from "../../components/table/table.component";
import { SkillsService } from 'src/app/services/skills.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TableComponent, ModalComponent, ReactiveFormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit{

  skillsList = computed(() => this.skillsService.skills());
  skillId: string = '';
  showModal: boolean = false;
  isEdit: boolean = false;
  name: FormControl = new FormControl('', Validators.required);

  constructor(private skillsService: SkillsService, private generalService: GeneralService) {}

  ngOnInit(): void {
    this.skillsService.fetchSkills();
  }

  addOrEditSkill(): void {
    if(this.name.invalid) {
      this.name.markAsTouched();
      return;
    }

    if (this.isEdit) {
      this.skillsService.updateSkill({ name: this.name.value }, this.skillId).subscribe({
        next: () => {
          this.skillsService.fetchSkills();
          this.closeModal();
        }
      })
    } else {
      this.skillsService.addSkill({ name: this.name.value }).subscribe({
        next: () => {
          this.skillsService.fetchSkills();
          this.closeModal();
        }
      })
    }
    this.isEdit = false;
  }

  openModal(): void {
    this.generalService.openModal();
  }

  closeModal(): void {
    this.name.setValue('');
    this.name.markAsUntouched();
    this.generalService.closeModal();
  }

  receiveData(event: any): void {
    const item = { ...event.item };
    this.name.setValue(item.name);
    this.skillId = item.id;
    this.isEdit = true;
  }

}
