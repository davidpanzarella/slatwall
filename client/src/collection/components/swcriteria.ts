/// <reference path='../../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

class SWCriteria{
	public static Factory(){
		var directive = (
			$log,
			$hibachi,
			$filter,
			collectionPartialsPath,
			collectionService,
			metadataService,
			pathBuilderConfig
		) => new SWCriteria(
			$log,
			$hibachi,
			$filter,
			collectionPartialsPath,
			collectionService,
			metadataService,
			pathBuilderConfig
		);
		directive.$inject = [
			'$log',
			'$hibachi',
			'$filter',
			'collectionPartialsPath',
			'collectionService',
			'metadataService',
			'pathBuilderConfig'
		];
		return directive;
	}
	constructor(
		$log,
		$hibachi,
		$filter,
		collectionPartialsPath,
		collectionService,
		metadataService,
		pathBuilderConfig
	){
		return {
			restrict: 'E',
			scope:{
				filterItem:"=",
		        selectedFilterProperty:"=",
		        filterPropertiesList:"=",
		        selectedFilterPropertyChanged:"&",
		        comparisonType:"=",
                collectionConfig: "="
			},
			templateUrl:pathBuilderConfig.buildPartialsPath(collectionPartialsPath)+'criteria.html',
			link: function(scope, element, attrs){
			}
		};
	}
}
export{
	SWCriteria
}


