import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AccountCreateComponent } from './components/account/account-create/account-create.component';
import { AccountImportComponent } from './components/account/account-import/account-import.component';
import { ChatComponent } from './components/chat/chat.component';
import { SocialComponent } from './components/social/social.component';
import { EmailComponent } from './components/social/email/email.component';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'account/create', component: AccountCreateComponent },
    { path: 'account/import', component: AccountImportComponent },
    { path: 'social', component: SocialComponent },
    { path: 'social/email', component: EmailComponent },
    { path: 'chat', component: ChatComponent },
    { path: '**', component: HomeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
