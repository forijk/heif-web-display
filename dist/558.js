(()=>{var e,t,r={6736:(e,t,r)=>{"use strict";var n=r(5110),a=r.n(n),o=r(8764).Buffer;const c="ConvertHeicToPng";onmessage=async function(e){e.data.urlPng=await async function(e){try{const t=await caches.open(c),r=await t.match(new Request(e));if(r){console.log("found from cache:",e);const t=await r.blob();return URL.createObjectURL(t)}}catch(e){console.log(e)}const t=await fetch(e).then((async e=>{const t=o.from(await e.arrayBuffer());return a()({buffer:t,format:"PNG"})})),r=new Blob([t],{type:"image/png"});try{(await caches.open(c)).put(new Request(e),new Response(r))}catch(e){console.log(e)}return URL.createObjectURL(r)}(e.data.url),postMessage(e.data)}},950:()=>{},6601:()=>{},9214:()=>{},8623:()=>{},7748:()=>{},5568:()=>{},4485:()=>{},6619:()=>{},7108:()=>{},2361:()=>{},4616:()=>{}},n={};function a(e){var t=n[e];if(void 0!==t)return t.exports;var o=n[e]={id:e,loaded:!1,exports:{}};return r[e].call(o.exports,o,o.exports,a),o.loaded=!0,o.exports}a.m=r,a.x=()=>{var e=a.O(void 0,[110],(()=>a(6736)));return a.O(e)},e=[],a.O=(t,r,n,o)=>{if(!r){var c=1/0;for(l=0;l<e.length;l++){for(var[r,n,o]=e[l],s=!0,i=0;i<r.length;i++)(!1&o||c>=o)&&Object.keys(a.O).every((e=>a.O[e](r[i])))?r.splice(i--,1):(s=!1,o<c&&(c=o));if(s){e.splice(l--,1);var f=n();void 0!==f&&(t=f)}}return t}o=o||0;for(var l=e.length;l>0&&e[l-1][2]>o;l--)e[l]=e[l-1];e[l]=[r,n,o]},a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,r)=>(a.f[r](e,t),t)),[])),a.u=e=>e+".js",a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),a.p="/tpl/jhin/js/heif-web-display/dist/",(()=>{var e={558:1};a.f.i=(t,r)=>{e[t]||importScripts(a.p+a.u(t))};var t=self.webpackChunk=self.webpackChunk||[],r=t.push.bind(t);t.push=t=>{var[n,o,c]=t;for(var s in o)a.o(o,s)&&(a.m[s]=o[s]);for(c&&c(a);n.length;)e[n.pop()]=1;r(t)}})(),t=a.x,a.x=()=>a.e(110).then(t),a.x()})();