Ext.define('WorldClock.controller.Offices', {
    extend: 'Ext.app.Controller',
    stores:['TimeZones', 'OpenHours', 'ClosedHours', 'Clocks', 'FontSizes','Options'],
    views:['Office','AddOffice','UpdateOffice','Options'],
    init: function() {
        this.control({
        	'#addOfficeBtn' :{
        		click: function(){
        			Ext.create('WorldClock.view.AddOffice',{}).show();
        		}
        	},
        	'#optionsBtn' :{
        		click: this.showOptions
        	},
            '#addOfficeWin #officeForm #saveBtn': {
                click: this.addNewOffice
            },
            '#updateOfficeWin #officeForm #saveBtn': {
                click: this.updateOffice
            },
	        '#optionsWin #optionsForm #saveBtn': {
	            click: this.saveOptions
	        },
            'panel': {
            	click: this.getEditRemoveWindow
            }
        });
    },
    onLaunch: function() {
    	var cookie = Ext.util.Cookies.get('WorldClock');
    	
    	if (cookie!=null){
        	this.getClocksStore().loadRawData(Ext.JSON.decode(cookie).clocks);
        	this.getOptionsStore().loadRawData(Ext.JSON.decode(cookie).options);
        	this.addClocks();
        	this.addMap();
    	}
    },
    addNewOffice: function(button){
		this.getClocksStore().add(button.up('form').getValues());
		button.up('form').up('window').destroy();
		this.saveCookie();
		this.addClocks();
    },
    updateOffice: function(button){
		button.up('form').getForm().updateRecord();
		button.up('window').destroy();
		this.saveCookie();
		this.addClocks();
    },   
    showOptions: function(){
    	var total = this.getOptionsStore().getCount();
    	var window = Ext.create(this.getOptionsView());
    	if (total==0){
    		this.getOptionsStore().add({fontSize: '12px', map: 'false'});
    	}
		window.down('form').loadRecord(this.getOptionsStore().getAt(0));
    	window.show();
    },
    saveOptions: function(button){
		button.up('form').getForm().updateRecord();
		button.up('window').destroy();
		this.saveCookie();
		this.addClocks();
		this.addMap();
    }, 
    addClocks: function(){ 
    	Ext.suspendLayouts();  	
		Ext.getCmp('clockContainer').removeAll(true);
    	
		var temp=0;   	
		var fontSize = '12px';
		if (this.getOptionsStore().getAt(0)!=null)
			fontSize = this.getOptionsStore().getAt(0).get('fontSize');
    	this.getClocksStore().each(function(r){
        	var isOpen = WorldClock.app.getController('Offices').isOpen(r);
        	var cssID = '';
        	if (isOpen)
        		cssID='clockTextOpen';
        	else
        		cssID='clockTextClosed';
    		Ext.getCmp('clockContainer').add(
	    			Ext.create('WorldClock.view.Office',{
	    			itemId:'clock'+temp,
	    			id:'office'+temp,
	    			html: r.get('office')+"<br><div id='clock"+temp+"'></div>",
	    			index:temp,
	    			bodyCls:cssID,
	    			bodyStyle: {
	    			    'font-size': fontSize,
	    			    'white-space': 'nowrap',
	    			    'text-align': 'center'
	    			}
    			})
    		);
    		temp++;
    	});
    	Ext.resumeLayouts(true);
    },
    addMap: function(){
    	Ext.suspendLayouts();
    	Ext.getCmp('map').removeAll(true);
    	
    	mapOption= this.getOptionsStore().getAt(0);
    	if (mapOption!=null) {
    		if(mapOption.get('map')=="true"){
    			var image = Ext.create('Ext.Component',{
	 			  imageSrc : 'resources/images/sunmap.jpg',
	 			  id:'sunComp',
	 			  autoEl: {tag: 'img'},
	 			  height:720,
	 			  width:1600,
	 			  refreshMe : function(src){
	 			     var el;
	 			     if(el = this.el){
	 			        el.dom.src = (src || this.imageSrc) + '?dc=' + new Date().getTime();
	 			     }
	 			  },
	 			  listeners : {
	 			     render :  function(){
	 			    	 this.refreshMe();
	 			     }
	 			  }	
    			});
	   			 Ext.TaskManager.start({
		    		     run: function(){
		    		    	 Ext.getCmp('sunComp').el.dom.src = 'resources/images/sunmap.jpg'+ '?dc=' + new Date().getTime();
		    		     },
		    		     interval: 1800000
		    		 });
	    		Ext.getCmp('map').add(image);
    		}
    	}
    	Ext.resumeLayouts(true);
    },
    getUpdateClock: function(){
	   	var updateClock = function () {
	   		Ext.suspendLayouts();
		    var i = 0;
		    Ext.data.StoreManager.lookup('Clocks').each(function(r){
		    	var office = Ext.getCmp('office'+i);
		    	var isOpen = WorldClock.app.getController('Offices').isOpen(r);
	        	if (isOpen) {
			    	office.removeBodyCls('clockTextClosed clockTextOpen');
		    		office.addBodyCls('clockTextOpen');
	        	}
	        	else{
	        		office.removeBodyCls('clockTextClosed clockTextOpen');
	        		office.addBodyCls('clockTextClosed');
	        	}
		    	
		    	var nd = WorldClock.app.getController('Offices').getChangedDate(r.get('offset'));
		    	Ext.fly('clock'+i).update(Ext.util.Format.date(nd,'g:i A D'));
		    	i++;
		    });
		    Ext.resumeLayouts(true);
		    Ext.getCmp('office0').doLayout();
	 	};
	 	return updateClock;
    },
    getEditRemoveWindow: function(panel){
		var window = Ext.create('Ext.window.Window', {
		    title: 'Alert',
		    layout: 'fit',
		    html: '<div class="x-window-default">Do you want to edit or remove this office?</div>',
		    buttons:[{text:'Edit',
        		    	handler: function(){
        		    		WorldClock.app.getController('Offices').getEditClock(panel.index);
        		    		window.destroy();
        		    	}
             		 },
		             {text:'Remove',
        		    	handler: function(){
        		    		WorldClock.app.getController('Offices').removeClock(panel.index);
        		    		window.destroy();
        		    	}
		             }
		  ]
		}).show();
    },
    getEditClock: function(index){
    	var record = this.getClocksStore().getAt(index);
		var window = Ext.create(this.getUpdateOfficeView());
		window.down('form').loadRecord(record);
		window.show();
    },
    removeClock: function(index){
		this.getClocksStore().removeAt(parseInt(index));
		this.saveCookie();
		this.addClocks();  
    },
    isOpen: function(r) {
    	var nd = WorldClock.app.getController('Offices').getChangedDate(r.get('offset'));
    	var current = Ext.util.Format.date(nd,'H:i:s');
    	var open = Ext.util.Format.date(Ext.Date.parse(r.get('open'),'g:i A'),'H:i:s');
    	var close = Ext.util.Format.date(Ext.Date.parse(r.get('close'),'g:i A'),'H:i:s');
    	    	
    	var isOpen = false;
    	if (current>open && current<close)
    		isOpen=true;
    	
    	return isOpen;
    },
    getChangedDate: function(offset){
	    var d = new Date();
	    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    	var nd = new Date(utc + (3600000*offset));
    	
    	return nd;
    },
    saveCookie: function(){
    	Ext.util.Cookies.clear('WorldClock');
    	var cookie = new Object();
    	cookie.clocks=Ext.pluck(this.getClocksStore().data.items, 'data');
    	cookie.options=Ext.pluck(this.getOptionsStore().data.items, 'data');
    	Ext.util.Cookies.set('WorldClock',Ext.encode(cookie));
    }
});