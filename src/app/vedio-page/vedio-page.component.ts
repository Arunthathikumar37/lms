import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'app-vedio-page',
  standalone: false,
  templateUrl: './vedio-page.component.html',
  styleUrl: './vedio-page.component.css'
})
export class VedioPageComponent implements OnInit {
  lessonId!: string | null;
  lesson: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.lessonId = this.route.snapshot.paramMap.get('id');
    this.lesson = history.state.lesson; // ✅ data passed from LessonComponent
  }
}