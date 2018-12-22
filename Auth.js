class Auth {
  constructor(){
    this.isAuthenticated = false;
    this.route="";
    }

  /**
   * Authenticate a user. Save a token string in the local storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    //localStorage.setItem('token', token);

    this.isAuthenticated = true;
  }

  static setAuthenticateRoute(token) {
    this.route = token;
  }

    static getAuthenticateRoute() {
    //localStorage.setItem('token', token);
    return this.route;
  }
  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    //return localStorage.getItem('token') !== null;
    return this.isAuthenticated;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    //localStorage.removeItem('token');
        this.isAuthenticated = false;

  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */



}

module.exports = Auth;
