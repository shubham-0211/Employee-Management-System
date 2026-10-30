import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./employees/employees').then((m) => m.Employees),
  },
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./employees/employee-details/employee-details').then(
        (m) => m.EmployeeDetails
      ),
  },
  {
    path: 'employees',
    pathMatch: 'full',
    loadComponent: () =>
      import('./employees/employee-list/employee-list').then(
        (m) => m.EmployeeList
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];