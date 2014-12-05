/**
 * CREATED BY IAN CALDERON FOR SAY MEDIA
 * VERSION: 0.1.3
 */
/*****************************************************************************************
 * MAIN
 *****************************************************************************************/
 var APP = {};

(function(window, document, $,_app, _userConf, Spinner, undefined) {

/*========================================= GLOBAL ==========================================*/

// LEAVING THIS HERE IS CASE THE WANT TO CREATE A SURVEY WITH A # OF QUESTIONS AND THEN REMOVE ONE OF THE QUESTIONS
// THIS WILL MAKE POSSIBLE TO SHOW THE RESULT OF THE DELETED QUESTION OF THE RESULTS SCREEN
_userConf.contemplateRemovedResults = false; 
_userConf.defaultResult = {
	styles: {
		"background-color": "rgb(28, 184, 65)",
		"color": "yellow",
		"text-shadow": "0 1px 1px rgba(0, 0, 0, 0.2)"
	},
	text: " {%} % default",
	no_votes_text: "no votes yet"
};
// END


_app.userConf = _userConf;
_app.Classes = {};
_app.author = "Ian Calderon";
_app.version = "0.1.3";
_app.generateCssText = function(stylesObject) {

	var key, value, css = "";

	if (typeof(stylesObject) !== "undefined") {

		for (key in stylesObject) {
			value = key + ":" + stylesObject[key] + ";";
			css += value;
		}
	}
	return css;
};
_app.getObjectSize = function(obj){
	var l, key, size = 0;

	for(key in obj){
		size++;
	}

	return size;
};


var
/*========================================= Private =========================================*/

//CONST
BASE_URL = "http://viz.saymedia.com/sophie/sophie.php",
BUTTON_ANIMATION_DURATION = 200,
MIN_DELAY = 50,
//DOM AND INSTANCES
_self,
_mainView,
_buttonSlide,
_resultSlide,
_buttons,
_resultItems,
_showingResuls = false,
// models
_resultModel,
_sizes = {
	win: {
		w: 0,
		h: 0
	}
},


//FN
applyBindPolyfill = function(){
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
	    if (typeof this !== "function") {
	      // closest thing possible to the ECMAScript 5
	      // internal IsCallable function
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }

	    var aArgs = Array.prototype.slice.call(arguments, 1), 
	        fToBind = this, 
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();

	    return fBound;
	  };
	}
},
buildClass = function(){
	applyBindPolyfill();
	initialSetup();
},
initialSetup = function(){

	// vars
	_buttons = new $.Collection();
	_resultModel = new $.Collection();
	_locked = false;
	_userConf.size = size = _app.getObjectSize(_userConf.items);

	// dom
	_mainView = $.q("#main");
	_buttonSlide = $.q("#buttonGroup");
	_resultSlide = $.q("#resultSlide");

},
setListeners = function(){
	// on window resize
	window.addEventListener("resize", onWindowResize);
},
getWindowSize = function() {
	var winW, winH;

	if (document.body && document.body.offsetWidth) {
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}
	if (document.compatMode == 'CSS1Compat' &&
		document.documentElement &&
		document.documentElement.offsetWidth) {
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	if (window.innerWidth && window.innerHeight) {
		winW = window.innerWidth;
		winH = window.innerHeight;
	}

	_sizes.win.w = winW;
	_sizes.win.h = winH;
},
onWindowResize = function() {
	getWindowSize();
	resizeElements();
},

resizeElements = function(){

	if (_showingResuls === true) {
		_resultItems.setCss("height:"+(_sizes.win.h - 6)+"px; margin-top:3px;");
	} else {
		_buttons.each(function(btn){
			btn.resize(_sizes.win.h - 6);
		});
	}

	
},
createButtons = function(){

	var models = _userConf.items,
		id, model, button, results;

	// create a results key in the result model
	_resultModel.add("results", new $.Collection());

	results = _resultModel.get("results");

	for(id in models){
		model = models[id];
		button = new _app.Classes.Button({ parent: this, model: model.question, value: id});
		_buttonSlide.appendHtml(button.container);
		_buttons.add(id, button);

		// create a field in the response model
		model.result.votes = 0;
		results.add(id, model.result);
		
	}

	results = null;
	button = null;
},
setMainStyles = function(){
	var css = _app.generateCssText(_userConf.container.styles);
	_mainView.setCss(css);
},
getRequestedData = function(type, votes){

	var result;

	switch (type){

		case "%":
			result = (votes*100/_resultModel.get("total")).toFixed(0);
		break;

		// default includes the # which is the number of votes
		default:
			result = votes;
		break;
	}

	return result;

};

var
/*========================================= Class ============================================*/
_main = function(){
	buildClass.apply(this, arguments);
};

_main.prototype = {
	constructor: _main,
	isLocked: false,
	initialize: function(){
		_app.Loading.hide({
			fn: function(){
				_buttons.each(function(btn){
					btn.show();
				});
			}
		});
	},
	load: function(){
		var self = this;
		createButtons.call(this);
		setMainStyles();
		setListeners();

		$.defer(function(){
			onWindowResize();
			self.initialize();
			self = null;
		}, MIN_DELAY);

	},
	onButtonTapped: function(val){
		var self = this;

		this.hideButtons();

		$.defer(function(){
			_app.Loading.show({ 
				msg: "Loading Results...",
				fn: function(){
					_showingResuls = true;
					_resultSlide.addClass("render");
				} 
			});

			self.postData(val);
			self = null;
		}, BUTTON_ANIMATION_DURATION);

	},
	hideButtons: function(){
		_buttons.each(function(btn){
			btn.hide();
		});
	},
	postData: function(val){
		var id = _userConf.question_id;

		JSONP.get( BASE_URL, {e: id, h:MD5(id+"merylstreep"), c: val}, this.handleRequestResponse.bind(this));

	},
	handleRequestResponse: function(data){
		var self = this;

		this.buildResultsModel(data);
		this.buildResultSlide();

		$.defer(function(){
			resizeElements();
			self.showResultSlide();
			self = null;
		}, MIN_DELAY);
	},
	showResultSlide: function(){
		_app.Loading.hide({
			fn: function(){
				_resultSlide.addClass("on");
			}
		});
	},
	buildResultsModel: function(data){
		data = data[_userConf.question_id];

		var results = _resultModel.get("results"),
			totalVotes = 0,
			key, votes, result;


		for(key in data){
			votes = parseInt(data[key]) || 0;
			result = results.get(key);

			// if result does not exist and user wants to use it for the results, create it and add it
			if (!result) {

				if ( _userConf.contemplateRemovedResults === true) {
					result = _userConf.defaultResult;
					results.add(key, result);
				}

			}

			// if result exists
			if (result) {
				result.votes = votes;
				totalVotes += votes;
			}

			result = null;
		}

		_resultModel.add("total", totalVotes);

		results = null;
	},
	buildResultSlide: function(){
		var results = _resultModel.get("results"),
			regex, data, type, value, item, container, text;


		results.each(function(model){
			regex = /{([^}]+)}/g;
			data = regex.exec(model.text);
			type = data[1];
			value = getRequestedData(type, model.votes);

			item = document.createElement("div");
	 		container = document.createElement("div");

	 		item.className = "item";

	 		if (parseInt(value) === 0 && model.no_votes_text) {
	 			text = model.no_votes_text;
	 		} else {
	 			text = model.text.replace(data[0], value);
	 		}

	 		item.innerHTML = "<span>"+text+"</span>";
	 		item.style.cssText = _app.generateCssText(model.styles);

	 		container.className = "item-parent pure-u-1-"+_userConf.size;
			container.appendChild(item);

	 		_resultSlide.appendHtml(container);

	 		container = null;
	 		item = null;
		});

		_resultItems = $.q(".item");

	}
};


/*========================================= LOCAL INSTANTIATION AND API=========================================*/

_app.load = function(){
	_self.load();
};

function init(){
	_self = new _main();
}

window.addEventListener("load", init);

}(this, document, c$, APP, APP_CONF, Spinner));