import{_ as h,r as p,c as a,a as n,F as c,e as d,d as D,o as s,t as m}from"./index-3et9JUYM.js";const k={class:"dataset-management"},b={key:0},j={__name:"DatasetManagement",setup(x){const r=p([]),u=p([]),v=l=>{const e=l.target.files[0];if(e){const t=new FileReader;t.onload=o=>{const i=o.target.result;e.name.endsWith(".csv")?_(i):e.name.endsWith(".json")&&f(i)},t.readAsText(e)}},_=l=>{const e=l.split(`
`);u.value=e[0].split(","),r.value=e.slice(1).map(t=>t.split(","))},f=l=>{const e=JSON.parse(l);u.value=Object.keys(e[0]),r.value=e.map(t=>Object.values(t))},g=()=>{alert("Dataset editing functionality is not yet implemented.")};return(l,e)=>(s(),a("div",k,[e[1]||(e[1]=n("h2",null,"Dataset Management",-1)),n("input",{type:"file",onChange:v,accept:".csv, .json"},null,32),r.value.length?(s(),a("div",b,[e[0]||(e[0]=n("h3",null,"Dataset Preview",-1)),n("table",null,[n("thead",null,[n("tr",null,[(s(!0),a(c,null,d(u.value,(t,o)=>(s(),a("th",{key:o},m(t),1))),128))])]),n("tbody",null,[(s(!0),a(c,null,d(r.value.slice(0,5),(t,o)=>(s(),a("tr",{key:o},[(s(!0),a(c,null,d(t,(i,y)=>(s(),a("td",{key:y},m(i),1))),128))]))),128))])]),n("button",{onClick:g},"Edit Dataset")])):D("",!0)]))}},F=h(j,[["__scopeId","data-v-3937e51d"]]);export{F as default};
