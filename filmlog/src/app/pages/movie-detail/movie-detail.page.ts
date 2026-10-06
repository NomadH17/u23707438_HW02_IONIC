import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MovieDetailPage implements OnInit {
  movie: any = null;
  
  alreadyInWatchlist = false;
  alreadyWatched = false;

  constructor(
    private movieService: MovieService,
    private toastController: ToastController
  ) { }

async ngOnInit() {
  this.movie = this.movieService.getSelectedMovie();
  
  if (this.movie) {
    if (!this.movie.genre || !this.movie.actors) {
      this.movieService.getMovieDetails(this.movie.imdbID).subscribe({
        next: (fullDetails: any) => {
          this.movie.genre = fullDetails.Genre || 'N/A';
          this.movie.actors = fullDetails.Actors || 'N/A';
        },
        error: (err) => console.error('Failed to fetch full details', err)
      });
    }

    await this.checkMovieStatus();
  }
}

  async checkMovieStatus() {
    try {
      const watchlist = await this.movieService.getWatchlist();
      this.alreadyInWatchlist = watchlist.some((m: any) => m.imdbID === this.movie.imdbID);

      const watchedList = await this.movieService.getWatchedList();
      this.alreadyWatched = watchedList.some((item: any) => item.movie.imdbID === this.movie.imdbID);
    } catch (error) {
      console.error('Error verifying list statuses', error);
    }
  }

  async addToWatchlist() {
    try {
      await this.movieService.addToWatchlist(this.movie);
      this.alreadyInWatchlist = true;
      this.showToast('Added to Watchlist!');
    } catch (error) {
      console.error('Error adding to watchlist', error);
      this.showToast('Failed to add to watchlist.');
    }
  }

  async markAsWatched() {
    try {
      await this.movieService.markAsWatched(this.movie);
      this.alreadyWatched = true;
      this.alreadyInWatchlist = false;
      this.showToast('Marked as Watched!');
    } catch (error) {
      console.error('Error marking as watched', error);
      this.showToast('Failed to mark as watched.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}