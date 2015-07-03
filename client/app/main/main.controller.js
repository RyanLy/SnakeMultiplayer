'use strict';

angular.module('snakemultiplayerApp')
  .controller('MainCtrl', function ($scope, $http, socket, socketFactory) {

    var mySnakeBoard = new SNAKE.Board(  {
                        boardContainer: "game-area",
                        fullScreen: false,
                        numPlayers: 3,
                        height:800,
                        width:800
                        });   
    console.log(mySnakeBoard);

    console.log(socket.socket);
    socket.socket.emit("newUser");

    $scope.players = [];


    mySnakeBoard.onPaused = function(argument){
        $http.post('/api/things', { active : argument });
    }

    mySnakeBoard.onStart = function(argument){
      $http.post('/api/things', { gameStart : true });
    }

    mySnakeBoard.onMove = function(argument){
      $http.post('/api/things', { gameMove : true });
    }

    socket.socket.on('clientid', function(data){
      console.log(data);
      $scope.clientid = data;

    });

    socket.socket.on('onUser', function(data){
      console.log(data);
      $scope.players = [];
      for (var i = 0; i < data.numClients; i++){
        $scope.players.push({});
      }
    });
  

    $scope.awesomeThings = [];


      socket.syncUpdates('thing', $scope.awesomeThings, function(event, item, object){
        console.log("Changed");
        console.log(item);
        console.log(object);
        if ('active' in item && mySnakeBoard.getPaused() != item.active){
          console.log("SetPaused");
          mySnakeBoard.setPausedClient(item.active);
        }
        else if ('gameStart' in item && mySnakeBoard.getBoardState() == 0){
          console.log("gameStart");
          mySnakeBoard.loadGameClient();
        }
        else if ('gameMove' in item && mySnakeBoard.getBoardState() == 1){
          console.log("gameMove");
          mySnakeBoard.startMoving();
        }
        
      });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });


 


  });
