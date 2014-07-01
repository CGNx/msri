
$(function() {

	var SPEED_UP_PLAYBACK_FACTOR = 2;

	//Set up text editor
	var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");  

	var logs = [];
	var handlers = true;

	$('.ace_text-input').focus();
	
	//Prints csv row to screen for testing purposes
	//id is the string id for the output div
	function printKeyPress(log, id) {
		var key = log.key;
		var pos = log.position.row != undefined ?
				  log.position.row + ', ' + log.position.column + ')' :
				  log.position.start.row + ', ' + log.position.start.column + ') to (' + 
				  log.position.end.row + ', ' + log.position.end.column + ')'
        var line = '<b>Event type</b>: ' + log.type +
        		   ', <b>Key Code</b>: ' + log.keyCode +
        		   ', <b>Key Value</b>: ' + log.text +
        		   ', <b>Cursor Position</b>: (' + pos +
        		   ', <b>Time</b>: ' + log.time;
        $('#' + id).append(line+'<br>');
        $("#" + id).animate({
	        scrollTop: $("#" + id)[0].scrollHeight
	    }, 10);
	}

	//Logs all keys into logs and events in events
	//Types of events:
	//	Move
	//  Insert
	//  Remove
	//  selection
	//  Copy, Cut, Paste
	function keypress_handler(e) {
    	if (handlers) {
    		var key = e.which;
	    	var type = e.type == 'click' ? 'click' : 'insert';
	    	//var text = keyboardMap[key]==''?String.fromCharCode(key):keyboardMap[key]; 
	    	var text = String.fromCharCode(key);
		    switch(key) {
			    case 13: //Enter press
			        text = '\n'; //String.fromCharCode fails for Enter key - manually add new line
			        break;
			        //editor.document.getNewLineCharacter();
			    case 34: //Page Down
			        e.preventDefault();
			        break;
			    case 86: //paste
			    	break;
			    case 67: //copy
			    	break;
			    case 88: //cut
			    	break;
			    default:			        
			}
		    	
	    	var logEntry = {'type': type,
	    					'time': e.timeStamp,
	    					'keyCode': key,
	    					'text': text,
	    					'position': editor.selection.getCursor()}; 
	    	printKeyPress(logEntry, 'output');
	    	logs.push(logEntry);
	    }
    }


    //Handles backspace/delete
    function keydown_handler(e) {
    	if (handlers) {
	    	var key = e.which;
	    	var type;
	    	switch(key) {
			    case 33: //Page Up
			        e.preventDefault();
			        break;
			    case 8: //Backspace
			    case 45: //Delete
			    	type = 'remove';
			    	var logEntry = {'type': type,
							'time': e.timeStamp,
							'keyCode': key,
							'text': null,
							'position': editor.selection.getCursor()}; 
			    	printKeyPress(logEntry, 'output');
			    	logs.push(logEntry);
			    	break;
			    case 37: //Arrow Left
			        e.preventDefault();
			        break;
			    case 38: //Arrow Up
			    	e.preventDefault();
			    	break;
			    case 39: //Arrow Right
			    	e.preventDefault();
			    	break;
			    case 40: //Arrow Down
			   		e.preventDefault();
			    	break;
			    default:			        
			}

			
    	}
    	

    }

    //Create a log event when selection changes (no log added if just cursor changes)
    function change_selection_handler(e) {
    	var selectedText = editor.getSelectedText();
    	if (handlers && selectedText != '') {
    		var selectedText = editor.getSelectedText();
	    	var logEntry = {'type': e.type,
							'time': $.now(),
							'keyCode': null,
							'text': selectedText,
							'position': editor.getSelectionRange()}; 
			printKeyPress(logEntry, 'output');
			logs.push(logEntry);
	    }
	}

	//Create a log event when cursor changes (no log added if selection changes, but cursor does not)
	function change_cursor_handler(e) {
		var selectedText = editor.getSelectedText();
    	if (handlers && selectedText == '') {
    		var selectedText = editor.getSelectedText();
	    	var logEntry = {'type': e.type,
							'time': $.now(),
							'keyCode': null,
							'text': selectedText,
							'position': editor.getCursorPosition()}; 
			printKeyPress(logEntry, 'output');
			logs.push(logEntry);
	    }
	}

    //Outputs a message when paste, cut, or copy occurs.
	function paste_cut_copy_handler(e) {
		if (handlers) {
			var keyMap = {'copy':67,'cut':88,'paste':86};
			var logEntry = {'type': e.type,
							'time': e.timeStamp,
							'keyCode': keyMap[e.type],
							'text': e.originalEvent.clipboardData.getData('Text'),
							'position': editor.selection.getCursor()}; 
			printKeyPress(logEntry, 'output');
			logs.push(logEntry);
		}
	}

	//Replays all events in the the event log
	function replay_from_undo_stack(e) {

		while(editor.session.getUndoManager().hasUndo()) {
			editor.undo();
		}

        function loop() {
        	editor.redo();
        	if (editor.session.getUndoManager().hasRedo()) {
                setTimeout(loop, 200); 
            }
        }
        loop();
	}

	//Replays all events in the the event log
	function replay_logs_handler(e) {
		//Turn off handlers
		handlers = false;
		console.log(logs);
		while(editor.session.getUndoManager().hasUndo()) {
			editor.undo();
		}

		var index = 0;
        function loop() {

        	var log = logs[index];
        	
    		//editor.gotoLine(log.position.row + 1, log.position.column, false);
    		//editor.moveCursorToPosition(log.position);
    		if(log.type == 'insert') {
    			//editor.moveCursorToPosition(log.position);
    			editor.insert(log.text);
    		} else if(log.type =='remove')  {
    			if (index >  0) {
    				editor.session.replace(logs[index - 1].position, '');
    			}
    			//delete|backspace single character
    		} else if(log.type == 'changeCursor') {
    			editor.moveCursorToPosition(log.position);
    		} else if(log.type == 'changeSelection') {
    			if(typeof log.position == 'Range') {
    				editor.selection.setSelectionRange(log.position);
    			} else {
    				editor.moveCursorToPosition(log.position);
    			}
    		}

        	if (index < logs.length - 1) {
        		index = index + 1;
        		console.log(index);
                setTimeout(loop, (logs[index].time - log.time) / SPEED_UP_PLAYBACK_FACTOR);
            }        	
        }
        loop();
	}

	function language_select_handler(e) {
    	editor.getSession().setMode("ace/mode/" + this.value);
	}

	//Attach event handlers
	$('.playback').on("keypress", keypress_handler);
	$('.playback textarea').on("keydown", keydown_handler);
	$('.playback').on('paste cut copy', paste_cut_copy_handler);
	$('#replay-button').click(replay_from_undo_stack);
	$('#replay-logs').click(replay_logs_handler);
	$('#language-select').change(language_select_handler);
	editor.selection.on('changeSelection', change_selection_handler);
	editor.selection.on('changeCursor', change_cursor_handler);

})




		/*$('.playback').off("keydown", playback_handler);
		$('#output').html('Replaying code...');
		while(events.length != 0) {
			// Create a new jQuery.Event object with specified event properties.
			var elbow = jQuery.Event( "keypress", { keyCode: 65 } );
			// trigger an artificial keydown event with keyCode 64
			$( ".playback" ).trigger( elbow );
			var emo = $.Event('keypress');
		    emo.which = 65; // Character 'A'`
		    $('.playback').trigger(emo);
			var evt = events.shift();
			console.log(evt)
			evt = createEvent(evt);
			console.log(evt);
			//document.getElementById('playback').dispatchEvent(evt);
			var result = $('.playback').trigger(evt);
			//var result = document.dispatchEvent(evt);
			console.log(result);
		}*/

		/*$('.playback').on('click', function(e) {
		// trigger an artificial keydown event with keyCode 64
		var emo = $.Event('keypress');
	    emo.which = 65; // Character 'A'`
	    $('.playback').trigger(emo);
	});*/



/*
//Adds a jquery function which finds the CursorPosition for a textarea element
	$.fn.getCursorPosition = function() {
	    var el = $(this).get(0);
	    var pos = 0;
	    var posEnd = 0;
	    if('selectionStart' in el) {
	        pos = el.selectionStart;
	        posEnd = el.selectionEnd;
	    } else if('selection' in document) {
	        el.focus();
	        var Sel = document.selection.createRange();
	        var SelLength = document.selection.createRange().text.length;
	        Sel.moveStart('character', -el.value.length);
	        pos = Sel.text.length - SelLength;
	        posEnd = Sel.text.length;
	    }
	    return [pos, posEnd];
	};

	//Determines the text deleted 
	function getDeletedText(key, text, position) {
	    var deleted = '';

	    if (key == 8) {
	        if (position[0] == position[1]) {
	            if (position[0] == 0)
	                deleted = '';
	            else
	                deleted = text.substr(position[0] - 1, 1);
	        }
	        else {
	            deleted = text.substring(position[0], position[1]);
	        }
	    }
	    else if (key == 46) {
	        var text = $(this).val();
	        if (position[0] == position[1]) {
	            
	            if (position[0] === text.length)
	                deleted = '';
	            else
	                deleted = text.substr(position[0], 1);
	        }
	        else {
	            deleted = text.substring(position[0], position[1]);
	        }
	    }
	    return deleted;
	}

	*/