angular.module('swAuth')
    .controller 'AuthLogoutCtrl', ($scope, $location, auth, authConfig) ->
        $scope.header = authConfig.getSystemLabel()

        auth.logout().then ->
            $location.path('/')
