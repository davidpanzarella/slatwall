/// <reference path='../../typings/slatwallTypescript.d.ts' />
/// <reference path='../../typings/tsd.d.ts' />
//import alertmodule = require('./alert/alert.module');
import {alertmodule} from "./alert/alert.module";
import {coremodule} from "./core/core.module";
import {paginationmodule} from "./pagination/pagination.module";
import {dialogmodule} from "./dialog/dialog.module";
import {giftcardmodule} from "./giftcard/giftcard.module";
import {collectionmodule} from "./collection/collection.module";
import {workflowmodule} from "./workflow/workflow.module";

var hibachimodule = angular.module('hibachi',[
    alertmodule.name,
    coremodule.name,
    giftcardmodule.name,
    paginationmodule.name,
    dialogmodule.name,
    collectionmodule.name,
    workflowmodule.name
])

;

export{
    hibachimodule  
};
//.controller('appcontroller',controller.ProductCreateController);