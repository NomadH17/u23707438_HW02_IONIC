import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MovieService } from '../../services/movie.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class StatisticsPage implements AfterViewInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;

  pieChartInstance: any;
  barChartInstance: any;
  topMoviesTable: any[] = [];
  hasData = false;

  constructor(private movieService: MovieService) {}

  async ngAfterViewInit() {
    await this.loadStatistics();
  }

  async loadStatistics() {
    try {
      const watchedData = await this.movieService.getWatchedList();
      if (!watchedData || watchedData.length === 0) {
        this.hasData = false;
        return;
      }
      this.hasData = true;

      const genreCounts: { [key: string]: number } = {};
      watchedData.forEach((item: any) => {
        if (item.movie.genre && item.movie.genre !== 'N/A') {
          item.movie.genre.split(',').map((g: string) => g.trim()).forEach((g: string) => {
            genreCounts[g] = (genreCounts[g] || 0) + item.timesWatched;
          });
        }
      });
      const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

      const decadeCounts: { [key: string]: number } = {};
      watchedData.forEach((item: any) => {
        if (item.movie.year && item.movie.year !== 'N/A') {
          const yearMatch = item.movie.year.match(/\d{4}/); 
          if (yearMatch) {
            const decade = Math.floor(parseInt(yearMatch[0], 10) / 10) * 10;
            decadeCounts[`${decade}s`] = (decadeCounts[`${decade}s`] || 0) + item.timesWatched;
          }
        }
      });
      const sortedDecades = Object.entries(decadeCounts).sort((a, b) => a[0].localeCompare(b[0]));

      this.topMoviesTable = [...watchedData].sort((a, b) => b.timesWatched - a.timesWatched).slice(0, 5);

      setTimeout(() => {
        this.renderPieChart(sortedGenres);
        this.renderBarChart(sortedDecades);
      }, 100);
    } catch (error) {
      console.error('Error loading statistics', error);
    }
  }

  renderPieChart(data: any[]) {
    if (this.pieChartInstance) this.pieChartInstance.destroy();
    this.pieChartInstance = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: data.map(d => d[0]),
        datasets: [{
          data: data.map(d => d[1]),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  renderBarChart(data: any[]) {
    if (this.barChartInstance) this.barChartInstance.destroy();
    this.barChartInstance = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d[0]),
        datasets: [{ label: 'Movies Watched', data: data.map(d => d[1]), backgroundColor: '#36A2EB' }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }
}