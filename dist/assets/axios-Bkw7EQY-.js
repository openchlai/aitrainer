import{J as i}from"./index-DJHDVjkT.js";const c=()=>window.location.hostname==="aitrainer.bitz-itc.com"?"https://edms-enpoints.bitz-itc.com/api":"http://127.0.0.1:8000/api",o=i.create({baseURL:c(),headers:{"Content-Type":"application/json"}});let s=!1,a=[];const p=e=>{a.push(e)},h=e=>{a.forEach(t=>t(e)),a=[]},l=async()=>{try{const e=localStorage.getItem("refresh_token");if(!e)throw new Error("No refresh token found.");const r=(await i.post(`${c()}/auth/refresh-token/`,{refresh:e})).data.access;return localStorage.setItem("access_token",r),h(r),r}catch(e){return alert("Session expired. Please log in again."),Promise.reject(e)}};o.interceptors.request.use(e=>{const t=localStorage.getItem("access_token"),n=["/verify-otp","/register","/request-otp"].some(u=>e.url.includes(u));return t&&!n&&(e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e));o.interceptors.response.use(e=>e,async e=>{const t=e.config;if(e.response&&e.response.status===401&&!t._retry){if(s)return new Promise(r=>{p(n=>{t.headers.Authorization=`Bearer ${n}`,r(o(t))})});t._retry=!0,s=!0;try{const r=await l();return s=!1,t.headers.Authorization=`Bearer ${r}`,o(t)}catch(r){return s=!1,Promise.reject(r)}}return Promise.reject(e)});export{o as a};
