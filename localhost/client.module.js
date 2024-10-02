
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@4.0.2/mod.js'

import {
    f_o_webgl_program,
    f_delete_o_webgl_program,
    f_resize_canvas_from_o_webgl_program,
    f_render_from_o_webgl_program
} from "https://deno.land/x/handyhelpers@4.0.7/mod.js"

import {
    f_s_hms__from_n_ts_ms_utc,
} from "https://deno.land/x/date_functions@1.4/mod.js"

let f_o_beat = function(
    n_duration_nor, 
    s_step // stufe
){
    return {
        n_duration_nor, 
        s_step
    }
}
let f_o_bar = function(
    n_beat_nor, 
    a_o_beat
){
    return {
        n_beat_nor, 
        a_o_beat
    }
}
let n_bpm = 120;
let o_state = {
    n_bpm,
    n_ms_per_beat: (60*1000)/n_bpm*4.,
    b_edit_mode: false,
    o_beat: null,
    o_bar: null,
    a_o_bar: [
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '1'),
                f_o_beat(1./4., '2'),
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '1'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '1'),
                f_o_beat(1./4., '2'),
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '1'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '4'),
                f_o_beat(2./4., '5'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '4'),
                f_o_beat(2./4., '5'),
            ]
        ), 
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./8., '5'),
                f_o_beat(1./8., '6'),
                f_o_beat(1./8., '5'),
                f_o_beat(1./8., '4'),
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '1'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./8., '5'),
                f_o_beat(1./8., '6'),
                f_o_beat(1./8., '5'),
                f_o_beat(1./8., '4'),
                f_o_beat(1./4., '3'),
                f_o_beat(1./4., '1'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '1'),
                f_o_beat(1./4., '5'),
                f_o_beat(2./4., '1'),
            ]
        ),
        f_o_bar(
            1./4., 
            [
                f_o_beat(1./4., '1'),
                f_o_beat(1./4., '5'),
                f_o_beat(2./4., '1'),
            ]
        ),
    ]
};

let f_o_o_bar_o_beat_relative_to = function(n_summand){
    let n_idx_bar = o_state.a_o_bar.indexOf(o_state.o_bar);
    let n_idx_beat = o_state.o_bar.a_o_beat.indexOf(o_state.o_beat);

    n_idx_beat += n_summand;
    if(
        n_idx_beat >= o_state.o_bar.a_o_beat.length
    ){
        n_idx_beat = 0;
        n_idx_bar += n_summand;
    }
    if(n_idx_beat < 0){
        n_idx_bar += n_summand
    }
    if(
        n_idx_bar >= o_state.a_o_bar.length
    ){
        n_idx_bar = 0;
    }
    if(n_idx_bar < 0){
        n_idx_bar = o_state.a_o_bar.length-1
    }
    let o_bar = o_state.a_o_bar[n_idx_bar];
    if(n_idx_beat < 0){
        n_idx_beat = o_bar.a_o_beat.length-1
    }
    let o_beat = o_bar.a_o_beat[n_idx_beat];
    return {
        o_bar, 
        o_beat
    }
}
window.addEventListener('click', ()=>{
    o_state.b_edit_mode = false;
}, {b_bubbling_phase:true}.b_bubbling_phase) 
window.onkeydown = async function(o_e){
    let s_key = o_e.key;
    if(o_state.b_edit_mode){

        let n_summand = 0;
        if(s_key == 'ArrowRight'){n_summand = 1}
        if(s_key == 'ArrowLeft'){n_summand = -1}
        if(n_summand != 0){
            let o_o_bar_o_beat = f_o_o_bar_o_beat_relative_to(n_summand);
            o_state.o_bar = o_o_bar_o_beat.o_bar;
            o_state.o_beat = o_o_bar_o_beat.o_beat;
        }else{
            if(
                ['1','2','3','4','5','6','7','8','.'].includes(s_key)
                && o_state.o_beat.s_step.length <= 2
            ){
                o_state.o_beat.s_step += s_key;
            }
            if(
                s_key == ' '
            ){
                o_state.o_beat.s_step = ''
            }
            if(
                s_key == 'Backspace'
            ){
                o_state.o_beat.s_step = o_state.o_beat.s_step.slice(0,-1)
            }
        }
        await o_state.o_js__a_o_bar._f_render();
        return

    }
}
window.o_state = o_state
o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    .o_bar{
        display:flex;
        flex-direction:row;
        border-right: 2px solid white;
    }
    
    .a_o_bar{
        display:flex;
        flex-direction:row; 
        flex-wrap:wrap;
    }
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
);

let f_o_assigned = function(f, s, o){
    let o2 = {
        f_o_jsh:f
    }
    if(f?.f_o_jsh){
        o2 = f
    }
    return Object.assign(
        o, 
        {
            [s]: o2
        } 
    )[s]
}
let sampler;
        
// Initialize the sampler and preload the samples
async function loadSampler() {
    sampler = new Tone.Sampler({
        urls: {
            A4: "A4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    // Wait until all samples are loaded
    await Tone.loaded();
    console.log('Sampler is ready');
}

// Function to play a note at a specific frequency and duration
function playNote(frequency, duration) {
    if (!sampler) {
        console.log('Sampler not loaded yet');
        return;
    }

    // Ensure the AudioContext has started (Tone.js requires user interaction)
    Tone.start().then(() => {
        // Trigger the note at the given frequency and duration
        sampler.triggerAttackRelease(Tone.Frequency(frequency), duration / 1000);
    });
}
let f_n_freq_from_n_step = function(n_step, n_freq_hz_base = 432){
        // Half-step intervals for each step
        const halfSteps = {
            1: 0,    // Unison
            1.5: 1,  // Minor second (kleine Sekund)
            2: 2,    // Major second
            2.5: 3,  // Minor third (kleine Terz)
            3: 4,    // Major third
            4: 5,    // Perfect fourth
            4.5: 6,  // Tritone
            5: 7,    // Perfect fifth
            5.5: 8,  // Minor sixth (kleine Sext)
            6: 9,    // Major sixth
            6.5: 10, // Minor seventh (kleine Sept)
            7: 11,   // Major seventh
            8: 12    // Octave (2x base frequency)
        };
    
        // Check if the step is valid
        if (!halfSteps.hasOwnProperty(n_step)) {
            throw new Error('Invalid step. Please use values between 1 and 8, including fractional steps like 1.5, 2.5, etc.');
        }
    
        // Calculate the frequency based on the number of half steps
        const semitoneRatio = Math.pow(2, 1/12); // 12th root of 2 (~1.05946)
        const frequency = n_freq_hz_base * Math.pow(semitoneRatio, halfSteps[n_step]);
    
        return frequency;
}

// Load the sampler after the page has loaded
window.onload = loadSampler;
window.f_play_note = playNote   
// window.onclick = function(){
//     playNote(440, 1000); // Play A4 (440 Hz) for 1 second
// }
document.body.appendChild(
    await f_o_html__and_make_renderable(
        {
            a_o: [
                {
                    s_tag: "button", 
                    innerText: "Play", 
                    onclick: async ()=>{

                        if(!o_state.o_bar || !o_state.o_beat){
                            o_state.o_bar = o_state.a_o_bar[0]
                            o_state.o_beat = o_state.o_bar.a_o_beat[0]
                        }
                        let n_ms_timeout = 0;
                        let f_recursive = function(){
                            window.setTimeout(()=>{
                                if(!o_state.o_js__a_o_bar._b_rendering){
                                    o_state.o_js__a_o_bar._f_render();
                                }

                                let n_freq_base = 432;
                                n_ms_timeout = o_state.o_beat.n_duration_nor * o_state.n_ms_per_beat
                                let n_freq_hz = f_n_freq_from_n_step(parseFloat(o_state.o_beat.s_step), n_freq_base)
                                if(n_freq_hz){
                                    playNote(n_freq_hz, n_ms_timeout)
                                }
                                let o_o_bar_o_beat = f_o_o_bar_o_beat_relative_to(1);
                                o_state.o_bar = o_o_bar_o_beat.o_bar
                                o_state.o_beat = o_o_bar_o_beat.o_beat
                                f_recursive();
                            },n_ms_timeout);
                        }
                        f_recursive()
                        // console.log(o_o_bar_o_beat);

                    }
                }, 
                f_o_assigned(
                    ()=>{
                        return {
                            class: "a_o_bar",
                            a_o: [
                                ...o_state.a_o_bar.map(o_bar=>{
                                    return {
                                        class: "o_bar",
                                        a_o: [
                                            ...o_bar.a_o_beat.map(o_beat=>{
                                                return {
                                                    class: `clickable o_beat ${(o_state.o_beat == o_beat) ? 'clicked' : ''}`,
                                                    innerText: o_beat.s_step, 
                                                    onclick: async ()=>{
                                                        o_state.o_bar = o_bar;
                                                        o_state.o_beat = o_beat;
                                                        o_state.b_edit_mode = true;
                                                        await o_state.o_js__a_o_bar._f_render();
                                                    }
                                                }
                                            }), 
                                        ]
                                    }
                                }),
                                {
                                    s_tag: "button", 
                                    innerText: "add", 
                                    onclick: async()=>{
                                        o_state.a_o_bar.push(
                                            f_o_bar(
                                                1./4., 
                                                [
                                                    f_o_beat(1./4., ''),
                                                    f_o_beat(1./4., ''),
                                                    f_o_beat(1./4., ''),
                                                    f_o_beat(1./4., ''),
                                                ]
                                            )
                                        )
                                        await o_state.o_js__a_o_bar._f_render();
                                    }
                                }
                            ]
                        }
                    }, 
                    'o_js__a_o_bar',
                    o_state
                )
                
            ]
        }
    )
)