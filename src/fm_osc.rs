use wasm_bindgen::prelude::*;
use web_sys::{AudioContext, OscillatorType};

#[wasm_bindgen]
pub struct FmOsc {
    ctx: AudioContext,
    primary: web_sys::OscillatorNode,
    gain: web_sys::GainNode,
    fm_gain: web_sys::GainNode,
    fm_osc: web_sys::OscillatorNode,
    fm_freq_ratio: f32,
    fm_gain_ratio: f32,
}

impl Drop for FmOsc {
    fn drop(&mut self) {
        let _ = self.ctx.close();
    }
}

#[wasm_bindgen]
impl FmOsc {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<FmOsc, JsValue> {
        let ctx = web_sys::AudioContext::new()?;
        let primary = ctx.create_oscillator()?;
        let fm_osc = ctx.create_oscillator()?;
        let gain = ctx.create_gain()?;
        let fm_gain = ctx.create_gain()?;
        primary.set_type(OscillatorType::Sine);
        primary.frequency().set_value(440.0);
        gain.gain().set_value(0.0);
        fm_gain.gain().set_value(0.0);
        fm_osc.set_type(OscillatorType::Sine);
        fm_osc.frequency().set_value(0.0);
        primary.connect_with_audio_node(&gain)?;
        gain.connect_with_audio_node(&ctx.destination())?;
        fm_osc.connect_with_audio_node(&fm_gain)?;
        fm_gain.connect_with_audio_param(&primary.frequency())?;
        primary.start()?;
        fm_osc.start()?;
        Ok(FmOsc {
            ctx,
            primary,
            gain,
            fm_gain,
            fm_osc,
            fm_freq_ratio: 0.0,
            fm_gain_ratio: 0.0,
        })
    }

    #[wasm_bindgen]
    pub fn set_gain(&self, mut gain: f32) {
        if gain > 1.0 {
            gain = 1.0;
        }
        if gain < 0.0 {
            gain = 0.0;
        }
        self.gain.gain().set_value(gain);
    }

    #[wasm_bindgen]
    pub fn set_primary_frequency(&self, freq: f32) {
        self.primary.frequency().set_value(freq);
        self.fm_osc.frequency().set_value(self.fm_freq_ratio * freq);
        self.fm_gain.gain().set_value(self.fm_gain_ratio * freq);
    }

    #[wasm_bindgen]
    pub fn set_note(&self, note: u8) {
        let freq = midi_to_freq(note);
        self.set_primary_frequency(freq);
    }

    #[wasm_bindgen]
    pub fn set_fm_amount(&mut self, amt: f32) {
        self.fm_gain_ratio = amt;

        self.fm_gain
            .gain()
            .set_value(self.fm_gain_ratio * self.primary.frequency().value());
    }

    #[wasm_bindgen]
    pub fn set_fm_frequency(&mut self, amt: f32) {
        self.fm_freq_ratio = amt;
        self.fm_osc
            .frequency()
            .set_value(self.fm_freq_ratio * self.primary.frequency().value());
    }
}

fn midi_to_freq(note: u8) -> f32 {
    27.5 * 2f32.powf((note as f32 - 21.0) / 12.0)
}
