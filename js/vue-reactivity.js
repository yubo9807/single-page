(()=>{function y(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function l(e){return["object","array"].includes(y(e))}function W(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function j(e,t){if(["object","array"].includes(y(e))&&["object","array"].includes(y(t))){let r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(let o of r)if(!n.includes(o)||!j(e[o],t[o]))return!1;return!0}else return e===t}function h(e){if(typeof Promise!==void 0)Promise.resolve().then(e);else if(typeof MutationObserver!==void 0){let t=new MutationObserver(e),r=document.createTextNode("0");t.observe(r,{characterData:!0}),r.data="1"}else typeof process!==void 0?process.nextTick(e):setTimeout(e,0)}var d=null,b=new WeakMap;function g(e){d=e,e(),d=null}function D(e){let t=b.get(e)||[],r=t.some(n=>d===n);d&&!r&&(t.push(d),b.set(e,t))}function k(e){let t=b.get(e);t&&t.forEach((r,n)=>{let o=r();typeof o=="boolean"&&o&&(t.splice(n,1),b.set(e,t))})}function C(e){return Reflect.defineProperty(e,c.IS_READONLY,{value:!0}),new Proxy(e,{get(t,r){return r===c.RAW?t:Reflect.get(t,r)},set(t,r,n){let o=Reflect.get(t,r);return console.warn(`Set operation on key '${r.toString()}' failed: target is readonly.`,{[r.toString()]:o}),o},deleteProperty(t,r){let n=Reflect.get(t,r);return console.warn(`Delete operation on key '${r.toString()}' failed: target is readonly.`,{[r.toString()]:n}),n}})}function q(e){return e&&C(e)[c.IS_READONLY]}var L=new WeakMap,c={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function u(e){if(!l(e))return console.warn(`lue cannot be made reactive: ${e}`),e;if(L.get(e))return e;let t=null;return new Proxy(e,{get(r,n,o){if(n===c.RAW)return r;D(r);let i=Reflect.get(r,n,o);return l(i)?u(i):i},set(r,n,o,i){let a=Reflect.get(r,n,i),s=Reflect.set(r,n,o,i);return r[c.IS_READONLY]?a:(h(()=>{let m=Reflect.get(r,n,i);s&&a!==o&&m===o&&k(r)}),s)},deleteProperty(r,n){let o=Reflect.get(r,n),i=W(r,n),a=Reflect.deleteProperty(r,n);return t=n,h(()=>{n===t&&(k(r),t=null)}),a}})}function T(e){return!!e[c.RAW]}function N(e){return T(e)?e[c.RAW]:e}function U(e){return T(e)||q(e)}function Y(e){return l(e)&&L.set(e,!0),e}function R(e){let t=u({value:e});function r(){return t.value}function n(o){t.value=o}return[r,n]}var w="__v_isRef",_=class{[w]=!0;__v_isShallow=!1;_rawValue;_value;getSignal;setSignal;constructor(t){this._rawValue=t;let[r,n]=R(t);this.getSignal=r,this.setSignal=n,this._value=r()}get value(){return this.getSignal()}set value(t){this.setSignal(t),this._rawValue=t}};function $(e){return new _(e)}function E(e){return e&&!!e[w]}function G(e){return E(e)?e.value:e}var x=class{__v_isRef=!0;_defaultValue;_key;_object;constructor(t,r,n=void 0){this._defaultValue=n,this._key=r,this._object=t}get value(){return this._object[this._key]}set value(t){this._object[this._key]=t}};function B(e,t,r=void 0){return new x(e,t,r)}function I(e){let t={};for(let r in e)t[r]=new x(e,r);return t}var F=class extends _{_get;_set;constructor(t){let r=!1,{get:n,set:o}=t(()=>r=!0,()=>this.setValue());super(n()),this.__v_isRef=r,this._get=n,this._set=o}get value(){return this.__v_isRef?super.value:this._get()}set value(t){this._set(t)}setValue(){super.value=this._get()}};function Q(e){return new F(e)}var v=class{fn;constructor(t){this.fn=t}};var O=class{__v_isReadonly=!0;[w]=!0;_cacheable=!0;_dirty=!0;computed;_setter;constructor(t,r){this.computed=new v(t),this._setter=r}get value(){return this.computed.fn()}set value(t){this._setter?this._setter(t):console.warn("Write operation failed: computed value is readonly")}};function z(e){return typeof e=="function"?new O(e):new O(e.get,e.set)}function f(e){return e instanceof Array?oe(e):y(e)==="object"?ne(e):e}function ne(e){let t={},r=Object.getOwnPropertyNames(e);for(let n=0;n<r.length;n++)t[r[n]]=f(e[r[n]]);return t}function oe(e){let t=new Array(e.length);for(let r=0;r<t.length;r++)t[r]=f(e[r]);return t}function V(e,t,r={}){let n=!1;if(n)return;let o=e(),i=f(o);return r.immediate&&t(o,void 0),g(()=>{let a=[];if(n)return a.length>0&&a.forEach(m=>m()),!0;let s=e();l(o)?r.deep&&!j(s,i)&&(t(s,u(i)),i=f(s),H(s).forEach(m=>{let re=V(()=>m,()=>{t(s,u(i))},{deep:!0});a.push(re)})):s!==i&&(t(s,i),i=f(s))}),()=>{n=!0}}function H(e,t=[]){for(let r in e)l(e[r])&&(t.push(e[r]),H(e[r],t));return t}function J(e){let t=!1,r=!1;return g(()=>{if(t)return!0;e(n=>{r&&n(),r=!0})}),()=>{t=!0}}var p="",S,ie=!0,se="";function X(e){p=e.base,S=e.mode||"history",ie=e.isBrowser,se=e.SSR_DATA_KEY||"g_initialProps"}function P(e){let t=e.path,r="";for(let i in e.query)r+=`&${i}=${e.query[i]}`;r=r?"?"+r:"";let n=e.hash?"#"+e.hash:"";return t+r+n}function Z(e){let t={};return e.replace("?","").split("&").forEach(n=>{let[o,i]=n.split("=");o&&i&&(t[o]=i)}),t}function K(e){return e.replace(/\/+/g,"/")}var A=u({path:"",query:{},hash:"",meta:{}});function M(e){let t=new URL("http://0.0.0.0"+e);A.path=t.pathname.replace(p,""),A.query=Z(t.search),A.hash=t.hash}function ee(){return A}function ue(e){let t=typeof e=="string"?e:P(e);S==="history"?history.pushState({},"",K(p+"/"+t)):location.hash=t,M(t)}function ae(e){let t=typeof e=="string"?e:P(e);S==="history"?history.replaceState({},"",K(p+"/"+t)):location.hash=t,M(t)}function ce(e){history.go(e)}function te(){return{push:ue,replace:ae,go:ce}}window.vue={isReactive:T,markRaw:Y,reactive:u,toRaw:N,isProxy:U,customRef:Q,isRef:E,ref:$,toRef:B,toRefs:I,unref:G,createSignal:R,readonly:C,computed:z,watch:V,watchEffect:J,binding:g,nextTick:h,initRouter:X,useRoute:ee,useRouter:te};})();
