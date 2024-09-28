import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title: string = '';

  constructor(private generalService: GeneralService) { }

  closeModal(): void {
    this.generalService.closeModal();
  }
}
