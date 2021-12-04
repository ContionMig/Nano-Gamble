'use strict';
//TODO: using Popup namespace
let settings = {};
class Popup{

	constructor(content, fnclose){
		this.content = content;
		this.fnclose = fnclose;
		this.event = new PopupEvent("popup-event");

		this.options = {};
		this.options.title = content;
		this.options.closeLabel = "close";
	}

	show(){
        this.$popup = this.draw();
        this.initEvents();

		$("body").append(this.$popup);
	}

	draw(){
		let popup = $("<div>").html(this.getTemplate());
		popup.find(".popup-content").html(this.content);
		return popup;
	}

	initEvents(){
		this.$popup.find("button").on("click", this.remove.bind(this));
		$("body").on("keydown.popup", this.$popup, this.keyPressed.bind(this));
	}

	removeEvents(){
		this.$popup.find("button").off("click", this.hide.bind(this));
		$("body").off(".popup");
	}

	keyPressed(event){
		if(event.keyCode == 27 || event.keyCode == 13){
			this.remove();
		}
	}

	hide(){

	}

	remove(){
	    this.fnclose(document.getElementById("prompt_input").value)

		this.removeEvents();
		this.$popup.remove();
	}

	getTemplate(){}

	static alert(content){
		let alert = new Alert(content);
		alert.show();
	}

	static confirm(content){
		let confirm = new Confirm(content);
		confirm.show();
	}

	static prompt(content, fnclose){
		let prompt = new Prompt(content, fnclose);
		prompt.show();
	}

    static settings(){
        return settings;
    }

    static init(params){
        settings = params || {};
    }
}

class Alert extends Popup{

	constructor(content){
		super(content);
		this.event.name = "event-alert";
	}

	getTemplate(){
		return "<div class='popup-bg popup-alert'>" +
					"<div class='popup'>" +
						"<div class='popup-inner'>" +
							"<div class='popup-content'></div>" +
							"<div class='popup-footer'><button>OK</button></div>" +
						"</div>" +
					"</div>" +
				"</div>";
	}
}

class Confirm extends Popup{

	constructor(content){
		super(content);

        this.options.yesLabel = "yes";
        this.options.noLabel = "no";

		this.event.name = "event-confirm";
		this.event.confirm = false;
	}

	hide(evt){
		super.hide();
		this.event.confirm = $(evt.target).hasClass("true");
	}

	keyPressed(event){
		if(event.keyCode == 13){
			this.$popup.find("button.true").trigger("click");
		}
		if(event.keyCode == 27){
			this.$popup.find("button.false").trigger("click");
		}
	}

	getTemplate(){
		return "<div class='popup-bg popup-confirm'>" +
					"<div class='popup'>" +
						"<div class='popup-inner'>" +
							"<div class='popup-content'></div>" +
							"<div class='popup-footer'><button class='true'>OK</button><button class='false'>" + this.options.noLabel + "</button></div>" +
						"</div>" +
					"</div>" +
				"</div>";
	}
}

class Prompt extends Popup{

	constructor(content, fnclose){
		super(content, fnclose);

        this.options.validLabel = "OK";

		this.event.name = "event-prompt";
		this.event.value = "";
	}

	hide(evt){
		this.event.value = this.$popup.find("input").val();
		super.hide();
	}

	getTemplate(){
		return "<div class='popup-bg popup-confirm'>" +
					"<div class='popup'>" +
						"<div class='popup-inner' style='padding: 20px;'>" +
							"<div class='popup-content'></div>" +
							"<div class='chat_input_container'>" +
								"<input id='prompt_input' value='' type='text' autofocus>" +
							"</div>" +
							"<div class='popup-footer'><button>OK</button></div>" +
						"</div>" +
					"</div>" +
				"</div>";
	}
}

class PopupEvent{

	constructor(name){
		this.name = name;
	}
}
