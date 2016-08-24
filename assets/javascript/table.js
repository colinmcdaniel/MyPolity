function drawRep(representative){
  var tr = $('<tr>');
  tr.addClass('trRep')
  if(representative.level == 'federal'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);;
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    }
    $('#federal').append(tr);
  }
  if(representative.level == 'state'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    }
    $('#state').append(tr);
  }
  if(representative.level == 'local'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    }
    $('#local').append(tr);
  }
}
function repInfo(representative){
  var rep;
  for(var i = 0; i < Representitives.length; i++){
    if(representative == Representitives[i].name){
      rep = Representitives[i];
    }
  }
}

$(document).on('click', '.trRep', function(){
  var rep = $(this).attr('data-name');
  repInfo(rep);
})
