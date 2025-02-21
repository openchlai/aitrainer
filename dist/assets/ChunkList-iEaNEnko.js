import{_ as T,A as V,r as i,n as j,D as z,c,a as v,b as a,E as P,t as s,G as g,B as D,h as f,F as W,x as G,j as R,o as r}from"./index-DJHDVjkT.js";import{a as x}from"./axios-Bkw7EQY-.js";const U={class:"chunk-list-screen"},q={class:"statistics"},H={class:"progress-bar"},J={class:"progress-labels"},K={class:"tabs"},O={key:0},Q={class:"pagination"},X=["disabled"],Y=["disabled"],Z={class:"audio-list"},tt={key:0,class:"checkmark"},at=["onClick"],et={key:1,class:"error-message"},d=50,nt={__name:"ChunkList",setup(st){const S=V(),F=R(),C=i([]),b=i([]),E=i([]),o=i("not_evaluated");i("oldest");const _=i(""),u=i(1),n=i({total_chunks:0,total_evaluated_chunks:0,total_unevaluated_chunks:0,notEvaluatedChunks:0,oneEvaluationChunks:0,twoEvaluationsChunks:0,evaluation_completion_rate:0});j(async()=>{await I(),await A(),await z()});async function A(){try{const t=await x.get("/transcriptions/chunk-statistics/");n.value={total_chunks:t.data.total_chunks,total_evaluated_chunks:t.data.total_chunks-t.data.not_evaluated,total_unevaluated_chunks:t.data.not_evaluated,notEvaluatedChunks:t.data.not_evaluated,oneEvaluationChunks:t.data.one_evaluation,twoEvaluationsChunks:t.data.two_evaluations,evaluation_completion_rate:t.data.evaluation_completion_rate}}catch(t){console.error("Error fetching statistics:",t)}}function h(t){for(let e=t.length-1;e>0;e--){const l=Math.floor(Math.random()*(e+1));[t[e],t[l]]=[t[l],t[e]]}return t}async function I(){try{const t=await x.get("/transcriptions/evaluation-categories/");C.value=h(t.data.not_evaluated||[]),b.value=h(t.data.one_evaluation||[]),E.value=h(t.data.two_evaluations||[]),_.value=""}catch(t){console.error("Error fetching chunks:",t),_.value="Failed to load audio files. Please try again later."}}const k=c(()=>o.value==="not_evaluated"?C.value:o.value==="one_evaluation"?b.value:o.value==="two_evaluations"?E.value:[]),M=c(()=>{const t=(u.value-1)*d,e=t+d;return k.value.slice(t,e)}),p=c(()=>Math.ceil(k.value.length/d));function N(){u.value<p.value&&u.value++}function B(){u.value>1&&u.value--}function L(t){const l=(u.value-1)*d+t;S.setAudioList(k.value),F.push({name:"ChunkEvaluationScreen",params:{absoluteIndex:l.toString()}})}const m=c(()=>n.value.total_chunks===0?0:(n.value.total_evaluated_chunks/n.value.total_chunks*100).toFixed(2)),w=c(()=>n.value.total_chunks===0?0:(n.value.total_unevaluated_chunks/n.value.total_chunks*100).toFixed(2));function $(t){return(u.value-1)*d+t}return(t,e)=>(r(),v("div",U,[a("div",q,[e[3]||(e[3]=a("h2",null,"Chunk Evaluation Progress",-1)),a("div",H,[a("div",{class:"progress-evaluated",style:P({width:m.value+"%"})},null,4),a("div",{class:"progress-unevaluated",style:P({width:w.value+"%"})},null,4)]),a("div",J,[a("span",null,"Evaluated: "+s(n.value.total_evaluated_chunks)+" ("+s(m.value)+"%)",1),a("span",null,"Unevaluated: "+s(n.value.total_unevaluated_chunks)+" ("+s(w.value)+"%)",1)])]),a("div",K,[a("button",{onClick:e[0]||(e[0]=l=>o.value="not_evaluated"),class:g({active:o.value==="not_evaluated"})},"Not Evaluated ("+s(n.value.notEvaluatedChunks)+")",3),a("button",{onClick:e[1]||(e[1]=l=>o.value="one_evaluation"),class:g({active:o.value==="one_evaluation"})},"With First Evaluation ("+s(n.value.oneEvaluationChunks)+")",3),a("button",{onClick:e[2]||(e[2]=l=>o.value="two_evaluations"),class:g({active:o.value==="two_evaluations"})},"With Second Evaluations ("+s(n.value.twoEvaluationsChunks)+")",3)]),o.value!="not_evaluated"?(r(),v("div",O,e[4]||(e[4]=[a("p",null,[a("span",{style:{"background-color":"green","border-radius":"50%"}}," ✓ "),D("Indicates chunks you have evaluated")],-1)]))):f("",!0),a("div",Q,[a("button",{onClick:B,disabled:u.value===1},"Previous",8,X),a("span",null,"Page "+s(u.value)+" of "+s(p.value),1),a("button",{onClick:N,disabled:u.value===p.value},"Next",8,Y)]),a("div",null,[a("div",Z,[(r(!0),v(W,null,G(M.value,(l,y)=>(r(),v("div",{key:l.id,class:"audio-card"},[l.evaluated_by_user?(r(),v("div",tt,"✓")):f("",!0),a("p",null,s("chunk_"+$(y)),1),a("button",{class:"review-btn",onClick:ot=>L(y)}," Evaluate ",8,at)]))),128))])]),_.value?(r(),v("div",et,s(_.value),1)):f("",!0)]))}},it=T(nt,[["__scopeId","data-v-c33a4eab"]]);export{it as default};
