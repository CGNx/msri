
$(function() {

	//Set up text editor
	var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
  

	var logs = [];
	var events = [];

	$('.ace_text-input').focus();
	


	
	//Prints csv row to screen for testing purposes
	//id is the string id for the output div
	function printKeyPress(arr, id) {
		var key = arr[1];
		var keyPressed = key < keyboardMap.length?keyboardMap[key]:String.fromCharCode(key); 
	        var line = '<b>Time</b>: ' + new Date(arr[0]) +
	        		   ', <b>Key Code</b>: ' + key +
	        		   ', <b>Key Value</b>: ' + keyPressed;
	        $('#' + id).append(line+'<br>');
	        $("#" + id).animate({
		        scrollTop: $("#" + id)[0].scrollHeight
		    }, 10);
	}

	function doUndo(){  
	  document.execCommand('undo', false, null);  
	}  
	   
	function doRedo(){  
	  document.execCommand('redo', false, null);  
	} 

	//Logs all keys into logs and events in events
	function playback_handler(e) {
    	key = e.keyCode;	    	
	    switch(key) {
		    case 33: //Page Up
		        e.preventDefault();
		        break;
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
	    	
    	var logEntry = [e.timeStamp, key];  	
    	printKeyPress(logEntry, 'output');
    	logs.push(logEntry);
    	events.push(e);
    }

    //Outputs a message when paste, cut, or copy occurs.
	function paste_cut_copy_handler(e) {
		$('#output').append('<span style="color:red; font-weight: bold"> '+e.type+' detected!</span><br>');
		$("#output").animate({
		        scrollTop: $("#output")[0].scrollHeight
		    }, 5);
	}

	//Takes a saved user dispatched event and recreates the same event
	function createEvent(evt) {
		return jQuery.Event(evt.type, evt);
	}

	//Replays all events in the the event log
	function replay(e) {

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
	}

	function language_select_handler(e) {
		console.log(this.value);
    	editor.getSession().setMode("ace/mode/" + this.value);
	}

	$('.playback').on("keydown", playback_handler);
	$('.playback').on('paste cut copy', paste_cut_copy_handler);
	$('#replay-button').click(replay);
	$('.playback').on('click drag dragend scroll', function(e) {
		console.log(e);
	});
	$('#language-select').change(language_select_handler);

})