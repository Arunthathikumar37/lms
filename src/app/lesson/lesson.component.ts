import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type LessonData = {
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
  documentFileName?:string
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

  // ✅ Use static array to share lessons across components
  static lessons: LessonData[] = [];
  lessons: LessonData[] = LessonComponent.lessons;

  filteredLessons: LessonData[] = [];
  lessonData: LessonData = this.getEmptyLesson();
  lessonToDelete: LessonData | null = null;

  constructor(private router: Router) {}

  // Return empty lesson
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

  // Open popup to add lesson
  addLesson() {
    this.showForm = true;
    this.editingLesson = false;
    this.lessonData = this.getEmptyLesson();
  }

  // Cancel popup
  cancel() {
    this.showForm = false;
  }

  // Save lesson
  saveLesson() {
    if (!this.lessonData.title.trim()) return;

    // Set type
    if (this.lessonData.videoUrl) this.lessonData.type = 'Video';
    else this.lessonData.type = 'Document';

    if (!this.editingLesson) {
      this.lessons.push({ ...this.lessonData });
      LessonComponent.lessons = this.lessons; // ✅ update static array
    } else {
      const index = this.lessons.findIndex(l => l.orderIndex === this.lessonData.orderIndex);
      if (index > -1) this.lessons[index] = { ...this.lessonData };
    }

    this.updateFilter();
    this.showForm = false;
  }

  // Filter lessons dynamically
  updateFilter() {
    this.filteredLessons = this.lessons.filter(
      l =>
        l.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Edit lesson
  editLesson(lesson: LessonData) {
    this.lessonData = { ...lesson };
    this.editingLesson = true;
    this.showForm = true;
  }

  // Delete lesson
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
      LessonComponent.lessons = this.lessons; // ✅ update static array
      this.updateFilter();
    }
    this.cancelDelete();
  }

  // ✅ Navigate to video page using ID (static array)
playLessonVideo(lesson: LessonData) {
  if (!lesson.videoUrl) {
    alert('No video uploaded for this lesson!');
    return;
  }

  // Navigate to the video page with lesson orderIndex
  this.router.navigate(['/video', lesson.orderIndex]);
}



  // Navigate to document page
openLessonDocument(lesson: LessonData) {
  if (!lesson.document) {
    alert('No document uploaded for this lesson!');
    return;
  }

  const base64Data = lesson.document;

  // Convert Base64 to Blob
  const byteString = atob(base64Data.split(',')[1]); // remove "data:application/pdf;base64,"
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]; // get MIME type
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  // Create a temporary URL
  const url = URL.createObjectURL(blob);

  // Open in a new tab
  window.open(url, '_blank');
}


  // Handle file uploads (Base64 preview)
  onFileSelected(event: any, type: 'image' | 'document' | 'video' | 'attachments') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'image') this.lessonData.image = reader.result as string;
        else if (type === 'document') {
          this.lessonData.document = reader.result as string;
          this.lessonData.videoUrl = null;
          this.lessonData.documentFileName = file.name; 
        } else if (type === 'video') {
          this.lessonData.videoUrl = reader.result as string;
          this.lessonData.document = null;
        } else if (type === 'attachments') this.lessonData.attachments = Array.from(event.target.files);
      };
      reader.readAsDataURL(file);
    }
  }
}
