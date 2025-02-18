import{_ as g,r as v,o as d,a as c,b as s,t as _,h as y,q as h,m as S,z as b,c as k,d as A,v as C,g as D,F as L,A as x,u as B}from"./index-C4K1h0fP.js";import{a as w}from"./axios-KRF_1AH0.js";const E={setup(){const l=v([]),e=v("");return{fileList:l,message:e,handleFolderSelection:n=>{const i=Array.from(n.target.files);l.value=i},submitFolder:async()=>{var n,i;try{if(l.value.length===0){e.value="No files selected.";return}const o=new FormData;l.value.forEach(m=>{o.append("files",m)});const f=await w.post("/transcriptions/process-audio/",o,{headers:{"Content-Type":"multipart/form-data"}});e.value=f.data.message}catch(o){e.value=((i=(n=o.response)==null?void 0:n.data)==null?void 0:i.error)||"Error processing files."}}}}},N={class:"folder-picker"},P=["disabled"],V={key:0,class:"message"};function M(l,e,u,t,n,i){return d(),c("div",N,[e[2]||(e[2]=s("h2",null,"Select a Folder to Process Audio Files",-1)),s("input",{type:"file",webkitdirectory:"",directory:"",onChange:e[0]||(e[0]=(...o)=>t.handleFolderSelection&&t.handleFolderSelection(...o))},null,32),s("button",{onClick:e[1]||(e[1]=(...o)=>t.submitFolder&&t.submitFolder(...o)),disabled:t.fileList.length===0},"Process Audio Files",8,P),t.message?(d(),c("p",V,_(t.message),1)):y("",!0)])}const I=g(E,[["render",M],["__scopeId","data-v-1df72f99"]]),R={class:"audio-list-screen"},T={class:"sort"},$={class:"audio-list"},q=["onClick"],z={key:0,class:"error-message"},O={__name:"AudioList",setup(l){const e=v([]),u=v("oldest"),t=v(""),n=h(),i=B();S(async()=>{await o(),await b()});async function o(){try{const a=await w.get("/transcriptions/cleaned-audio-files/");e.value=a.data,n.setAudioList(e.value),t.value=""}catch(a){console.error("Error fetching audios:",a),t.value="Failed to load audio files. Please try again later."}}const f=k(()=>e.value.sort((a,r)=>u.value==="newest"?new Date(r.created_at)-new Date(a.created_at):new Date(a.created_at)-new Date(r.created_at)));function m(a){console.log(a.toString()),i.push({name:"AudioEvaluationScreen",params:{startIndex:a.toString()}})}return(a,r)=>(d(),c("div",R,[s("div",T,[r[2]||(r[2]=s("label",{for:"sort"},"Sort By:",-1)),A(s("select",{id:"sort","onUpdate:modelValue":r[0]||(r[0]=p=>u.value=p)},r[1]||(r[1]=[s("option",{value:"newest"},"Newest",-1),s("option",{value:"oldest"},"Oldest",-1)]),512),[[C,u.value]])]),D(I),s("div",$,[(d(!0),c(L,null,x(f.value,(p,F)=>(d(),c("div",{key:p.id,class:"audio-card"},[s("p",null,_("audio_"+p.id),1),s("button",{class:"review-btn",onClick:U=>m(F)}," Review ",8,q)]))),128))]),t.value?(d(),c("div",z,_(t.value),1)):y("",!0)]))}},H=g(O,[["__scopeId","data-v-916aca93"]]);export{H as default};
