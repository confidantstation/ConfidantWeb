import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { AccountCreateComponent } from './components/account/account-create/account-create.component';
import { AccountImportComponent } from './components/account/account-import/account-import.component';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './components/chat/chat.component';
import { SocialComponent } from './components/social/social.component';
import { EmailComponent } from './components/social/email/email.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AccountComponent,
        AccountCreateComponent,
        AccountImportComponent,
        ChatComponent,
        SocialComponent,
        EmailComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
