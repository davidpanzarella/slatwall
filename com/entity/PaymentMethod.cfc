/*

    Slatwall - An e-commerce plugin for Mura CMS
    Copyright (C) 2011 ten24, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Linking this library statically or dynamically with other modules is
    making a combined work based on this library.  Thus, the terms and
    conditions of the GNU General Public License cover the whole
    combination.
 
    As a special exception, the copyright holders of this library give you
    permission to link this library with independent modules to produce an
    executable, regardless of the license terms of these independent
    modules, and to copy and distribute the resulting executable under
    terms of your choice, provided that you also meet, for each linked
    independent module, the terms and conditions of the license of that
    module.  An independent module is a module which is not derived from
    or based on this library.  If you modify this library, you may extend
    this exception to your version of the library, but you are not
    obligated to do so.  If you do not wish to do so, delete this
    exception statement from your version.

Notes:

*/
component displayname="Payment Method" entityname="SlatwallPaymentMethod" table="SlatwallPaymentMethod" persistent=true output=false accessors=true extends="BaseEntity" {
	
	// Persistent Properties
	property name="paymentMethodID" ormtype="string" length="32" fieldtype="id" generator="uuid" unsavedvalue="" default="";
	property name="paymentMethodName" ormtype="string";
	property name="paymentMethodType" ormtype="string" formFieldType="select";
	property name="providerGateway" ormtype="string";
	property name="allowSaveFlag" ormtype="boolean" default="false";
	property name="activeFlag" ormtype="boolean" default="false";
	property name="sortOrder" ormtype="integer";
	
	// Remote Properties
	property name="remoteID" ormtype="string";

	// Audit properties
	property name="createdDateTime" ormtype="timestamp";
	property name="createdByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="createdByAccountID";
	property name="modifiedDateTime" ormtype="timestamp";
	property name="modifiedByAccount" cfc="Account" fieldtype="many-to-one" fkcolumn="modifiedByAccountID";
	
	public array function getPaymentMethodTypeOptions() {
		var options = [
			{name="Cash", value="cash"},
			{name="Check", value="check"},
			{name="Credit Card", value="creditCard"},
			{name="External", value="external"},
			{name="Gift Card", value="giftCard"}
		];
		return options;
	}
	
	public any function getIntegration() {
		return getService("integrationService").getIntegrationByIntegrationPackage(getProviderGateway());
	}
	
	    

	// ============ START: Non-Persistent Property Methods =================
	
	// ============  END:  Non-Persistent Property Methods =================
		
	// ============= START: Bidirectional Helper Methods ===================
	
	// =============  END:  Bidirectional Helper Methods ===================
	
	// =================== START: ORM Event Hooks  =========================
	
	// ===================  END:  ORM Event Hooks  =========================
}
