angular.module('swAuth', [
    'ngCookies'
    'ngRoute'
])

    .constant('AUTH_UPDATE_USER', 'sw_auth_service_update_user')
    .constant('AUTH_SERVER_REJECT', 'sw_auth_service_server_401_or_403_reject')

    .config ($httpProvider) ->
        $httpProvider.interceptors.push('authInterceptor')

    # broadcast of 401 or 403 http status
    .factory 'authInterceptor', ($location, $q, $rootScope, AUTH_SERVER_REJECT) ->
        return {
            responseError: (response) ->
                if response?.status == 401 or response?.status == 403
                    $rootScope.$broadcast AUTH_SERVER_REJECT, response.status, response.data
                return $q.reject(response)

        }


    .run ($rootScope, $location, auth, authConfig, AUTH_UPDATE_USER, AUTH_SERVER_REJECT) ->
        # subscribe on url changing
        $rootScope.$on '$routeChangeStart', (scope, next, current) ->
            # save origin path
            nextPath = ''
            if next?.$$route?.originalPath
                nextPath = next.$$route.originalPath

            # redirect not authorized user to login page
            if not auth.isAuthenticated() and nextPath not in authConfig.getFreeUrls()
                loginUrl = auth.getLoginUrl()

                # skip redirection if we are going to login page
                if loginUrl == nextPath
                    return

                $location.path(loginUrl)

        # subscribe server rejecting
        $rootScope.$on AUTH_SERVER_REJECT, (event, server_status) ->
            auth.clearCurrentUser()
            $location.path(auth.getLoginUrl())