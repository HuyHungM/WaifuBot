module.exports = {
  ownerName: "huyhung0210",
  getEmbedConfig: function () {
    return {
      color: "#80FF92",
      errorColor: "#FF8DA1",
      footer: `Made by ${this.ownerName} with ♥`,
    };
  },
  emotes: {
    error: "❌",
    success: "✔",
  },
  music: {
    filters: {
      remix:
        "atempo=1.17, bass=g=14:width_type=q, treble=g=20:width_type=s, atempo=1.16, highpass=f=200, lowpass=f=16000, afade=enable='between(t,0,5)':t=in:st=5, aecho=0.8:0.88:6:0.4, adelay=5000|5000, asetrate=48000*1.02, flanger=delay=30, afftdn=nt=w",
      remix2:
        "atempo=1.17, bass=g=20:f=120, treble=g=20:width_type=q, acrusher=level_in=0.9:level_out=0.4:bits=2:aa=1, asetrate=48000*1.03, highpass=f=200, lowpass=f=17000, flanger=delay=10:depth=5:regen=20:width=50:speed=1:shape=sinusoidal:phase=50:interp=linear, aecho=0.8:0.88:60:0.4, adelay=5000|5000, afade=enable='between(t,0,5)':t=in:st=5, afftdn=nt=w",
      remix3:
        "atempo=1.17, bass=g=12:width_type=s, treble=g=12:width_type=q, lowpass=f=17000, aecho=0.8:0.88:60:0.4, afade=enable='between(t,0,5)':t=out:st=5, asetrate=48000*1.06, afftdn=nt=w",
      remix4:
        "atempo=1.19, bass=g=20:width_type=q, treble=g=20:width_type=o, asetrate=48000*1.02, highpass=f=200, lowpass=f=16000, aecho=0.8:0.88:6:0.4, chorus=0.7:0.9:55:0.4:0.25:2, afftdn=nt=w",
      lofi: "highpass=f=200, lowpass=f=3000, afftdn, atempo=0.87, asetrate=48000*0.95, afftdn=nt=w",
    },
  },
};
