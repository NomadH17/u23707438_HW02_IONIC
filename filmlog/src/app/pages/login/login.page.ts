import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    try {
      await this.authService.login({ email: this.email, password: this.password });
      this.showToast('Login successful!');
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('Login failed', error);
      this.showToast('Invalid credentials. Please try again.');
    }
  }

  async signup() {
    try {
      await this.authService.register({ email: this.email, password: this.password });
      this.showToast('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Registration failed', error);
      this.showToast('Registration failed. Email might be taken.');
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