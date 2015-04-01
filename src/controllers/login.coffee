angular.module('swAuth')
    .controller 'AuthLoginCtrl', ($scope, $location, auth, authConfig) ->
        $scope.header = authConfig.getSystemLabel()

        success = ->
            $location.path('/')

        fail = (response) ->
            errorMsg =  response.data.responseStatus?.message or response.data
            $scope.loginError = errorMsg

        $scope.logIn = ->
            loginPromise = auth.login(
                $scope.login,
                $scope.password,
            )

            loginPromise.then success, fail