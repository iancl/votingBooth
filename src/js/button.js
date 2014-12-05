(function(window, document, $, _app, undefined) {

var BuildClass = function (opts){

	// store params
	this.model = opts.model;
	this.parent = opts.parent;
	this.value = opts.value;

	// other
	buildElements.call(this);
	
	this.initialize();
	
},
buildElements = function(){
	var el = document.createElement("a"),
		container = document.createElement("div");

	el.className = "button pure-button hide";
	el.innerHTML = "<span>"+this.model.text+"</span>";
	el.style.cssText = _app.generateCssText(this.model.styles);
	el.setAttribute("data-value", this.value);
	container.className = "btn-parent pure-u-1-"+_app.userConf.size;
	container.appendChild(el);

	this.el = $.q(el);
	this.container = $.q(container);
	el = null;
	container = null;
};

var Button = function(opts){
	BuildClass.apply(this, arguments);
	
};

Button.prototype = {
	constructor: Button,
	initialize: function(){
		this.el.on("click", this.buttonTapped.bind(this));
	},
	resize: function(height){
		this.el.setCss("height:"+height+"px; margin-top:3px;");
	},
	show: function(){
		this.el.removeClass("hide");
	},
	hide: function(){
		this.el.addClass("hide");
	},
	buttonTapped: function(){
		this.parent.onButtonTapped(this.value);
	}
};


_app.Classes.Button = Button;

}(this, document, c$, APP));