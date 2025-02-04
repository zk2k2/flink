import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    return this.http.post(`${this.authUrl}/check-status`, {}).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): Observable<boolean> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
