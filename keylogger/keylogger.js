$(function() {
	var keyboardMap = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","","","COMMA","","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
	var prevKeyDown;

	$('#textbox').keydown(
    function(e) {
    	key = e.keyCode;

    	if (prevKeyDown != key) {
	    	var keyPressed = key < keyboardMap.length?keyboardMap[key]:String.fromCharCode(key);
	    	console.log(keyPressed); 
	        var line = '<b>Time</b>: ' + new Date(e.timeStamp) +
	        			', <b>Key Pressed</b>: ' + keyPressed;
	        $('#output').append(line+'<br>');
	        $("#output").animate({
		        scrollTop: $("#output")[0].scrollHeight
		    }, 20);
	        prevKeyDown = key;
	    }
    }
	);

	//Resets the prevKeyDown if the key is lifted that way if the user types cc, both are caught.
	$('#textbox').keyup(
    function(e) {
    	if (e.keyCode == prevKeyDown) {
    		prevKeyDown = -1;
    	}
    }
	);

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

	$('#textbox').on('paste', paste_handler);
	$('#textbox').on('copy', copy_handler);
	$('#textbox').on('cut', cut_handler);

})