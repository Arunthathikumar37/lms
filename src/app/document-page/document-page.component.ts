import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonComponent, LessonData } from '../lesson/lesson.component';

@Component({
  selector: 'app-document-page',
  standalone: false,
  templateUrl: './document-page.component.html',
  styleUrl: './document-page.component.css'
})
export class DocumentPageComponent implements OnInit {
  lesson: LessonData | undefined;
documentUrl: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (lessonId) {
      const index = parseInt(lessonId, 10);
      this.lesson = LessonComponent.lessons.find(l => l.orderIndex === index);
      if (!this.lesson || !this.lesson.videoUrl) {
        alert('Video not found!');
        this.router.navigate(['/']);
      }
    }
  }
}