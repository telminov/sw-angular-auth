# sw-angular-auth
## Installing
Install via bower
```
bower install sw-angular-auth angular-cookies --save
```

Add at index.html
```
<script src="bower_components/angular-cookies/angular-cookies.min.js"></script>
<script src="bower_components/sw-angular-auth/sw-angular-auth.min.js"></script>
```

Add to application
```
angular.module('myApp', [
    ...
    'swAuth'
    ...
])
```

Add config constant
```
angular.module('myApp')
    .constant('config', {
        serverAddress: 'http://127.0.0.1:8000',
    })
```

Add controllers in route
```
angular.module('myApp').config ($routeProvider) ->
    $routeProvider
    .when('/login/',
        templateUrl: 'controllers/login.html'
        controller: 'AuthLoginCtrl'
        label: 'Login'
    )
    .when('/logout/',
        templateUrl: 'controllers/logout.html'
        controller: 'AuthLogoutCtrl'
        label: 'Logout'
```

Add config on start app
```
angular.module('myApp').config (authConfigProvider, config) ->
    authConfigProvider.setSystemLabel('parkKeeper')
    authConfigProvider.setServerAddress(config.serverAddress)
    authConfigProvider.setFreeUrls([])
```

Add login.html like
```
<div class="header">
    <h3 class="text-muted">{{ header }}</h3>
</div>

<div>
    <alert ng-repeat="error in loginErrors" type="danger" close="closeAlert($index)">
        {{ error }}
    </alert>

    <h1>Login</h1>
    <form class="form-horizontal authentication" ng-submit="logIn()">
        <div class="form-group">
            <label for="inputLogin" class="col-lg-2 control-label">Name</label>
            <div class="col-lg-8">
                <input type="text" class="form-control" id="inputLogin" placeholder="user name"
                       ng-model="login" autofocus="autofocus" required>
            </div>
        </div>
        <div class="form-group">
            <label for="inputPassword" class="col-lg-2 control-label">Password</label>
            <div class="col-lg-8">
                <input type="password" class="form-control" id="inputPassword"
                       placeholder="password" ng-model="password" required>
            </div>
        </div>
        <div class="form-group">
            <div class="col-lg-offset-2 col-lg-8">
                <button type="submit" class="btn btn-default">Login</button>
            </div>
        </div>
    </form>
</div>
```

and logout.html
```
<div class="header">
    <h3 class="text-muted">{{ header }}</h3>
</div>

<alert type="danger" ng-show="logoutError">{{ logoutError }}</alert>

<h1>Logout</h1>
<p ng-if="inProcess">
    Exiting...
</p>
```
