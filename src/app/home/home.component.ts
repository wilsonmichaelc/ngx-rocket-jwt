import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  results: any;
  isLoading: boolean;

  constructor() { }

  ngOnInit() {
    this.isLoading = true;
    setTimeout(() => {
      this.results = 'Finished loading...';
      this.isLoading = false;
    }, 1000);
  }

}
