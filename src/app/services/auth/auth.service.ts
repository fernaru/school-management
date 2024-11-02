import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { tap } from 'rxjs/operators';

const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin,
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://api.example.com/auth';

  constructor(private http: HttpClient, private router: Router, 
    private oauthService: OAuthService,
    private jwtHelper: JwtHelperService) { 
      this.oauthService.configure(authConfig);
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.oauthService.logOut();
  }

  loginWithGoogle() {
    this.oauthService.initImplicitFlow();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  isLoggedInOut(): boolean {
    return !!localStorage.getItem('token');
  }

  get isLoggedIn() {
    this.isLoggedInOut();
    return this.oauthService.hasValidAccessToken();
  }
}
