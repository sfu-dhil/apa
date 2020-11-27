"use strict";

(function () {

  /**
   * Process the JSON with all the clipping data, add the clippings to the page.
   *
   * Handlebars might be overkill here, but it's just so damn useful.
   *
   * @param {Array} data
   */
  function loadJson(data) {
    let templateText = document.getElementById('screen-template').innerText;
    let template = Handlebars.compile(templateText);
    let scenes = document.getElementById('scenes');
    data.forEach(d => {
      scenes.insertAdjacentHTML('beforeend', template(d));
    });
  }

  /**
   * When a clipping drag is started, make a copy of the clipping HTML so that it can
   * be copied to the playlist later.
   *
   * @param event
   */
  function clipDragStart(event) {
    event.dataTransfer.setData('text/html', event.target.outerHTML);
    event.dataTransfer.dropEffect = 'copy';
  }

  /**
   * Initialize one clipping element as a draggable object, and make sure that
   * its descendents cannot be dragged.
   * @param element
   */
  function clipDragInit(element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', clipDragStart);
    element.querySelectorAll('*')
      .forEach(n => n.setAttribute('draggable', false));
  }

  /**
   * Initialize the clipping list so that the items can be added to the playlist.
   */
  function dragInit() {
    document.querySelectorAll('.clip')
      .forEach(clipDragInit);
  }

  /**
   * A clip has been dragged over the playlist.
   * @param event
   */
  function playlistDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  /**
   * Move a clip up in the playlist if it is not at the top.
   * @param event
   */
  function moveClipUp(event) {
    event.preventDefault();
    let clip = event.target.closest('.clip');
    let previous = clip.previousElementSibling;
    if( ! previous) {
      return;
    }
    let parent = clip.parentNode;
    parent.insertBefore(clip, previous);
  }

  /**
   * Move a clip down the playlist if it is not at the end.
   *
   * @param event
   */
  function moveClipDown(event) {
    event.preventDefault();
    let clip = event.target.closest('.clip');
    let next = clip.nextElementSibling;
    if( ! next) {
      return;
    }
    let parent = clip.parentNode;
    parent.insertBefore(next, clip);
  }

  /**
   * Remove a clip from the playlist.
   *
   * @param event
   */
  function removeClip(event) {
    event.preventDefault();
    let clip = event.target.closest('.clip');
    clip.parentNode.removeChild(clip);
  }

  /**
   * Once a clip is dropped in the playlist, copy it over and add some controls to
   * it. And make it not draggable.
   *
   * @param event
   */
  function playlistDrop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text/html');
    let element = document.createRange().createContextualFragment(data).childNodes.item(0);
    element.setAttribute('draggable', false);
    element.insertAdjacentHTML('beforeend', '<button class="up">Up</button><button class="down">Down</button><button class="remove">Remove</button>');
    element.querySelector('.up').addEventListener('click', moveClipUp);
    element.querySelector('.down').addEventListener('click', moveClipDown);
    element.querySelector('.remove').addEventListener('click', removeClip);
    event.target.appendChild(element);
  }

  /**
   * Set up the playlist element as a drop area.
   */
  function dropInit() {
    let element = document.querySelector('#playlist');
    element.addEventListener('dragover', playlistDragOver);
    element.addEventListener('drop', playlistDrop);
  }

  /**
   * Convert hh:mm:ss to number of seconds.
   *
   * @param time
   * @returns {number}
   */
  function timeToSeconds(time) {
    let hms = time.split(':').map(n => parseInt(n));
    return (hms[0] * 60 + hms[1]) * 60 + hms[2];
  }

  /**
   * The video started playing, so get the list of clips in the playlist,
   * set the start time to the first clip, and add an event listener for the
   * time update event.
   *
   * @param event
   */
  function videoPlay(event) {
    event.preventDefault();
    let clips = document.querySelectorAll('#playlist .clip');
    if(clips.length === 0) {
      alert("You have not added any clips to the playlist.");
    }
    let start = timeToSeconds(clips[0].dataset.start);
    let video = document.querySelector('#video');
    video.currentTime = start;

    let index = 0;
    let endTime = timeToSeconds(clips[0].dataset.end);
    video.addEventListener('timeupdate', video.listener = function(){
      // This needs to be an anonymous function so that it has access to the list of
      // clips.
      if (video.currentTime >= endTime) {
        if (index >= clips.length - 1) {
          video.pause();
          return;
        }
        index++;
        video.currentTime = timeToSeconds(clips[index].dataset.start);
        endTime = timeToSeconds(clips[index].dataset.end);
      }
    });
  }

  /**
   * Remove the timeupdate listener from the video, so that when it resumes
   * it will refresh the clips and start from the beginning.
   */
  function videoStop() {
    let video = document.querySelector('#video');
    video.removeEventListener('timeupdate', video.listener);
  }

  /**
   * Initialize the video player by added the play and pause event listeners.
   */
  function videoInit() {
    let element = document.querySelector('#video');
    element.addEventListener('play', videoPlay)
    element.addEventListener('pause', videoStop);
  }

  function ready(fn) {
    if(document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 1);
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initialize() {
    let metadataUrl = document.querySelector('#video').dataset.metadata;

    /**
     * Fetch is super!
     */
    fetch(metadataUrl)
    .then(response => response.json())
    .then(loadJson)
    .then(dropInit)
    .then(dragInit)
    .then(videoInit);
  }

  ready(initialize);

})();
