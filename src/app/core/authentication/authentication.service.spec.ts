import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { CoreModule } from '@app/core';
import { Credentials } from '@app/core/authentication/authentication.entities';
import { AuthTokenInterceptor } from '@app/core/http/auth-token.interceptor';
import { environment } from '@env/environment';

import { MockAuthenticationService } from './authentication.service.mock';

describe('AuthenticationService', () => {
  let authenticationService: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpClient,
        MockAuthenticationService,
        AuthTokenInterceptor
      ]
    });
  });

  beforeEach(inject([
    MockAuthenticationService,
    HttpTestingController
  ], (_authenticationService: MockAuthenticationService) => {

    authenticationService = _authenticationService;
  }));

  afterEach(() => {
    // Cleanup
    localStorage.removeItem(environment.credentials);
    sessionStorage.removeItem(environment.credentials);
  });

  describe('login', () => {
    it('should return credentials', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(credentials => {
        console.log(credentials);
        expect(credentials).toBeDefined();
        expect(credentials.token).toBeDefined();
      });
    }));

    it('should authenticate user', fakeAsync(() => {
      expect(authenticationService.isAuthenticated()).toBe(true);

      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);
        expect(authenticationService.credentials).toBeDefined();
        expect(authenticationService.credentials).not.toBeNull();
        expect((<Credentials>authenticationService.credentials).token).toBeDefined();
        expect((<Credentials>authenticationService.credentials).token).not.toBeNull();
      });
    }));

    it('should persist credentials for the session', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(sessionStorage.getItem(environment.credentials)).not.toBeNull();
      });
    }));

    it('should persist credentials across sessions', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(localStorage.getItem(environment.credentials)).not.toBeNull();
      });
    }));
  });

  describe('logout', () => {
    it('should clear user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(environment.credentials)).toBeNull();
          expect(localStorage.getItem(environment.credentials)).toBeNull();
        });
      });
    }));

    it('should clear persisted user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(environment.credentials)).toBeNull();
          expect(localStorage.getItem(environment.credentials)).toBeNull();
        });
      });
    }));
  });
});
