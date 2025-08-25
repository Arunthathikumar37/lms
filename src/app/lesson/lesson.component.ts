import { Component } from '@angular/core';
import { Router } from '@angular/router';

type LessonData = {
  type: 'Video' | 'Document';
  image: string | null;
  document: string | null;
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
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  standalone: false
})
export class LessonComponent {
  showForm = false; // popup visibility
  showDeleteConfirm = false;
  editingLesson = false;
  searchTerm: string = '';
  lessons: LessonData[] = [];
  filteredLessons: LessonData[] = [];
  lessonData: LessonData = this.getEmptyLesson();
  lessonToDelete: LessonData | null = null;

  constructor(private router: Router) {}

  // NEW: Return a fresh empty lesson
  private getEmptyLesson(): LessonData {
    return {
      type: 'Document',
      image: null,
      document: null,
      videoUrl: null,
      title: '',
      description: '',
      attachments: [],
      summary: '',
      duration: null,
      orderIndex: this.lessons.length + 1
    };
  }

  // Open popup for adding new lesson
  addLesson() {
    this.showForm = true;
    this.editingLesson = false;
    this.lessonData = this.getEmptyLesson(); // NEW: reset form
  }

  // Cancel popup
  cancel() {
    this.showForm = false;
  }

  // Save lesson
  saveLesson() {
    if (!this.lessonData.title.trim()) return;

    // NEW: type is already selected by dropdown; ensure consistency
    if (this.lessonData.videoUrl) this.lessonData.type = 'Video';
    else this.lessonData.type = 'Document';

    if (this.editingLesson) {
      const index = this.lessons.findIndex(l => l.orderIndex === this.lessonData.orderIndex);
      if (index > -1) this.lessons[index] = { ...this.lessonData };
    } else {
      this.lessons.push({ ...this.lessonData });
    }

    this.updateFilter();
    this.showForm = false; // close popup
  }

  // Filter lessons dynamically
  updateFilter() {
    this.filteredLessons = this.lessons.filter(
      l =>
        l.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Edit a lesson
  editLesson(lesson: LessonData) {
    this.lessonData = { ...lesson };
    this.editingLesson = true;
    this.showForm = true; // open popup
  }

  // Delete confirmation
  confirmDelete(lesson: LessonData) {
    this.lessonToDelete = lesson;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.lessonToDelete = null;
  }

  deleteLesson() {
    if (this.lessonToDelete) {
      this.lessons = this.lessons.filter(l => l !== this.lessonToDelete);
      this.updateFilter();
    }
    this.cancelDelete();
  }

  // Navigate to video page
  playLessonVideo(lesson: LessonData) {
    if (lesson.videoUrl) this.router.navigate(['/video'], { state: { videoUrl: lesson.videoUrl } });
  }

  // Navigate to document page
  openLessonDocument(lesson: LessonData) {
    if (lesson.document) this.router.navigate(['/document'], { state: { documentUrl: lesson.document } });
  }

  // NEW: Handle file uploads with Base64 preview
  onFileSelected(event: any, type: 'image' | 'document' | 'video' | 'attachments') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'image') this.lessonData.image = reader.result as string;
        else if (type === 'document') {
          this.lessonData.document = reader.result as string;
          this.lessonData.videoUrl = null;
        } else if (type === 'video') {
          this.lessonData.videoUrl = reader.result as string;
          this.lessonData.document = null;
        } else if (type === 'attachments') this.lessonData.attachments = Array.from(event.target.files);
      };
      reader.readAsDataURL(file);
    }
  }
}
