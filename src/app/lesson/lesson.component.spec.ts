import { Component } from '@angular/core';
import { Router } from '@angular/router';

type LessonData = {
  type: string;
  image: File | null;
  document: File | null;
  videoUrl: string | null;
  title: string;
  description: string;
  attachments: File[];
  summary: string;
  duration: number | null;
  orderIndex: number;
};

@Component({
  selector: 'app-lesson',
  standalone: false,
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent {
updateFilter() {
throw new Error('Method not implemented.');
}
  searchTerm: string = '';
  showForm = false;

  lessons: LessonData[] = [];

  // for popup form
  lessonData: LessonData = {
    type: 'Document',
    image: null,
    document: null,
    videoUrl: null,
    title: '',
    description: '',
    attachments: [],
    summary: '',
    duration: null,
    orderIndex: 1
  };

  // for delete confirmation
  showDeleteConfirm = false;
  lessonToDelete: LessonData | null = null;

  constructor(private router: Router) {}

  // Show popup form
  addLesson() {
    this.showForm = true;
  }

  // Handle file input safely
  onFileSelected(event: any, field: keyof LessonData) {
    const file = event.target.files[0];
    if (!file) return;

    if (field === 'attachments') {
      this.lessonData.attachments = Array.from(event.target.files);
    } else if (field === 'image' || field === 'document') {
      this.lessonData[field] = file;

      // ✅ if lesson is video, generate preview URL
      if (this.lessonData.type === 'Video' && field === 'document') {
        this.lessonData.videoUrl = URL.createObjectURL(file);
      }
    }
  }

  // Save lesson
  saveLesson() {
    this.lessons.push({ ...this.lessonData });

    // reset form
    this.lessonData = {
      type: 'Document',
      image: null,
      document: null,
      videoUrl: null,
      title: '',
      description: '',
      attachments: [],
      summary: '',
      duration: null,
      orderIndex: 1
    };
    this.showForm = false;
  }

  // Cancel popup
  cancel() {
    this.showForm = false;
  }

  // Local search filter logic
  get filteredLessons(): LessonData[] {
    if (!this.searchTerm) return this.lessons;
    return this.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Ask for delete confirmation
  confirmDelete(lesson: LessonData) {
    this.showDeleteConfirm = true;
    this.lessonToDelete = lesson;
  }

  // Cancel delete
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.lessonToDelete = null;
  }

  // Delete lesson
  deleteLesson() {
    if (this.lessonToDelete) {
      this.lessons = this.lessons.filter(l => l !== this.lessonToDelete);
    }
    this.showDeleteConfirm = false;
    this.lessonToDelete = null;
  }

  // Edit lesson
  editLesson(lesson: LessonData) {
    alert(`Edit form should open for "${lesson.title}"`);
  }

  // ✅ Navigate to video page
  playLessonVideo(lesson: LessonData) {
    this.router.navigate(['/video', lesson.orderIndex], {
      state: { lesson }
    });
  }

  // ✅ Navigate to document page
  openLessonDocument(lesson: LessonData) {
    this.router.navigate(['/document', lesson.orderIndex], {
      state: { lesson }
    });
  }
}

