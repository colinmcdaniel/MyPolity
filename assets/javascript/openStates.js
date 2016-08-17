$(document).ready(function(){
      $('.slides').slick({
        arrows: false,
        dots: true,
        slidesToShow: 2,
        infinite: true,
      });
    });
$(document).on('click', '#submit-button', function() {
  var user = {
    zip: ('#zip').val()
  };
});
