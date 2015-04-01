describe 'App module logic', ->
    describe 'authInterceptor', ->
        auth = $httpBackend = $rootScope = AUTH_SERVER_REJECT = null

        beforeEach module 'swAuth'
        beforeEach inject ($injector) ->
            auth = $injector.get('auth')
            authConfig = $injector.get('authConfig')
            AUTH_SERVER_REJECT = $injector.get('AUTH_SERVER_REJECT')
            $httpBackend = $injector.get('$httpBackend')
            $rootScope = $injector.get('$rootScope')

        afterEach ->
            $httpBackend.verifyNoOutstandingExpectation()
            $httpBackend.verifyNoOutstandingRequest()

        it 'should broadcast AUTH_SERVER_REJECT status on 401 and 403 status', ->
            spyOn($rootScope, '$broadcast').andCallThrough()

            for server_status in [401, 403]
                $httpBackend.expectGET(authConfig.getServerUserInfoUrl()).respond(server_status, '')

                auth.getCurrentUser()
                $httpBackend.flush()

                expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_SERVER_REJECT, server_status, '')()