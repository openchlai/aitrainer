import{_ as M,u as R,A as U,r as p,H as Y,c as _,n as F,w as x,a as m,b as e,t as c,B as b,h as L,F as q,x as A,C as H,o as g,d as w,I as N,D as j}from"./index-DJHDVjkT.js";import{a as z}from"./axios-Bkw7EQY-.js";const G={class:"audio-screen"},J={class:"top-bar"},K={class:"audio-container"},Q=["src"],W={class:"playback-buttons"},X=["disabled"],Z=["disabled"],ee={key:0},ae={class:"current-time"},te={class:"evaluation-box"},oe={class:"radio-buttons"},ne=["onUpdate:modelValue"],le=["onUpdate:modelValue"],se={class:"action-buttons"},ue=["disabled"],ie=["disabled"],re={__name:"ChunkEvalScreen",setup(de){const f=R(),T=U(),I=H(),n=p(0),o=p(null),i=p(!1),h=p(0),C={dual_speaker:{label:"Dual Speaker"},speaker_overlap:{label:"Speaker Overlap"},background_noise:{label:"Background Noise"},prolonged_silence:{label:"Prolonged Silence"},not_normal_speech_rate:{label:"Not Normal Speech Rate"},echo_noise:{label:"Echo Noise"},incomplete_sentence:{label:"Incomplete Sentence"}},s=Y({});for(const a in C)s[a]=!1;const r=_(()=>T.audioList),d=_(()=>r.value[n.value]||{}),y=_(()=>r.value.length),D=_(()=>d.value.chunk_file||"");let v=null;F(()=>{const a=parseInt(I.params.absoluteIndex);r.value&&r.value.length>a?(n.value=Number.isNaN(a)?0:a,v=new Date):(console.log(r.value.length),console.error("Invalid audio index or audio list not loaded."))}),x(d,async()=>{i.value=!1,h.value=0;for(const a in s)s[a]=!1;await j(),o.value&&o.value.load(),v=new Date}),x(o,a=>{a&&(a.ontimeupdate=()=>{h.value=a.currentTime},a.onplay=()=>{i.value=!0},a.onpause=()=>{i.value=!1})});function E(){o.value&&o.value.play()}function P(){o.value&&o.value.pause()}function V(){o.value&&(o.value.currentTime=0,i.value=!1,o.value.pause())}function S(a){if(!o.value)return;const t=o.value.currentTime+a,u=o.value.duration||0;o.value.currentTime=Math.min(Math.max(t,0),u)}async function $(){if(!d.value.unique_id)return;const a=new Date,t=new Date(a-v),u={...s,is_evaluated:!0,evaluation_start:v.toISOString(),evaluation_end:a.toISOString(),evaluation_duration:t.toISOString().substr(11,8)};try{const l=await z.post(`/transcriptions/audio-chunks/${d.value.unique_id}/evaluate/`,u);l.data.created?(console.log(l.data.evaluation),f.success(`Chunk ${n.value} evaluation created successfully!`)):f.success(`Your evaluation for Chunk ${n.value} has been updated successfully!`)}catch(l){console.error("Error saving evaluation:",l),f.error(`Could not save evaluation for chunk ${n.value}. Please try again.`)}}function B(){n.value<r.value.length-1&&n.value++}function O(){n.value>0&&n.value--}return(a,t)=>(g(),m("div",G,[e("div",J,[e("p",null,c(n.value+1)+" / "+c(y.value),1),e("h2",null,"Evaluating Chunk "+c(n.value),1)]),e("div",K,[e("audio",{ref_key:"audioPlayer",ref:o,class:"audio-player",controls:""},[e("source",{src:D.value,type:"audio/wav"},null,8,Q),t[2]||(t[2]=b(" Your browser does not support the audio element. "))],512),e("div",W,[e("button",{onClick:E,disabled:i.value},"Play",8,X),e("button",{onClick:P,disabled:!i.value},"Pause",8,Z),e("button",{onClick:V},"Reset"),e("button",{onClick:t[0]||(t[0]=u=>S(-5))},"-5s"),e("button",{onClick:t[1]||(t[1]=u=>S(5))},"+5s")]),d.value.evaluated_by_user?(g(),m("div",ee,t[3]||(t[3]=[e("p",null,[e("span",{style:{"background-color":"green",color:"white","border-radius":"50%"}}," ✓ "),b(" You can update your evaluation")],-1)]))):L("",!0),e("div",ae," Time: "+c(h.value.toFixed(2))+"s / "+c(d.value.duration||0)+"s ",1)]),e("div",te,[(g(),m(q,null,A(C,(u,l)=>e("div",{key:l,class:"radio-group"},[e("label",null,c(u.label),1),e("div",oe,[e("label",null,[w(e("input",{type:"radio",value:!0,"onUpdate:modelValue":k=>s[l]=k},null,8,ne),[[N,s[l]]]),t[4]||(t[4]=b(" Yes "))]),e("label",null,[w(e("input",{type:"radio",value:!1,"onUpdate:modelValue":k=>s[l]=k},null,8,le),[[N,s[l]]]),t[5]||(t[5]=b(" No "))])])])),64))]),e("div",se,[e("button",{onClick:O,disabled:n.value===0},"Previous",8,ue),e("button",{onClick:$,class:"save-button"},"Save Evaluation"),e("button",{onClick:B,disabled:n.value===y.value-1},"Next",8,ie)])]))}},pe=M(re,[["__scopeId","data-v-33f5702e"]]);export{pe as default};
