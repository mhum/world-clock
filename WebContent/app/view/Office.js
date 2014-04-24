Ext.define('WorldClock.view.Office', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.office',
	layout:'fit',
	border:false,
	margin:'5',
    style: {
        cursor: 'pointer'
    },
	config :{
		index:false
	},
	listeners:{
		added:function(){					
	    	 if (this.getIndex()==0) { 
	    		 this.getUpdater().start();
			}
	    	 else{
	    		 this.getUpdater().stop();
	    		 this.getUpdater().start();
	    	 }
		},
	    click: {
	        element: 'el',
	        fn: function(){
	            var panel = Ext.getCmp(this.id);
	            panel.fireEvent('click',panel);
	        }
	    }
	},
	getUpdater: function(){
		 var runner = new Ext.util.TaskRunner();
		 var task = runner.newTask({
		     run: WorldClock.app.getController('Offices').getUpdateClock(),
		     interval: 1000
		 });
		 return task;
	}
});