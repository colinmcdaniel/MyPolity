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
  $('#rep-office').empty();
  $('#rep-phone').empty();
  $('#rep-email').empty();
  $('#rep-website').empty();
  var rep;
  for(var i = 0; i < Representitives.length; i++){
    if(representative == Representitives[i].name){
      rep = Representitives[i];
    }
  }
  $('#rep-name').text(rep.name);
  for(var k = 0; k < rep.addresses.length; k++){
    $('#rep-office').append('<h4>' + rep.addresses[k].replace(/\b[a-z]/g,function(f){return f.toUpperCase();}) + '</h4>');
  }
  for(var j = 0; j < rep.phones.length; j++){
    $('#rep-phone').append('<h4><a href="tel:' + rep.phones[j] + '">' + rep.phones[j] + '</a></h4>');
  }
  for(var l = 0; l < rep.emails.length; l++){
    $('#rep-email').append('<h4><a href="mailto:' + rep.emails[l] + '">' + rep.emails[l] + '</a></h4>');
  }
  for(var m = 0; m < rep.urls.length; m++){
    $('#rep-website').append('<h4><a href="' + rep.urls[m] + '">' + rep.urls[m] + '</a></h4>');
  }
}

$(document).on('click', '.trRep', function(){
  var rep = $(this).attr('data-name');
  repInfo(rep);
})
