angular.module('swAuth')
    .service 'auth', ($http, $rootScope, $cookieStore, $location, authConfig, AUTH_UPDATE_USER) ->
        auth = this

        auth.getUser = ->
            return $cookieStore.get('user')

        auth.setUser = (newUserData) ->
            oldUserData = auth.getUser()
            $cookieStore.put('user', newUserData)
            $rootScope.$broadcast AUTH_UPDATE_USER, newUserData, oldUserData

        auth.isAuthenticated = (userData)->
            user = userData or auth.getUser()
            return user?.is_authenticated or false

        auth.getName = (userData) ->
            user = userData or auth.getUser()
            return user?.username

        auth.getLoginUrl = ->
            return authConfig.getAppLoginUrl()


        auth.login = (username, password) ->
            loginUrl = authConfig.getServerLoginUrl()

            loginPromise = $http(
                method: "POST"
                url: loginUrl
                data: $.param({
                    username: username
                    password: password
                })
                withCredentials: true
            )

            # after login go to user info method
            loginPromise = loginPromise.then ->
                return auth.getCurrentUser()

            return loginPromise


        auth.getCurrentUser = ->
            userPromise = $http(
                method: "GET"
                url: authConfig.getServerUserInfoUrl()
                withCredentials: true
            )

            # add save user info method call
            userPromise = userPromise.then (response) ->
                newUserData = response.data
                auth.setUser(newUserData)
                return newUserData

            return userPromise


        auth.clearCurrentUser = ->
            newUserData = {}
            auth.setUser(newUserData)

        auth.logout = ->
            logoutPromise = $http(
                    method: "POST"
                    url: authConfig.getServerLogoutUrl()
                    withCredentials: true
                )

            logoutPromise.then ->
                auth.clearCurrentUser()

            return logoutPromise

        auth.isLoginPage = ->
            return $location.path() == authConfig.getAppLoginUrl()

        return