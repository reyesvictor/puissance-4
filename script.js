function myOnClick(element,functionToLaunch,valueToPass = null,value2 = null,value3 = null) {
  $(element).prop("onclick", null).off("click");
  $(`${element}`).on("click", function(e) {
    functionToLaunch(e, this, valueToPass, value2, value3);
  });
}

$( document ).ready(function() {
  
  showMenu();
  function showMenu() {
    //Get information for the game 
    $('#param').append(`
    <h1 class='font-color'>Please choose paremeters for your new game.</h1></br>
    <input class='choice' type="number" id="col" name="namecol" required min="6" max="15" size="12" placeholder='Number of columns'><br>
    <input class='choice' type="number" id="row" name="namerow" required min="6" max="15" size="12" placeholder='Number of rows'><br>
    <select class='choice' name='color' id='select-color-1' required>
      <option selected="true" disabled="disabled" value=''>Color Player 1</option>    
    </select><br>
    <select class='choice' name='color' id='select-color-2' required>
    <option selected="true" disabled="disabled" value=''>Color Player 2</option>    
    </select><br>
    <button class='choice btn' id='btnnewgame'>New Game</button>
    `);
    $('#col').val('7');
    $('#row').val('6');
  }

  //COLOR CHOICE
  let array = ['red', 'green', 'yellow', 'orange', 'purple'];
  for (let j = 1; j <= 2; j++) { //number of players
    for (let i = 0; i < array.length; i++) { //colors
      $(`#select-color-${j}`).append(`<option value="${array[i]}">${array[i]}</option>`);
    }
  }

  myOnClick('#btnnewgame', getInf);  
  //    <input type="text" id="name-player1" name="namep1" required minlength="2" maxlength="10" size="12" placeholder='Name of Player1'><br>
  // <input type="text" id="name-player2" name="namep2" required minlength="2" maxlength="10" size="12" placeholder='Name of Player2'></br>
  function getInf() { 
    let check = ''; 
    let str = '';
    let min = 6;
    let max = 15;
    let param = 
    {
      Number_Of_Columns: $('#col').val(),
      Number_Of_Rows: $('#row').val(),
      Color_Of_Player_1: $('#select-color-1 option:selected').val(), 
      Color_Of_Player_2: $('#select-color-2 option:selected').val(), 
    }

    $.each( param, function (i, val) {
      if ( val == '' ) {
        str += i + " is missing.\n";
        check = 'missing';
      }
      if ( parseFloat(val) > max || parseFloat(val) < min ) {
        str += i + ` has to be between ${min} and ${max}.\n`;
        check ='missing';
      }
    })

    if ( check == '' ) {
      $('#game').puissance4(param);
      $('#param').hide();
    } else {
      alert(str);
    }
  }

  myOnClick('#replay', replay);

  function replay() {
    $('#replay').hide();
    $('#game').text('');
    $('#param').show();
    $('#game').hide();
    $('#game').css('pointer-events', '')
  }

});