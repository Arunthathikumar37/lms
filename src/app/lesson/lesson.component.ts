import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export type LessonData = {
  type: 'Video' | 'Document';
  image: string | null;
  imageFileName?: string;
  document: string | null;
  documentFileName?: string;
  videoUrl: string | null;
  videoFileName?: string;
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
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  showForm = false;
  showDeleteConfirm = false;
  editingLesson = false;
  searchTerm: string = '';

  static lessons: LessonData[] = [];
  lessons: LessonData[] = LessonComponent.lessons;
  filteredLessons: LessonData[] = [];
  lessonToDelete: LessonData | null = null;

  lessonForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.updateFilter();
  }

  // Initialize Reactive Form
  initForm() {
    this.lessonForm = this.fb.group(
      {
        type: ['Document', Validators.required],
        title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        summary: [''],
        duration: [null, [Validators.required, Validators.min(1), Validators.max(300)]],
        orderIndex: [this.lessons.length + 1, [Validators.required, Validators.min(1)]],
        image: [null],
        imageFileName: [''],
        document: [null],
        documentFileName: [''],
        videoUrl: [null],
        videoFileName: [''],
        attachments: this.fb.array([])
      },
      { validators: this.typeFileValidator() }
    );
  }

  // Custom validator: ensure video or document uploaded based on type
  typeFileValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const type = control.get('type')?.value;
      const video = control.get('videoUrl')?.value;
      const document = control.get('document')?.value;

      if (type === 'Video' && !video) return { requiredVideo: true };
      if (type === 'Document' && !document) return { requiredDocument: true };
      return null;
    };
  }

  // FormArray for attachments
  get attachments(): FormArray {
    return this.lessonForm.get('attachments') as FormArray;
  }

  // Open Add Lesson popup
  addLesson() {
    this.showForm = true;
    this.editingLesson = false;
    this.lessonForm.reset({ type: 'Document', orderIndex: this.lessons.length + 1 });
    this.attachments.clear();
  }

  cancel() {
    this.showForm = false;
  }

  // Save lesson
  saveLesson() {
    if (this.lessonForm.invalid) return;

    const lessonData: LessonData = { ...this.lessonForm.value };
    lessonData.details = lessonData.description;

    if (!this.editingLesson) {
      this.lessons.push(lessonData);
      LessonComponent.lessons = this.lessons;
    } else {
      const index = this.lessons.findIndex(l => l.orderIndex === lessonData.orderIndex);
      if (index > -1) this.lessons[index] = lessonData;
    }

    this.updateFilter();
    this.showForm = false;
  }

  // Search filter
  updateFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLessons = this.lessons.filter(
      l =>
        l.title.toLowerCase().includes(term) ||
        (l.title?.toLowerCase() || '').includes(term)
    );
  }

  // Edit lesson
  editLesson(lesson: LessonData) {
    this.editingLesson = true;
    this.showForm = true;
    this.lessonForm.patchValue({ ...lesson });
    this.attachments.clear();
    if (lesson.attachments) {
      lesson.attachments.forEach(att => {
        this.attachments.push(this.fb.group({ name: att.name, data: att.data }));
      });
    }
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
      LessonComponent.lessons = this.lessons;
      this.updateFilter();
    }
    this.cancelDelete();
  }

  // Navigate to video page
  playLessonVideo(lesson: LessonData) {
    if (!lesson.videoUrl) {
      alert('No video uploaded for this lesson!');
      return;
    }
    this.router.navigate(['/video', lesson.orderIndex]);
  }

  // Navigate to document page
  openLessonDocument(lesson: LessonData) {
    if (!lesson.document) {
      alert('No document uploaded for this lesson!');
      return;
    }
    this.router.navigate(['/document', lesson.orderIndex]);
  }

  // Handle file uploads
  onFileSelected(event: any, type: 'image' | 'document' | 'video' | 'attachments') {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    if (type === 'image' || type === 'document' || type === 'video') {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'image') this.lessonForm.patchValue({ image: reader.result, imageFileName: file.name });
        if (type === 'document') this.lessonForm.patchValue({ document: reader.result, documentFileName: file.name, videoUrl: null });
        if (type === 'video') this.lessonForm.patchValue({ videoUrl: reader.result, videoFileName: file.name, document: null });
      };
      reader.readAsDataURL(file);
    } else if (type === 'attachments') {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => this.attachments.push(this.fb.group({ name: file.name, data: reader.result }));
        reader.readAsDataURL(file);
      });
    }
  }
}
