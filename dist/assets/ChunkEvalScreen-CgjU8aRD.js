import{_ as M,u as R,s as U,r as p,C as F,c as _,n as L,w as S,a as y,b as e,t as c,x as k,F as q,A as Y,y as z,o as x,d as w,D as I,z as A}from"./index-6pGkwk_o.js";import{a as j}from"./axios-CPsZO0Op.js";const G={class:"audio-screen"},H={class:"top-bar"},J={class:"audio-container"},K=["src"],Q={class:"playback-buttons"},W=["disabled"],X=["disabled"],Z={class:"current-time"},ee={class:"evaluation-box"},ae={class:"radio-buttons"},te=["onUpdate:modelValue"],oe=["onUpdate:modelValue"],ne={class:"action-buttons"},le=["disabled"],se=["disabled"],ue={__name:"ChunkEvalScreen",setup(ie){const b=R(),N=U(),T=z(),n=p(0),t=p(null),i=p(!1),f=p(0),m={dual_speaker:{label:"Dual Speaker"},speaker_overlap:{label:"Speaker Overlap"},background_noise:{label:"Background Noise"},prolonged_silence:{label:"Prolonged Silence"},not_normal_speech_rate:{label:"Not Normal Speech Rate"},echo_noise:{label:"Echo Noise"},incomplete_sentence:{label:"Incomplete Sentence"}},s=F({});for(const a in m)s[a]=!1;const r=_(()=>N.audioList),d=_(()=>r.value[n.value]||{}),C=_(()=>r.value.length),D=_(()=>d.value.chunk_file||"");let v=null;L(()=>{const a=parseInt(T.params.absoluteIndex);r.value&&r.value.length>a?(n.value=Number.isNaN(a)?0:a,v=new Date):(console.log(r.value.length),console.error("Invalid audio index or audio list not loaded."))}),S(d,async()=>{i.value=!1,f.value=0;for(const a in s)s[a]=!1;await A(),t.value&&t.value.load(),v=new Date}),S(t,a=>{a&&(a.ontimeupdate=()=>{f.value=a.currentTime},a.onplay=()=>{i.value=!0},a.onpause=()=>{i.value=!1})});function E(){t.value&&t.value.play()}function P(){t.value&&t.value.pause()}function $(){t.value&&(t.value.currentTime=0,i.value=!1,t.value.pause())}function g(a){if(!t.value)return;const o=t.value.currentTime+a,u=t.value.duration||0;t.value.currentTime=Math.min(Math.max(o,0),u)}async function V(){if(!d.value.unique_id)return;const a=new Date,o=new Date(a-v),u={...s,is_evaluated:!0,evaluation_start:v.toISOString(),evaluation_end:a.toISOString(),evaluation_duration:o.toISOString().substr(11,8)};try{const l=await j.post(`/transcriptions/audio-chunks/${d.value.unique_id}/evaluate/`,u);l.data.created?(console.log(l.data.evaluation),b.success(`Chunk ${n.value} saved successfully! Evaluation ID: ${l.data}`)):b.success(`Chunk ${n.value} updated successfully! Evaluation ID: ${l.data}`)}catch(l){console.error("Error saving evaluation:",l),b.error(`Could not save evaluation for chunk ${n.value}. Please try again.`)}}function O(){n.value<r.value.length-1&&n.value++}function B(){n.value>0&&n.value--}return(a,o)=>(x(),y("div",G,[e("div",H,[e("p",null,c(n.value+1)+" / "+c(C.value),1),e("h2",null,"Evaluating Chunk "+c(n.value),1)]),e("div",J,[e("audio",{ref_key:"audioPlayer",ref:t,class:"audio-player",controls:""},[e("source",{src:D.value,type:"audio/wav"},null,8,K),o[2]||(o[2]=k(" Your browser does not support the audio element. "))],512),e("div",Q,[e("button",{onClick:E,disabled:i.value},"Play",8,W),e("button",{onClick:P,disabled:!i.value},"Pause",8,X),e("button",{onClick:$},"Reset"),e("button",{onClick:o[0]||(o[0]=u=>g(-5))},"-5s"),e("button",{onClick:o[1]||(o[1]=u=>g(5))},"+5s")]),e("div",Z," Time: "+c(f.value.toFixed(2))+"s / "+c(d.value.duration||0)+"s ",1)]),e("div",ee,[(x(),y(q,null,Y(m,(u,l)=>e("div",{key:l,class:"radio-group"},[e("label",null,c(u.label),1),e("div",ae,[e("label",null,[w(e("input",{type:"radio",value:!0,"onUpdate:modelValue":h=>s[l]=h},null,8,te),[[I,s[l]]]),o[3]||(o[3]=k(" Yes "))]),e("label",null,[w(e("input",{type:"radio",value:!1,"onUpdate:modelValue":h=>s[l]=h},null,8,oe),[[I,s[l]]]),o[4]||(o[4]=k(" No "))])])])),64))]),e("div",ne,[e("button",{onClick:B,disabled:n.value===0},"Previous",8,le),e("button",{onClick:V,class:"save-button"},"Save Evaluation"),e("button",{onClick:O,disabled:n.value===C.value-1},"Next",8,se)])]))}},de=M(ue,[["__scopeId","data-v-f3ddf365"]]);export{de as default};
