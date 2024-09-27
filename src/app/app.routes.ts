import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.component').then(c => c.TasksComponent) },
  { path: 'persons', loadComponent: () => import('./pages/persons/persons.component').then(c => c.PersonsComponent) },
  { path: 'skills', loadComponent: () => import('./pages/skills/skills.component').then(c => c.SkillsComponent) },
];
