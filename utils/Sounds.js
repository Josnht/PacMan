var Sounds = (function() {
    "use strict";


    function supportsAudio() {
        return !!document.createElement("audio").canPlayType;
    }


    function supportsMP3() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""));
    }

    function supportsOGG() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/ogg; codecs='vorbis'").replace(/no/, ""));
    }




    function Sounds(soundFiles, storageName, usesElement) {
        this.data = new Storage(storageName, true);
        this.format = supportsOGG() ? ".ogg" : (supportsMP3() ? ".mp3" : null);
        this.mute = !!this.data.get();
        this.old = this.mute;

        if (usesElement) {
            this.audio = document.querySelector(".audio");
            this.waves = document.querySelector(".waves");
        }

        if (this.format) {
            this.setSounds(soundFiles);
            this.setDisplay();
        } else if (this.audio) {
            this.audio.style.display = "none";
        }
    }

    Sounds.prototype.setSounds = function(soundFiles) {
        var audio, self = this;

        soundFiles.forEach(function(sound) {
            self[sound] = function() {
                audio = new Audio("audio/" + sound + self.format);
                if (self.format && !self.mute) {
                    audio.play();
                }
            };
        });
    };


    Sounds.prototype.toggle = function(mute) {
        this.mute = mute !== undefined ? mute : !this.mute;
        this.setDisplay();
        this.data.set(this.mute ? 1 : 0);
    };


    Sounds.prototype.startMute = function() {
        this.old = this.mute;
        this.toggle(true);
    };


    Sounds.prototype.endMute = function() {
        this.toggle(this.old);
    };


    Sounds.prototype.isMute = function() {
        return this.mute;
    };


    Sounds.prototype.setDisplay = function() {
        if (this.waves) {
            this.waves.style.display = this.mute ? "none" : "block";
        }
    };



    return Sounds;
}());