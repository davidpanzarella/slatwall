angular.module('slatwalladmin')
.directive('swWorkflowTasks', [
'$log',
'$location',
'$slatwall',
'metadataService',
'workflowPartialsPath',
	function(
	$log,
	$location,
	$slatwall,
	metadataService,
	workflowPartialsPath
	){
		return {
			require:"^form",
			restrict: 'A',
			scope:{
				workflow:"="
			},
			templateUrl:workflowPartialsPath+"workflowtasks.html",
			link: function(scope, element,attrs,formController){
				
				$log.debug('workflow tasks init');	
				
				scope.workflowPartialsPath = workflowPartialsPath;
				
					
				scope.propertiesList = {};
					
				scope.getWorkflowTasks = function(){
					scope.workflowTasks = scope.workflow.$$getWorkflowTasks();
				};
				
				scope.getWorkflowTasks();
				
				scope.addWorkflowTask = function(){
					$log.debug('addWorkflowTasks');
					var newWorkflowTask = $slatwall.newWorkflowTask();
					newWorkflowTask.data.workflow = scope.workflow.data;
					scope.selectWorkflowTask(newWorkflowTask);
					scope.workflowTasks.push(newWorkflowTask);
					$log.debug(scope.workflowTasks);
				};
				
				scope.selectWorkflowTask = function(workflowTask){
					scope.workflowTasks.selectedTask = workflowTask;
					if(angular.isString(workflowTask.data.taskConditionsConfig)){
						workflowTask.data.taskConditionsConfig = angular.fromJson(workflowTask.data.taskConditionsConfig);
					}
					if(workflowTask.$$isPersisted()){
						var workflowTaskActions = workflowTask.$$getWorkflowTaskActions();
						workflowTask.data.workflowTaskActions = workflowTaskActions;
					}else{
						workflowTask.data.workflowTaskActions = [];
						console.log(workflowTask);
					}
				};
				
				scope.removeWorkflowTask = function(workflowTask){
					if(workflowTask === scope.workflowTasks.selectedTask){
						delete scope.workflowTasks.selectedTask;
					}
					scope.workflowTasks.splice(workflowTask.$$index,1);
					for(var i in scope.workflowTasks){
						scope.workflowTasks[i].$$index = i;
					}
				};
			}
		};
	}
]);
	
