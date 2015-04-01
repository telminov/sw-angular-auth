(function() {
  angular.module('swAuth', ['ngCookies', 'ngRoute']).constant('AUTH_UPDATE_USER', 'sw_auth_service_update_user').constant('AUTH_SERVER_REJECT', 'sw_auth_service_server_401_or_403_reject').config(function($httpProvider) {
    return $httpProvider.interceptors.push('authInterceptor');
  }).factory('authInterceptor', function($location, $q, $rootScope, AUTH_SERVER_REJECT) {
    return {
      responseError: function(response) {
        if ((response != null ? response.status : void 0) === 401 || (response != null ? response.status : void 0) === 403) {
          $rootScope.$broadcast(AUTH_SERVER_REJECT, response.status, response.data);
        }
        return $q.reject(response);
      }
    };
  }).run(function($rootScope, $location, auth, AUTH_UPDATE_USER, AUTH_SERVER_REJECT) {
    $rootScope.$on('$routeChangeStart', function(scope, next, current) {
      var loginUrl, nextPath, ref;
      nextPath = '';
      if (next != null ? (ref = next.$$route) != null ? ref.originalPath : void 0 : void 0) {
        nextPath = next.$$route.originalPath;
      }
      if (!auth.isAuthenticated()) {
        loginUrl = auth.getLoginUrl();
        if (loginUrl === nextPath) {
          return;
        }
        return $location.path(loginUrl);
      }
    });
    return $rootScope.$on(AUTH_SERVER_REJECT, function(event, server_status) {
      auth.clearCurrentUser();
      return $location.path(auth.getLoginUrl());
    });
  });

}).call(this);

(function() {
  angular.module('swAuth').provider('authConfig', function() {
    var config;
    config = {
      systemLabel: 'System Label',
      serverAddress: '/server_url',
      serverLoginUrl: '/api/auth/login/',
      serverLogoutUrl: '/api/auth/logout/',
      serverUserInfoUrl: '/api/auth/current_user/',
      serverCSRFUrl: '/api/auth/get_csrf/',
      appLoginUrl: '/login/'
    };
    return {
      $get: function() {
        return {
          getSystemLabel: function() {
            return config.systemLabel;
          },
          getServerAddress: function() {
            return config.serverAddress;
          },
          getServerLoginUrl: function() {
            return config.serverAddress + config.serverLoginUrl;
          },
          getServerLogoutUrl: function() {
            return config.serverAddress + config.serverLogoutUrl;
          },
          getServerUserInfoUrl: function() {
            return config.serverAddress + config.serverUserInfoUrl;
          },
          getServerCSRFUrl: function() {
            return config.serverAddress + config.serverCSRFUrl;
          },
          getAppLoginUrl: function() {
            return config.appLoginUrl;
          }
        };
      },
      setSystemLabel: function(label) {
        return config.systemLabel = label;
      },
      setServerAddress: function(address) {
        return config.serverAddress = address;
      },
      setServerLoginUrl: function(url) {
        return config.serverLoginUrl = url;
      },
      setServerLogoutUrl: function(url) {
        return config.serverLogoutUrl = url;
      },
      setServerUserInfoUrl: function(url) {
        return config.serverUserInfoUrl = url;
      },
      setServerCSRFUrl: function(url) {
        return config.serverCSRFUrl = url;
      },
      setAppLoginUrl: function(url) {
        return config.appLoginUrl = url;
      }
    };
  });

}).call(this);

(function() {
  angular.module('swAuth').service('auth', function($http, $rootScope, $cookieStore, authConfig, AUTH_UPDATE_USER) {
    var auth;
    auth = this;
    auth.getUser = function() {
      return $cookieStore.get('user');
    };
    auth.setUser = function(newUserData) {
      var oldUserData;
      oldUserData = auth.getUser();
      $cookieStore.put('user', newUserData);
      return $rootScope.$broadcast(AUTH_UPDATE_USER, newUserData, oldUserData);
    };
    auth.isAuthenticated = function(userData) {
      var user;
      user = userData || auth.getUser();
      return (user != null ? user.is_authenticated : void 0) || false;
    };
    auth.getName = function(userData) {
      var user;
      user = userData || auth.getUser();
      return user != null ? user.username : void 0;
    };
    auth.getLoginUrl = function() {
      return authConfig.getAppLoginUrl();
    };
    auth.login = function(username, password) {
      var loginPromise, loginUrl;
      loginUrl = authConfig.getServerLoginUrl();
      loginPromise = $http({
        method: "POST",
        url: loginUrl,
        data: $.param({
          username: username,
          password: password
        }),
        withCredentials: true
      });
      loginPromise = loginPromise.then(function() {
        return auth.getCurrentUser();
      });
      return loginPromise;
    };
    auth.getCurrentUser = function() {
      var userPromise;
      userPromise = $http({
        method: "GET",
        url: authConfig.getServerUserInfoUrl(),
        withCredentials: true
      });
      userPromise = userPromise.then(function(response) {
        var newUserData;
        newUserData = response.data;
        auth.setUser(newUserData);
        return newUserData;
      });
      return userPromise;
    };
    auth.clearCurrentUser = function() {
      var newUserData;
      newUserData = {};
      return auth.setUser(newUserData);
    };
    auth.logout = function() {
      var logoutPromise;
      logoutPromise = $http({
        method: "POST",
        url: authConfig.getServerLogoutUrl(),
        withCredentials: true
      });
      logoutPromise.then(function() {
        return auth.clearCurrentUser();
      });
      return logoutPromise;
    };
  });

}).call(this);

(function() {
  angular.module('swAuth').controller('AuthLoginCtrl', function($scope, $location, auth, authConfig) {
    var fail, success;
    $scope.header = authConfig.getSystemLabel();
    success = function() {
      return $location.path('/');
    };
    fail = function(response) {
      return $scope.loginErrors = response.data.errors;
    };
    return $scope.logIn = function() {
      var loginPromise;
      loginPromise = auth.login($scope.login, $scope.password);
      return loginPromise.then(success, fail);
    };
  });

}).call(this);

(function() {
  angular.module('swAuth').controller('AuthLogoutCtrl', function($scope, $location, auth, authConfig) {
    $scope.header = authConfig.getSystemLabel();
    return auth.logout().then(function() {
      return $location.path('/');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJjb25maWcuY29mZmVlIiwic2VydmljZXMuY29mZmVlIiwiY29udHJvbGxlcnMvbG9naW4uY29mZmVlIiwiY29udHJvbGxlcnMvbG9nb3V0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLEVBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxRQUFmLEVBQXlCLENBQ3JCLFdBRHFCLEVBRXJCLFNBRnFCLENBQXpCLENBS0ksQ0FBQyxRQUxMLENBS2Msa0JBTGQsRUFLa0MsNkJBTGxDLENBTUksQ0FBQyxRQU5MLENBTWMsb0JBTmQsRUFNb0MsMENBTnBDLENBUUksQ0FBQyxNQVJMLENBUVksU0FBQyxhQUFELEdBQUE7V0FDSixhQUFhLENBQUMsWUFBWSxDQUFDLElBQTNCLENBQWdDLGlCQUFoQyxFQURJO0VBQUEsQ0FSWixDQVlJLENBQUMsT0FaTCxDQVlhLGlCQVpiLEVBWWdDLFNBQUMsU0FBRCxFQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEIsa0JBQTVCLEdBQUE7QUFDeEIsV0FBTztBQUFBLE1BQ0gsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ1gsUUFBQSx3QkFBRyxRQUFRLENBQUUsZ0JBQVYsS0FBb0IsR0FBcEIsd0JBQTJCLFFBQVEsQ0FBRSxnQkFBVixLQUFvQixHQUFsRDtBQUNJLFVBQUEsVUFBVSxDQUFDLFVBQVgsQ0FBc0Isa0JBQXRCLEVBQTBDLFFBQVEsQ0FBQyxNQUFuRCxFQUEyRCxRQUFRLENBQUMsSUFBcEUsQ0FBQSxDQURKO1NBQUE7QUFFQSxlQUFPLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixDQUFQLENBSFc7TUFBQSxDQURaO0tBQVAsQ0FEd0I7RUFBQSxDQVpoQyxDQXNCSSxDQUFDLEdBdEJMLENBc0JTLFNBQUMsVUFBRCxFQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsZ0JBQTlCLEVBQWdELGtCQUFoRCxHQUFBO0FBRUQsSUFBQSxVQUFVLENBQUMsR0FBWCxDQUFlLG1CQUFm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SDBCO0VBQUEsQ0FEbEMsQ0FBQSxDQUFBO0FBQUEiLCJmaWxlIjoic3ctYW5ndWxhci1hdXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3N3QXV0aCcsIFtcbiAgICAnbmdDb29raWVzJ1xuICAgICduZ1JvdXRlJ1xuXSlcblxuICAgIC5jb25zdGFudCgnQVVUSF9VUERBVEVfVVNFUicsICdzd19hdXRoX3NlcnZpY2VfdXBkYXRlX3VzZXInKVxuICAgIC5jb25zdGFudCgnQVVUSF9TRVJWRVJfUkVKRUNUJywgJ3N3X2F1dGhfc2VydmljZV9zZXJ2ZXJfNDAxX29yXzQwM19yZWplY3QnKVxuXG4gICAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJylcblxuICAgICMgYnJvYWRjYXN0IG9mIDQwMSBvciA0MDMgaHR0cCBzdGF0dXNcbiAgICAuZmFjdG9yeSAnYXV0aEludGVyY2VwdG9yJywgKCRsb2NhdGlvbiwgJHEsICRyb290U2NvcGUsIEFVVEhfU0VSVkVSX1JFSkVDVCkgLT5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IChyZXNwb25zZSkgLT5cbiAgICAgICAgICAgICAgICBpZiByZXNwb25zZT8uc3RhdHVzID09IDQwMSBvciByZXNwb25zZT8uc3RhdHVzID09IDQwM1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QgQVVUSF9TRVJWRVJfUkVKRUNULCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKVxuXG4gICAgICAgIH1cblxuXG4gICAgLnJ1biAoJHJvb3RTY29wZSwgJGxvY2F0aW9uLCBhdXRoLCBBVVRIX1VQREFURV9VU0VSLCBBVVRIX1NFUlZFUl9SRUpFQ1QpIC0+XG4gICAgICAgICMgc3Vic2NyaWJlIG9uIHVybCBjaGFuZ2luZ1xuICAgICAgICAkcm9vdFNjb3BlLiRvbiAnJHJvdXRlQ2hhbmdlU3RhcnQnLCAoc2NvcGUsIG5leHQsIGN1cnJlbnQpIC0+XG4gICAgICAgICAgICAjIHNhdmUgb3JpZ2luIHBhdGhcbiAgICAgICAgICAgIG5leHRQYXRoID0gJydcbiAgICAgICAgICAgIGlmIG5leHQ/LiQkcm91dGU/Lm9yaWdpbmFsUGF0aFxuICAgICAgICAgICAgICAgIG5leHRQYXRoID0gbmV4dC4kJHJvdXRlLm9yaWdpbmFsUGF0aFxuXG4gICAgICAgICAgICAjIHJlZGlyZWN0IG5vdCBhdXRob3JpemVkIHVzZXIgdG8gbG9naW4gcGFnZVxuICAgICAgICAgICAgaWYgbm90IGF1dGguaXNBdXRoZW50aWNhdGVkKClcbiAgICAgICAgICAgICAgICBsb2dpblVybCA9IGF1dGguZ2V0TG9naW5VcmwoKVxuXG4gICAgICAgICAgICAgICAgIyBza2lwIHJlZGlyZWN0aW9uIGlmIHdlIGFyZSBnb2luZyB0byBsb2dpbiBwYWdlXG4gICAgICAgICAgICAgICAgaWYgbG9naW5VcmwgPT0gbmV4dFBhdGhcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChsb2dpblVybClcblxuICAgICAgICAjIHN1YnNjcmliZSBzZXJ2ZXIgcmVqZWN0aW5nXG4gICAgICAgICRyb290U2NvcGUuJG9uIEFVVEhfU0VSVkVSX1JFSkVDVCwgKGV2ZW50LCBzZXJ2ZXJfc3RhdHVzKSAtPlxuICAgICAgICAgICAgYXV0aC5jbGVhckN1cnJlbnRVc2VyKClcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKGF1dGguZ2V0TG9naW5VcmwoKSkiLCJhbmd1bGFyLm1vZHVsZSgnc3dBdXRoJylcclxuICAgIC5wcm92aWRlciAnYXV0aENvbmZpZycsIC0+XHJcbiAgICAgICAgY29uZmlnID0ge1xyXG4gICAgICAgICAgICBzeXN0ZW1MYWJlbDogJ1N5c3RlbSBMYWJlbCdcclxuICAgICAgICAgICAgc2VydmVyQWRkcmVzczogJy9zZXJ2ZXJfdXJsJ1xyXG4gICAgICAgICAgICBzZXJ2ZXJMb2dpblVybDogJy9hcGkvYXV0aC9sb2dpbi8nXHJcbiAgICAgICAgICAgIHNlcnZlckxvZ291dFVybDogJy9hcGkvYXV0aC9sb2dvdXQvJ1xyXG4gICAgICAgICAgICBzZXJ2ZXJVc2VySW5mb1VybDogJy9hcGkvYXV0aC9jdXJyZW50X3VzZXIvJ1xyXG4gICAgICAgICAgICBzZXJ2ZXJDU1JGVXJsOiAnL2FwaS9hdXRoL2dldF9jc3JmLydcclxuICAgICAgICAgICAgYXBwTG9naW5Vcmw6ICcvbG9naW4vJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgJGdldDogLT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRTeXN0ZW1MYWJlbDogLT4gY29uZmlnLnN5c3RlbUxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2VydmVyQWRkcmVzczogLT4gY29uZmlnLnNlcnZlckFkZHJlc3NcclxuICAgICAgICAgICAgICAgICAgICBnZXRTZXJ2ZXJMb2dpblVybDogLT4gY29uZmlnLnNlcnZlckFkZHJlc3MgKyBjb25maWcuc2VydmVyTG9naW5VcmxcclxuICAgICAgICAgICAgICAgICAgICBnZXRTZXJ2ZXJMb2dvdXRVcmw6IC0+IGNvbmZpZy5zZXJ2ZXJBZGRyZXNzICsgY29uZmlnLnNlcnZlckxvZ291dFVybFxyXG4gICAgICAgICAgICAgICAgICAgIGdldFNlcnZlclVzZXJJbmZvVXJsOiAtPiBjb25maWcuc2VydmVyQWRkcmVzcyArIGNvbmZpZy5zZXJ2ZXJVc2VySW5mb1VybFxyXG4gICAgICAgICAgICAgICAgICAgIGdldFNlcnZlckNTUkZVcmw6IC0+IGNvbmZpZy5zZXJ2ZXJBZGRyZXNzICsgY29uZmlnLnNlcnZlckNTUkZVcmxcclxuICAgICAgICAgICAgICAgICAgICBnZXRBcHBMb2dpblVybDogLT4gY29uZmlnLmFwcExvZ2luVXJsXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZXRTeXN0ZW1MYWJlbDogKGxhYmVsKSAtPlxyXG4gICAgICAgICAgICAgICAgY29uZmlnLnN5c3RlbUxhYmVsID0gbGFiZWxcclxuXHJcbiAgICAgICAgICAgIHNldFNlcnZlckFkZHJlc3M6IChhZGRyZXNzKSAtPlxyXG4gICAgICAgICAgICAgICAgY29uZmlnLnNlcnZlckFkZHJlc3MgPSBhZGRyZXNzXHJcblxyXG4gICAgICAgICAgICBzZXRTZXJ2ZXJMb2dpblVybDogKHVybCkgLT5cclxuICAgICAgICAgICAgICAgIGNvbmZpZy5zZXJ2ZXJMb2dpblVybCA9IHVybFxyXG5cclxuICAgICAgICAgICAgc2V0U2VydmVyTG9nb3V0VXJsOiAodXJsKSAtPlxyXG4gICAgICAgICAgICAgICAgY29uZmlnLnNlcnZlckxvZ291dFVybCA9IHVybFxyXG5cclxuICAgICAgICAgICAgc2V0U2VydmVyVXNlckluZm9Vcmw6ICh1cmwpIC0+XHJcbiAgICAgICAgICAgICAgICBjb25maWcuc2VydmVyVXNlckluZm9VcmwgPSB1cmxcclxuXHJcbiAgICAgICAgICAgIHNldFNlcnZlckNTUkZVcmw6ICh1cmwpIC0+XHJcbiAgICAgICAgICAgICAgICBjb25maWcuc2VydmVyQ1NSRlVybCA9IHVybFxyXG5cclxuICAgICAgICAgICAgc2V0QXBwTG9naW5Vcmw6ICh1cmwpIC0+XHJcbiAgICAgICAgICAgICAgICBjb25maWcuYXBwTG9naW5VcmwgPSB1cmxcclxuICAgICAgICB9IiwiYW5ndWxhci5tb2R1bGUoJ3N3QXV0aCcpXG4gICAgLnNlcnZpY2UgJ2F1dGgnLCAoJGh0dHAsICRyb290U2NvcGUsICRjb29raWVTdG9yZSwgYXV0aENvbmZpZywgQVVUSF9VUERBVEVfVVNFUikgLT5cbiAgICAgICAgYXV0aCA9IHRoaXNcblxuICAgICAgICBhdXRoLmdldFVzZXIgPSAtPlxuICAgICAgICAgICAgcmV0dXJuICRjb29raWVTdG9yZS5nZXQoJ3VzZXInKVxuXG4gICAgICAgIGF1dGguc2V0VXNlciA9IChuZXdVc2VyRGF0YSkgLT5cbiAgICAgICAgICAgIG9sZFVzZXJEYXRhID0gYXV0aC5nZXRVc2VyKClcbiAgICAgICAgICAgICRjb29raWVTdG9yZS5wdXQoJ3VzZXInLCBuZXdVc2VyRGF0YSlcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCBBVVRIX1VQREFURV9VU0VSLCBuZXdVc2VyRGF0YSwgb2xkVXNlckRhdGFcblxuICAgICAgICBhdXRoLmlzQXV0aGVudGljYXRlZCA9ICh1c2VyRGF0YSktPlxuICAgICAgICAgICAgdXNlciA9IHVzZXJEYXRhIG9yIGF1dGguZ2V0VXNlcigpXG4gICAgICAgICAgICByZXR1cm4gdXNlcj8uaXNfYXV0aGVudGljYXRlZCBvciBmYWxzZVxuXG4gICAgICAgIGF1dGguZ2V0TmFtZSA9ICh1c2VyRGF0YSkgLT5cbiAgICAgICAgICAgIHVzZXIgPSB1c2VyRGF0YSBvciBhdXRoLmdldFVzZXIoKVxuICAgICAgICAgICAgcmV0dXJuIHVzZXI/LnVzZXJuYW1lXG5cbiAgICAgICAgYXV0aC5nZXRMb2dpblVybCA9IC0+XG4gICAgICAgICAgICByZXR1cm4gYXV0aENvbmZpZy5nZXRBcHBMb2dpblVybCgpXG5cblxuICAgICAgICBhdXRoLmxvZ2luID0gKHVzZXJuYW1lLCBwYXNzd29yZCkgLT5cbiAgICAgICAgICAgIGxvZ2luVXJsID0gYXV0aENvbmZpZy5nZXRTZXJ2ZXJMb2dpblVybCgpXG5cbiAgICAgICAgICAgIGxvZ2luUHJvbWlzZSA9ICRodHRwKFxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCJcbiAgICAgICAgICAgICAgICB1cmw6IGxvZ2luVXJsXG4gICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAjIGFmdGVyIGxvZ2luIGdvIHRvIHVzZXIgaW5mbyBtZXRob2RcbiAgICAgICAgICAgIGxvZ2luUHJvbWlzZSA9IGxvZ2luUHJvbWlzZS50aGVuIC0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF1dGguZ2V0Q3VycmVudFVzZXIoKVxuXG4gICAgICAgICAgICByZXR1cm4gbG9naW5Qcm9taXNlXG5cblxuICAgICAgICBhdXRoLmdldEN1cnJlbnRVc2VyID0gLT5cbiAgICAgICAgICAgIHVzZXJQcm9taXNlID0gJGh0dHAoXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXG4gICAgICAgICAgICAgICAgdXJsOiBhdXRoQ29uZmlnLmdldFNlcnZlclVzZXJJbmZvVXJsKClcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgIyBhZGQgc2F2ZSB1c2VyIGluZm8gbWV0aG9kIGNhbGxcbiAgICAgICAgICAgIHVzZXJQcm9taXNlID0gdXNlclByb21pc2UudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgICAgICAgICAgbmV3VXNlckRhdGEgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICAgICAgYXV0aC5zZXRVc2VyKG5ld1VzZXJEYXRhKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdVc2VyRGF0YVxuXG4gICAgICAgICAgICByZXR1cm4gdXNlclByb21pc2VcblxuXG4gICAgICAgIGF1dGguY2xlYXJDdXJyZW50VXNlciA9IC0+XG4gICAgICAgICAgICBuZXdVc2VyRGF0YSA9IHt9XG4gICAgICAgICAgICBhdXRoLnNldFVzZXIobmV3VXNlckRhdGEpXG5cbiAgICAgICAgYXV0aC5sb2dvdXQgPSAtPlxuICAgICAgICAgICAgbG9nb3V0UHJvbWlzZSA9ICRodHRwKFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiXG4gICAgICAgICAgICAgICAgICAgIHVybDogYXV0aENvbmZpZy5nZXRTZXJ2ZXJMb2dvdXRVcmwoKVxuICAgICAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGxvZ291dFByb21pc2UudGhlbiAtPlxuICAgICAgICAgICAgICAgIGF1dGguY2xlYXJDdXJyZW50VXNlcigpXG5cbiAgICAgICAgICAgIHJldHVybiBsb2dvdXRQcm9taXNlXG5cbiAgICAgICAgcmV0dXJuIiwiYW5ndWxhci5tb2R1bGUoJ3N3QXV0aCcpXG4gICAgLmNvbnRyb2xsZXIgJ0F1dGhMb2dpbkN0cmwnLCAoJHNjb3BlLCAkbG9jYXRpb24sIGF1dGgsIGF1dGhDb25maWcpIC0+XG4gICAgICAgICRzY29wZS5oZWFkZXIgPSBhdXRoQ29uZmlnLmdldFN5c3RlbUxhYmVsKClcblxuICAgICAgICBzdWNjZXNzID0gLT5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJylcblxuICAgICAgICBmYWlsID0gKHJlc3BvbnNlKSAtPlxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRXJyb3JzID0gcmVzcG9uc2UuZGF0YS5lcnJvcnNcblxuICAgICAgICAkc2NvcGUubG9nSW4gPSAtPlxuICAgICAgICAgICAgbG9naW5Qcm9taXNlID0gYXV0aC5sb2dpbihcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9naW4sXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBhc3N3b3JkLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBsb2dpblByb21pc2UudGhlbiBzdWNjZXNzLCBmYWlsIiwiYW5ndWxhci5tb2R1bGUoJ3N3QXV0aCcpXG4gICAgLmNvbnRyb2xsZXIgJ0F1dGhMb2dvdXRDdHJsJywgKCRzY29wZSwgJGxvY2F0aW9uLCBhdXRoLCBhdXRoQ29uZmlnKSAtPlxuICAgICAgICAkc2NvcGUuaGVhZGVyID0gYXV0aENvbmZpZy5nZXRTeXN0ZW1MYWJlbCgpXG5cbiAgICAgICAgYXV0aC5sb2dvdXQoKS50aGVuIC0+XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=