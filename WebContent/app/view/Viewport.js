Ext.define('WorldClock.view.Viewport', {
	extend: 'Ext.container.Viewport',
	id:'Viewport',
    layout: 'vbox',
    requires:['WorldClock.view.Clocks'],
    items:[      
           {
        	   xtype:'clocks',
    	   },
    	   {
        	   xtype:'container', 
        	   id:'map'
    	   },
    	   {
    		   xtype:'container',
    		   layout:'hbox',
    		   itemId:'buttonContainer',
    		   items:[
    	          {
    	       	   xtype:'button',
    	       	   text:'Add Office',
    	   		   itemId: 'addOfficeBtn',
    	   		   margin:5
    	   	   	  },
    	   	   	  {
    	   	   		xtype:'button',
    	   	   		text:'Options',
    	   	   		itemId:'optionsBtn',
    	   	   		margin:5
    	   	   	  }
               ]
    	   }
   ]
});