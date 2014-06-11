$(function() {
	var keyboardMap = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","","","COMMA","","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
	var prevKeyDown;
	var allowHoldingKeys = true;
	var GLOBAL_TEST_COUNT = 0;

	if (allowHoldingKeys) {
		//Resets the prevKeyDown if the key is lifted that way if the user types cc, both are caught.
		$('#textbox-wrapper').keyup(
	    function(e) {
	    	if (e.keyCode == prevKeyDown) {
	    		prevKeyDown = -1; //Set to impossible key value for update
	    	}
	    }
		);
	}

	//Wrapper around a textbox.
	//This wrapper logs all keypresses and disables mouse events
	//Assumes that events are automatically propogated to children.
	//Uses capturing, not bubbling for event propagation.
	document.getElementById('textbox-wrapper').addEventListener("keydown",
	    function(e) {
	    	key = e.keyCode;
	    	if (key == 86) {
	    		//86 is a paste event

	    	} else if (key == 67) {
	    		//67 is copy event

	    	} else if (key == 88) {
	    		//88 is cut event
	    		
	    	}

	    	if (allowHoldingKeys || !prevKeyDown != key) {
	    		GLOBAL_TEST_COUNT = GLOBAL_TEST_COUNT + 1;
		    	var keyPressed = key < keyboardMap.length?keyboardMap[key]:String.fromCharCode(key);
		    	console.log(new Date(e.timeStamp)); 
		        var line = '<b>Order</b>: ' + GLOBAL_TEST_COUNT +
		        		   '<b>Time</b>: ' + e.timeStamp +
		        		   ', <b>Key Pressed</b>: ' + keyPressed +
		        		   ', <b>Key Code</b>: ' + key;
		        $('#output').append(line+'<br>');
		        $("#output").animate({
			        scrollTop: $("#output")[0].scrollHeight
			    }, 20);
		        prevKeyDown = key;
		    }
	    }, true);

	document.getElementById('textbox-wrapper').addEventListener(
							'scroll',
		function(e) {
			//alert('hit')
			e.preventDefault();
			//e.stopPropagation();
			e.returnValue = false;
		}, true);

	//Test Code to check that child can handle events seperate from wrapper
	document.getElementById('textbox-wrapper').addEventListener("keydown",
	    function(e) {
	    	GLOBAL_TEST_COUNT = GLOBAL_TEST_COUNT + 1;
	        $('#output').append('order: ' + GLOBAL_TEST_COUNT + 'child handler hit.'+'<br>');
	    }, true);

	function paste_handler(e) {
		$('#output').append('<span style="color:red; font-weight: bold"> Paste Detected!</span><br>');
		$("#output").animate({
		        scrollTop: $("#output")[0].scrollHeight
		    }, 20);
	}
	function copy_handler(e) {
		$('#output').append('<span style="color:red; font-weight: bold"> Copy Detected!</span><br>');
		$("#output").animate({
		        scrollTop: $("#output")[0].scrollHeight
		    }, 20);
	}
	function cut_handler(e) {
		$('#output').append('<span style="color:red; font-weight: bold"> Cut Detected!</span><br>');
		$("#output").animate({
		        scrollTop: $("#output")[0].scrollHeight
		    }, 20);
	}

	$('#textbox-wrapper').on('paste', paste_handler);
	$('#textbox-wrapper').on('copy', copy_handler);
	$('#textbox-wrapper').on('cut', cut_handler);

})