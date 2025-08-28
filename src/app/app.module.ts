import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LessonComponent } from './lesson/lesson.component';
import { VedioPageComponent } from './vedio-page/vedio-page.component';     // ✅ Correct
import { DocumentPageComponent } from './document-page/document-page.component'; // ✅ Correct

// Nebular imports
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbInputModule,
  NbIconModule,
  NbCardModule,
  NbDialogModule,
  NbSelectModule,
  NbBadgeModule, NbMenuModule,NbContextMenuModule,NbPopoverModule,
    
  NbTooltipModule,NbOverlayModule,NbSidebarModule, NbActionsModule,NbListModule, NbTabsetModule,NbAccordionModule,NbProgressBarModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LessonComponent },         
  { path: 'video/:id', component: VedioPageComponent },     
  { path: 'document/:id', component: DocumentPageComponent }, 
  { path: '**', redirectTo: '' }                   
];

@NgModule({
  declarations: [
    AppComponent,
    LessonComponent,
    VedioPageComponent,     
    DocumentPageComponent   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),

    // Nebular Modules
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbTooltipModule,NbContextMenuModule,
    NbIconModule,
    NbOverlayModule,
    NbEvaIconsModule,NbMenuModule,
    NbCardModule,
    NbDialogModule.forRoot(),
    NbSelectModule,NbPopoverModule,
    NbBadgeModule,NbSidebarModule, NbActionsModule,NbListModule, NbTabsetModule,NbAccordionModule,NbProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
