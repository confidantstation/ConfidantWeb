import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AccountCreateComponent } from './components/account/account-create/account-create.component';
import { AccountImportComponent } from './components/account/account-import/account-import.component';
import { ChatComponent } from './components/chat/chat.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account/create', component: AccountCreateComponent },
  { path: 'account/import', component: AccountImportComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
