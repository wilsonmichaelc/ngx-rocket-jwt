import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials, LoginContext } from '@app/core/authentication/authentication.entities';
import { environment } from '@env/environment';
import { Observable, Observer, of } from 'rxjs';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;

  constructor(private httpClient: HttpClient) {
    const savedCredentials =
      sessionStorage.getItem(environment.credentials)
      || localStorage.getItem(environment.credentials);

    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {

    /*
      Remove this once you have an auth server up and running ... ;)
    */
    if (environment.useDummyAuth) {
      return Observable.create((observer: Observer<any>) => {
          const data = {
            username: context.username,
            token: 'anytoken'
          };
          this.setCredentials(data, context.remember);
          observer.next(data);
          observer.complete();
      });
    }
    // ***************************************************

    return Observable.create((observer: Observer<any>) => {
      return this.httpClient.disableApiPrefix().disableAuthToken().post(environment.authUrl,
        {user: context.username, password: context.password}).subscribe((response: any) => {
          const data = {
            username: context.username,
            token: response.apiGatewaySessionId
          };
          this.setCredentials(data, context.remember);
          observer.next(data);
          observer.complete();
      });
    });
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
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
