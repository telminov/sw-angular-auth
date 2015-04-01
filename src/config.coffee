angular.module('swAuth')
    .provider 'authConfig', ->
        config = {
            systemLabel: 'System Label'
            serverAddress: '/server_url'
            serverLoginUrl: '/api/auth/login/'
            serverLogoutUrl: '/api/auth/logout/'
            serverUserInfoUrl: '/api/auth/current_user/'
            serverCSRFUrl: '/api/auth/get_csrf/'
            appLoginUrl: '/login/'
            freeUrls: []
        }

        return {
            $get: ->
                {
                    getSystemLabel: -> config.systemLabel
                    getServerAddress: -> config.serverAddress
                    getServerLoginUrl: -> config.serverAddress + config.serverLoginUrl
                    getServerLogoutUrl: -> config.serverAddress + config.serverLogoutUrl
                    getServerUserInfoUrl: -> config.serverAddress + config.serverUserInfoUrl
                    getServerCSRFUrl: -> config.serverAddress + config.serverCSRFUrl
                    getAppLoginUrl: -> config.appLoginUrl
                    getFreeUrls: -> config.freeUrls
                }

            setSystemLabel: (label) ->
                config.systemLabel = label

            setServerAddress: (address) ->
                config.serverAddress = address

            setServerLoginUrl: (url) ->
                config.serverLoginUrl = url

            setServerLogoutUrl: (url) ->
                config.serverLogoutUrl = url

            setServerUserInfoUrl: (url) ->
                config.serverUserInfoUrl = url

            setServerCSRFUrl: (url) ->
                config.serverCSRFUrl = url

            setAppLoginUrl: (url) ->
                config.appLoginUrl = url

            setFreeUrls: (freeUrls) ->
                config.freeUrls = freeUrls
        }