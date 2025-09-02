import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    
  NbTooltipModule,NbOverlayModule,NbSidebarModule, NbActionsModule,NbListModule, NbTabsetModule,NbAccordionModule,NbProgressBarModule,
  NbIconLibraries
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private icons: NbIconLibraries) {
    // 📍 Round pushpin (emoji-like) — uses currentColor so you can style with CSS
    this.icons.registerSvgPack('custom', {
      'pin-round-fill': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g fill="currentColor">
            <!-- round head -->
            <circle cx="12" cy="6" r="4"/>
            <!-- pin stem -->
            <rect x="11" y="10" width="2" height="7" rx="1"/>
            <!-- sharp tip -->
            <path d="M12 22l-2.5-5h5L12 22z"/>
          </g>
        </svg>
      `,
    });
  }
}
