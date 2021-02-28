import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersListComponent} from './Components/users-list/users-list.component';
import {NewUserComponent} from './Components/new-user/new-user.component';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  {
    path: 'new-user',
    component: NewUserComponent,
  },
  {
    path: 'user/:id',
    component: NewUserComponent,
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
