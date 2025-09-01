import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type LessonData = {
  type: 'Video' | 'Document';
  image: string | null;
  imageFileName?: string;       // ✅ new
  document: string | null;
  documentFileName?: string;    // ✅ new
  videoUrl: string | null;
  videoFileName?: string;       // ✅ new
  title: string;
  description: string;
  attachments?: { name: string; data: string }[];
  summary?: string;
  duration: number | null;
  orderIndex: number;
  details?: string;
  transcript?: { time: string; text: string }[];
  notes?: { text: string; time?: string }[];
};



  


@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css'],
  
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
selectedItem: any;

  constructor(private router: Router) {}
  ngOnInit() {
    this.updateFilter(); // ✅ initialize filteredLessons
  }

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

  // ← ADD THIS LINE
  this.lessonData.details = this.lessonData.description;

  if (!this.editingLesson) {
    this.lessons.push({ ...this.lessonData });
    LessonComponent.lessons = this.lessons; // update static array
  } else {
    const index = this.lessons.findIndex(l => l.orderIndex === this.lessonData.orderIndex);
    if (index > -1) this.lessons[index] = { ...this.lessonData };
  }

  this.updateFilter();
  this.showForm = false;
}

  updateFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLessons = this.lessons.filter(
      l =>
        l.title.toLowerCase().includes(term) ||
        (l.description?.toLowerCase() || '').includes(term)
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
// Navigate to document page
openLessonDocument(lesson: LessonData) {
  if (!lesson.document) {
    alert('No document uploaded for this lesson!');
    return;
  }

  // ✅ Navigate to document route with lesson orderIndex
  this.router.navigate(['/document', lesson.orderIndex]);
}



  // Handle file uploads (Base64 preview)
// Add/Update inside LessonComponent class
onFileSelected(event: any, type: 'image' | 'document' | 'video' | 'attachments') {
  const files: FileList = event.target.files;
  if (!files || files.length === 0) return;

  if (type === 'image' || type === 'document' || type === 'video') {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'image') {
        this.lessonData.image = reader.result as string;
        this.lessonData.imageFileName = file.name;   // ✅ store filename
      } 
      else if (type === 'document') {
        this.lessonData.document = reader.result as string;
        this.lessonData.documentFileName = file.name; // ✅ store filename
        this.lessonData.videoUrl = null;
      } 
      else if (type === 'video') {
        this.lessonData.videoUrl = reader.result as string;
        this.lessonData.videoFileName = file.name;   // ✅ store filename
        this.lessonData.document = null;
      }
    };
    reader.readAsDataURL(file);
  }

  else if (type === 'attachments') {
    if (!this.lessonData.attachments) this.lessonData.attachments = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.lessonData.attachments!.push({
          name: file.name,        // ✅ store attachment filename
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }
}



  
}
