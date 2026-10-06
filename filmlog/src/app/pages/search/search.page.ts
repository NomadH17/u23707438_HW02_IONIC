import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonButton, IonGrid, IonRow,
  IonCol, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, filmOutline } from 'ionicons/icons';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonButton, IonGrid, IonRow,
    IonCol, IonIcon, IonButtons
  ]
})
export class SearchPage {
  searchQuery = '';
  results: any[] = [];
  filteredResults: any[] = [];
  searched = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline, filmOutline });
  }

  searchMovies() {
    if (!this.searchQuery.trim()) return;
    
    this.movieService.searchMovies(this.searchQuery).subscribe((data: any) => {
      this.results = data.Search || [];
      this.filteredResults = [...this.results];
      this.searched = true;
    });
  }

  filterResults() {
    const q = this.searchQuery.toLowerCase();
    this.filteredResults = this.results.filter(m =>
      m.Title?.toLowerCase().includes(q)
    );
  }

  openDetail(movie: any) {
    this.movieService.setSelectedMovie(movie);
    this.router.navigate(['/movie-detail']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}