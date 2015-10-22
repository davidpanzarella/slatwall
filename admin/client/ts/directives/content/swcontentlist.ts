/// <reference path='../../../../../client/typings/slatwallTypescript.d.ts' />
/// <reference path='../../../../../client/typings/tsd.d.ts' />


module slatwalladmin {
    'use strict';
    
    export class SWContentListController{
        public static $inject = [
            '$scope',
            '$log',
            '$timeout',
            '$slatwall',
            'paginationService',
            'observerService',
            'collectionConfigService'
        ];
        constructor(
            private $scope:ng.IScope,
            private $log:ng.ILogService,
            private $timeout:ng.ITimeoutService,
            private $slatwall:ngSlatwall.$Slatwall,
            private paginationService:slatwalladmin.PaginationService,
            private observerService:slatwalladmin.ObserverService,
            private collectionConfigService:slatwalladmin.CollectionService
        ){
               this.$log.debug('slatwallcontentList init');
               console.log(this);
	           var pageShow = 50;
               if(this.pageShow !== 'Auto'){
                   pageShow = this.pageShow;
               }
               
               this.pageShowOptions = [
                   {display:10,value:10},
                   {display:20,value:20},
                   {display:50,value:50},
                   {display:250,value:250}
               ];
               
               this.loadingCollection = false;
               
               this.selectedSite;
               this.orderBy;
               var orderByConfig;
               
	        	this.getCollection = (isSearching)=>{
                   this.collectionConfig = collectionConfigService.newCollectionConfig('Content');
                   
                   
                   var columnsConfig = [
                       //{"propertyIdentifier":"_content_childContents","title":"","isVisible":true,"isDeletable":true,"isSearchable":true,"isExportable":true,"ormtype":"string","aggregate":{"aggregateFunction":"COUNT","aggregateAlias":"childContentsCount"}},
                       {
                           propertyIdentifier:'_content.contentID',
                           isVisible:false,
                           ormtype:'id',
                           isSearchable:true
                       },
                       {
                               propertyIdentifier: '_content.urlTitlePath',
                               isVisible: false,
                               isSearchable: true
                       },
                       //need to get template via settings
                       {
                           propertyIdentifier:'_content.allowPurchaseFlag',
                           isVisible:true,
                           ormtype:'boolean',
                           isSearchable:false
                       }, 
                       {
                           propertyIdentifier:'_content.productListingPageFlag',
                           isVisible:true,
                           ormtype:'boolean',
                           isSearchable:false
                       },
                       {
                           propertyIdentifier:'_content.activeFlag',
                           isVisible:true,
                           ormtype:'boolean',
                           isSearchable:false
                       }
                   ];
                   
                   
                   
	        		var options = {
                       currentPage:'1', 
                       pageShow:'1', 
                       keywords:this.keywords
                   };
                   var column = {};
                   if(!isSearching || this.keywords === ''){
                        var filterGroupsConfig =[
                           {
                             "filterGroup": [
                               {
                                 "propertyIdentifier": "parentContent",
                                 "comparisonOperator": "is",
                                 "value": 'null'
                               }
                             ]
                           }
                         ];
                        column = {
                           propertyIdentifier:'_content.title',
                           isVisible:true,
                           ormtype:'string',
                           isSearchable:true,
                           tdclass:'primary'
                       };
                       columnsConfig.unshift(column);
                   }else{
                       var filterGroupsConfig =[
                           {
                             "filterGroup": [
                               {
                                 "propertyIdentifier": "excludeFromSearch",
                                 "comparisonOperator": "!=",
                                 "value": true
                               }
                             ]
                           }
                         ];
                      column = {
                           propertyIdentifier:'_content.title',
                           isVisible:false,
                           ormtype:'string',
                           isSearchable:true
                       };
                       columnsConfig.unshift(column);

                       var titlePathColumn = {
                           propertyIdentifier:'_content.titlePath',
                           isVisible:true,
                           ormtype:'string',
                           isSearchable:false
                       };  
                       columnsConfig.unshift(titlePathColumn);
                   }
                   //if we have a selected Site add the filter
                   if(angular.isDefined(this.selectedSite)){
                       var selectedSiteFilter = {
                           logicalOperator:"AND",
                           propertyIdentifier:"site.siteID",
                           comparisonOperator:"=",
                           value:this.selectedSite.siteID
                       };
                       filterGroupsConfig[0].filterGroup.push(selectedSiteFilter);
                   }
                   
                   if(angular.isDefined(this.orderBy)){
                       var orderByConfig = [];
                       orderByConfig.push(this.orderBy);    
                       options.orderByConfig = angular.toJson(orderByConfig);
                   }
                   
                   
                   options.filterGroupsConfig = angular.toJson(filterGroupsConfig);
                   options.columnsConfig = angular.toJson(columnsConfig);
                   
	        		
                   
                //    var json = {
                //        columns:columnsConfig,
                //        filterGroups:filterGroupsConfig,
                //        baseEntityName:'Content',
                //        baseEntityAlias:'_content'    
                //    };
                //    this.collectionConfig.loadJson(angular.toJson(json));
                   angular.forEach(columnsConfig,(column)=>{
                       this.collectionConfig.addColumn(column.propertyIdentifier,column.title,column);
                   });
                   this.collectionConfig.addDisplayAggregate('childContents','COUNT','childContentsCount',{isVisible:false,isSearchable:false,title:'test'});
                   this.collectionConfig.addDisplayProperty(
                       'site.siteID',
                       undefined,
                       {
                           isVisible:false,
                           ormtype:'id',
                           isSearchable:false
                        }
                   );
                   this.collectionConfig.addDisplayProperty(
                       'site.domainNames',
                       undefined,
                       {
                            isVisible: false,
                            isSearchable: true
                       }
                   );
                   
                   angular.forEach(filterGroupsConfig[0].filterGroup,(filter)=>{
                       
                       this.collectionConfig.addFilter(filter.propertyIdentifier,filter.value,filter.comparisonOperator,filter.logicalOperator);
                   });
                   
                   this.collectionListingPromise = this.collectionConfig.getEntity();
	        		this.collectionListingPromise.then((value)=>{
                       angular.forEach(value.pageRecords, (node)=>{
                           node.site_domainNames = node.site_domainNames.split(",")[0];
                       });
	        			this.collection = value;
	        			//this.collectionConfig = angular.fromJson(this.collection.collectionConfig);
	        			//this.collectionConfig.columns = columnsConfig;
	        			this.collection.collectionConfig = this.collectionConfig;
                       this.firstLoad = true;
                       this.loadingCollection = false;
	        		});
                   this.collectionListingPromise;
	        	};
	        	//this.getCollection(false);
               
               this.keywords = "";
               this.loadingCollection = false;
               var searchPromise;
               this.searchCollection = ()=>{
                   
                   if(searchPromise) {
                       this.$timeout.cancel(searchPromise);
                   }
                   
                   searchPromise = $timeout(()=>{
                       $log.debug('search with keywords');
                       $log.debug(this.keywords);
                       $('.childNode').remove();
                       //Set current page here so that the pagination does not break when getting collection
                       this.loadingCollection = true;
                       this.getCollection(true);
                   }, 500);
               };
              
               
           var siteChanged = (selectedSiteOption)=>{
               this.selectedSite = selectedSiteOption;
               this.getCollection();
           }
           
           this.observerService.attach(siteChanged,'optionsChanged','siteOptions');
               
           var sortChanged = (orderBy)=>{
               this.orderBy = orderBy;
               this.getCollection();
           };
           this.observerService.attach(sortChanged,'sortByColumn','siteSorting');
           
           var optionsLoaded = ()=>{
               this.observerService.notify('selectFirstOption');
               
           }
           this.observerService.attach(optionsLoaded,'optionsLoaded','siteOptionsLoaded');
               
           
        }
    }
    export class SWContentList implements ng.IDirective{
        
        public restrict:string = 'E';
        
        //public bindToController=true;
        public controller=SWContentListController;
        public controllerAs="swContentList";
        public templateUrl;
        
        constructor(
             private partialsPath,
             private observerService
        ){
            this.templateUrl = this.partialsPath+'content/contentlist.html';
        } 
        
        public link:ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs:ng.IAttributes,controller, transclude) =>{
            console.log('directive');
            console.log(scope);
            scope.$on('$destroy', function handler() {
               observerService.detachByEvent('optionsChanged');
               observerService.detachByEvent('sortByColumn');
           });
        }
    }
    
    angular.module('slatwalladmin').directive('swContentList',['partialsPath','observerService',(partialsPath,observerService) => new SWContentList(partialsPath,observerService)]);   
    
}

//'use strict';
//
//angular.module('slatwalladmin')
//.directive('swContentList', [
//	
//	) {
//	    return {
//	       
//	        link: function (scope, element, attr) {
//	        	$log.debug('slatwallcontentList init');
//	        	var pageShow = 50;
//                if(scope.pageShow !== 'Auto'){
//                    pageShow = scope.pageShow;
//                }
//                
//                scope.pageShowOptions = [
//                    {display:10,value:10},
//                    {display:20,value:20},
//                    {display:50,value:50},
//                    {display:250,value:250}
//                ];
//                
//                scope.loadingCollection = false;
//                
//                scope.selectedSite;
//                scope.orderBy;
//                var orderByConfig;
//                
//	        	scope.getCollection = function(isSearching){
//                    scope.collectionConfig = collectionConfigService.newCollectionConfig('Content');
//                    
//                    
////                    var columnsConfig = [
////                        {"propertyIdentifier":"_content_childContents","title":"","isVisible":true,"isDeletable":true,"isSearchable":true,"isExportable":true,"ormtype":"string","aggregate":{"aggregateFunction":"COUNT","aggregateAlias":"childContentsCount"}},
////                        {
////                            propertyIdentifier:'_content.contentID',
////                            isVisible:false,
////                            ormtype:'id',
////                            isSearchable:true
////                        },
////                         {
////                            propertyIdentifier:'_content.site.siteID',
////                            isVisible:false,
////                            ormtype:'id',
////                            isSearchable:false
////                        },
////                        {
////                                propertyIdentifier: '_content.site.domainNames',
////                                isVisible: false,
////                                isSearchable: true
////                        },
////                        {
////                                propertyIdentifier: '_content.urlTitlePath',
////                                isVisible: false,
////                                isSearchable: true
////                        },
////                        //need to get template via settings
////                        {
////                            propertyIdentifier:'_content.allowPurchaseFlag',
////                            isVisible:true,
////                            ormtype:'boolean',
////                            isSearchable:false
////                        }, 
////                        {
////                            propertyIdentifier:'_content.productListingPageFlag',
////                            isVisible:true,
////                            ormtype:'boolean',
////                            isSearchable:false
////                        },
////                        {
////                            propertyIdentifier:'_content.activeFlag',
////                            isVisible:true,
////                            ormtype:'boolean',
////                            isSearchable:false
////                        }
////                    ];
//                    
//	        		var options = {
//                        currentPage:'1', 
//                        pageShow:'1', 
//                        keywords:scope.keywords
//                    };
//                    var column = {};
//                    if(!isSearching || scope.keywords === ''){
//                         var filterGroupsConfig =[
//                            {
//                              "filterGroup": [
//                                {
//                                  "propertyIdentifier": "_content.parentContent",
//                                  "comparisonOperator": "is",
//                                  "value": 'null'
//                                }
//                              ]
//                            }
//                          ];
//                         column = {
//                            propertyIdentifier:'_content.title',
//                            isVisible:true,
//                            ormtype:'string',
//                            isSearchable:true,
//                            tdclass:'primary'
//                        };
//                        columnsConfig.unshift(column);
//                    }else{
//                        var filterGroupsConfig =[
//                            {
//                              "filterGroup": [
//                                {
//                                  "propertyIdentifier": "_content.excludeFromSearch",
//                                  "comparisonOperator": "!=",
//                                  "value": true
//                                }
//                              ]
//                            }
//                          ];
//                       column = {
//                            propertyIdentifier:'_content.title',
//                            isVisible:false,
//                            ormtype:'string',
//                            isSearchable:true
//                        };
//                        columnsConfig.unshift(column);
//
//                        var titlePathColumn = {
//                            propertyIdentifier:'_content.titlePath',
//                            isVisible:true,
//                            ormtype:'string',
//                            isSearchable:false
//                        };  
//                        columnsConfig.unshift(titlePathColumn);
//                    }
//                    //if we have a selected Site add the filter
//                    if(angular.isDefined(scope.selectedSite)){
//                        var selectedSiteFilter = {
//                            logicalOperator:"AND",
//                            propertyIdentifier:"_content.site.siteID",
//                            comparisonOperator:"=",
//                            value:scope.selectedSite.siteID
//                        };
//                        filterGroupsConfig[0].filterGroup.push(selectedSiteFilter);
//                    }
//                    
//                    if(angular.isDefined(scope.orderBy)){
//                        var orderByConfig = [];
//                        orderByConfig.push(scope.orderBy);    
//                        options.orderByConfig = angular.toJson(orderByConfig);
//                    }
//                    
//                    
//                    options.filterGroupsConfig = angular.toJson(filterGroupsConfig);
//                    options.columnsConfig = angular.toJson(columnsConfig);
//                    
//	        		scope.collectionListingPromise = $slatwall.getEntity(
//                        scope.entityName, 
//                        options
//                    );
//                    
//                    var json = {
//                        columns:columnsConfig,
//                        filterGroups:filterGroupsConfig,
//                        baseEntityName:'Content',
//                        baseEntityAlias:'_content'    
//                    };
//                    scope.collectionConfig.loadJson(angular.toJson(json));
//                    
//                    
//	        		scope.collectionListingPromise.then(function(value){
//                        angular.forEach(value.pageRecords, function(node){
//                            node.site_domainNames = node.site_domainNames.split(",")[0];
//                        });
//	        			scope.collection = value;
//	        			//scope.collectionConfig = angular.fromJson(scope.collection.collectionConfig);
//	        			//scope.collectionConfig.columns = columnsConfig;
//	        			scope.collection.collectionConfig = scope.collectionConfig;
//                        scope.firstLoad = true;
//                        scope.loadingCollection = false;
//	        		});
//                    scope.collectionListingPromise;
//	        	};
//	        	//scope.getCollection(false);
//                
//                scope.keywords = "";
//                scope.loadingCollection = false;
//                var searchPromise;
//                scope.searchCollection = function(){
//                    
//                    if(searchPromise) {
//                        $timeout.cancel(searchPromise);
//                    }
//                    
//                    searchPromise = $timeout(function(){
//                        $log.debug('search with keywords');
//                        $log.debug(scope.keywords);
//                        $('.childNode').remove();
//                        //Set current page here so that the pagination does not break when getting collection
//                        scope.loadingCollection = true;
//                        scope.getCollection(true);
//                    }, 500);
//                };
//               
//                
//            var siteChanged = function(selectedSiteOption){
//                scope.selectedSite = selectedSiteOption;
//                scope.getCollection();
//            }
//            
//            observerService.attach(siteChanged,'optionsChanged','siteOptions');
//                
//            var sortChanged = function(orderBy){
//                scope.orderBy = orderBy;
//                scope.getCollection();
//            };
//            observerService.attach(sortChanged,'sortByColumn','siteSorting');
//            
//            var optionsLoaded = function(){
//                observerService.notify('selectFirstOption');
//                
//            }
//            observerService.attach(optionsLoaded,'optionsLoaded','siteOptionsLoaded');
//                
//            scope.$on('$destroy', function handler() {
//                observerService.detachByEvent('optionsChanged');
//                observerService.detachByEvent('sortByColumn');
//            });
//	    }
//	}
//}]);
