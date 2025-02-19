import{_ as y,r as p,o as d,a as c,b as s,t as _,h as w,s as h,n as S,z as b,c as k,d as A,v as C,g as D,F as L,A as B,j as E}from"./index-6pGkwk_o.js";import{a as F}from"./axios-CPsZO0Op.js";const N={setup(){const l=p([]),e=p("");return{fileList:l,message:e,handleFolderSelection:n=>{const i=Array.from(n.target.files);l.value=i},submitFolder:async()=>{var n,i;try{if(l.value.length===0){e.value="No files selected.";return}const o=new FormData;l.value.forEach(f=>{o.append("files",f)});const v=await F.post("/transcriptions/process-audio/",o,{headers:{"Content-Type":"multipart/form-data"}});e.value=v.data.message}catch(o){e.value=((i=(n=o.response)==null?void 0:n.data)==null?void 0:i.error)||"Error processing files."}}}}},P={class:"folder-picker"},x=["disabled"],V={key:0,class:"message"};function M(l,e,u,t,n,i){return d(),c("div",P,[e[2]||(e[2]=s("h2",null,"Select a Folder to Process Audio Files",-1)),s("input",{type:"file",webkitdirectory:"",directory:"",onChange:e[0]||(e[0]=(...o)=>t.handleFolderSelection&&t.handleFolderSelection(...o))},null,32),s("button",{onClick:e[1]||(e[1]=(...o)=>t.submitFolder&&t.submitFolder(...o)),disabled:t.fileList.length===0},"Process Audio Files",8,x),t.message?(d(),c("p",V,_(t.message),1)):w("",!0)])}const I=y(N,[["render",M],["__scopeId","data-v-1df72f99"]]),R={class:"audio-list-screen"},T={class:"sort"},$={class:"audio-list"},j=["onClick"],z={key:0,class:"error-message"},O={__name:"AudioList",setup(l){const e=p([]),u=p("oldest"),t=p(""),n=h(),i=E();S(async()=>{await o(),await b()});async function o(){try{const a=await F.get("/transcriptions/cleaned-audio-files/?pending=true");e.value=a.data,n.setAudioList(e.value),t.value=""}catch(a){console.error("Error fetching audios:",a),t.value="Failed to load audio files. Please try again later."}}const v=k(()=>e.value.sort((a,r)=>u.value==="newest"?new Date(r.created_at)-new Date(a.created_at):new Date(a.created_at)-new Date(r.created_at)));function f(a){console.log(a.toString()),i.push({name:"AudioEvaluationScreen",params:{startIndex:a.toString()}})}return(a,r)=>(d(),c("div",R,[s("div",T,[r[2]||(r[2]=s("label",{for:"sort"},"Sort By:",-1)),A(s("select",{id:"sort","onUpdate:modelValue":r[0]||(r[0]=m=>u.value=m)},r[1]||(r[1]=[s("option",{value:"newest"},"Newest",-1),s("option",{value:"oldest"},"Oldest",-1)]),512),[[C,u.value]])]),D(I),s("div",$,[(d(!0),c(L,null,B(v.value,(m,g)=>(d(),c("div",{key:m.id,class:"audio-card"},[s("p",null,_("audio_"+g),1),s("button",{class:"review-btn",onClick:U=>f(g)}," Review ",8,j)]))),128))]),t.value?(d(),c("div",z,_(t.value),1)):w("",!0)]))}},H=y(O,[["__scopeId","data-v-25e7bfda"]]);export{H as default};
