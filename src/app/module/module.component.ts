import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  askDelete(index: number) {
    this.pendingDeleteIndex = index;
  }

  cancelDelete() {
    this.pendingDeleteIndex = null;
  }

  confirmDelete() {
    if (this.pendingDeleteIndex !== null) {
      this.modules.splice(this.pendingDeleteIndex, 1);
      this.updateFilter();
      this.pendingDeleteIndex = null;
    }
  }
  modules: any[] = [];
  filteredModules: any[] = [];
  searchTerm = '';
  showForm = false;
  moduleForm!: FormGroup;
  pendingDeleteIndex: number | null = null;
  editIndex: number | null = null;

 constructor(private fb: FormBuilder, private router: Router) {}

goToLessons(courseId: number, moduleId: number) {
  this.router.navigate([`/courses/${courseId}/modules/${moduleId}/lessons`]);
}

  ngOnInit(): void {
    this.moduleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      orderIndex: [null, [Validators.required, Validators.min(1)]],
    });

    this.updateFilter();
  }

  // === Form Actions ===
  addModule() {
    this.showForm = true;
    this.moduleForm.reset();
  }

  cancel() {
    this.showForm = false;
  }

  saveModule() {
    if (this.moduleForm.invalid) return;

    const newModule = { ...this.moduleForm.value };
    if (this.editIndex!==null){
      this.modules[this.editIndex]=newModule
       this.editIndex = null;
    }
    else{
this.modules.push(newModule);
    }
    
    this.updateFilter();
    this.showForm = false;
  }

  // === Edit ===
  editModule(module: any, index:number) {
    this.showForm = true;
    this.editIndex = index;
    this.moduleForm.patchValue(module);
  }

  // === Filter ===
  updateFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredModules = this.modules.filter(
      m =>
        m.title.toLowerCase().includes(term) ||
        (m.description?.toLowerCase() || '').includes(term)
    );
  }

  // === Delete ===
  deleteModule(index: number) {
    this.modules.splice(index, 1);
    this.updateFilter();
  }
}
