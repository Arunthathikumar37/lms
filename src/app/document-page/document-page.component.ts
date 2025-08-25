import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-document-page',
  standalone: false,
  templateUrl: './document-page.component.html',
  styleUrl: './document-page.component.css'
})
export class DocumentPageComponent implements OnInit {
  lessonId!: string | null;
  lesson: any;
  documentUrl: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('id');
    this.lesson = history.state.lesson;

    if (this.lesson?.document) {
      this.documentUrl = URL.createObjectURL(this.lesson.document);
    }
  }
}
