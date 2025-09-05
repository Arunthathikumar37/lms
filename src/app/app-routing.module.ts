import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ModuleComponent } from './module/module.component';
import { LessonComponent } from './lesson/lesson.component';
import { DocumentPageComponent } from './document-page/document-page.component';
import { VedioPageComponent } from './vedio-page/vedio-page.component';

const routes: Routes = [
  { path: 'courses', component: CourseComponent, data: { breadcrumb: 'Course Builder' } },
  { path: 'courses/:courseId/modules', component: ModuleComponent, data: { breadcrumb: 'Modules' } },
  { path: 'courses/:courseId/modules/:moduleId/lessons', component: LessonComponent, data: { breadcrumb: 'Lessons' } },
  { path: 'video/:id', component: VedioPageComponent, data: { breadcrumb: 'Video' } },
  { path: 'document/:id', component: DocumentPageComponent, data: { breadcrumb: 'Document' } },
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: '**', redirectTo: 'courses' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
