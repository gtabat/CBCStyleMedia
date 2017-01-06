var app = angular.module('App', ['ngCordova','ui.router']);
var titles = {
    main: "CBC Radio",
    programs: "خلكم وينا",
    program: "برامجنا",
    news: "آخر الأخبار",
    contact: "برامجنا",
    categories: "Categories",
    shows: "Shows"
};
app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $httpParamSerializerProvider) {

    $stateProvider
    .state('main', {
        url: '/newses/:cat',
        controller: 'MainController',
        templateUrl: 'views/news.html'
    })
    .state('categories', {
        url: '/categories',
        controller: 'CatsController',
        templateUrl: 'views/categories.html',
        bclass: "categories"
    })
    .state('contact', {
        url: '/contact',
        controller: 'ContactController',
        templateUrl: 'views/contact.html',
        bclass: "contact"
    })
    .state('news', {
        url: '/news/{id:int}',
        controller: 'NewsController',
        templateUrl: 'views/news-full.html',
        bclass: 'news'
    })
    .state('shows', {
        url: '/shows',
        controller: 'ShowsController',
        templateUrl: 'views/shows.html',
        bclass: 'shows'
    })
    .state('show-list', {
        url: '/show-list/{id:int}',
        controller: 'ShowListController',
        templateUrl: 'views/show-item-list.html',
        bclass: 'show-list'
    })
    .state('livevideo', {
        url: '/livevideo',
        controller: 'VideoController',
        templateUrl: 'views/livevideo.html',
        bclass: 'news'
    })
    .state('settings', {
        url: '/settings',
        controller: 'SettingsController',
        templateUrl: 'views/settings.html',
        bclass: 'settings'
    });

    $urlRouterProvider.otherwise('/newses/0');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.transformRequest = function(data) {
        return $httpParamSerializerProvider.$get()(data);
    };


    $(function(){

        $(".button-collapse").sideNav({
            closeOnClick: true,
            menuWidth: 250
        });
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        $('.collapsible').collapsible();

        $(".play-pause").click(function(e){
            e.preventDefault();
            e.stopPropagation();
        });

        // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();

    });

});

app.run(function($cordovaStatusbar) {
    document.addEventListener("deviceready", function() {
        $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusbar.style(2);
        $cordovaStatusbar.styleHex("#003462");
    }, false);


    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

app.controller("MainController", function($scope, $stateParams, $http, $state, $api) {

    $scope.$parent.isLoading = true;

    var url = parseInt($stateParams.cat) ? "/news/cat" : "/news/all";

    $api.get(url, {
        'page':1,
        'length':10,
        'id': $stateParams.cat
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.news = data.result;
        }
    });


    $scope.open = function(id) {
        $state.go("news",{id:id});
    };

});

app.controller("CatsController", function ($scope, $api, $state) {
    $api.get("/news/categories", {}, function(data) {
        if(data.success) {
            $scope.categories = data.result;
        }
    });

    $scope.open = function(id) {
        $state.go("main", {cat:id})
    }
});

app.controller('programsController', function ($scope,$state,$api) {

    $scope.$parent.isLoading = true;
    $api.get('/programs/all', {
        'page':1,
        'length':10
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.programs = data.result;
        }
    });

    $scope.open = function(id) {
        $state.go("program",{id:id});
    };

});

app.controller('ContactController', function ($scope,$state,$api) {

    $scope.submit = function() {
       $api.get("/contact", {
           name: $scope.name,
           email: $scope.email,
           message: $scope.text
       }, function(data) {
            if(data.success) {
                document.querySelector(".response").textContent = "Sent successfully";
            } else {
                document.querySelector(".response").textContent = "Error sending message";
            }
       }, function() {
           document.querySelector(".response").textContent = "Error sending message";
       });
    }
});

app.controller('programController', function($scope, $stateParams, $timeout, $api) {

    $scope.program = {
        title: "...",
        post_whole: "...",
        broadcast: "..."
    };


    $scope.$parent.isLoading = true;
    $api.get('/programs', {
        'id':$stateParams.id
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.program = data.result;
        }
    });

});

app.controller('NewsController', function($scope, $stateParams, $timeout, $api) {

    $scope.news = {};

    $scope.$parent.isLoading = true;
    $api.get('/news', {
        'id':$stateParams.id
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.news = data.result;
        }
    });

});


app.controller('ShowListController', function($scope, $stateParams, $timeout, $api) {

    $scope.show = {};

    $scope.$parent.isLoading = true;
    $api.get('/show/get', {
        id: $stateParams.id
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.show = data.result.show;
        }
    });

    $scope.play = function(url) {
        url = "http://35.165.142.89"+url;
        $scope.$parent.$player.loadAudio(url);
        $('#modal1').modal('open');
    }

});
app.controller('ShowsController', function($scope, $state, $stateParams, $timeout, $api) {

    $scope.shows = {};

    $scope.$parent.isLoading = true;
    $api.get('/show/all', {
        page: 1,
        length: 10
    }, function(data) {
        if(data.success) {
            $scope.$parent.isLoading = false;
            $scope.shows = data.result;
        }
    });

    $scope.open = function(id) {
        $state.go("show-list", {id:id});
    }

});

app.controller('BodyController', function($scope, $interval, $api) {
    var self = this;

    self.qualityPaths = {
        "HQ": "/live",
        "LQ": "/livelq"
    };

    $scope.$vars = {
        pageTitle: "",
        live: true,
        timeStr: "00:00:00",
        pageClass: "",
        streamVolumeState: "enabled",
        streamState: "playing",
        isAudioLoading: true
    };

    var getCurrentProgramInterval;

    function runCurrentProgramInterval() {
        var getCurrentProgram;
        getCurrentProgramInterval = $interval(getCurrentProgram = function () {
            $api.get("/programs/current", {}, function (data) {
                if (data.success)
                    $scope.currentProgram = data.result.title;
            });
        }, 10000);
        getCurrentProgram();
    }


    var audio = document.querySelector('audio');

    {
        /* Setting Audio Event Listeners */

        audio.addEventListener("ended", function () {
            $scope.$vars.isAudioLoading = true;
            $scope.$vars.streamState = "paused";
            $scope.$apply();
            audio.load();
        });

        audio.addEventListener("error", function () {
            $scope.$vars.isAudioLoading = true;
            $scope.$vars.streamState = "paused";
            $scope.$apply();
            audio.load();
        });

        audio.addEventListener("play", function () {
            $scope.$vars.isAudioLoading = false;
            $scope.$vars.streamState = "playing";
            $scope.$apply();
        });
        audio.addEventListener("pause", function () {
            $scope.$vars.streamState = "paused";
            $scope.$apply();
        });

        audio.addEventListener("timeupdate", function (e) {
            $scope.$vars.timeStr = toHHMMSS(e.target.currentTime);
            $scope.$apply();
        });
    }

    $scope.isLoading = true;

    $scope.$on('$stateChangeStart', function(){
        $scope.isLoading = true;
    });

    $scope.$on('$stateChangeSuccess', function(event, toState/*, toParams, fromState, fromParams*/){
        if (angular.isDefined(toState.bclass)) {
            $scope.$vars.pageClass = toState.bclass;
        } else {
            $scope.$vars.pageClass = "";
        }

        $scope.isLoading = false;

        if(angular.isDefined(titles[toState.name])) {
            $scope.$vars.pageTitle = titles[toState.name];
        }
    });




    $scope.$player = {
        loadAudio: function(url) {
            $scope.$vars.live = false;
            $scope.streamSrc = url;

            $interval.cancel(getCurrentProgramInterval);

        },
        loadLiveStream: function() {
            $scope.$vars.live = true;
            setStreamSrc();
            runCurrentProgramInterval();
        },

        playPause: function() {
            if(audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        },
        pause: function() {
            if(!audio.paused) {
                audio.pause();
            }
        },
        playPrev: function() {
            if($scope.$vars.live) return;
            // previous
        },
        playNext: function() {
            if($scope.$vars.live) return;
            // next
        },
        back: function(time) {
            if($scope.$vars.live) return;
            if(audio.currentTime - time >= 0) {
                audio.currentTime -= time;
            }

            // back {time} seconds
        },
        next: function(time) {
            if($scope.$vars.live) return;

            if(audio.currentTime + time <= audio.duration) {
                audio.currentTime += time;
            }
            // next {time} seconds
        },
        switchVolume: function() {
            audio.muted = !audio.muted;
            $scope.$vars.streamVolumeState = audio.muted ? "disabled" : "enabled";
        }
    };


    $scope.$player.loadLiveStream();

    function setStreamSrc() {
        $scope.streamQuality = getQuality();
        $scope.streamSrc = "http://35.165.142.89:8000"+getQualityPath();
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    function toHHMMSS(time) {
        var sec_num = parseInt(time, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    function getQuality() {
        var q = localStorage.getItem("quality");
        if(q==null) {
            q = "HQ";
            localStorage.setItem("quality", q);
        }
        return q;
    }

    function getQualityPath() {
        return self.qualityPaths[getQuality()];
    }

    $scope.saveQuality = function(quality) {
        localStorage.setItem("quality", quality);
        setStreamSrc();
    };


});

app.controller("VideoController", function($scope) {
    $scope.infoText = "Loading Video...";

    $scope.videoSrc = "live_stream?channel=UC_3Yu0IUFzFI1wv5iqr-VjQ&enablejsapi=1&widgetid=1&origin=*#";

    var player = new YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: "live_stream?channel=UC_3Yu0IUFzFI1wv5iqr-VjQ&enablejsapi=1&widgetid=1&origin=*&showinfo=0&controls=0&autoplay=1#",
        autoplay: 1
    });

});

app.controller("SettingsController", function($scope) {
    $scope.mdl = {
        quality: "1"
    };

    $scope.changeQuality = function($event) {
        $scope.$parent.saveQuality($event.target.checked ? "HQ" : "LQ");
    }

});

app.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);
