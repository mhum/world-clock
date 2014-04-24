Ext.define('WorldClock.view.Options', {
    extend: 'Ext.window.Window',
    alias: 'widget.options',
    itemId:'optionsWin',
	title: 'Options',
	layout: 'fit',
	items: {xtype:'form',
		bodyPadding: 5,
		width:300,
		itemId:'optionsForm',
		items:[
          {
   		   xtype:'combo',	   		   
   		   fieldLabel:'Font Size',
   		   store:'FontSizes',
   		   itemId: 'fontSizeCombo',
   		   name:'fontSize',
   		   displayField:'display',
   		   valueField:'value',
   		   allowBlank:false,
   		   queryMode:'local', 
   		   anyMatch:true, 
   		   forceSelection: true
	   	  },
	      {
            xtype      : 'fieldcontainer',
            fieldLabel : 'Show Map',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [
                {
                	xtype:'radio',
                    boxLabel  : 'No',
                    name      : 'map',
                    inputValue: 'false',
                    id        : 'map1'
                }, {
                	xtype:'radio',
                    boxLabel  : 'Yes',
                    name      : 'map',
                    inputValue: 'true',
                    id        : 'map2'
                }
            ]
	      },
		],
		buttons:[{
			text:'Save',
			itemId:'saveBtn',
			formBind:true
		}]
	}		
});