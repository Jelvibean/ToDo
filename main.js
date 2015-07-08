var serverCodePass;


function sendToServer(data) {
    $.ajax({
        type: "POST",
        url: 'todo.php',
        cache: false,
        data: $('#todoFormTag').serialize(),
        dataType: 'json',
        success: function(result) {
            if(result == "error"){
                serverCodePass = false;
            }
            else {
                serverCodePass = true;
            }

        },
        error: function (response, desc, exception) {
        }
    });
}




function popUpBox(action) {
    $('#button').removeClass('new').removeClass('update').addClass(action);
    if(action == 'new') {
        $('#button').val('Add Task');
    }
    else {
        $('#button').val('Update Task');
    }
    $('#popwrapper').fadeIn().prepend('<a href="#" class="close"><img src="images/closeX.gif" border="0" class="btn_close" /></a>');
    var popMargTop = ($('#popwrapper').height() + 20) / 2;
    var popMargLeft = ($('#popwrapper').width() + 20) / 2;
    $('#popwrapper').css({ 'margin-top' : -popMargTop, 'margin-left' : -popMargLeft });
    $('body').append('<div id="fade"></div>');
    $('#fade').css({'filter' : 'alpha(opacity=70)'}).fadeIn();
}


// Resets search to empty for every new entry
// Checks first div child to every div with .task
// From that reads its parent and fades it in.
// This is how you get the full div with info to display.

function reset() {
    $('#search').val('');
    $('.task div:first-child').each(function() {
        $(this).parent().fadeIn();

    });
}




$(document).ready( function() {

    $("#datepicker").datepicker();

    $('a.close, #fade').live('click', function() {
        $('#fade , .popup_block').fadeOut('fast', function() {
            $('#fade, a.close').remove();
        });
    });

    $('#button').live('click', function() {

        var addedTask = $('#task').val();
        var random = Math.random()* 1345600;
        var count = Math.round(random);
        var targetDate = $('#datepicker').val();

        // validation
        if(addedTask == '') {
            $('#error').html('Please fill out a task.').fadeIn('fast');
            return;
        }
        if(targetDate == '') {
            $('#error').html('Please fill out a date.').fadeIn('fast');
            return;
        }
        $('#error').html('').fadeOut('fast');

        // check if the div is empty
        if(!$('#content').is(":empty")) {
            var exists = false;
            $('.task div:first-child').each(function() {
                var current_task = $(this).text();
                if(addedTask == current_task) {
                    $('#error').html('Duplicate task.').fadeIn('fast');
                    exists = true;
                    return;
                }
            });
            if(exists) {
                return;
            }
        }

        sendToServer();
        if(serverCodePass == false){
            return false;
        }


        if($('#button').hasClass('new')) {
            var c = ('<div class="task" id="' + count + '"><div class="task-desc">' + addedTask  + '</div><div class="task-date">' + targetDate + '</div><div class="edit"></div><div id="delete' +  count + '" class="delete"></div></div>');

            if(!$('#content').is(":empty")) {
                $('.task').each(function() {

                    var current = $(this).children('div.task-date').html();
                    var sibling = $(this).siblings().children('div.task-date').html();
                    console.log(current);
                    console.log(targetDate);
                    console.log(sibling);
                    if(targetDate < current) {
                        console.log(1);
                        $('#content').prepend(c);
                        return false;
                    }
                    else if(targetDate > current && sibling == null) {
                        console.log(2);
                        $('#content').append(c);
                        return false;
                    }
                    else if(targetDate > current && targetDate < sibling) {
                        console.log(3)
                        $(this).siblings().prepend(c);
                        return false;
                    }
                    else { // las
                        console.log(4);
                        $('#content').append(c);
                        return false;
                    }
                });
            }
            else {
                console.log(5);
                $('#content').append(c);
            }
        }
        else {
            var id = $('#id').val();
            $('#task' + id).html($('#task').val());
            $('#taskedit' + id).html($('#datepicker').val());
        }
        $('#fade , .popup_block').fadeOut('fast', function() {
            $('#fade, a.close').remove();
        });
        $('#task').val('');
        $('#datepicker').val('');
        $('#id').val('');
    });

//CODE STARTS HERE
    $('#addbutton').click(function() {
        reset();
        popUpBox('new');
    });

    $('.delete').live('click', function() {
        $(this).parent().remove();
    });

    $('.edit').live('click', function() {
        var id = $(this).parent().attr("id");
        $('#id').val(id);
        $('#task').val($('#task' + id).html());
        $('#datepicker').val($('#taskdate' + id).html());
        popUpBox('update');
    });


    $('#search').keyup(function() {
        var usersrch = $('#search').val().toLowerCase();

        if($('#content').is(":empty")) {
            console.log("here");
            return;
        }
        $('.task div:first-child').each(function() {
            var current_task = $(this).html().toLowerCase();
            console.log(current_task)
            if(current_task.indexOf(usersrch) < 0){
                $(this).parent().fadeOut();
            }
            else {
                $(this).parent().fadeIn();
            }
        });

    });




});