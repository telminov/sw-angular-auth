angular.module('swAuth')
    .provider 'authConfigProvider', ->
        config = {
            systemLabel: 'System Label'
            serverAddress: '/server_url'
            serverLoginUrl: '/login/'
            serverLogoutUrl: '/logout/'
            serverUserInfoUrl: '/current_user/'
            appLoginUrl: '/login/'
        }

        return {
            $get: ->
                {
                    getSystemLabel: -> config.systemLabel
                    getServerAddress: -> config.serverAddress
                    getServerLoginUrl: -> config.serverLoginUrl
                    getServerLogoutUrl: -> config.serverLogoutUrl
                    getServerUserInfoUrl: -> config.serverUserInfoUrl
                    getAppLoginUrl: -> config.appLoginUrl
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

            setAppLoginUrl: (url) ->
                config.appLoginUrl = url
        }