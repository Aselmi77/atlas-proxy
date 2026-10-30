"use strict";
const form=document.querySelector('#navigate'), address=document.querySelector('#address'), status=document.querySelector('#status'), viewport=document.querySelector('#viewport');
const {ScramjetController}=$scramjetLoadController();
const controller=new ScramjetController({files:{wasm:'/scram/scramjet.wasm.wasm',all:'/scram/scramjet.all.js',sync:'/scram/scramjet.sync.js'}});
const initialized=Promise.resolve(controller.init());
const connection=new BareMux.BareMuxConnection('/baremux/worker.js');
let frame;
function destination(value){
 value=value.trim(); if(!value)throw Error('Enter a URL or search term.');
 if(/^[a-z][a-z\d+.-]*:/i.test(value)&&!/^https?:/i.test(value))throw Error('Use an HTTP or HTTPS website address.');
 if(!/^https?:\/\//i.test(value)){value=/^[^\s/]+\.[^\s]+/.test(value)?'https://'+value:'https://www.google.com/search?q='+encodeURIComponent(value);}
 const url=new URL(value); if(!['https:','http:'].includes(url.protocol))throw Error('Unsupported URL.');return url.href;
}
form.addEventListener('submit',async event=>{
 event.preventDefault();const go=document.querySelector('#go');go.disabled=true;
 try{
  const url=destination(address.value);status.textContent='Connecting…';
  if(!isSecureContext)throw Error('Open this app over HTTPS, or localhost for local testing.');
  if(!crossOriginIsolated)throw Error('Required isolation headers are missing. Open the proxy directly in its own tab.');
  await initialized;await registerSW();await navigator.serviceWorker.ready;
  if((await connection.getTransport())!=='/libcurl/index.mjs')await connection.setTransport('/libcurl/index.mjs',[{websocket:(location.protocol==='https:'?'wss://':'ws://')+location.host+'/wisp/'}]);
  if(!frame){frame=controller.createFrame();frame.frame.title='Proxied website';viewport.appendChild(frame.frame);frame.frame.addEventListener('load',()=>{status.textContent='Page navigation finished. Some sites may require additional loading.';});}
  viewport.hidden=false;document.body.classList.add('browsing');address.value=url;frame.go(url);status.textContent='Loading website…';
 }catch(error){status.textContent=error.message||String(error);}finally{go.disabled=false;}
});
function control(action){try{if(frame)action();}catch{status.textContent='This page does not support that navigation action.';}}
document.querySelector('#back').onclick=()=>control(()=>frame.back());
document.querySelector('#forward').onclick=()=>control(()=>frame.forward());
document.querySelector('#reload').onclick=()=>control(()=>frame.reload());
document.querySelector('#home').onclick=()=>{if(frame)frame.frame.remove();frame=null;viewport.hidden=true;document.body.classList.remove('browsing');status.textContent='Ready when you are.';address.value='';address.focus();};
