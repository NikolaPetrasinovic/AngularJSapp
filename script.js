var app = angular.module("Demo", ["ui.router"])
                 .config(function($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider){
                    $urlRouterProvider.otherwise("/home");
                    $urlMatcherFactoryProvider.caseInsensitive(true);                   
                    $stateProvider
                        .state("home", {
                            url: "/home",
                            templateUrl:"./templates/home.html",
                            controller:"homeController as homeCtrl",
                            data: {
                                customData1: "Home State Custom Data 1",
                                customData2: "Home State Custom Data 2"
                            }
                        })
                        .state("courses", {
                            url: "/courses",
                            templateUrl:"./templates/courses.html",
                            controller:"coursesController as coursesCtrl",
                            data: {
                                customData1: "Courses State Custom Data 1",
                                customData2: "Courses State Custom Data 2"
                            }
                        })
                        .state("studentParent", {
                            url: "/students",
                            controller: "studentParentController",
                            controllerAs: "stdParentCtrl",
                            templateUrl: "templates/studentParent.html",
                            resolve: {
                                studentTotals: function ($http) {
                                    return $http.get("http://localhost:3000/Students")
                                            .then(function (response) {
                                                return response.data;
                                            })
                                }
                            },
                            abstract: true
                        })
                        .state("studentParent.students", {
                            url:"/",
                            views: {
                                "studentData" : {
                                    templateUrl:"./templates/students.html",
                                    controller:"studentsController",
                                    controllerAs: "studentsCtrl",
                                    studentslist: function ($http) {
                                        return $http.get("http://localhost:3000/Students")
                                                .then(function (response) {
                                                    return response.data;
                                                })
                                    }
                                }, 
                                "totalData" : {
                                    templateUrl: "templates/studentsTotal.html",
                                    controller: "studentsTotalController",
                                    controllerAs: "studentsTotalCtrl",
                                
                                }
                                    
                            }
                        })
                        .state("studentParent.studentDetails", {
                            url: "/:id",
                            views :{
                                "studentData": {
                                    templateUrl:"./templates/studentDetails.html",
                                    controller:"studentDetailsController",
                                    controllerAs: "studentDetailsCtrl",
                                }
                            }
                        })
                        .state("studentsSearch", {
                            url: "/studentsSearch/:name",
                          templateUrl:"./templates/studentsSearch.html",
                           controller:"studentsSearchController as studentsSearchCtrl" 
                      })
                      .state("studentsSearchAll", {
                        url: "/studentsSearch/All",
                        templateUrl:"./templates/studentsSearchAll.html",
                        controller:"studentSearchControllerAll",
                        controllerAs: "studentSearchCtrlAll",
                    })
                    $locationProvider.html5Mode(true);
                 })
                 .controller("homeController", function($state){
                    this.message = "Home Page";
                    this.homeCustomData1 = $state.current.data.customData1;
                    this.homeCustomData2 = $state.current.data.customData2;

                    this.coursesCustomData1 = $state.get("courses").data.customData1;
                    this.coursesCustomData2 = $state.get("courses").data.customData2;

                 })
                 .controller("studentsController", function($http, $state, $location, $scope, studentTotals){
                    var vm = this;
                    vm.searchStudent = function(){
                        if(vm.name){
                            $state.go("studentsSearch", {name: vm.name})}
                        else{
                            $state.go("studentsSearchAll")
                        }
                    }
                    $scope.$on("$locationChangeStart", function (event, next, current) {
                        if(!confirm("are you sure you want to navigate away from this page to" + next)){
                            event.preventDefault();
                        }
                    });
                    this.message = "Students Page";
                    
                    vm.reloadData = function () {
                        $state.reload();
                    }
                    $http.get('http://localhost:3000/Students')
                         .then(function (response){
                            vm.students = response.data;
                         })
                         vm.studentTotals = studentTotals;
                 })
                 .controller("coursesController", function($http){
                    this.message = ["C#", "SQL", "PHP", "C++"];
                    var vm = this;
                    $http.get('http://localhost:3000/courses')
                         .then(function (response){
                            vm.courses = response.data
                         })
                 })
                 .controller("studentDetailsController", function($http, $stateParams){
                    var vm = this;
                    
                    $http({
                        url:"http://localhost:3000/Students",
                        params:{id:$stateParams.id},
                        method:"get"
                    })
                    .then(function(response){
                        
                        vm.student = response.data[0]
                        console.log(response)
                    })
                 })
                 
                 .controller("studentsSearchController", function($http, $stateParams){
                    var vm = this;
                    
                    if($stateParams.name)
                    {
                        $http({
                            url:"http://localhost:3000/Students?name_like=" +$stateParams.name,
                            method:"get"
                        })
                        .then(function(response){
                            
                            vm.students = response.data
                        })
                    }
                    else{
                        $http.get('http://localhost:3000/Students')
                         .then(function (response){
                            vm.students = response.data;
                         })
                    }
                    
                 })
                 .controller("studentSearchControllerAll", function($http, $stateParams){
                    var vm = this;
                    if(!$stateParams.name)
                        $http({
                            url:"http://localhost:3000/Students",
                            //params:{name:$stateParams.name},
                            method:"get"
                            })
                            .then(function(response){
                                vm.students = response.data
                                console.log($stateParams)
                            })
                 })
                .controller('studentParentController', function($http) {
                        var vm = this;
                        vm.femaleCount = 0;
                        vm.maleCount = 0;
                        vm.totalCount = 0;
                        $http.get('http://localhost:3000/Students')
                        .then(function(response){
                            vm.students = response.data;
                            angular.forEach(vm.students, function(student){
                                if(student.gender === "Female"){
                                    vm.femaleCount++;
                                }
                                else if(student.gender === "Male"){
                                    vm.maleCount++;
                                }
                                // vm.totalCount++;
                            })
                        })
                      })
                      .controller("studentsTotalController", function ($http) {
                        var vm = this;
                        vm.totalCount = 0;
                        $http.get('http://localhost:3000/Students')
                        .then(function(response){
                            vm.students = response.data;
                            angular.forEach(vm.students, function(){
                                vm.totalCount++;
                            })
                        })
                    })
                   
