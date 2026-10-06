import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/movies`;
  private watchlistUrl = `${environment.apiUrl}/watchlist`;
  private watchedUrl = `${environment.apiUrl}/watched`;

  selectedMovie: any = null;

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?t=${query}`);
  }

  getMovieDetails(imdbID: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/details/${imdbID}`);
  }

  setSelectedMovie(movie: any) {
    this.selectedMovie = this.normalizeMovie(movie);
  }

  getSelectedMovie() {
    return this.selectedMovie;
  }

  normalizeMovie(movie: any) {
    const id = movie.imdbID || movie['#IMDB_ID'] || movie.id;
    return {
      imdbID: id,
      title: movie.title || movie['#TITLE'] || movie.Title,
      year: movie.year || movie['#YEAR'] || movie.Year,
      poster: movie.poster || movie['#IMG_POSTER'] || movie.Poster,
      actors: movie.actors || movie.Actors || '',
      genre: movie.genre || movie.Genre || ''
    };
  }

  async getWatchlist(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(this.watchlistUrl));
  }

  async addToWatchlist(movie: any) {
    const normalized = this.normalizeMovie(movie);
    return firstValueFrom(this.http.post(this.watchlistUrl, normalized));
  }

  async removeFromWatchlist(imdbID: string) {
    return firstValueFrom(this.http.delete(`${this.watchlistUrl}/${imdbID}`));
  }

  async getWatchedList(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(this.watchedUrl));
  }

  async markAsWatched(movie: any) {
    const normalized = this.normalizeMovie(movie);
    return firstValueFrom(this.http.post(this.watchedUrl, normalized));
  }

  async removeFromWatchedList(imdbID: string) {
    return firstValueFrom(this.http.delete(`${this.watchedUrl}/${imdbID}`));
  }

  async resetTimesWatched(imdbID: string) {
    return firstValueFrom(this.http.post(`${this.watchedUrl}/reset/${imdbID}`, {}));
  }
}