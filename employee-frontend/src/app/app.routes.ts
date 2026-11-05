import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./auth/change-password/change-password').then(
        (m) => m.ChangePassword
      ),
  },
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'user-management',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./user-management/user-management').then(
        (m) => m.UserManagement
      ),
  },
  {
    path: 'departments/:id/employees',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./departments/department-employees').then(
        (m) => m.DepartmentEmployees
      ),
  },
  {
    path: 'departments',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./departments/department-management').then(
        (m) => m.DepartmentManagement
      ),
  },
  {
    path: 'employees/new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./employees/employees').then((m) => m.Employees),
  },
  {
    path: 'employees/directory',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./employees/employee-list/employee-list').then(
        (m) => m.EmployeeList
      ),
  },
  {
    path: 'employees/:id/edit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'HR'] },
    loadComponent: () =>
      import('./employees/employee-edit/employee-edit').then(
        (m) => m.EmployeeEdit
      ),
  },
  {
    path: 'employees/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./employees/employee-details/employee-details').then(
        (m) => m.EmployeeDetails
      ),
  },
  {
    path: 'employees',
    pathMatch: 'full',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE'] },
    loadComponent: () =>
      import('./employees/employee-dashboard').then(
        (m) => m.EmployeeDashboard
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];