import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonComponent, LessonData } from '../lesson/lesson.component';

type TranscriptLine = { time: string; text: string };
type NoteItem = { text: string; time?: string };

@Component({
  selector: 'app-vedio-page',
  templateUrl: './vedio-page.component.html',
  styleUrls: ['./vedio-page.component.css'],
  
})
export class VedioPageComponent implements OnInit, AfterViewInit {
  lesson: LessonData | null = null;

  safeVideoUrl: SafeResourceUrl | null = null;

  // Tabs
selectedIndex = 0;
  // Notes UI
  noteText = '';
  notesSearch = '';

  // Side panel (right slide window)
  sidePanelOpen = true;

  @ViewChild('player') playerRef!: ElementRef<HTMLVideoElement>;
  notes: any;
  attachmentProgress: number[] = [];  // initialize as empty array
  currentAttachmentIndex: number | null = null;
  transcriptSearch: any;
attachments: any;

  get filteredTranscript(): TranscriptLine[] {
    if (!this.lesson?.transcript) return [];
    const term = this.transcriptSearch.trim().toLowerCase();
    if (!term) return this.lesson.transcript;
    return this.lesson.transcript.filter(line => {
      const text = (line.text || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const time = (line.time || '').replace(/\s+/g, ' ').trim().toLowerCase();
      return text.includes(term) || time.includes(term);
    });
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Get lesson from shared static list
    this.lesson = LessonComponent.lessons.find(l => l.orderIndex === id) ?? null;

    if (!this.lesson) {
      alert('Lesson not found');
      this.router.navigate(['/']);
      return;
    }

    // Initialize arrays
    if (!this.lesson.transcript) this.lesson.transcript = [];
    if (!this.lesson.notes) this.lesson.notes = [];
    if (!this.lesson.attachments) this.lesson.attachments = [];
    if (this.lesson.videoUrl) {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson.videoUrl);
  }
  this.attachmentProgress = this.lesson.attachments.map(() => 0);

    if (this.lesson.videoUrl) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson.videoUrl);
      this.currentAttachmentIndex = null; // main lesson video
    }

    // ---- Add Transcript Lines Here ----
    this.lesson.transcript.push(
      { time: '0:05', text: 'Introduction to the topic' },
      { time: '0:15', text: 'Explaining the first concept' },
      { time: '0:30', text: 'Some example here' },
      { time: '1:00', text: 'Conclusion of section 1' }
    );

    // Safe video URL
    if (this.lesson.videoUrl) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.lesson.videoUrl);
    }
  }
ngAfterViewInit(): void {
  if (this.playerRef?.nativeElement) {
    this.playerRef.nativeElement.addEventListener('timeupdate', () => {
      if (this.currentAttachmentIndex !== null) {
        const player = this.playerRef.nativeElement;
        if (player.duration) {
          const percent = (player.currentTime / player.duration) * 100;
          this.attachmentProgress[this.currentAttachmentIndex] = percent;
        }
      }
    });
  }
}
  // ---- Notes ----
addNote(): void {
    if (!this.lesson || !this.noteText.trim() || !this.playerRef?.nativeElement) return;
    const t = Math.floor(this.playerRef.nativeElement.currentTime);
    const time = this.formatTime(t);
    this.lesson.notes!.push({ text: this.noteText.trim(), time });
    this.noteText = '';
  }
  get filteredNotes(): NoteItem[] {
    if (!this.lesson?.notes) return [];
    const term = this.notesSearch.trim().toLowerCase();
    if (!term) return this.lesson.notes;
    return this.lesson.notes.filter(n =>
      (n.text || '').toLowerCase().includes(term) ||
      (n.time || '').toLowerCase().includes(term)
    );
  }

  jumpToTimeStr(timeStr?: string): void {
    if (!timeStr || !this.playerRef?.nativeElement) return;
    const [m, s] = timeStr.split(':').map(Number);
    const sec = (m || 0) * 60 + (s || 0);
    this.playerRef.nativeElement.currentTime = sec;
    this.playerRef.nativeElement.play();
  }

  // ---- Transcript ----
  pinFromTranscript(line: TranscriptLine): void {
    if (!this.lesson) return;
    this.lesson.notes = this.lesson.notes || [];
    this.lesson.notes.push({ text: line.text, time: line.time });
   this.selectedIndex = 0;  // switch to notes tab
  }

  // ---- Helpers ----
  formatTime(totalSec: number): string {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  // default tab index

onTabChanged(event: { tabIndex: number; tabTitle: string }) {
  this.selectedIndex = event.tabIndex;
  console.log('Active tab:', event);
}


panelOpen = false;

togglePanel() {
  this.panelOpen = !this.panelOpen; // toggle panel state
}




  togglePin(note: any, index: number) {
    note.pinned = !note.pinned;
    if (note.pinned) {
      this.notes.splice(index, 1);
      this.notes.unshift(note);
    }
  }
menu = [
  { title: 'Edit', action: 'edit' },
  { title: 'Delete', action: 'delete' },
];

onMenuClick(item: any, index: number) {
  if (!this.lesson?.notes) return;

  if (item.action === 'edit') {
    const note = this.lesson.notes[index];
    console.log('Edit note:', note);
    this.noteText = note.text;
    this.lesson.notes.splice(index, 1);
  } 
  else if (item.action === 'delete') {
    this.lesson.notes.splice(index, 1);
  }
}

// Inside VedioPageComponent class
playAttachment(index: number) {
  if (!this.lesson?.attachments || !this.lesson.attachments[index]) return;

  const file = this.lesson.attachments[index];

  // ✅ Highlight: set current attachment index first
  this.currentAttachmentIndex = index;

  // ✅ Update the main video player with the selected attachment
  this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.data);

  // ✅ Reset progress of other attachments
  this.attachmentProgress = this.lesson.attachments.map((_, i) => (i === index ? 0 : this.attachmentProgress[i] || 0));

  // ✅ Load and play the new video
  setTimeout(() => {
    if (this.playerRef?.nativeElement) {
      const player = this.playerRef.nativeElement;
      player.load(); // reload video source
      player.play().catch(err => console.log('Error playing video:', err));

      // ✅ Update progress bar as video plays
      player.ontimeupdate = () => {
        if (player.duration) {
          const percent = (player.currentTime / player.duration) * 100;
          this.attachmentProgress[this.currentAttachmentIndex!] = percent;
        }
      };
    }
  }, 50);
}






}
