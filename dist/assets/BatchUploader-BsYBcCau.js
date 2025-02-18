import{_ as h,r as c,w as T,m as w,o as d,a as p,b as t,F as k,A as L,t as b,s as F,d as R,f as $,h as m,y,z as q,g as P,j as V}from"./index-C4K1h0fP.js";const B={class:"container"},D={class:"request-list"},M={class:"request-header"},N={class:"request-title"},E=["onClick"],j={key:0,class:"transcription-container"},I={class:"transcription-title"},z=["src"],O={class:"audio-controls"},S=["disabled"],Y=["disabled"],G={class:"audio-navigation"},H={class:"current-time"},J={__name:"TranscriptionList",setup(v){const n=c([]),u=c(null),o=c(""),a=c(null),r=c(!1),i=c(0),_=async()=>{try{const s=await y.get("http://127.0.0.1:8000/api/transcription/case-records");n.value=s.data}catch(s){console.error("Error fetching transcription requests:",s)}},C=s=>{u.value=s,o.value="",i.value=0,r.value=!1},x=()=>{a.value&&(a.value.play(),r.value=!0)},g=()=>{a.value&&(a.value.pause(),r.value=!1)},U=()=>{a.value&&(a.value.currentTime=0,r.value=!1,o.value="")},f=s=>{if(a.value){const e=a.value.currentTime+s,l=a.value.duration||0;a.value.currentTime=Math.min(Math.max(e,0),l)}};T(a,s=>{s&&(s.ontimeupdate=()=>{i.value=s.currentTime})}),T(()=>{var s,e;return(e=(s=u.value)==null?void 0:s.audio_file)==null?void 0:e.audio_file},async(s,e)=>{a.value&&s&&e&&s!==e&&(await q(),a.value.load())});const A=()=>{console.log("Submitting transcription:",o.value)};return w(_),(s,e)=>(d(),p("div",B,[e[6]||(e[6]=t("h1",{class:"title"},"Transcription Requests",-1)),t("ul",D,[(d(!0),p(k,null,L(n.value,l=>(d(),p("li",{key:l.audio_file.unique_id,class:"request-item"},[t("div",M,[t("span",N,b(l.case_id)+" - "+b(l.narrative),1),t("button",{onClick:st=>C(l),class:"transcribe-button"},"Transcribe",8,E)])]))),128))]),u.value?(d(),p("div",j,[t("h2",I,"Transcribing Case: "+b(u.value.case_id),1),t("audio",{ref_key:"audioPlayer",ref:a,controls:"",class:"audio-player"},[(d(),p("source",{key:u.value.audio_file.audio_file,src:`http://localhost:8000${u.value.audio_file.audio_file}`,type:"audio/wav"},null,8,z)),e[5]||(e[5]=F(" Your browser does not support the audio element. "))],512),t("div",O,[t("button",{onClick:x,disabled:r.value,class:"play-button"},"Play",8,S),t("button",{onClick:g,disabled:!r.value,class:"pause-button"},"Pause",8,Y),t("button",{onClick:U,class:"reset-button"},"Reset")]),t("div",G,[t("button",{onClick:e[0]||(e[0]=l=>f(-10)),class:"skip-button"},"-10s"),t("button",{onClick:e[1]||(e[1]=l=>f(-5)),class:"skip-button"},"-5s"),t("button",{onClick:e[2]||(e[2]=l=>f(5)),class:"skip-button"},"+5s"),t("button",{onClick:e[3]||(e[3]=l=>f(10)),class:"skip-button"},"+10s")]),R(t("textarea",{"onUpdate:modelValue":e[4]||(e[4]=l=>o.value=l),class:"transcription-textarea",rows:"6",placeholder:"Enter transcription here..."},null,512),[[$,o.value]]),t("p",H," Current Time: "+b(i.value.toFixed(2))+" seconds ",1),t("button",{onClick:A,class:"transcribe-button"}," Submit Transcription ")])):m("",!0)]))}},K=h(J,[["__scopeId","data-v-b522b62d"]]),Q={components:{TranscriptionList:K},setup(){const v=c(null),n=c(""),u=c("");return{audioFile:v,audioURL:n,transcript:u,handleFileUpload:async r=>{const i=r.target.files[0];i&&(n.value=URL.createObjectURL(i),v.value=i)},transcribeAudio:async()=>{if(!v.value){alert("Please upload an audio file.");return}const r=new FormData;r.append("audio_file",v.value);try{const i=await y.post("http://127.0.0.1:8000/api/transcription/transcribe/",r,{headers:{"Content-Type":"multipart/form-data"}});u.value=i.data.model_transcript}catch(i){console.error("Transcription failed:",i)}}}}},W={class:"container"},X={key:0},Z=["src"],tt={key:1};function et(v,n,u,o,a,r){const i=V("TranscriptionList");return d(),p(k,null,[P(i),t("div",W,[n[3]||(n[3]=t("h2",null,"Upload & Transcribe Audio",-1)),t("input",{type:"file",onChange:n[0]||(n[0]=(..._)=>o.handleFileUpload&&o.handleFileUpload(..._)),accept:"audio/*"},null,32),o.audioURL?(d(),p("div",X,[t("audio",{src:o.audioURL,controls:""},null,8,Z),t("button",{onClick:n[1]||(n[1]=(..._)=>o.transcribeAudio&&o.transcribeAudio(..._))},"Transcribe")])):m("",!0),o.transcript?(d(),p("div",tt,[n[2]||(n[2]=t("h3",null,"Transcription",-1)),t("p",null,b(o.transcript),1)])):m("",!0)])],64)}const ot=h(Q,[["render",et],["__scopeId","data-v-123d4b59"]]);export{ot as default};
