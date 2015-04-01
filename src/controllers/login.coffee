angular.module('swAuth')
    .controller 'AuthLoginCtrl', ($scope, $location, auth, authConfig) ->
        $scope.header = authConfig.getSystemLabel()

        success = ->
            $location.path('/')

        fail = (response) ->
            $scope.loginErrors = response.data?.errors or ['Ошибка аутентификации']

        $scope.logIn = ->
            $scope.loginErrors = undefined

            loginPromise = auth.login(
                $scope.login,
                $scope.password,
            )

            loginPromise.then success, fail