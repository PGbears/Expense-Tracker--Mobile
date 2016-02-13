angular.module('starter.services', [])

.factory('expenseFactory', function() {
	
  // Try your own firebase url
  var ref = new Firebase("FIREBASE_URL"),
  	  refExpenses = new Firebase("FIREBASE_URL/expenses"),
	  refGoals = new Firebase("FIREBASE_URL/goals");
			
  return {
  	  ref: function(){
		  return ref;
  	  },
	  refExpenses: function(){
		  return refExpenses;
	  },
	  refGoals: function(){
		  return refGoals;
	  }
  };
})

.service('analyticsService', function($ionicLoading){

	//Find Sum
	this.findSum = function(expenses){
		var sum = 0;
	 	for(var i = 0; i < expenses.length; i++){
			sum += Number(expenses[i].cost);
		}
		return sum;
	};
	
	//Find top expense and its amount
	this.findTopExpense = function(expenses){
		expenses.sort(function(object1, object2){
			return object2.cost - object1.cost;
		});
		
		var topExpense = expenses[0].label;
		var mostExpensiveAmount = expenses[0].cost;
		return [topExpense, mostExpensiveAmount];
	};
	
	//Find most frequent expense
	this.findMostFrequentExpense = function(expenses){
		var frequency = {};
		var max = 0;
		var result;
		
		for(var i = 0; i < expenses.length; i++){
			frequency[expenses[i].label] = (frequency[expenses[i].label] || 0) + 1;
			if(frequency[expenses[i].label] > max){
				max = frequency[expenses[i].label];
				result = expenses[i].label;
			};
		};
		
		var sumExpense = 0;
		for(var i = 0; i < expenses.length; i++){
			if(expenses[i].label === result){
				sumExpense += Number(expenses[i].cost);
			};
		};
		
		var resultCosts = [];
		var resultDates = [];
		for(var i = 0; i < expenses.length; i++){
			if(expenses[i].label === result){
				resultCosts.push(Number(expenses[i].cost));
				date = new Date(expenses[i].date).getDate().toString();
				resultDates.push(date);
			};
		}
		
		//Frequent Expense Chart
		var frequentExpenseData = {};
		frequentExpenseData = {
	        options: {
	            chart: {
	                type: 'bubble',
					zoomType: 'xy'
	            }
	        },
	        series: [{
				showInLegend: false,
	            data: resultCosts
	        }],
			title: {
				text: null
			},
	        loading: false,
			xAxis: {
				categories: resultDates
			},
			yAxis: {
				title: null
			}
		}
		
		return [sumExpense, result, frequentExpenseData];	
	};
	
	//Find most popular category
	this.findMostPopularCategory = function(expenses){
		var frequency = {};
		var max = 0;
		var result;
		
		for(var i = 0; i < expenses.length; i++){
			frequency[expenses[i].category] = (frequency[expenses[i].category] || 0) + 1;
			if(frequency[expenses[i].category] > max){
				max = frequency[expenses[i].category];
				result = expenses[i].category;
			};
		};
		
		var sumCategory = 0;
		for(var i = 0; i < expenses.length; i++){
			if(expenses[i].category === result){
				sumCategory += Number(expenses[i].cost);
			};
		};
				
		return [sumCategory, result];	
	};
	
	//Find todays goal
	this.findTodaysGoal = function(goals){
		
		var goal = 0;
		var today = new Date();

		
		for(var i = 0; i < goals.length; i++){
			if(goals[i].date == today){
				goal = Number(goals[i].value);
			}else{
				goal = 20;
			}
		}
		
		
		return goal;
	};
	
	//Goal Chart
	this.getGoalChartData = function(expenses, goal){
		
		var sum = 0;	
		for(var i = 0; i < expenses.length; i++){
			sum += Number(expenses[i].cost);
		};

		var metric = sum/goal;
		var grade = 'A';
		if(metric < 0.15){
			grade = 'A';
		}else if(metric >= 0.15 && metric < 0.2){
			grade = 'A-';
		}else if(metric >= 0.2 && metric < 0.25){
			grade = 'B+'
		}else if(metric >= 0.25 && metric < 0.3){
			grade = 'B'
		}else if(metric >= 0.3 && metric < 0.35){
			grade = 'B-'
		}else if(metric >= 0.35 && metric < 0.45){
			grade = 'C+'
		}else if(metric >= 0.45 && metric < 0.5){
			grade = 'C'
		}else if(metric >= 0.5 && metric < 0.6){
			grade = 'C-'
		}else if(metric >= 0.6 && metric < 0.7){
			grade = 'D+'
		}else if(metric >= 0.7 && metric <0.8){
			grade = 'D'
		}else{
			grade = 'F'
		}
		
		if(sum > goal){
			sum = goal;
		}
		
		var goalChartData = {};
		goalChartData = {
	        options: {
	            chart: {
	                type: 'pie'
	            }
	        },
	        series: [{
				showInLegend: false,
                dataLabels: {
                    enabled: false
                },
				style: {
					color: 'blue'
				},
				innerSize: '80%',
	            data: [{
					y: sum,
					color: "rgba(0,0,255,0.7)"
				}, {
					y: goal-sum,
					color: "rgba(160,160,160,0.5)"
				}]
	        }],
			title: {
				text: '<span style="font-family: georgia;font-size:40px"></span>',
			    align: 'center',
			    verticalAlign: 'middle',
			    y: 12
			},
	        loading: false
		}		
				
		goalChartData.title.text = '<span style="font-family: georgia;font-size:40px">' + grade + '</span>';
		
		return goalChartData;
	};
	
	//Most active time & time-range
	this.findMostActiveTime = function(expenses){
		var mostActiveTimeChart = {};
		var timeExpenseData = [];
		
		var morningRange = [];
		var afternoonRange = [];
		var eveningRange = [];
		
		var morningSum = 0;
		var afternoonSum = 0;
		var eveningSum = 0;
		
		for(var i = 0; i < expenses.length; i++){
			var newDate = new Date(expenses[i].date);
			var hours = newDate.getHours();
			
			if(hours >= 0 && hours < 12){
				morningSum += Number(expenses[i].cost);
				morningRange.push(expenses[i]);
			}else if(hours >= 12 && hours < 18){
				afternoonSum += Number(expenses[i].cost);
				afternoonRange.push(expenses[i]);
			}else if(hours >= 18 && hours <= 23){
				eveningSum += Number(expenses[i].cost);
				eveningRange.push(expenses[i]);
			}
		};
		
		timeExpenseData.push(
			{
				value: morningSum,
				label: "Morning"
			},
			{
				value: afternoonSum,
				label: "Afternoon"
			},
			{
				value: eveningSum,
				label: "Evening"
			}
		);
		
		function compare(a, b){
			if(a.value < b.value)
				return -1;
			if(a.value > b.value)
				return 1;
			return 0;
		}
		
		timeExpenseData.sort(compare);
		var mostActiveTime = timeExpenseData[2].label;
		
		if(mostActiveTime === "Morning"){
			morningRange.sort(compare);
			var timeRange = new Date(morningRange[morningRange.length - 1].date).getHours();
		}else if(mostActiveTime === "Afternoon"){
			afternoonRange.sort(compare);
			var timeRange = new Date(afternoonRange[afternoonRange.length - 1].date).getHours();
			if(timeRange > 12 && timeRange < 24){
				timeRange = timeRange - 12;
			};
		}else if(mostActiveTime === "Evening"){
			eveningRange.sort(compare);
			var timeRange = new Date(eveningRange[eveningRange.length - 1].date).getHours();
			if(timeRange > 12 && timeRange < 24){
				timeRange = timeRange - 12;
			};
		}
		
		mostActiveTimeChart = {
	        options: {
	            chart: {
	                type: 'pie'
	            }
	        },
	        series: [{
				showInLegend: true,
                dataLabels: {
                    enabled: false
                },
				innerSize: '60%',
	            data: [['Morning', morningSum], ['Afternoon', afternoonSum], ['Evening', eveningSum]]
	        }],
			title: {
				text: null
			},
	        loading: false
		}
		
		return [mostActiveTime, timeRange, mostActiveTimeChart];
	};
	
	//Expense vs. Time Data
	this.getExpenseTimeData = function(expenses){
		var expenseTimeData = {};
		var costs = [];
		var dates = [];
		
		//Sort dates
		expenses.sort(function(a, b){
			if(a.date < b.date)
				return -1;
			if(a.date > b.date)
				return 1;
			return 0;
		});
		
		for(var i = 0; i < expenses.length; i++){
			var date = new Date(expenses[i].date).getDate();
			costs.push(Number(expenses[i].cost));
			dates.push(date);
		};
				
		expenseTimeData = {
	        options: {
	            chart: {
	                type: 'line'
	            }
	        },
	        series: [{
				showInLegend: false,
	            data: costs
	        }],
			title: {
				text: null
			},
	        loading: false,
			xAxis: {
				categories: dates
			},
			yAxis: {
				title: null
			}
		}
				
		return expenseTimeData;
	};
	
	//All Expense Data
	this.getExpenseChartData = function(expenses){
		var expenseChartData = {};
		var costs = [];
		
		for(var i = 0; i < expenses.length; i++){
			costs.push([expenses[i].label, Number(expenses[i].cost)]);
		}
		
		expenseChartData = {
	        options: {
	            chart: {
	                type: 'pie'
	            }
	        },
	        series: [{
				name: 'Costs',
				showInLegend: false,
                dataLabels: {
                    enabled: false
                },
				innerSize: '60%',
	            data: costs
	        }],
			title: {
				text: null
			},
	        loading: false
		}
		
		return expenseChartData;
	};
	
	//Category Chart Data
	this.getCategoryChartData = function(expenses){
		var categoryChartData = {};
		
		var gasSum = 0;
		var groceriesSum = 0;
		var shoppingSum = 0;
		var takeoutSum = 0;
		
		for(var i = 0; i < expenses.length; i++){
			if(expenses[i].category === "Gas"){
				gasSum += Number(expenses[i].cost);
			}else if(expenses[i].category === "Groceries"){
				groceriesSum += Number(expenses[i].cost);
			}else if(expenses[i].category === "Shopping"){
				shoppingSum += Number(expenses[i].cost);
			}else if(expenses[i].category === "Take-Out"){
				takeoutSum += Number(expenses[i].cost);
			}
		};
		
		categoryChartData = {
	        options: {
	            chart: {
	                type: 'pie'
	            }
	        },
	        series: [{
				showInLegend: true,
                dataLabels: {
                    enabled: false
                },
				innerSize: '60%',
	            data: [['Gas', gasSum], ['Groceries', groceriesSum], ['Shopping', shoppingSum], ['Take-out', takeoutSum]]
	        }],
			title: {
				text: null
			},
	        loading: false
		}
				
		return categoryChartData;
	};
			
});
