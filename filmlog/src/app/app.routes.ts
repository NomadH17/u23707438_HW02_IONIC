import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; // Now it will be read!

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage),
    canActivate: [authGuard], // <-- ADDED HERE to protect all tabs!
    children: [
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage)
      },
      {
        path: 'watchlist',
        loadComponent: () => import('./pages/watchlist/watchlist.page').then( m => m.WatchlistPage)
      },
      {
        path: 'watched',
        loadComponent: () => import('./pages/watched/watched.page').then( m => m.WatchedPage)
      },
      {
        path: 'statistics',
        loadComponent: () => import('./pages/statistics/statistics.page').then( m => m.StatisticsPage)
      },
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      }
    ] 
  },
  {
    path: 'movie-detail',
    loadComponent: () => import('./pages/movie-detail/movie-detail.page').then( m => m.MovieDetailPage),
    canActivate: [authGuard] // <-- ADDED HERE to protect the detail page!
  },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics.page').then( m => m.StatisticsPage)
  }
];