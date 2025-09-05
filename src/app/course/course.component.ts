// 1) Keep your imports as-is ✅
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  searchTerm = '';
  courses: any[] = [];
  filteredCourses: any[] = [];
  showForm = false;
  courseForm!: FormGroup;
  editIndex: number | null = null;





constructor(private fb: FormBuilder, private dialogService: NbDialogService, private router: Router) {}

goToModules(courseId: number) {
  this.router.navigate([`/courses/${courseId}/modules`]);
}




  ngOnInit(): void {
    this.courseForm = this.fb.group({
      image: ['', Validators.required],
      imageFileName: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      level: ['', Validators.required],
      instructorName: ['', Validators.required],
      orderIndex: [null, [Validators.required, Validators.min(1)]],
    });

    this.updateFilter();
  }

  /** ✅ Open delete dialog */
// Track which course is pending delete
pendingDeleteIndex: number | null = null;

// When user clicks the trash icon
askDelete(index: number) {
  this.pendingDeleteIndex = index;
}

// Cancel delete
cancelDelete() {
  this.pendingDeleteIndex = null;
}

// Confirm delete
confirmDelete() {
  if (this.pendingDeleteIndex !== null) {
    this.courses.splice(this.pendingDeleteIndex, 1);
    this.updateFilter();
    this.pendingDeleteIndex = null;
  }
}



  // === Form Actions ===
  addCourse() {
    this.showForm = true;
    this.courseForm.reset();
  }

  cancel() {
    this.showForm = false;
  }

// Add a property to track edit index


// === Edit Course ===
editCourse(course: any, index: number) {
  this.showForm = true;
  this.editIndex = index; 
  this.courseForm.reset(); // ✅ store which course is being edited
  this.courseForm.patchValue(course);
  
}


// === Save Course ===
saveCourse() {
  if (this.courseForm.invalid) return;

  const courseData = { ...this.courseForm.value };

  if (this.editIndex !== null) {
    // ✅ Update existing course
    this.courses[this.editIndex] = courseData;
    this.editIndex = null;
  } else {
    // ✅ Add new course
    this.courses.push(courseData);
  }

  this.updateFilter();
  this.showForm = false;
}


  // === Filter ===
  updateFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(
      c =>
        c.title.toLowerCase().includes(term) ||
        (c.description?.toLowerCase() || '').includes(term)
    );
  }

  // === File Upload ===
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.courseForm.patchValue({
          image: reader.result,
          imageFileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // === Edit Course ===

}


