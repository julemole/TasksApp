import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  closeModal() {
    const modal = document.querySelector('.modal');
    const backdrop = document.querySelector('.modal-backdrop');

    if (modal) {
      (modal as any).classList.remove('show');
      (modal as any).setAttribute('aria-hidden', 'true');
      (modal as any).setAttribute('style', 'display: none');
    }

    if (backdrop) {
      backdrop.remove();
    }
  }

  openModal() {
    const modal = document.querySelector('.modal');
    const backdrop = document.createElement('div');

    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    document.body.appendChild(backdrop);

    if (modal) {
      (modal as any).classList.add('show');
      (modal as any).setAttribute('aria-hidden', 'false');
      (modal as any).setAttribute('style', 'display: block');
    }

  }
}
