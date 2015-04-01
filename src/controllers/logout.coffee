angular.module('swAuth')
    .controller 'AuthLogoutCtrl', ($scope, $location, $log, auth, authConfig) ->
        $scope.header = authConfig.getSystemLabel()

        $scope.inProcess = true
        auth.logout().then(
            ->
                $scope.inProcess = false
                $location.path('/')
            (response) ->
                $scope.inProcess = false
                $log.error(response)
                $scope.logoutError = "Logout error"
        )
