import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle, bookmarkOutline } from 'ionicons/icons';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonButton, IonIcon
  ]
})
export class WatchlistPage {
  watchlist: any[] = [];

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({ closeCircle, bookmarkOutline });
  }

  async ionViewWillEnter() {
    this.watchlist = await this.movieService.getWatchlist();
  }

  openDetail(movie: any) {
  this.movieService.setSelectedMovie(movie);
  this.router.navigate(['/movie-detail']);
}

  async removeMovie(event: Event, movie: any) {
    event.stopPropagation();
    await this.movieService.removeFromWatchlist(movie.imdbID);
    this.watchlist = await this.movieService.getWatchlist();
  }
}