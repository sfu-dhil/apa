(function($){

  function loadJson(data) {
    template = Handlebars.compile($("#screen-template").html());
    data.forEach(function (d, i) {
      d.image = 'public/screenshot/touched/' + d.image;
      $("#scenes").append(template(d));
    });
    $(".clip").draggable({
      revert: true,
      zIndex: 100
    });

    $("#playlist").droppable({
      accept: '.clip',
      activeClass: 'active',
      hoverClass: 'hover',

      drop: function (event, ui) {
        let clone = $(ui.draggable).clone();
        clone.draggable({destroy: true})
        .removeClass('ui-draggable-dragging ui-draggable ui-draggable-handle')
        .removeClass('clip')
        .attr('style', '');
        $(this).append(clone);
      }
    });
  }

  $("#playlist").on('mouseenter', function(e) {
    console.log("mouse enter");
    $("#playlist .media").sortable();
  });

  function init() {
    $.getJSON('touched.json', null, loadJson);
  }

  init();

})(jQuery);
