(function($){

  function loadJson(data) {
    template = Handlebars.compile($("#screen-template").html());
    data.forEach(function(d, i){
      d.image = 'public/screenshot/touched/' + d.image;
      $("#scenes").append(template(d));
    });
    $(".media").draggable({
      revert: true,
      zIndex: 100
    });
    $("#playlist").droppable({
      accept: '.media',
      activeClass: 'active',
      hoverClass: 'hover',

      drop: function(event, ui) {
        let clone = $(ui.draggable).clone();
        clone.draggable({ destroy: true }).removeClass('ui-draggable-dragging ui-draggable ui-draggable-handle')
          .attr('style', '');

        $(this).append(clone);
      }
    }).sortable().disableSelection();
  }

  function init() {
    $.getJSON('touched.json', null, loadJson);
  }

  init();

})(jQuery);