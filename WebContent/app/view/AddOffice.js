Ext.define('WorldClock.view.AddOffice', {
    extend: 'Ext.window.Window',
    alias: 'widget.addoffice',
    itemId:'addOfficeWin',
	title: 'Add Office',
	layout: 'fit',
	items: {xtype:'form',
		bodyPadding: 5,
		width:500,
		defaultType:'combo',
		itemId:'officeForm',
		defaults:{width:450, allowBlank:false, queryMode:'local', anyMatch:true, forceSelection: true},
		items:[
		  {
			xtype:'textfield',
		    fieldLabel:'Office',
		    name:'office',
		  },
		  {
		    fieldLabel:'Time Zone',
		    store:'TimeZones',
		    name:'offset',
		    displayField:'display',
		    valueField:'offset'
		  },
		  {
			fieldLabel: 'Open',
			store:'OpenHours',
			name:'open',
		    displayField:'value',
		    valueField:'value'
		  },
		  {
			fieldLabel: 'Close',
			store:'ClosedHours',
			name:'close',
		    displayField:'value',
		    valueField:'value'
		  }
		],
		buttons:[{
			text:'Save',
			itemId:'saveBtn',
			formBind:true
		}]
	}		
});