import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { LoginContext, Credentials } from '@app/core/authentication/authentication.entities';

export class MockAuthenticationService {

  private _credentials: Credentials | null = {
    username: 'toto',
    token: '123'
  };

  login(context: LoginContext): Observable<Credentials> {
    const data = {
      username: context.username,
      token: 'anytoken'
    };
    this.setCredentials(data, context.remember);
    return of({
      username: context.username,
      token: 'anytoken'
    });
  }

  logout(): Observable<boolean> {
    this.setCredentials();
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }


  get credentials(): Credentials | null {
    return this._credentials;
  }

  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(environment.credentials, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(environment.credentials);
      localStorage.removeItem(environment.credentials);
    }
  }

}
