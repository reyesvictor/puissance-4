(function($) {
  $.fn.puissance4 = function (param = null) {

    $('#game').show();
    let div = $(this); 
    gg = 'game-generated';
    createGame();

    function createGame()  {
      checkColor();
      window.start = 0;
      window.data_1 = [];
      window.data_2 = [];
      for (let i = 0; i < param['Number_Of_Columns']; i++) {
        createCol(i);
      }
      myOnClick(`.${gg}`, play);
      myOnClick('#goback', fuckgoback);
      $(div).before(`<h1 id='game-title-player' class='box' style='color: ${window.color1};'>Player 1</h1>`);
    }

    function getUserTurn() {
      if ( window.start % 2 ) {
        return 1;
      } else {
        return 2;
      }
    }

    function checkColor() {
      let arr = ['red', 'green', 'yellow', 'orange', 'purple'];
      window.color1 = param['Color_Of_Player_1'];
      window.color2 = param['Color_Of_Player_2'];
      if ( window.color1 == window.color2 ) {
        for (let i = 0; i < arr.length; i++) {
          if ( window.color2 !== arr[i]) {
            window.color2 = arr[i];
            break;
          }
        }
      }
    }

    function createCol(i) {
      $(div).append(`<span class='${gg}' value='${i}' id='${gg}${i}'></span>`);
      for (let j = param['Number_Of_Rows'] - 1; j >= 0; j--) {
        let empty = '';
        if ( j == 0 ) {
          empty = ` playable-${i}`;
        }
        $(`#${gg}${i}`).append(`
        <div value='${i}_${j}' class='circle${empty}' id='${i}_${j}'
        style='width: ${(30/param['Number_Of_Rows'])}vw; height:${(30/param['Number_Of_Rows'])}vw; margin: ${(3/param['Number_Of_Rows'])}vw;'>
        </div>`);
      }
    }

    function play(e, here) {
      $('#goback').show();
      $('#game').css('pointer-events', 'none'); //e debloque a la fin de play
      playerturn();
      store(here.getAttribute('value'));
      checkEnd();
      setTimeout( () => {
        $('#game').css('pointer-events', ''); //se bloque au debut de play
      }, 500)
    }
    
    function playerturn() {
      let turn = getUserTurn();
      $('#goback').text('Cancel Player ' + turn + ' previous move');
      $('#game-title-player').text('Player ' + turn);
      $('#game-title-player').css('color', window['color' + turn]);
      window.start++;
    }
    
    function store(col_nbr) {
      let cl_play = 'playable-' + col_nbr;
      let cl_play_dot = '.playable-' + col_nbr;
      let id_next = '';
      let id = '#'  + $(cl_play_dot).attr('id');
      window.id_prec = id;
      window.cl_play_dot_prec = cl_play;
      let value = $(cl_play_dot).attr('id');
      //Next Input
      if ( $(cl_play_dot).length > 0 ) {
        id_next = value.split('_');
        id_next = '#'  + id_next[0] + "_" +  (parseFloat(id_next[1]) + 1);
        window.id_next_stored = id_next;
      } else {
        alert("Can't play this row anymore");
        return false;
      }
      //AFFICHER JETON
      $(id).removeClass(cl_play);
      if ( $(id_next) && $(id_next).length > 0 ) {
        $(id_next).addClass(cl_play);
      }
      // JETON ANIMÉ
      let turn = getUserTurn();
      window['data_' + turn].push(value);
      animation(window['color' + turn], value);
      checkWin(window['data_' + turn], turn);
    }

    function fuckgoback() {
      $('#goback').hide();
      myOnClick(`.${gg}`, play);
      myOnClick('#goback', fuckgoback);
      //Restore previous html
      $(window.id_next_stored).removeClass(window.cl_play_dot_prec);
      $(window.id_prec).addClass(window.cl_play_dot_prec);
      $(window.id_prec).css('background', '');
      //Erase last input in array
      let turn = getUserTurn();
      window['data_' + turn ].pop();
      playerturn();
    }
    
    function animation(color, value) {
      let xconst = value.split('_')[0];
      let y = value.split('_')[1];
      let newid;
      let j = 0;
      let count = param['Number_Of_Rows'];
      let setInt = setInterval(counter, 60);
      function counter() {
        --count;
        newidprec = '#' + xconst + '_' + (count + 1);
        newid = '#' + xconst + '_' + count;
        if ( count == y ) {
          $(newid).css('background', color);
          clearInterval(setInt);
        }
        $(newidprec).css('background', '');
        $(newid).css('background', color);
      }
    }

    function checkWin(dia, player) {
      let counter = 0;
      let arr = [];
      let str = '';
      dia.sort( ((a,b) => a-b));
      let arrverif = ['horizontal', 'vertical', 'diagonal', 'reverse_diagonal'];
      let verif = {
        'vertical': function(x, y) { return ( parseFloat(x)) + '_' + ( parseFloat(y) + 1 ); },
        'horizontal': function(x, y) { return ( parseFloat(x) + 1 ) + '_' + ( parseFloat(y)); },
        'diagonal': function(x, y) { return ( parseFloat(x) + 1 ) + '_' + ( parseFloat(y) + 1); },
        'reverse_diagonal': function(x, y) { return ( parseFloat(x) - 1 ) + '_' + ( parseFloat(y) + 1); }
      };
      for (let v = 0; v < arrverif.length; v++) {
        counter = 0;
        for (let i = 0; i < dia.length; i++) {
          arr = dia[i];
          arr = arr.split('_');
          str = verif[arrverif[v]](arr[0], arr[1]);
          while ( $.inArray(str, dia) !== -1 ) {
            counter++;
            arr2 = str.split('_');
            str = verif[arrverif[v]](arr2[0], arr2[1]);
          }
          if ( counter == 3 ) {
            setTimeout( () => {
              alert(`We have a ${arrverif[v]} win ! Well played Player ${player} !`);
              endGame(player);
            }, 400);
            break;
          }
          counter = 0;
        }
     }
    }

    function checkEnd() {
      let j = 0;
      for (let i = 0; i < param['Number_Of_Columns']; i++) {
        if ( $('.playable-' + i ).length > 0 ){
          j++;
        }
      }
      if ( j == 0 ) {
        alert('The game has ended without winners');
        endGame(0);
        return false;
      }
    }
    
    function endGame(pl) {
      $('#game').css('pointer-events', 'none');
      $('#goback').hide();
      $('#replay').show();
      $('button#replay').show();
      $('div#score-board').show();
      $('#game-title-player').remove();
      if ( pl !== 0 ) {
        incrementPlayerScore(pl);
      }
    }

    function incrementPlayerScore(pl) {
      id = '#score-' + pl;
      score_prec = parseFloat($(id).text());
      $(id).text(score_prec + 1);
    }
  }
}(jQuery));