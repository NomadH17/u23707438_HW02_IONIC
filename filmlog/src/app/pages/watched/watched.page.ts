import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle, refreshCircle, checkmarkCircleOutline } from 'ionicons/icons';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-watched',
  templateUrl: './watched.page.html',
  styleUrls: ['./watched.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonButton, IonIcon
  ]
})
export class WatchedPage {
  watchedList: any[] = [];

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({ closeCircle, refreshCircle, checkmarkCircleOutline });
  }

  async ionViewWillEnter() {
  this.watchedList = await this.movieService.getWatchedList();
  console.log('Watched list on page load:', this.watchedList);
}

  openDetail(movie: any) {
  this.movieService.setSelectedMovie(movie);
  this.router.navigate(['/movie-detail']);
}

  async resetWatched(event: Event, movie: any) {
    event.stopPropagation();
    await this.movieService.resetTimesWatched(movie.imdbID);
    this.watchedList = await this.movieService.getWatchedList();
  }

  async removeMovie(event: Event, movie: any) {
    event.stopPropagation();
    await this.movieService.removeFromWatchedList(movie.imdbID);
    this.watchedList = await this.movieService.getWatchedList();
  }
}