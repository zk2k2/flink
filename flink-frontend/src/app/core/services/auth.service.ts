import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStatus().subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  checkStatus(): Observable<boolean> {
    return this.http.post(`${this.authUrl}/check-status`, {}).pipe(
      map(() => {
        this.isLoggedInSubject.next(true);
        return true;
      }),
      catchError(() => {
        this.isLoggedInSubject.next(false);
        return of(false);
      })
    );
  }

  login(credentials: {
    identifier: string;
    password: string;
  }): Observable<boolean> {
    return this.http.post(`${this.authUrl}/login`, credentials).pipe(
      map(() => {
        this.isLoggedInSubject.next(true);
        return true;
      }),
      catchError(() => {
        this.isLoggedInSubject.next(false);
        return of(false);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      map(() => {
        this.isLoggedInSubject.next(false);
        return true;
      }),
      catchError(() => of(false))
    );
  }
}
