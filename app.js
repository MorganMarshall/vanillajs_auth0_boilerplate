// app.js

window.addEventListener('load', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'marshallapi.auth0.com',
    clientID: 'MPMl84Ym5D81r9veb1S8eN1eGAQBfLh2',
    responseType: 'token id_token',
    audience: 'https://marshallapi.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: "http://127.0.0.1:3000"
  });
  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
   e.preventDefault();
   webAuth.authorize();
 });

  var loginStatus = document.querySelector('.container h4');
    var loginView = document.getElementById('login-view');
    var homeView = document.getElementById('home-view');

    // buttons and event listeners
    var homeViewBtn = document.getElementById('btn-home-view');
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');

    homeViewBtn.addEventListener('click', function() {
      homeView.style.display = 'inline-block';
      loginView.style.display = 'none';
    });

    logoutBtn.addEventListener('click', logout);

    function handleAuthentication() {
      webAuth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setSession(authResult);
          loginBtn.style.display = 'none';
          homeView.style.display = 'inline-block';
        } else if (err) {
          homeView.style.display = 'inline-block';
          console.log(err);
          alert(
            'Error: ' + err.error + '. Check the console for further details.'
          );
        }
        displayButtons();
      });
    }

    function setSession(authResult) {
      // Set the time that the Access Token will expire at
      var expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      displayButtons();
    }

    function isAuthenticated() {
      // Check whether the current time is past the
      // Access Token's expiry time
      var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    function displayButtons() {
      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loginStatus.innerHTML = 'logged in';
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        loginStatus.innerHTML =
          'You are not logged in! Please log in to continue.';
      }
    }



  handleAuthentication();
});
