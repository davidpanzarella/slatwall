'use strict';
angular.module('slatwalladmin')
.directive('swProductBundleGroups', [
	'$http',
	'$log',
	'productBundlePartialsPath',
	'productBundleService',
	function(
		$http,
		$log,
		productBundlePartialsPath,
		productBundleService
	){
		return {
			restrict: 'A',
			templateUrl:productBundlePartialsPath+"productbundlegroups.html",
			scope:{
				sku:"=",
				productBundleGroups:"=",
				addProductBundleGroup:"&"
			},
			controller: function($scope, $element,$attrs){
				$scope.$id = 'productBundleGroups';
				$log.debug('productBundleGroups');
				$log.debug($scope.productBundleGroups);
				$scope.editing = $scope.editing || true;
				angular.forEach($scope.productBundleGroups,function(obj){
					productBundleService.decorateProductBundleGroup(obj);
					obj.data.$$editing = false;
				});
				
				this.removeProductBundleGroup = function(index){
					$scope.productBundleGroups.splice(index,1);
				};
				$scope.addProductBundleGroup = function(){
					var productBundleGroup = $scope.sku.$$addProductBundleGroup();
					productBundleService.decorateProductBundleGroup(productBundleGroup);
					
					$scope.sku.data.productBundleGroups.selectedProductBundleGroup = productBundleGroup;
				};
				
			}
		};
	}
]);
	
