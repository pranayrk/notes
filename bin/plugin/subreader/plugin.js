"use strict";

function handleCueCommands(cue) {
    if(cue.startsWith("{{gotoslide}}")) {
        const goToSlide = cue.replace("{{gotoslide}}", "").trim();
        Reveal.slide(goToSlide, 0, 0);
        return true;
    }
    switch (cue) {
        case "{{left}}":
            Reveal.left();
            return true;
        case "{{right}}":
            Reveal.right();
            return true;
        case "{{up}}":
            Reveal.up();
            return true;
        case "{{down}}":
            Reveal.down();
            return true;
        case "{{prev}}":
            Reveal.prev();
            return true;
        case "{{next}}":
            Reveal.next();
            return true;
        case "{{pause}}":
            document.getElementById("submedia").pause();
            return true;
        default:
            return false;    
    }
}

function removeSubmedia() {
    const submedia = document.getElementById("submedia");
    if (submedia) {
        submedia.remove();
    }
}

function addSubtitles(config) {
    if(!config || !config.src) {
        return;
    }
    const audio = document.createElement("audio");
    audio.src="bin/plugin/subreader/blank.mp3";
    audio.id = "submedia";
    audio.controls = "";
    audio.playbackRate = config.speed ? config.speed : 1;

    const track = document.createElement("track");
    track.kind = "captions";
    track.label = "English";
    track.srclang = "en";
    track.src = config.src;
    track.mode = "showing"

    track.addEventListener('cuechange', (event) => {
        const cues = event.target.track.activeCues
        const subtitle = document.getElementById("subtitle");
        if(cues.length > 0) {
            if(!handleCueCommands(cues[0].text)) {
                subtitle.innerHTML = cues[0].text;
            }
        } else {
            subtitle.innerHTML = "";
        }
    });

    audio.appendChild(track)
    audio.textTracks[0].mode = "showing"


    const subtitle = document.createElement("div");
    subtitle.id = "subtitle"

    const slides = Reveal.getSlidesElement();
    slides.appendChild(audio);
    slides.appendChild(subtitle);
}


window.RevealSubreader = window.SubReader || {
    id: 'RevealSubreader',

    init: function(deck) {
        let config = Reveal.getConfig().subreader;
        if(!config) {
            return;
        }
        Reveal.addEventListener( 'ready', function( event ) {
            addSubtitles(config);
        });
        Reveal.on('slidechanged', (event) => {
                const audio = document.getElementById("submedia");
                if(audio) {
                    audio.pause();
                }
        });
        Reveal.on('slidetransitionend', (event) => {
            const state = Reveal.getState();
            if(state.indexh == 0 && state.indexv == 0) {
                const audio = document.getElementById("submedia");
                if(audio) 
                {
                    audio.pause();
                    audio.currentTime = 0;
                }
            } else {
                if(event.currentSlide.hasAttribute("data-subtitle")) {
                    config.src = event.currentSlide.getAttribute("data-subtitle");
                    removeSubmedia();
                    addSubtitles(config);
                }
                const audio = document.getElementById("submedia");
                if(audio) {
                    audio.play();
                }
            }
        });
    }
}
