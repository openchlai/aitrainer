import{l as P,m as C,r as l,w as b,n as T,p as k,q as G,_ as v,k as y,o as h,a as g,b as n,g as u,c as A,F as S,s as L,t as $,d as B,v as z,x as I,y as V}from"./index-CW44icXo.js";import{a as U}from"./axios-Cl29fZd6.js";const _="https://www.gstatic.com/charts/loader.js";let E=null;const w=new Map;function W(){return window.google!==void 0?Promise.resolve(window.google.charts):(E===null&&(E=new Promise(t=>{const e=document.querySelector('script[src="'.concat(_,'"]')),a=e||document.createElement("script");e||(a.src=_,a.type="text/javascript",document.head.append(a)),a.onload=()=>{window.google!==void 0&&t(window.google.charts)}})),E)}async function N(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"current",{packages:e=["corechart","controls"],language:a="en",mapsApiKey:s}=arguments.length>1?arguments[1]:void 0;const r=await W(),i="".concat(t,"_").concat(e.join("_"),"_").concat(a);if(w.has(i))return w.get(i);const o=new Promise(c=>{r.load(t,{packages:e,language:a,mapsApiKey:s}),r.setOnLoadCallback(()=>c(window.google))});return w.set(i,o),o}function j(t,e,a){return t!==null&&e instanceof t.visualization.DataTable||t!==null&&e instanceof t.visualization.DataView?e:t!==null&&Array.isArray(e)?t.visualization.arrayToDataTable(e,a):t!==null&&e!==null&&typeof e=="object"?new t.visualization.DataTable(e):null}function M(t,e,a,s,r,i){const o=(p,d,m)=>{if(m===void 0)throw new Error("please, provide chart type property");return new d.visualization[m](p)};if(t===null)throw new Error("please, provide charts lib property");if(a===null)throw new Error("please, provide chart element property");return e=(i||o)(a,t,s),H(t,e,r),e}function H(t,e,a){if(a!==null)for(const[s,r]of Object.entries(a))t!==null&&e!==null&&t.visualization.events.addListener(e,s,r)}function F(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:50,a;function s(){return e}return function(){for(var i=arguments.length,o=new Array(i),c=0;c<i;c++)o[c]=arguments[c];const p=this,d=function(){a=void 0,t.apply(p,o)};a!==void 0&&clearTimeout(a),a=setTimeout(d,s())}}let D=null;const f=C({name:"GChart",props:{type:{type:String,required:!0},data:{type:[Array,Object,null],default:()=>[]},isFirstRowLabels:{type:Boolean,default:!1},options:{type:Object,default:()=>({})},version:{type:String,default:"current"},settings:{type:Object,default:()=>({packages:["corechart","table"]})},events:{type:Object,default:null},createChart:{type:Function,default:void 0},resizeDebounce:{type:Number,default:200}},setup(t,e){let{emit:a}=e;const s=l(null),r=l(null);function i(){if(D===null||s.value===null)return;const o=j(D,t.data,t.isFirstRowLabels);if(o!==null){var c;(c=s.value)===null||c===void 0||c.draw(o,t.options)}}return b(()=>t.data,()=>i(),{deep:!0}),b(()=>t.options,()=>i(),{deep:!0}),b(()=>t.type,()=>{s.value=M(D,s.value,r.value,t.type,t.events,t.createChart),i()}),T(()=>{N(t.version,t.settings).then(o=>{o!==void 0&&(D=o,s.value=M(D,s.value,r.value,t.type,t.events,t.createChart),a("ready",s.value,o),i())}),t.resizeDebounce>0&&window.addEventListener("resize",F(i,t.resizeDebounce))}),k(()=>{s.value!==null&&typeof s.value.clearChart=="function"&&s.value.clearChart(),t.resizeDebounce>0&&window.removeEventListener("resize",F(i,t.resizeDebounce))}),()=>G("div",{ref:r},[])}}),R=P({});function q(){R.component("GChart",f)}const K={version:"1.1.0",install:q};let O=null;typeof window<"u"&&(O=window.Vue);O!=null&&R.use(K);const Q=C({components:{GChart:f},setup(){const t=l([["Dataset","Files Collected"],["Training",5e3],["Validation",1e3],["Testing",800]]),e=l([["Category","Percentage"],["Male",40],["Female",50],["Children",10],["Noisy Background",20],["Quiet Environment",80],["English",60],["Other Languages",40]]),a=l([["Length (Seconds)","Number of Files"],["0-5s",1200],["5-10s",1800],["10-20s",1500],["20-30s",900],["30s+",400]]),s=l([["Status","Percentage"],["Transcribed (6200)",92],["Missing (500)",8]]),r=l([["Format","Files"],["WAV",4900],["MP3",1e3],["Other",300]]);return{audioFilesData:t,diversityData:e,audioLengthData:a,missingTranscriptionsData:s,formatConsistencyData:r,barChartOptions:{legend:{position:"none"},colors:["#4285F4"]},pieChartOptions:{pieHole:.4,colors:["#34A853","#EA4335","#FBBC05","#3366CC","#FF9900"]},histogramOptions:{legend:{position:"none"},colors:["#FF9900"]}}}}),J={class:"metrics-container"},X={class:"charts"},Y={class:"chart-container"},Z={class:"chart-container"},x={class:"chart-container"},tt={class:"chart-container"},et={class:"chart-container"};function nt(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",J,[e[5]||(e[5]=n("h2",null,"Data Collection & Preparation Metrics",-1)),e[6]||(e[6]=n("p",{class:"goal-text"}," Goal: Ensure high-quality, diverse, and well-structured data for training. ",-1)),n("div",X,[n("div",Y,[e[0]||(e[0]=n("h3",null,"Total Audio Files Collected 📊",-1)),u(o,{type:"ColumnChart",data:t.audioFilesData,options:t.barChartOptions},null,8,["data","options"])]),n("div",Z,[e[1]||(e[1]=n("h3",null,"Dataset Diversity Score 🎭",-1)),u(o,{type:"PieChart",data:t.diversityData,options:t.pieChartOptions},null,8,["data","options"])]),n("div",x,[e[2]||(e[2]=n("h3",null,"Audio Length Distribution ⏳",-1)),u(o,{type:"Histogram",data:t.audioLengthData,options:t.histogramOptions},null,8,["data","options"])]),n("div",tt,[e[3]||(e[3]=n("h3",null,"Missing Transcriptions % ⚠️",-1)),u(o,{type:"PieChart",data:t.missingTranscriptionsData,options:t.pieChartOptions},null,8,["data","options"])]),n("div",et,[e[4]||(e[4]=n("h3",null,"Audio Format Consistency 🎵",-1)),u(o,{type:"BarChart",data:t.formatConsistencyData,options:t.barChartOptions},null,8,["data","options"])])])])}const ot=v(Q,[["render",nt]]),at=C({components:{GChart:f},setup(){const t=l([["Category","Percentage"],["Correctly Trimmed",95],["Over-trimmed",3],["Under-trimmed",2]]),e=l([["Format","Success Rate %"],["16 kHz",98],["24 kHz",90],["44.1 kHz",85]]),a=l([["Status","Percentage"],["Successful",97],["Failed",3]]),s=l([["Sample Index","Width","Height"],[1,128,256],[2,128,256],[3,128,256],[4,130,258],[5,128,256]]);return{silenceRemovalData:t,resamplingData:e,featureExtractionData:a,spectrogramSizeData:s,pieChartOptions:{pieHole:.4,colors:["#34A853","#EA4335","#FBBC05"]},barChartOptions:{legend:{position:"none"},colors:["#4285F4"]},lineChartOptions:{curveType:"function",legend:{position:"bottom"},hAxis:{title:"Sample Index"},vAxis:{title:"Size (pixels)"},colors:["#FF9900","#3366CC"]}}}}),st={class:"metrics-container"},rt={class:"charts"},it={class:"chart-container"},lt={class:"chart-container"},ct={class:"chart-container"},pt={class:"chart-container"};function dt(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",st,[e[4]||(e[4]=n("h2",null,"Data Preprocessing & Feature Extraction Metrics",-1)),e[5]||(e[5]=n("p",{class:"goal-text"}," Goal: Ensure clean and properly formatted data for model training. ",-1)),n("div",rt,[n("div",it,[e[0]||(e[0]=n("h3",null,"Silence Removal Accuracy % 🎙️",-1)),u(o,{type:"PieChart",data:t.silenceRemovalData,options:t.pieChartOptions},null,8,["data","options"])]),n("div",lt,[e[1]||(e[1]=n("h3",null,"Resampling Success Rate % 🔄",-1)),u(o,{type:"BarChart",data:t.resamplingData,options:t.barChartOptions},null,8,["data","options"])]),n("div",ct,[e[2]||(e[2]=n("h3",null,"Feature Extraction Completion % 📈",-1)),u(o,{type:"PieChart",data:t.featureExtractionData,options:t.pieChartOptions},null,8,["data","options"])]),n("div",pt,[e[3]||(e[3]=n("h3",null,"Spectrogram Size Consistency % 📏",-1)),u(o,{type:"LineChart",data:t.spectrogramSizeData,options:t.lineChartOptions},null,8,["data","options"])])])])}const ut=v(at,[["render",dt]]),ht=C({components:{GChart:f},setup(){const t=[{epoch:1,loss:.8,wer:35,cer:25,train_time:15,gpu_util:70},{epoch:2,loss:.6,wer:30,cer:20,train_time:14,gpu_util:75},{epoch:3,loss:.5,wer:25,cer:18,train_time:13,gpu_util:80},{epoch:4,loss:.4,wer:20,cer:15,train_time:12,gpu_util:85},{epoch:5,loss:.3,wer:15,cer:10,train_time:11,gpu_util:90}],e=l([["Epoch","CTC Loss"],...t.map(({epoch:d,loss:m})=>[d,m])]),a=l([["Epoch","WER (%)"],...t.map(({epoch:d,wer:m})=>[d,m])]),s=l([["Epoch","CER (%)"],...t.map(({epoch:d,cer:m})=>[d,m])]),r=l([["Epoch","Training Time (s)"],...t.map(({epoch:d,train_time:m})=>[d,m])]),i=l([["GPU Utilization","Percentage"],["Used",t[t.length-1].gpu_util],["Available",100-t[t.length-1].gpu_util]]);return{lossData:e,werData:a,cerData:s,trainTimeData:r,gpuData:i,lineChartOptions:{curveType:"function",legend:{position:"bottom"},hAxis:{title:"Epoch"},vAxis:{title:"Value"},colors:["#4285F4"]},barChartOptions:{legend:{position:"none"},hAxis:{title:"Epoch"},vAxis:{title:"Training Time (s)"},colors:["#34A853"]},pieChartOptions:{pieHole:.4,legend:"none",colors:["#EA4335","#CCCCCC"]}}}}),mt={class:"metrics-container"},gt={class:"charts"},Ct={class:"chart-container"},vt={class:"chart-container"},ft={class:"chart-container"},yt={class:"chart-container"},Dt={class:"chart-container"};function $t(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",mt,[e[5]||(e[5]=n("h2",null,"Model Training & Fine-Tuning Metrics",-1)),e[6]||(e[6]=n("p",{class:"goal-text"}," Goal: Evaluate the Whisper model's learning process and efficiency. ",-1)),n("div",gt,[n("div",Ct,[e[0]||(e[0]=n("h3",null,"Loss Function (CTC Loss) 📉",-1)),u(o,{type:"LineChart",data:t.lossData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",vt,[e[1]||(e[1]=n("h3",null,"Word Error Rate (WER) % 📝",-1)),u(o,{type:"LineChart",data:t.werData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",ft,[e[2]||(e[2]=n("h3",null,"Character Error Rate (CER) % 🔠",-1)),u(o,{type:"LineChart",data:t.cerData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",yt,[e[3]||(e[3]=n("h3",null,"Training Time per Epoch ⏳",-1)),u(o,{type:"BarChart",data:t.trainTimeData,options:t.barChartOptions},null,8,["data","options"])]),n("div",Dt,[e[4]||(e[4]=n("h3",null,"GPU Utilization % ⚡",-1)),u(o,{type:"PieChart",data:t.gpuData,options:t.pieChartOptions},null,8,["data","options"])])])])}const bt=v(ht,[["render",$t]]),Et=C({components:{GChart:f},setup(){const t=[{epoch:1,train_loss:.8,val_loss:.9,wer:30,cer:20,latency:200},{epoch:2,train_loss:.6,val_loss:.7,wer:25,cer:18,latency:180},{epoch:3,train_loss:.5,val_loss:.6,wer:20,cer:15,latency:160},{epoch:4,train_loss:.4,val_loss:.5,wer:18,cer:13,latency:140},{epoch:5,train_loss:.3,val_loss:.4,wer:15,cer:10,latency:120}],e=[["Speaker Group","WER (%)"],["Native Accent",10],["Non-Native Accent",20],["Children",25],["Elderly",30],["Noisy Environment",35]],a=l([["Epoch","Training Loss","Validation Loss"],...t.map(({epoch:p,train_loss:d,val_loss:m})=>[p,d,m])]),s=l([["Epoch","WER (%)","CER (%)"],...t.map(({epoch:p,wer:d,cer:m})=>[p,d,m])]),r=l(e),i=l([["Epoch","Latency (ms)"],...t.map(({epoch:p,latency:d})=>[p,d])]);return{lossComparisonData:a,werCerTestData:s,speakerPerformanceData:r,latencyData:i,lineChartOptions:{curveType:"function",legend:{position:"bottom"},hAxis:{title:"Epoch"},vAxis:{title:"Value"},colors:["#4285F4","#EA4335"]},barChartOptions:{legend:{position:"none"},hAxis:{title:"Category"},vAxis:{title:"Value"},colors:["#34A853"]}}}}),wt={class:"metrics-container"},Ot={class:"charts"},_t={class:"chart-container"},Mt={class:"chart-container"},Ft={class:"chart-container"},Tt={class:"chart-container"};function At(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",wt,[e[4]||(e[4]=n("h2",null,"Model Evaluation Metrics",-1)),e[5]||(e[5]=n("p",{class:"goal-text"}," Goal: Measure model accuracy and robustness on unseen data. ",-1)),n("div",Ot,[n("div",_t,[e[0]||(e[0]=n("h3",null,"Validation Loss vs. Training Loss 🔄",-1)),u(o,{type:"LineChart",data:t.lossComparisonData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",Mt,[e[1]||(e[1]=n("h3",null,"WER/CER on Test Set 📊",-1)),u(o,{type:"LineChart",data:t.werCerTestData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",Ft,[e[2]||(e[2]=n("h3",null,"Speaker Variation Performance 🎭",-1)),u(o,{type:"BarChart",data:t.speakerPerformanceData,options:t.barChartOptions},null,8,["data","options"])]),n("div",Tt,[e[3]||(e[3]=n("h3",null,"Processing Latency per Sample ⏱️",-1)),u(o,{type:"BarChart",data:t.latencyData,options:t.barChartOptions},null,8,["data","options"])])])])}const St=v(Et,[["render",At]]),Lt=C({components:{GChart:f},setup(){const t=[{epoch:1,latency:150,throughput:50,memory:75,success_rate:95,feedback:4.5},{epoch:2,latency:140,throughput:55,memory:70,success_rate:97,feedback:4.7},{epoch:3,latency:130,throughput:60,memory:65,success_rate:98,feedback:4.8},{epoch:4,latency:120,throughput:65,memory:60,success_rate:99,feedback:4.9},{epoch:5,latency:110,throughput:70,memory:55,success_rate:99,feedback:5}],e=l([["Epoch","Latency (ms)"],...t.map(({epoch:p,latency:d})=>[p,d])]),a=l([["Epoch","Throughput (requests/s)"],...t.map(({epoch:p,throughput:d})=>[p,d])]),s=l([["Epoch","Memory Usage (%)"],...t.map(({epoch:p,memory:d})=>[p,d])]),r=l([["Epoch","Success Rate (%)"],...t.map(({epoch:p,success_rate:d})=>[p,d])]),i=l([["Epoch","User Feedback Rating"],...t.map(({epoch:p,feedback:d})=>[p,d])]);return{latencyData:e,throughputData:a,memoryUsageData:s,apiSuccessData:r,feedbackData:i,lineChartOptions:{curveType:"function",legend:{position:"bottom"},hAxis:{title:"Epoch"},vAxis:{title:"Value"},colors:["#4285F4"]},barChartOptions:{legend:{position:"none"},hAxis:{title:"Epoch"},vAxis:{title:"Feedback Rating"},colors:["#34A853"]}}}}),Rt={class:"metrics-container"},Pt={class:"charts"},kt={class:"chart-container"},Gt={class:"chart-container"},Bt={class:"chart-container"},zt={class:"chart-container"},It={class:"chart-container"};function Vt(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",Rt,[e[5]||(e[5]=n("h2",null,"Model Deployment & Inference Metrics",-1)),e[6]||(e[6]=n("p",{class:"goal-text"}," Goal: Ensure fast and accurate real-world performance. ",-1)),n("div",Pt,[n("div",kt,[e[0]||(e[0]=n("h3",null,"Real-time Inference Latency ⚡",-1)),u(o,{type:"LineChart",data:t.latencyData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",Gt,[e[1]||(e[1]=n("h3",null,"Throughput 🚀",-1)),u(o,{type:"LineChart",data:t.throughputData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",Bt,[e[2]||(e[2]=n("h3",null,"Memory Usage 🖥️",-1)),u(o,{type:"LineChart",data:t.memoryUsageData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",zt,[e[3]||(e[3]=n("h3",null,"API Response Success Rate 🌍",-1)),u(o,{type:"LineChart",data:t.apiSuccessData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",It,[e[4]||(e[4]=n("h3",null,"User Feedback Rating ⭐",-1)),u(o,{type:"BarChart",data:t.feedbackData,options:t.barChartOptions},null,8,["data","options"])])])])}const Ut=v(Lt,[["render",Vt]]),Wt=C({components:{GChart:f},setup(){const t=[{epoch:1,wer_drift:15,data_shift:.1,retrain_improvement:5,error_reports:5},{epoch:2,wer_drift:18,data_shift:.15,retrain_improvement:8,error_reports:4},{epoch:3,wer_drift:20,data_shift:.18,retrain_improvement:10,error_reports:3},{epoch:4,wer_drift:22,data_shift:.2,retrain_improvement:15,error_reports:6},{epoch:5,wer_drift:23,data_shift:.25,retrain_improvement:18,error_reports:7}],e=l([["Epoch","WER Drift (%)"],...t.map(({epoch:c,wer_drift:p})=>[c,p])]),a=l([["Epoch","Data Distribution Shift (%)"],...t.map(({epoch:c,data_shift:p})=>[c,p])]),s=l([["Epoch","Retraining Improvement (%)"],...t.map(({epoch:c,retrain_improvement:p})=>[c,p])]),r=l([["Epoch","Error Reports Frequency"],...t.map(({epoch:c,error_reports:p})=>[c,p])]);return{werDriftData:e,distributionShiftData:a,retrainingImprovementData:s,errorReportData:r,lineChartOptions:{curveType:"function",legend:{position:"bottom"},hAxis:{title:"Epoch"},vAxis:{title:"Value"},colors:["#FF5733"]},barChartOptions:{legend:{position:"none"},hAxis:{title:"Epoch"},vAxis:{title:"Improvement %"},colors:["#00C853"]}}}}),Nt={class:"metrics-container"},jt={class:"charts"},Ht={class:"chart-container"},qt={class:"chart-container"},Kt={class:"chart-container"},Qt={class:"chart-container"};function Jt(t,e,a,s,r,i){const o=y("GChart");return h(),g("div",Nt,[e[4]||(e[4]=n("h2",null,"Continuous Monitoring & Model Retraining Metrics",-1)),e[5]||(e[5]=n("p",{class:"goal-text"}," Goal: Maintain model accuracy and adapt to new data. ",-1)),n("div",jt,[n("div",Ht,[e[0]||(e[0]=n("h3",null,"WER Drift Over Time 📈",-1)),u(o,{type:"LineChart",data:t.werDriftData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",qt,[e[1]||(e[1]=n("h3",null,"Data Distribution Shift 📊",-1)),u(o,{type:"LineChart",data:t.distributionShiftData,options:t.lineChartOptions},null,8,["data","options"])]),n("div",Kt,[e[2]||(e[2]=n("h3",null,"Retraining Improvement % 🔄",-1)),u(o,{type:"BarChart",data:t.retrainingImprovementData,options:t.barChartOptions},null,8,["data","options"])]),n("div",Qt,[e[3]||(e[3]=n("h3",null,"Error Report Frequency 🛠️",-1)),u(o,{type:"LineChart",data:t.errorReportData,options:t.lineChartOptions},null,8,["data","options"])])])])}const Xt=v(Wt,[["render",Jt]]),Yt=C({name:"Leaderboard",setup(){const t=l([]),e=l(!0),a=async()=>{try{const r=await U.get("/transcriptions/leader-board/");t.value=r.data}catch(r){console.error("Error fetching leaderboard:",r)}finally{e.value=!1}},s=A(()=>t.value.sort((r,i)=>i.evaluations_done-r.evaluations_done));return T(()=>{a()}),{sortedLeaderboard:s,loading:e}}}),Zt={class:"leaderboard-container"},xt={class:"leaderboard-table"},te={key:0,class:"loading-message"},ee={key:1};function ne(t,e,a,s,r,i){return h(),g("div",Zt,[e[1]||(e[1]=n("h2",null,"🏆 Evaluation Leaderboard",-1)),n("div",xt,[t.loading?(h(),g("div",te,"Loading leaderboard...")):(h(),g("table",ee,[e[0]||(e[0]=n("thead",null,[n("tr",null,[n("th",null,"Rank"),n("th",null,"User Name"),n("th",null,"Evaluations Done")])],-1)),n("tbody",null,[(h(!0),g(S,null,L(t.sortedLeaderboard,(o,c)=>(h(),g("tr",{key:c},[n("td",null,$(c+1),1),n("td",null,$(o.created_by_username),1),n("td",null,$(o.evaluations_done),1)]))),128))])]))])])}const oe=v(Yt,[["render",ne],["__scopeId","data-v-730d15db"]]),ae=C({components:{DataCollectionMetrics:ot,DataPreprocessingMetrics:ut,ModelTrainingMetrics:bt,ModelEvaluationMetrics:St,ModelDeploymentMetrics:Ut,ContinuosImprovements:Xt,LeaderBoards:oe},setup(){const t=l("dataCollection"),e={dataCollection:{name:"Data Collection & Preparation",component:"DataCollectionMetrics"},dataPreprocessing:{name:"Data Preprocessing & Feature Extraction",component:"DataPreprocessingMetrics"},modelTraining:{name:"Model Training & Fine-Tuning",component:"ModelTrainingMetrics"},modelEvaluation:{name:"Model Evaluation",component:"ModelEvaluationMetrics"},modelDeployment:{name:"Model Deployment & Inference",component:"ModelDeploymentMetrics"},continousIprovments:{name:"Continuos Improvements",component:"ContinuosImprovements"},leaderBoards:{name:"Leader Boards",component:"LeaderBoards"}},a=A(()=>e[t.value].component);return{selectedStage:t,pipelineStages:e,currentComponent:a}}}),se={class:"dashboard"},re={class:"select-container"},ie=["value"];function le(t,e,a,s,r,i){return h(),g("div",se,[e[2]||(e[2]=n("h1",{class:"text-xl font-bold"},"AI Project Metrics Dashboard",-1)),n("div",re,[e[1]||(e[1]=n("label",{for:"stage-select"},"Select Pipeline Stage:",-1)),B(n("select",{id:"stage-select","onUpdate:modelValue":e[0]||(e[0]=o=>t.selectedStage=o)},[(h(!0),g(S,null,L(t.pipelineStages,(o,c)=>(h(),g("option",{key:c,value:c},$(o.name),9,ie))),128))],512),[[z,t.selectedStage]])]),(h(),I(V(t.currentComponent)))])}const de=v(ae,[["render",le]]);export{de as default};
