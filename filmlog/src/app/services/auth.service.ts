import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) { }

  async register(credentials: { email: string, password: string }) {
    return firstValueFrom(this.http.post(`${this.apiUrl}/register`, credentials));
  }

  async login(credentials: { email: string, password: string }) {
    const response: any = await firstValueFrom(this.http.post(`${this.apiUrl}/login`, credentials));
    
    if (response && response.token) {
      await this.storageService.set('jwt_token', response.token);
    }
    return response;
  }

  async logout() {
    await this.storageService.remove('jwt_token');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storageService.get('jwt_token');
    return !!token; 
  }
}