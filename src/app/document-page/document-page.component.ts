import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonComponent, LessonData } from '../lesson/lesson.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-page',

  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.css']
})
export class DocumentPageComponent implements OnInit {

    lesson: LessonData | undefined;
  safeDocumentUrl: SafeResourceUrl | undefined;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.lesson = LessonComponent.lessons.find(l => l.orderIndex === id);

    if (this.lesson?.document) {
      this.safeDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson.document);
    }
  }
}