$(function() {

	//Global Parameters
	var SPEED_UP_PLAYBACK_FACTOR = 2;
	var ALLOW_EDITOR_AUTO_COMPLETE = false;
	
	//Returns the set difference of this array and arr array
	Array.prototype.diff = function(arr) {
	    return this.filter(function(i) {return arr.indexOf(i) < 0;});
	};

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

	//Adds a dictionary of the input variables to the log array object.
	function addLog(type, time, code, text, pos) {
		//Get cursor/selection position if no position provided
		pos = pos !== undefined ? pos : 
			  (editor.getSelectedText() == '' ? editor.selection.getCursor() : editor.getSelectionRange());

		//Add log entry
		var logEntry = {'type': type,
						'time': time,
						'keyCode': code,
						'text': text,
						'position': pos}; 
    	printKeyPress(logEntry, 'output');
    	logs.push(logEntry);
	}

	//Swaps two elements of logs array at indices a and b.
	//Maintain time ordering by swapping times as well
	function swapLogs(index_a, index_b) {
	    //Swap objects
	    var temp = logs[index_a];
	    logs[index_a] = logs[index_b];
	    logs[index_b] = temp;

	    //Reswap time fields
	    logs[index_b].time = logs[index_a].time;
	    logs[index_a].time = temp.time;
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
	    	var text = String.fromCharCode(key);
		    switch(key) {
			    case 13: //Enter press
			        text = '\n'; //String.fromCharCode fails for Enter key - manually add new line
			        break;
			        //editor.document.getNewLineCharacter();
			}
		    	
	    	var logEntry = {'type': 'insert',
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
	    	var type = 'remove';
	    	var text = null;
	    	switch(key) {
			    case 9: //Tab
			    	//numSpaces is the number of spaces to the next tab (e.g. if 'lol' was typed (3 characters),
			    	//and a tab is four spaces, then numSpaces = 1)
			        //var numSpaces = editor.session.getScreenTabSize(editor.getCursorPosition().column);
			        //console.log('cursor position: ' + editor.getCursorPosition().column);
			        //console.log('Tab spaces left: ' + numSpaces);
			        //text = Array(numSpaces).join(' '); //String.fromCharCode fails for Tab key - manually add tab
			        text = '\t';
			        type = e.shiftKey ? 'outdent' : 'indent';
			        break;
			    case 90: //Undo
			    	//e.preventDefault();
			    	if (e.shiftKey === false) { //Will go to next case if shift+ctrl+z (redo)
			    		type = 'undo';
			    		break;
			    	}
			    case 89: //Redo
			    	//e.preventDefault();
			    	type = 'redo';
			    	break;	        
			}

			//Keys: 8 is backspace, 46 is delete, 9 is tab, 90 is undo, 89 is redo
			if ([8, 46, 9, 89, 90].indexOf(key) > -1) {
				addLog(type, e.timeStamp, key, text);
		    }			
    	}
    }

    //Create a log event when selection changes (no log added if just cursor changes)
    function change_selection_handler(e) {
    	if (handlers && editor.getSelectedText() != '') {
    		addLog(e.type, $.now(), null, editor.getSelectedText(), editor.getSelectionRange());
	    }
	}

	//Create a log event when cursor changes (no log added if selection changes, but cursor does not)
	function change_cursor_handler(e) {
		var selectedText = editor.getSelectedText();
    	if (handlers && selectedText == '') {
    		addLog(e.type, $.now(), null, editor.getSelectedText(), editor.getCursorPosition());
	    }
	}

	//Create a log anytime any text is inserted or deleted or the state of the editor changes
	function ace_change_handler(e) {
		if (handlers) {
			console.log(e);
			addLog(e.data.action, $.now(), null, e.data.text, e.data.range);
		}
	}

    //Create a log event when cut, or copy occurs.
	function copy_handler(e) {
		if (handlers) {
			var text = e.originalEvent.clipboardData.getData('Text');
			addLog('copy', e.timeStamp, 67, text);
		}
	}

	//Create a log event when paste occurs.
	function paste_handler(e) {
		if (handlers) {
			addLog('paste', $.now(), 86, e.text);
		}
	}

	//Create a log event when cut occurs.
	function cut_handler(e) {
		if (handlers) {
			addLog('cut', $.now(), 88, editor.getSelectedText(), e);
		}
	}

	//Replays all events in the the event log
	/*function replay_from_undo_stack(e) {

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
	}*/

	function double_speed() {
		var doubleSpeed = SPEED_UP_PLAYBACK_FACTOR * 2;
		var maxSpeed = 64;
		SPEED_UP_PLAYBACK_FACTOR = doubleSpeed > maxSpeed ? maxSpeed : doubleSpeed;
		$("#double-replay-speed").val('Double Speed: ' + SPEED_UP_PLAYBACK_FACTOR + 'x');
	};


	//Rearranges cursorMove events to occur after the delete or insert occurs.
	//Swaps remove/indent events which are preceded by cursorMove events
	//This way the cursor is moved after the remove occurs
	//And the remove simply removes the highlighted portion.
	function preprocessLogs() {
		for (var i = 1; i < logs.length; i++) {
			if ((['remove', 'indent', 'outdent'].indexOf(logs[i].type) > -1 && logs[i-1].type == 'changeCursor')  ||
			   (['indent', 'outdent','block_indent', 'block_outdent'].indexOf(logs[i].type) > -1 && logs[i-1].type == 'changeSelection')) {
				swapLogs(i, i-1);
			}
		}
	}

	//Replays all events in the the event log
	function replay_logs_handler(e) {
		if (logs.length != 0) {
			//preprocessLogs();	
			console.log(logs);		
			handlers = false; //Turn off handlers
			editor.selectAll(); 
			editor.remove(); //Clear editor for replay

			var index = 0;
	        function loop() {

	        	var log = logs[index];
	        	
	    		if(log.type == 'insertText') {
	    			editor.insert(log.text);
	    		} else if(log.type == 'insertLines') {
	    			console.log(log);
	    		} else if(log.type =='removeText')  {
					//editor.session.replace(log.position, '');
					editor.remove();
				} else if(log.type == 'changeCursor') {
	    			editor.moveCursorToPosition(log.position);
	    			editor.selection.clearSelection();
	    		} else if(log.type == 'changeSelection') {
					editor.selection.setSelectionRange(log.position);
	    		} 

	        	if (index < logs.length - 1) {
	        		index = index + 1;
	        		console.log(log.type);
	                setTimeout(loop, (logs[index].time - log.time) / SPEED_UP_PLAYBACK_FACTOR);
	            } else  { //This code runs when the replay finishes
	            	handlers = true; //Turn hanlders back on
	            	SPEED_UP_PLAYBACK_FACTOR = 2; //Reset playback speed to double speed
	            	$("#double-replay-speed").val('Double Speed: ' + SPEED_UP_PLAYBACK_FACTOR + 'x');
	            }       	
	        }
	        loop();
	    }
	}

	function language_select_handler(e) {
    	editor.getSession().setMode("ace/mode/" + this.value);
	}

	function next_command_handler(e) {
		console.log(commandIndex);
		editor.execCommand(commands[commandIndex]);
		commandIndex = (commandIndex + 1)%commands.length;
		$("#next-command").val('Next Command: ' + commands[commandIndex]);
	}

	//Set up text editor
	var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/java");
    editor.setBehavioursEnabled(ALLOW_EDITOR_AUTO_COMPLETE);
    //editor.getSession().setUseSoftTabs(true);
    editor.focus();

    //Tracking logs are stored here
	var logs = [];

	//Other management global variables
	var handlers = true;
	var commandIndex = 0;
	var commands = Object.keys(editor.commands.commands);

	//Attach event handlers
	$('.playback textarea').on("keypress", keypress_handler);
	$('.playback textarea').on("keydown", keydown_handler);
	$('.playback').on('copy', copy_handler);
	$('#replay-logs').click(replay_logs_handler);
	$('#double-replay-speed').click(double_speed);
	$('#next-command').click(next_command_handler);
	$('#language-select').change(language_select_handler);
	editor.selection.on('changeSelection', change_selection_handler);
	editor.selection.on('changeCursor', change_cursor_handler);
	editor.on('paste', paste_handler);
	editor.on('cut', cut_handler);
	editor.on('change', ace_change_handler);

})





	/*editor.getSession().on('change', function(e) {
		if (handlers) {
			var text = e.data.text;
			console.log('b' + text + 'b');
			if (text == ' ' || text == '  ' || text == '   ' || text == '    ') {
				var logEntry = {'type': 'insert',
								'time': e.timeStamp,
								'keyCode': null,
								'text': text,
								'position': e.data.range.start}; 
		    	printKeyPress(logEntry, 'output');
		    	logs.push(logEntry);
			}
		    console.log(e.data.text);
		    console.log(e);
		}
	});*/
	//editor.getSession().on('change', function(e) {console.log(e)});