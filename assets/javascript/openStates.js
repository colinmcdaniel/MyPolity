$(document).ready(function(){
      $('.slides').slick({
        arrows: true,
        dots: true,
        slidesToShow: 2,
        infinite: true,
        responsive: [
    // {
    //   breakpoint: 1024,
    //   settings: {
    //     slidesToShow: 3,
    //     slidesToScroll: 3,
    //     infinite: true,
    //     dots: true
    //   }
    // },
    // {
    //   breakpoint: 600,
    //   settings: {
    //     slidesToShow: 2,
    //     slidesToScroll: 2
    //   }
    // },
    {
      breakpoint: 376,
      settings: {
        arrows: false,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
      });
    });
$(document).on('click', '#submit-button', function() {
  var user = {
    zip: ('#zip').val()
  };
});
