var sampleCiruclarProgress = angular.module('scp', ['ui.router', 'ngAnimate']);

sampleCiruclarProgress.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "template/home.html",
            controller: "home"
        })
        .state("userDetail", {
            url: "/userDetail",
            templateUrl: "template/userDetail.html",
            controller: "userDetail"
        })
        


    $urlRouterProvider.otherwise('/');

});



sampleCiruclarProgress.controller("home", function($scope, providerService, $state, $timeout){

    console.log("Home controller begins");

    $scope.user = {
        name: "",
        score: "",
        startDate: "",
        endDate: ""
    };

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    $scope.todayDate = yyyy + "-" + mm + '-' + dd;

    $scope.onlyNumbers = /^\d+$/;

    $scope.saveActivity = function(){
        console.log($scope.user);
        $scope.loading = true;
        $scope.errorMsg = "";
        
        $timeout(function() {

            if($scope.user.name != "" && $scope.user.score != "" && $scope.user.startDate != "" && $scope.user.endDate != ""){

                var userScore = parseInt($scope.user.score);
                var startDate = new Date($scope.user.startDate);
                var endDate = new Date($scope.user.endDate);
                if((userScore >= 0) && (userScore <=100)){
                if(startDate <= endDate){
                    providerService.setUserData($scope.user);
                    console.log(providerService.getUserData());
                    $state.go('userDetail');
                }else{
                    console.log("Date is incorrect");
                    $scope.errorMsg = " End date should after the Start date";
                }
            }else{
                $scope.errorMsg = " Percentage should be 0 to 100";
            }
            }else{
                $scope.errorMsg = " Please fill the all fields";
            }
            $scope.loading = false;
        }, 1500);
    };

    

});

sampleCiruclarProgress.controller("userDetail", function($scope, providerService){

    $scope.userDetails = providerService.getUserData();

    function SetBarsAsUndefined()
            {
                    var bar = document.getElementById("bar-2");
                    bar.setUndeterminated(1);
                    SetBarsAsDefined();
            }
            function SetBarsAsDefined()
            {
                    var bar = document.getElementById("bar-2");
                    bar.setUndeterminated(0);
                UpdateBars();
                
            }
            
            function UpdateBars()
            {
                var bar = document.getElementById("bar-2");
                bar.progress++;
                if(document.getElementById("bar-2").progress < parseInt($scope.userDetails.score))
                {
                    setTimeout(UpdateBars, 10);
                }
            }

           if($scope.userDetails != undefined) {
                SetBarsAsUndefined();
           }else{
                $scope.userDetails = providerService.getUserData();
                SetBarsAsUndefined();
           }
});

sampleCiruclarProgress.factory("providerService", function(){
    var userData = {};

    return{
            setUserData : function(data){
                userData = data;
            },
            getUserData : function(){
                return userData;
            }
        }
});

sampleCiruclarProgress.directive('numericOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = inputValue ? inputValue.replace(/[^\d.-]/g,'') : null;

                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});