angular.module('starter.controllers', [])

.controller('DashCtrl', function(){

})

.controller('ExpenseCtrl', function($scope, expenseFactory, analyticsService, $firebaseArray, $ionicSideMenuDelegate, $ionicModal, $ionicLoading){
	
	//Get all expenses
	$scope.expenses = $firebaseArray(expenseFactory.refExpenses());
	$scope.goals = $firebaseArray(expenseFactory.refGoals());
		
	

	$scope.expenses.$loaded().then(function(){

		$scope.display('today');

		/*
		var d = new Date();
		var lastMid = d.setHours(0,0,0,0);
		var nextMid = d.setHours(24,0,0,0);
		var now = new Date().getTime();
		*/
	});

	
	$scope.goals.$loaded().then(function(){
		$scope.goal = analyticsService.findTodaysGoal($scope.goals);
		$scope.display('today');
	//	$scope.goalChartConfig = analyticsService.getGoalChartData($scope.expenses, $scope.goal);	//Goal chart data
	});
	

	//Update
	$scope.expenses.$watch(function(){
		$scope.sum = analyticsService.findSum($scope.expenses);  //Find sum of expenses
		$scope.topExpense = analyticsService.findTopExpense($scope.expenses)[0];  //Find top expense
		$scope.mostExpensiveAmount = analyticsService.findTopExpense($scope.expenses)[1];	//Find top expense amount
		$scope.mostFrequentExpense = analyticsService.findMostFrequentExpense($scope.expenses)[1];	//Find most frequently bought item
		$scope.sumFrequentExpense = analyticsService.findMostFrequentExpense($scope.expenses)[0];	//Find the total amount spent on most frequent expense
		$scope.mostPopularCategory = analyticsService.findMostPopularCategory($scope.expenses)[1];	//Find most popular category
		$scope.sumPopularCategory = analyticsService.findMostPopularCategory($scope.expenses)[0];	//Find amount spent on most popular category
		$scope.mostActiveTime = analyticsService.findMostActiveTime($scope.expenses)[0];	//Find most active time
		$scope.timeRange = analyticsService.findMostActiveTime($scope.expenses)[1];	//Find most active time-range
		
		$scope.expenseTimeConfig = analyticsService.getExpenseTimeData($scope.expenses);  //Expense by time chart
		$scope.expenseChartConfig = analyticsService.getExpenseChartData($scope.expenses);  //All expense data
		$scope.categoryChartConfig = analyticsService.getCategoryChartData($scope.expenses);  //Category chart data
		$scope.activeTimeChartConfig = analyticsService.findMostActiveTime($scope.expenses)[2];  //Most active time chart
		$scope.frequentExpenseChartConfig =	analyticsService.findMostFrequentExpense($scope.expenses)[2];  //Most frequent expense chart
		$scope.goalChartConfig = analyticsService.getGoalChartData($scope.expenses, $scope.goal);	//Goal chart data
	});
		
	//Display data for certain time period
	$scope.display = function(period){
		var data = [],
			date = new Date(),
			today = date.getTime(),
			lastMid = date.setHours(0,0,0,0);
				
		for(var i = 0; i < $scope.expenses.length; i++){
			var expenseDate = new Date($scope.expenses[i].date).getTime();
			
			if(period === 'today'){							
				if((today - expenseDate)/(1000*60*60) <= (today - lastMid)/(1000*60*60)){
					data.push($scope.expenses[i]);			
					$scope.goal = analyticsService.findTodaysGoal($scope.goals)
				}	 				
			}else if(period === "week"){
				if((today - expenseDate)/(1000*60*60) <= 24*7){
					data.push($scope.expenses[i]);
					$scope.goal = analyticsService.findTodaysGoal($scope.goals)*7
				}
			}else if(period === 'month'){				
				if((today - expenseDate)/(1000*60*60) <= 24*30){
					data.push($scope.expenses[i]);
					$scope.goal = analyticsService.findTodaysGoal($scope.goals)*30
				}
			}else if(period === 'year'){
				if((today - expenseDate)/(1000*60*60) <= 24*365){
					data.push($scope.expenses[i]);
					$scope.goal = analyticsService.findTodaysGoal($scope.goals)*365
				}
			}
		}
		
		$scope.sum = analyticsService.findSum(data);  //Find sum of expenses
		$scope.topExpense = analyticsService.findTopExpense(data)[0];  //Find top expense
		$scope.mostExpensiveAmount = analyticsService.findTopExpense(data)[1];	//Find top expense amount
		$scope.mostFrequentExpense = analyticsService.findMostFrequentExpense(data)[1];	//Find most frequently bought item
		$scope.sumFrequentExpense = analyticsService.findMostFrequentExpense(data)[0];	//Find the total amount spent on most frequent expense
		$scope.mostPopularCategory = analyticsService.findMostPopularCategory(data)[1];	//Find most popular category
		$scope.sumPopularCategory = analyticsService.findMostPopularCategory(data)[0];	//Find amount spent on most popular category
		$scope.mostActiveTime = analyticsService.findMostActiveTime(data)[0];	//Find most active time
		$scope.timeRange = analyticsService.findMostActiveTime(data)[1];	//Find most active time-range
		
		$scope.expenseTimeConfig = analyticsService.getExpenseTimeData(data);  //Expense by time chart
		$scope.expenseChartConfig = analyticsService.getExpenseChartData(data);  //All expense data
		$scope.categoryChartConfig = analyticsService.getCategoryChartData(data);  //Category chart data
		$scope.activeTimeChartConfig = analyticsService.findMostActiveTime(data)[2];  //Most active time chart
		$scope.frequentExpenseChartConfig =	analyticsService.findMostFrequentExpense(data)[2];  //Most frequent expense chart
		$scope.goalChartConfig = analyticsService.getGoalChartData(data, $scope.goal);	//Goal chart data
	};
	
	//Initialize model
	$scope.expense = {
		date: "",
		label: "",
		cost: "",
		category: ""
	};	
	
	$scope.goal = {
		date: "",
		value: ""
	};
	
	//Add Expense
	$scope.addExpense = function(){
		$scope.expenses.$add({
	    	date: Firebase.ServerValue.TIMESTAMP,
	        label: $scope.expense.label,
	        cost: $scope.expense.cost,
			category: $scope.expense.category
	    });
	  	$scope.expense.label = "";
	  	$scope.expense.cost = "";
		$scope.expense.cost = "";
		$scope.modal.hide();
	};
	
	$scope.addGoal = function(){
		$scope.goals.$add({
			date: Firebase.ServerValue.TIMESTAMP,
			value: $scope.goal.value
		});
		$scope.goal.value = "";
	}
	
	//Delete Expense			
	$scope.deleteExpense = function(id){
		$scope.expenses.$remove(id);
	};
	
	//OPTIONS
	//Current date
	$scope.currentDate = new Date();
		
	//Item swiping and side menu functions			
	$scope.listCanSwipe = true;
	$scope.toggleLeft = function(){
		$ionicSideMenuDelegate.toggleLeft();
	};
	$scope.toggleRight = function(){
		$ionicSideMenuDelegate.toggleRight();
	};
		
	//Modal Control
	$scope.openModal = function(){
		$scope.modal.show();
	}
		
	$ionicModal.fromTemplateUrl('modal.html',{
		animation: 'slide-in-up',
	    scope: $scope
	}).then(function(modal){
	    $scope.modal = modal;
	});	
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});