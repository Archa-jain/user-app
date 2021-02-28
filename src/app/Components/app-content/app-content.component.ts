import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.scss']
})
export class AppContentComponent implements OnInit {

  sideNavOpened = true;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

}
