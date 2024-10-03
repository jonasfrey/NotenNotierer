
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
    f_render_from_o_webgl_program, 
    f_n_idx_ensured_inside_array
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
    a_o_beat
){
    return {
        a_o_beat
    }
}
let n_bpm = 120;
let o_state = {
    a_s_key_chromatic_scale: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    n_freq_hz_kammerton_a: 432,
    s_key_base_note: 'C',
    o_vexflow_renderer: null,
    o_vexflow_context: null,
    n_number_of_beats_per_bar: 4.,
    n_nor_type_of_beat_in_bar: 1./4.,
    n_bpm,
    n_ms_per_beat: (60*1000)/n_bpm*4.,
    b_edit_mode: false,
    o_beat: null,
    a_o_beat: [
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '2'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '2'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '4'),
        f_o_beat(2./4., '5'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '4'),
        f_o_beat(2./4., '5'),
        f_o_beat(1./8., '5'),
        f_o_beat(1./8., '6'),
        f_o_beat(1./8., '5'),
        f_o_beat(1./8., '4'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./8., '5'),
        f_o_beat(1./8., '6'),
        f_o_beat(1./8., '5'),
        f_o_beat(1./8., '4'),
        f_o_beat(1./4., '3'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '5'),
        f_o_beat(2./4., '1'),
        f_o_beat(1./4., '1'),
        f_o_beat(1./4., '5'),
        f_o_beat(2./4., '1')
    ], 
    a_o_bar: []
};
const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

let f_update_o_beat__from_n_idx_summand = function(n_idx_summand){
    let n_idx_beat = o_state.a_o_beat.indexOf(o_state.o_beat);
    let n_idx_beat_new = f_n_idx_ensured_inside_array(n_idx_summand, o_state.a_o_beat.length);
    o_state.o_beat = o_state.a_o_beat[n_idx_beat_new]
    return o_state.o_beat
}
window.addEventListener('click', ()=>{
    o_state.b_edit_mode = false;
}, {b_bubbling_phase:true}.b_bubbling_phase) 
window.onkeydown = async function(o_e){
    let s_key = o_e.key;
    if(o_state.b_edit_mode){

        let n_idx_summand = 0;
        if(s_key == 'ArrowRight'){n_idx_summand = 1}
        if(s_key == 'ArrowLeft'){n_idx_summand = -1}
        if(n_idx_summand != 0){
            let o_o_bar_o_beat = f_update_o_beat__from_n_idx_summand(n_idx_summand);

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
let f_o_info = function(
    n_step, 
    n_freq_base_a4 = 440, 
    s_name_kirchen_ladder = 'aeolian'
){
    let o_n_step_halftone_s_key__aeolian = {
        1.0:'A',
        1.5:'A#',
        2.0:'B',
        3.0:'C',
        3.5:'C#',
        4.0:'D',
        4.5:'D#',
        5.0:'E',
        6.0:'F',
        6.5:'F#',
        7.0:'G',
        7.5:'G#'
    }

    let a_s_name_ladder = ['aeolian', 'hypophrygian', 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian'];
    let n_idx_ladder_start = 0; 
    let s_name_ladder = a_s_name_ladder.find((s, n_idx)=>{
        if(s_name_kirchen_ladder?.toLowerCase() == s){
            n_idx_ladder_start = n_idx
            return s
        }
    });

    if(!s_name_ladder){
        throw Error(`ladder name ${s_name_ladder} is not supported, use a 'kirchentonart' (${a_s_name_ladder.join(',')})`);
    }

    let o_n_step_s_key = {};
    let n_numeral_start = 8.-n_idx_ladder_start;
    let a_n_step_n_halftone__aeolian = Object.keys(o_n_step_halftone_s_key__aeolian).map(s=>{return parseFloat(s)});
    let n_idx_halftone_start = a_n_step_n_halftone__aeolian.indexOf(n_numeral_start);
    if(s_name_kirchen_ladder == 'aeolian'){
        o_n_step_s_key = o_n_step_halftone_s_key__aeolian;
    }else{
        for(let n = 0; n<12; n+=1){
                let n_idx_wrapped = (n_idx_halftone_start+n)%12
                let s_key = Object.values(o_n_step_halftone_s_key__aeolian)[n_idx_wrapped]
                let n_step = a_n_step_n_halftone__aeolian[n_idx_wrapped];
                if(n_step >= n_numeral_start){
                    n_step -= n_numeral_start-1
                }else{
                    n_step += (8.-n_numeral_start)
                }
                o_n_step_s_key[n_step] = s_key
        }
    }

    // Calculate the frequency
    const semitoneRatio = Math.pow(2, 1 / 12); // 12th root of 2
    let n_step_in_aeolian = ( (n_numeral_start -1.) + n_step ) % 8
    if(s_name_kirchen_ladder == 'aeolian'){
        n_step_in_aeolian = n_step
    }
    const frequency = n_freq_base_a4 * Math.pow(semitoneRatio, n_step_in_aeolian);
    let n_idx_in_aeolian = a_n_step_n_halftone__aeolian.indexOf(n_step_in_aeolian);
    let s_key = Object.values(o_n_step_halftone_s_key__aeolian)[n_idx_in_aeolian];
    
    let o = {
        frequency,
        s_name_kirchen_ladder,
        o_n_step_s_key, 
        s_key
    }
    console.log(o)
    return o

}
window.f_o_info = f_o_info

  
let f_update_canvas = function(){
    const VF = Vex.Flow;

    // Get the actual HTML element by ID
    const o_el = document.getElementById('canvas');
    
    // Instead of passing the element ID, pass the HTML element directly
    const vf = new VF.Factory({
        renderer: { elementId: o_el, width: 1000, height: 2000 }
    });

    // EasyScore and system setup for drawing the stave and notes
    const score = vf.EasyScore();
    const system = vf.System();


    
    for(let o_bar of o_state.a_o_bar){
            // Create a 4/4 treble stave and add two parallel voices
        system.addStave({
            voices: [
                score.voice(
                    score.notes(
                        o_bar.a_o_beat.map(o_beat=>{
                            let o_info = f_o_info(
                            parseFloat(o_beat.s_step)
                            );
                            let s_key = o_info.s_key 
                            let n_duration = parseInt(1./o_beat.n_duration_nor);
                            if(o_beat.s_step.trim() == '.' 
                            || o_beat.s_step.trim() == '' )
                            {
                                s_key = 'r'
                            }
                            let s_octave = '4'
                            return `${s_key}${s_octave}/${n_duration}`      
                        }).join(',') 
                    )
                )
                // Top voice: 4 quarter notes with stems up
                // score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
                // Bottom voice: 2 half notes with stems down
                // score.voice(score.notes('C#4/h, C#4', { stem: 'down' }))
            ]
        }).addClef('treble').addTimeSignature('4/4');

        // let a_o_note = o_bar.a_o_beat.map(o_beat=>{
        //     let o_info = f_o_info(
        //         parseFloat(o_beat.s_step)
        //         );
        //         let s_key = o_info.s_key 
        //         let n_duration = parseInt(1./o_beat.n_duration_nor);
        //         if(o_beat.s_step.trim() == '.' 
        //         || o_beat.s_step.trim() == '' )
        //         {
        //             s_key = 'r'
        //         }
        //         // type: The note type (e.g., r for rest, s for slash notes, etc.) dots: The number of dots, which affects the duration. duration: The time length (e.g., q for quarter, h for half, 8 for eighth etc.)
        //         return new StaveNote({ keys: [`${s_key}/${n_duration}`], duration: 'q' })
        //     });
        // }
    }

    // Draw everything
    vf.draw();  

}
let f_update_a_o_bar = function(){
    o_state.a_o_bar = [];
    let n_nor_acc = 0;
    let n_nor_max_per_bar = o_state.n_number_of_beats_per_bar*o_state.n_nor_type_of_beat_in_bar;
    let o_bar = f_o_bar([]);
    for(let o_beat of o_state.a_o_beat){
        n_nor_acc += o_beat.n_duration_nor;
        o_bar.a_o_beat.push(o_beat);
        console.log(o_beat.n_duration_nor)
        if(n_nor_acc >= n_nor_max_per_bar){
            n_nor_acc = 0
            o_state.a_o_bar.push(o_bar)
            o_bar = f_o_bar([])
        }
    }
    f_update_canvas();
    console.log(o_state.a_o_bar)
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
                    s_tag: "input", 
                    oninput: (o_e)=>{
                        let n = parseInt(o_e.target.value); 
                        o_state.n_number_of_beats_per_bar = n;
                        f_update_a_o_bar()
                    }, 
                    value: o_state.n_number_of_beats_per_bar,
                    type: 'number', 
                    step: 1, 
                    min: 1, 
                    max: 20
                },
                {
                    s_tag: "input", 
                    oninput: (o_e)=>{
                        let n = parseInt(o_e.target.value); 
                        o_state.n_nor_type_of_beat_in_bar = 1./n;
                        f_update_a_o_bar()
                    }, 
                    value: parseInt(1./o_state.n_nor_type_of_beat_in_bar),
                    type: 'number', 
                    step: 1, 
                    min: 1, 
                    max: 20
                },
                {
                    s_tag: "button", 
                    innerText: "Play", 
                    onclick: async ()=>{
                        if(!o_state.o_beat){
                            o_state.o_beat = o_state.o_bar.a_o_beat[0]
                        }
                        let n_ms_timeout = 0;
                        let f_recursive = function(){
                            window.setTimeout(()=>{
                                if(!o_state.o_js__a_o_bar._b_rendering){
                                    o_state.o_js__a_o_bar._f_render();
                                }

                                // let n_freq_base = 432;
                                // n_ms_timeout = o_state.o_beat.n_duration_nor * o_state.n_ms_per_beat
                                // let n_freq_hz = f_n_freq_from_n_step(parseFloat(o_state.o_beat.s_step), n_freq_base)
                                // if(n_freq_hz){
                                //     playNote(n_freq_hz, n_ms_timeout)
                                // }
                                // let o_o_bar_o_beat = f_update_o_beat__from_n_idx_summand(1);

                                // f_recursive();
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
                ), 
                {
                    f_after_f_o_html__and_make_renderable:(o_el)=>{
                        
                        o_state.o_vexflow_renderer = new Renderer(o_el, Renderer.Backends.SVG);
                        o_state.o_vexflow_renderer.resize(500, 500);
                        o_state.o_vexflow_context = o_state.o_vexflow_renderer.getContext();


                    },
                    f_o_jsh:()=>{
                        return {
                            // s_tag: "canvas", 
                            id:'canvas'
                        }
                    }
                }
                
            ]
        }
    )
)

f_update_a_o_bar()
await o_state.o_js__a_o_bar._f_render();