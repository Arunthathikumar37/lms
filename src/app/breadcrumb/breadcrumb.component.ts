import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Crumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Crumb[] = [];

  // Map path segments to display names
  private labelMap: Record<string, string> = {
    courses: 'Course Builder',
    modules: 'Modules',
    lessons: 'Lessons',

  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildFromUrl(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.buildFromUrl(event.urlAfterRedirects || event.url);
      });
  }

  private buildFromUrl(url: string) {
    const segments = url.split('/').filter(Boolean);
    const crumbs: Crumb[] = [];
    let path = '';

    for (const seg of segments) {
      path += `/${seg}`;

      if (this.labelMap[seg]) {
        crumbs.push({
          label: this.labelMap[seg],
          url: path
        });
      }
    }

    this.breadcrumbs = crumbs;
  }
}
