var jt=`
:root {
  /* \u2500\u2500 Surface hierarchy \u2500\u2500 */
  --mm-bg-base: #08090d;
  --mm-bg-surface: #111318;
  --mm-bg-elevated: #1a1c23;
  --mm-bg-overlay: #22252e;

  /* \u2500\u2500 Accent palette (blue-violet) \u2500\u2500 */
  --mm-accent: #6c8cff;
  --mm-accent-hover: #8aa4ff;
  --mm-accent-subtle: rgba(108, 140, 255, 0.12);
  --mm-accent-glow: rgba(108, 140, 255, 0.25);
  --mm-accent-text: #a3baff;

  /* \u2500\u2500 Semantic: success \u2500\u2500 */
  --mm-success: #4ade80;
  --mm-success-subtle: rgba(74, 222, 128, 0.12);
  --mm-success-hover: #6ee7a0;

  /* \u2500\u2500 Semantic: warning \u2500\u2500 */
  --mm-warning: #fbbf24;
  --mm-warning-subtle: rgba(251, 191, 36, 0.12);
  --mm-warning-hover: #fcd34d;

  /* \u2500\u2500 Semantic: danger \u2500\u2500 */
  --mm-danger: #f87171;
  --mm-danger-subtle: rgba(248, 113, 113, 0.12);
  --mm-danger-hover: #fca5a5;

  /* \u2500\u2500 Semantic: info \u2500\u2500 */
  --mm-info: #38bdf8;
  --mm-info-subtle: rgba(56, 189, 248, 0.12);
  --mm-info-hover: #7dd3fc;

  /* \u2500\u2500 Text hierarchy \u2500\u2500 */
  --mm-text-primary: rgba(255, 255, 255, 0.92);
  --mm-text-secondary: rgba(255, 255, 255, 0.60);
  --mm-text-muted: rgba(255, 255, 255, 0.38);
  --mm-text-inverse: #08090d;

  /* \u2500\u2500 Borders \u2500\u2500 */
  --mm-border: rgba(255, 255, 255, 0.08);
  --mm-border-hover: rgba(255, 255, 255, 0.15);
  --mm-border-focus: var(--mm-accent);

  /* \u2500\u2500 Radius \u2500\u2500 */
  --mm-radius-sm: 6px;
  --mm-radius-md: 10px;
  --mm-radius-lg: 14px;
  --mm-radius-xl: 20px;
  --mm-radius-full: 9999px;

  /* \u2500\u2500 Spacing \u2500\u2500 */
  --mm-space-xs: 4px;
  --mm-space-sm: 8px;
  --mm-space-md: 12px;
  --mm-space-lg: 16px;
  --mm-space-xl: 24px;
  --mm-space-2xl: 32px;
  --mm-space-3xl: 48px;

  /* \u2500\u2500 Typography \u2500\u2500 */
  --mm-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --mm-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --mm-text-xs: 0.6875rem;
  --mm-text-sm: 0.8125rem;
  --mm-text-base: 0.9375rem;
  --mm-text-lg: 1.125rem;
  --mm-text-xl: 1.375rem;
  --mm-text-2xl: 1.75rem;
  --mm-text-3xl: 2.25rem;
  --mm-leading-tight: 1.25;
  --mm-leading-normal: 1.5;
  --mm-weight-normal: 400;
  --mm-weight-medium: 500;
  --mm-weight-semibold: 600;
  --mm-weight-bold: 700;

  /* \u2500\u2500 Shadows \u2500\u2500 */
  --mm-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
  --mm-shadow-md: 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
  --mm-shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.25);
  --mm-shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.4), 0 24px 48px rgba(0, 0, 0, 0.3);
  --mm-shadow-glow: 0 0 20px var(--mm-accent-glow);
  --mm-shadow-glow-lg: 0 0 40px var(--mm-accent-glow), 0 0 80px rgba(108, 140, 255, 0.1);

  /* \u2500\u2500 Transitions \u2500\u2500 */
  --mm-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --mm-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --mm-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --mm-duration-fast: 150ms;
  --mm-duration-normal: 250ms;
  --mm-duration-slow: 400ms;
  --mm-transition-fast: var(--mm-duration-fast) var(--mm-ease);
  --mm-transition-normal: var(--mm-duration-normal) var(--mm-ease-out);
  --mm-transition-slow: var(--mm-duration-slow) var(--mm-ease-out);

  /* \u2500\u2500 Z-index scale \u2500\u2500 */
  --mm-z-base: 0;
  --mm-z-dropdown: 100;
  --mm-z-sticky: 200;
  --mm-z-modal: 300;
  --mm-z-toast: 400;
  --mm-z-tooltip: 500;
}

body {
  margin: 0;
  background: var(--mm-bg-base);
  color: var(--mm-text-primary);
  font-family: var(--mm-font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`,bt=new CSSStyleSheet;bt.replaceSync(jt);document.adoptedStyleSheets=[...document.adoptedStyleSheets,bt];var j=globalThis,N=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,I=Symbol(),ft=new WeakMap,z=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==I)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(N&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ft.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ft.set(e,t))}return t}toString(){return this.cssText}},xt=a=>new z(typeof a=="string"?a:a+"",void 0,I),c=(a,...t)=>{let e=a.length===1?a[0]:t.reduce((r,s,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+a[i+1],a[0]);return new z(e,a,I)},yt=(a,t)=>{if(N)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=j.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,a.appendChild(r)}},V=N?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return xt(e)})(a):a;var{is:Nt,defineProperty:Rt,getOwnPropertyDescriptor:Ot,getOwnPropertyNames:Dt,getOwnPropertySymbols:Bt,getPrototypeOf:It}=Object,R=globalThis,wt=R.trustedTypes,Vt=wt?wt.emptyScript:"",Yt=R.reactiveElementPolyfillSupport,M=(a,t)=>a,Y={toAttribute(a,t){switch(t){case Boolean:a=a?Vt:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},_t=(a,t)=>!Nt(a,t),$t={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:_t};Symbol.metadata??=Symbol("metadata"),R.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$t){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Rt(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:i}=Ot(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:s,set(n){let v=s?.call(this);i?.call(this,n),this.requestUpdate(t,v,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$t}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let t=It(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let e=this.properties,r=[...Dt(e),...Bt(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(V(s))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:Y).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let i=r.getPropertyOptions(s),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Y;this._$Em=s;let v=n.fromAttribute(e,i.type);this[s]=v??this._$Ej?.get(s)??v,this._$Em=null}}requestUpdate(t,e,r,s=!1,i){if(t!==void 0){let n=this.constructor;if(s===!1&&(i=this[t]),r??=n.getPropertyOptions(t),!((r.hasChanged??_t)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:i},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,i]of r){let{wrapped:n}=i,v=this[s];n!==!0||this._$AL.has(s)||v===void 0||this.C(s,void 0,i,v)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[M("elementProperties")]=new Map,y[M("finalized")]=new Map,Yt?.({ReactiveElement:y}),(R.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,kt=a=>a,O=Q.trustedTypes,St=O?O.createPolicy("lit-html",{createHTML:a=>a}):void 0,Lt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+$,Ft=`<${Tt}>`,S=document,T=()=>S.createComment(""),P=a=>a===null||typeof a!="object"&&typeof a!="function",G=Array.isArray,Wt=a=>G(a)||typeof a?.[Symbol.iterator]=="function",F=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,At=/>/g,_=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,zt=/"/g,Pt=/^(?:script|style|textarea|title)$/i,tt=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),o=tt(1),l=tt(2),se=tt(3),E=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Mt=new WeakMap,k=S.createTreeWalker(S,129);function qt(a,t){if(!G(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(t):t}var Kt=(a,t)=>{let e=a.length-1,r=[],s,i=t===2?"<svg>":t===3?"<math>":"",n=L;for(let v=0;v<e;v++){let d=a[v],g,f,h=-1,x=0;for(;x<d.length&&(n.lastIndex=x,f=n.exec(d),f!==null);)x=n.lastIndex,n===L?f[1]==="!--"?n=Et:f[1]!==void 0?n=At:f[2]!==void 0?(Pt.test(f[2])&&(s=RegExp("</"+f[2],"g")),n=_):f[3]!==void 0&&(n=_):n===_?f[0]===">"?(n=s??L,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,g=f[1],n=f[3]===void 0?_:f[3]==='"'?zt:Ct):n===zt||n===Ct?n=_:n===Et||n===At?n=L:(n=_,s=void 0);let w=n===_&&a[v+1].startsWith("/>")?" ":"";i+=n===L?d+Ft:h>=0?(r.push(g),d.slice(0,h)+Lt+d.slice(h)+$+w):d+$+(h===-2?v:w)}return[qt(a,i+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},q=class a{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let i=0,n=0,v=t.length-1,d=this.parts,[g,f]=Kt(t,e);if(this.el=a.createElement(g,r),k.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=k.nextNode())!==null&&d.length<v;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(Lt)){let x=f[n++],w=s.getAttribute(h).split($),H=/([.?@])?(.*)/.exec(x);d.push({type:1,index:i,name:H[2],strings:w,ctor:H[1]==="."?K:H[1]==="?"?X:H[1]==="@"?Z:C}),s.removeAttribute(h)}else h.startsWith($)&&(d.push({type:6,index:i}),s.removeAttribute(h));if(Pt.test(s.tagName)){let h=s.textContent.split($),x=h.length-1;if(x>0){s.textContent=O?O.emptyScript:"";for(let w=0;w<x;w++)s.append(h[w],T()),k.nextNode(),d.push({type:2,index:++i});s.append(h[x],T())}}}else if(s.nodeType===8)if(s.data===Tt)d.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf($,h+1))!==-1;)d.push({type:7,index:i}),h+=$.length-1}i++}}static createElement(t,e){let r=S.createElement("template");return r.innerHTML=t,r}};function A(a,t,e=a,r){if(t===E)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,i=P(t)?void 0:t._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(a),s._$AT(a,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=A(a,s._$AS(a,t.values),s,r)),t}var W=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??S).importNode(e,!0);k.currentNode=s;let i=k.nextNode(),n=0,v=0,d=r[0];for(;d!==void 0;){if(n===d.index){let g;d.type===2?g=new U(i,i.nextSibling,this,t):d.type===1?g=new d.ctor(i,d.name,d.strings,this,t):d.type===6&&(g=new J(i,this,t)),this._$AV.push(g),d=r[++v]}n!==d?.index&&(i=k.nextNode(),n++)}return k.currentNode=S,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},U=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=A(this,t,e),P(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=q.createElement(qt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let i=new W(s,this),n=i.u(this.options);i.p(e),this.T(n),this._$AH=i}}_$AC(t){let e=Mt.get(t.strings);return e===void 0&&Mt.set(t.strings,e=new q(t)),e}k(t){G(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let i of t)s===e.length?e.push(r=new a(this.O(T()),this.O(T()),this,this.options)):r=e[s],r._$AI(i),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=kt(t).nextSibling;kt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){let i=this.strings,n=!1;if(i===void 0)t=A(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==E,n&&(this._$AH=t);else{let v=t,d,g;for(t=i[0],d=0;d<i.length-1;d++)g=A(this,v[r+d],e,d),g===E&&(g=this._$AH[d]),n||=!P(g)||g!==this._$AH[d],g===b?t=b:t!==b&&(t+=(g??"")+i[d+1]),this._$AH[d]=g}n&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},K=class extends C{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},X=class extends C{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},Z=class extends C{constructor(t,e,r,s,i){super(t,e,r,s,i),this.type=5}_$AI(t,e=this){if((t=A(this,t,e,0)??b)===E)return;let r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},J=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){A(this,t)}};var Xt=Q.litHtmlPolyfillSupport;Xt?.(q,U),(Q.litHtmlVersions??=[]).push("3.3.2");var Ut=(a,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let i=e?.renderBefore??null;r._$litPart$=s=new U(t.insertBefore(T(),i),i,void 0,e??{})}return s._$AI(a),s};var et=globalThis,m=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ut(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};m._$litElement$=!0,m.finalized=!0,et.litElementHydrateSupport?.({LitElement:m});var Zt=et.litElementPolyfillSupport;Zt?.({LitElement:m});(et.litElementVersions??=[]).push("4.2.2");var Jt={search:l`<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,x:l`<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,download:l`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`,upload:l`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>`,play:l`<polygon points="6 3 20 12 6 21 6 3"/>`,pause:l`<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>`,"trash-2":l`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>`,settings:l`<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,monitor:l`<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`,film:l`<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7h4"/><path d="M17 7h4"/><path d="M3 12h18"/><path d="M3 17h4"/><path d="M17 17h4"/>`,tv:l`<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>`,star:l`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,clock:l`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,"check-circle":l`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,"alert-triangle":l`<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,info:l`<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,"chevron-down":l`<path d="m6 9 6 6 6-6"/>`,"chevron-right":l`<path d="m9 18 6-6-6-6"/>`,"chevron-left":l`<path d="m15 18-6-6 6-6"/>`,"refresh-cw":l`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>`,"external-link":l`<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,folder:l`<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,file:l`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>`,"hard-drive":l`<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>`,wifi:l`<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>`,zap:l`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,eye:l`<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,send:l`<path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/>`,bell:l`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,plus:l`<path d="M5 12h14"/><path d="M12 5v14"/>`,minus:l`<path d="M5 12h14"/>`,copy:l`<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,edit:l`<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>`,hash:l`<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>`,globe:l`<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,database:l`<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>`,menu:l`<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`,home:l`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,list:l`<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>`,"trending-up":l`<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,"arrow-left":l`<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,"arrow-right":l`<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,"log-out":l`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`},D=class extends m{static properties={name:{type:String},size:{type:Number},color:{type:String}};static styles=c`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    svg {
      display: block;
    }
  `;constructor(){super(),this.name="",this.size=20,this.color="currentColor"}render(){let t=Jt[this.name];return t?o`
      <svg
        width="${this.size}"
        height="${this.size}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="${this.color}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >${t}</svg>
    `:o``}};customElements.define("mm-icon",D);var p=c`
  :host {
    font-family: var(--mm-font-sans);
    color: var(--mm-text-primary);
    line-height: var(--mm-leading-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`,u=c`
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: none;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`,xe=c`
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: var(--mm-radius-full);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;var rt=class extends m{static properties={variant:{type:String},size:{type:String},loading:{type:Boolean},disabled:{type:Boolean,reflect:!0}};static styles=[p,u,c`
      :host {
        display: inline-flex;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--mm-space-sm);
        border-radius: var(--mm-radius-md);
        font-weight: var(--mm-weight-medium);
        white-space: nowrap;
        user-select: none;
        overflow: hidden;
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast),
          transform var(--mm-transition-fast),
          border-color var(--mm-transition-fast);
      }

      /* Sizes */
      button.sm {
        height: 32px;
        padding: 0 var(--mm-space-md);
        font-size: var(--mm-text-xs);
        border-radius: var(--mm-radius-sm);
      }

      button.md {
        height: 38px;
        padding: 0 var(--mm-space-lg);
        font-size: var(--mm-text-sm);
      }

      button.lg {
        height: 44px;
        padding: 0 var(--mm-space-xl);
        font-size: var(--mm-text-base);
      }

      /* Primary variant */
      button.primary {
        background: var(--mm-accent);
        color: #fff;
        box-shadow: 0 0 0 0 transparent;
      }

      button.primary:hover:not(:disabled) {
        background: var(--mm-accent-hover);
        box-shadow: var(--mm-shadow-glow);
        transform: translateY(-1px);
      }

      button.primary:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 0 12px var(--mm-accent-glow);
      }

      /* Secondary variant */
      button.secondary {
        background: var(--mm-bg-elevated);
        color: var(--mm-text-primary);
        border: 1px solid var(--mm-border);
      }

      button.secondary:hover:not(:disabled) {
        background: var(--mm-bg-overlay);
        border-color: var(--mm-border-hover);
        transform: translateY(-1px);
      }

      button.secondary:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Danger variant */
      button.danger {
        background: var(--mm-danger);
        color: #fff;
      }

      button.danger:hover:not(:disabled) {
        background: var(--mm-danger-hover);
        box-shadow: 0 0 20px rgba(248, 113, 113, 0.25);
        transform: translateY(-1px);
      }

      button.danger:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Ghost variant */
      button.ghost {
        background: transparent;
        color: var(--mm-text-secondary);
      }

      button.ghost:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-primary);
      }

      button.ghost:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
      }

      /* Disabled */
      button:disabled {
        opacity: 0.4;
      }

      /* Ripple */
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0);
        animation: ripple-anim 500ms ease-out forwards;
        pointer-events: none;
      }

      @keyframes ripple-anim {
        to {
          transform: scale(2.5);
          opacity: 0;
        }
      }

      /* Loading spinner */
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 600ms linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      ::slotted(mm-icon) {
        flex-shrink: 0;
      }
    `];constructor(){super(),this.variant="primary",this.size="md",this.loading=!1,this.disabled=!1}_handleClick(t){if(this.loading||this.disabled){t.preventDefault(),t.stopPropagation();return}let e=this.shadowRoot.querySelector("button"),r=e.getBoundingClientRect(),s=document.createElement("span");s.classList.add("ripple");let i=Math.max(r.width,r.height);s.style.width=s.style.height=`${i}px`,s.style.left=`${t.clientX-r.left-i/2}px`,s.style.top=`${t.clientY-r.top-i/2}px`,e.appendChild(s),s.addEventListener("animationend",()=>s.remove())}render(){return o`
      <button
        class="${this.variant} ${this.size}"
        ?disabled=${this.disabled||this.loading}
        @click=${this._handleClick}
      >
        ${this.loading?o`<span class="spinner"></span>`:""}
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `}};customElements.define("mm-button",rt);var st=class extends m{static properties={elevated:{type:Boolean},hoverable:{type:Boolean},padding:{type:String}};static styles=[p,c`
      :host {
        display: block;
      }

      .card {
        background: var(--mm-bg-surface);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-lg);
        overflow: hidden;
        transition:
          background var(--mm-transition-fast),
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-normal),
          transform var(--mm-transition-normal);
      }

      .card.elevated {
        background: var(--mm-bg-elevated);
        box-shadow: var(--mm-shadow-md);
      }

      .card.hoverable:hover {
        border-color: var(--mm-border-hover);
        box-shadow: var(--mm-shadow-lg), 0 0 0 1px rgba(108, 140, 255, 0.06);
        transform: translateY(-2px);
      }

      .body {
        padding: var(--mm-space-lg);
      }

      .body.sm { padding: var(--mm-space-md); }
      .body.lg { padding: var(--mm-space-xl); }

      .header {
        padding: var(--mm-space-lg) var(--mm-space-lg) 0;
      }

      .header.sm { padding: var(--mm-space-md) var(--mm-space-md) 0; }
      .header.lg { padding: var(--mm-space-xl) var(--mm-space-xl) 0; }

      .footer {
        padding: 0 var(--mm-space-lg) var(--mm-space-lg);
        border-top: 1px solid var(--mm-border);
        margin-top: var(--mm-space-lg);
        padding-top: var(--mm-space-lg);
      }

      .footer.sm {
        padding: 0 var(--mm-space-md) var(--mm-space-md);
        margin-top: var(--mm-space-md);
        padding-top: var(--mm-space-md);
      }

      .footer.lg {
        padding: 0 var(--mm-space-xl) var(--mm-space-xl);
        margin-top: var(--mm-space-xl);
        padding-top: var(--mm-space-xl);
      }

      /* Hide slots when empty */
      slot[name="header"]::slotted(*) + .body {
        padding-top: var(--mm-space-md);
      }
    `];constructor(){super(),this.elevated=!1,this.hoverable=!1,this.padding="md"}_hasSlot(t){return this.querySelector(`[slot="${t}"]`)!==null}render(){let t=this.padding;return o`
      <div class="card ${this.elevated?"elevated":""} ${this.hoverable?"hoverable":""}">
        ${this._hasSlot("header")?o`<div class="header ${t}"><slot name="header"></slot></div>`:""}
        <div class="body ${t}">
          <slot></slot>
        </div>
        ${this._hasSlot("footer")?o`<div class="footer ${t}"><slot name="footer"></slot></div>`:""}
      </div>
    `}};customElements.define("mm-card",st);var at=class extends m{static properties={label:{type:String},value:{type:String},placeholder:{type:String},type:{type:String},error:{type:String},disabled:{type:Boolean},_focused:{state:!0}};static styles=[p,u,c`
      :host {
        display: block;
      }

      .wrapper {
        position: relative;
      }

      .field {
        position: relative;
        display: flex;
        align-items: center;
      }

      input {
        width: 100%;
        height: 44px;
        padding: var(--mm-space-md) var(--mm-space-lg);
        padding-top: 20px;
        padding-bottom: 4px;
        background: var(--mm-bg-elevated);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-md);
        color: var(--mm-text-primary);
        font-size: var(--mm-text-sm);
        transition:
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast),
          background var(--mm-transition-fast);
      }

      input::placeholder {
        color: transparent;
      }

      input:focus {
        border-color: var(--mm-accent);
        box-shadow: 0 0 0 3px var(--mm-accent-subtle);
        background: var(--mm-bg-overlay);
      }

      input:hover:not(:focus):not(:disabled) {
        border-color: var(--mm-border-hover);
      }

      input:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      /* Floating label */
      label {
        position: absolute;
        left: var(--mm-space-lg);
        top: 50%;
        transform: translateY(-50%);
        font-size: var(--mm-text-sm);
        color: var(--mm-text-muted);
        pointer-events: none;
        transition:
          top var(--mm-transition-fast),
          font-size var(--mm-transition-fast),
          color var(--mm-transition-fast),
          transform var(--mm-transition-fast);
        transform-origin: left center;
      }

      /* Label floated up when input focused or has value */
      input:focus + label,
      input:not(:placeholder-shown) + label {
        top: 8px;
        transform: translateY(0);
        font-size: var(--mm-text-xs);
        color: var(--mm-text-secondary);
      }

      input:focus + label {
        color: var(--mm-accent);
      }

      /* Error state */
      .wrapper.error input {
        border-color: var(--mm-danger);
      }

      .wrapper.error input:focus {
        box-shadow: 0 0 0 3px var(--mm-danger-subtle);
      }

      .wrapper.error input:focus + label,
      .wrapper.error input:not(:placeholder-shown) + label {
        color: var(--mm-danger);
      }

      .error-text {
        font-size: var(--mm-text-xs);
        color: var(--mm-danger);
        margin-top: var(--mm-space-xs);
        padding-left: var(--mm-space-lg);
      }
    `];constructor(){super(),this.label="",this.value="",this.placeholder=" ",this.type="text",this.error="",this.disabled=!1,this._focused=!1}_onInput(t){this.value=t.target.value,this.dispatchEvent(new CustomEvent("mm-input",{detail:{value:this.value},bubbles:!0,composed:!0}))}_onChange(t){this.dispatchEvent(new CustomEvent("mm-change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return o`
      <div class="wrapper ${this.error?"error":""}">
        <div class="field">
          <input
            type="${this.type}"
            .value=${this.value}
            placeholder="${this.placeholder||" "}"
            ?disabled=${this.disabled}
            @input=${this._onInput}
            @change=${this._onChange}
            @focus=${()=>this._focused=!0}
            @blur=${()=>this._focused=!1}
          />
          ${this.label?o`<label>${this.label}</label>`:""}
        </div>
        ${this.error?o`<div class="error-text">${this.error}</div>`:""}
      </div>
    `}};customElements.define("mm-input",at);var it=class extends m{static properties={variant:{type:String},size:{type:String},pulse:{type:Boolean}};static styles=[p,c`
      :host {
        display: inline-flex;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: var(--mm-radius-full);
        font-weight: var(--mm-weight-medium);
        white-space: nowrap;
        line-height: 1;
      }

      /* Sizes */
      .badge.sm {
        height: 22px;
        padding: 0 var(--mm-space-sm);
        font-size: 0.625rem;
      }

      .badge.md {
        height: 26px;
        padding: 0 var(--mm-space-md);
        font-size: var(--mm-text-xs);
      }

      /* Variants */
      .badge.success {
        background: var(--mm-success-subtle);
        color: var(--mm-success);
      }

      .badge.warning {
        background: var(--mm-warning-subtle);
        color: var(--mm-warning);
      }

      .badge.danger {
        background: var(--mm-danger-subtle);
        color: var(--mm-danger);
      }

      .badge.info {
        background: var(--mm-info-subtle);
        color: var(--mm-info);
      }

      .badge.neutral {
        background: rgba(255, 255, 255, 0.08);
        color: var(--mm-text-secondary);
      }

      /* Pulse dot */
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
      }

      .dot.pulse {
        animation: pulse-dot 1.5s ease-in-out infinite;
      }

      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.75); }
      }
    `];constructor(){super(),this.variant="neutral",this.size="md",this.pulse=!1}render(){return o`
      <span class="badge ${this.variant} ${this.size}">
        ${this.pulse?o`<span class="dot pulse"></span>`:""}
        <slot></slot>
      </span>
    `}};customElements.define("mm-badge",it);var ot=class extends m{static properties={open:{type:Boolean,reflect:!0},title:{type:String},size:{type:String}};static styles=[p,u,c`
      :host {
        display: contents;
      }

      .backdrop {
        position: fixed;
        inset: 0;
        z-index: var(--mm-z-modal);
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--mm-space-xl);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity var(--mm-transition-normal),
          visibility var(--mm-transition-normal);
      }

      .backdrop.open {
        opacity: 1;
        visibility: visible;
      }

      .dialog {
        background: var(--mm-bg-elevated);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-xl);
        box-shadow: var(--mm-shadow-xl);
        width: 100%;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        transform: scale(0.95) translateY(10px);
        opacity: 0;
        transition:
          transform var(--mm-transition-normal),
          opacity var(--mm-transition-normal);
      }

      .backdrop.open .dialog {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      /* Sizes */
      .dialog.sm { max-width: 400px; }
      .dialog.md { max-width: 560px; }
      .dialog.lg { max-width: 720px; }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--mm-space-xl) var(--mm-space-xl) 0;
        flex-shrink: 0;
      }

      .title {
        font-size: var(--mm-text-lg);
        font-weight: var(--mm-weight-semibold);
        color: var(--mm-text-primary);
        margin: 0;
      }

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: var(--mm-radius-sm);
        color: var(--mm-text-muted);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-primary);
      }

      .body {
        padding: var(--mm-space-xl);
        overflow-y: auto;
        flex: 1;
      }

      .footer {
        padding: 0 var(--mm-space-xl) var(--mm-space-xl);
        border-top: 1px solid var(--mm-border);
        padding-top: var(--mm-space-lg);
        display: flex;
        justify-content: flex-end;
        gap: var(--mm-space-sm);
        flex-shrink: 0;
      }

      /* Scrollbar */
      .body::-webkit-scrollbar { width: 6px; }
      .body::-webkit-scrollbar-track { background: transparent; }
      .body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: var(--mm-radius-full);
      }
    `];constructor(){super(),this.open=!1,this.title="",this.size="md",this._onKeyDown=this._onKeyDown.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown)}_onKeyDown(t){t.key==="Escape"&&this.open&&this._close()}_onBackdropClick(t){t.target===t.currentTarget&&this._close()}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("mm-close",{bubbles:!0,composed:!0}))}_hasFooter(){return this.querySelector('[slot="footer"]')!==null}render(){return o`
      <div class="backdrop ${this.open?"open":""}" @click=${this._onBackdropClick}>
        <div class="dialog ${this.size}" role="dialog" aria-modal="true">
          <div class="header">
            <h2 class="title">${this.title}</h2>
            <button class="close-btn" @click=${this._close} aria-label="Close">
              <mm-icon name="x" size="18"></mm-icon>
            </button>
          </div>
          <div class="body">
            <slot></slot>
          </div>
          ${this._hasFooter()?o`
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          `:""}
        </div>
      </div>
    `}};customElements.define("mm-modal",ot);var Ht="mm-toast-container";function Qt(){let a=document.getElementById(Ht);return a||(a=document.createElement("div"),a.id=Ht,Object.assign(a.style,{position:"fixed",bottom:"24px",right:"24px",zIndex:"400",display:"flex",flexDirection:"column-reverse",gap:"8px",pointerEvents:"none",maxWidth:"380px",width:"100%"}),document.body.appendChild(a)),a}var B=class extends m{static properties={message:{type:String},type:{type:String},_visible:{state:!0}};static styles=[p,c`
      :host {
        display: block;
        pointer-events: auto;
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--mm-space-md);
        padding: var(--mm-space-md) var(--mm-space-lg);
        background: var(--mm-bg-overlay);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-md);
        box-shadow: var(--mm-shadow-lg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        font-size: var(--mm-text-sm);
        color: var(--mm-text-primary);
        transform: translateX(120%);
        opacity: 0;
        transition:
          transform var(--mm-transition-normal),
          opacity var(--mm-transition-normal);
      }

      .toast.visible {
        transform: translateX(0);
        opacity: 1;
      }

      .toast.leaving {
        transform: translateX(120%);
        opacity: 0;
      }

      /* Type accent (left border) */
      .toast.success { border-left: 3px solid var(--mm-success); }
      .toast.error { border-left: 3px solid var(--mm-danger); }
      .toast.warning { border-left: 3px solid var(--mm-warning); }
      .toast.info { border-left: 3px solid var(--mm-info); }

      .icon {
        flex-shrink: 0;
        margin-top: 1px;
      }

      .toast.success .icon { color: var(--mm-success); }
      .toast.error .icon { color: var(--mm-danger); }
      .toast.warning .icon { color: var(--mm-warning); }
      .toast.info .icon { color: var(--mm-info); }

      .text {
        flex: 1;
        line-height: var(--mm-leading-normal);
      }

      .close {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: var(--mm-radius-sm);
        color: var(--mm-text-muted);
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        transition: color var(--mm-transition-fast), background var(--mm-transition-fast);
      }

      .close:hover {
        color: var(--mm-text-primary);
        background: rgba(255, 255, 255, 0.06);
      }
    `];static show(t,e="info",r=4e3){let s=Qt(),i=document.createElement("mm-toast");return i.message=t,i.type=e,s.appendChild(i),requestAnimationFrame(()=>{requestAnimationFrame(()=>{i._visible=!0})}),r>0&&setTimeout(()=>i._dismiss(),r),i}constructor(){super(),this.message="",this.type="info",this._visible=!1}_getIcon(){return{success:"check-circle",error:"alert-triangle",warning:"alert-triangle",info:"info"}[this.type]||"info"}_dismiss(){this._visible=!1;let t=this.shadowRoot.querySelector(".toast");t&&t.classList.add("leaving"),setTimeout(()=>this.remove(),300)}render(){return o`
      <div class="toast ${this.type} ${this._visible?"visible":""}">
        <span class="icon">
          <mm-icon name="${this._getIcon()}" size="18"></mm-icon>
        </span>
        <span class="text">${this.message}</span>
        <button class="close" @click=${this._dismiss}>
          <mm-icon name="x" size="14"></mm-icon>
        </button>
      </div>
    `}};customElements.define("mm-toast",B);var nt=class extends m{static properties={size:{type:String}};static styles=[p,c`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .spinner {
        border-radius: 50%;
        border-style: solid;
        border-color: var(--mm-accent-subtle);
        border-top-color: var(--mm-accent);
        animation: spin 750ms linear infinite;
      }

      .spinner.sm {
        width: 16px;
        height: 16px;
        border-width: 2px;
      }

      .spinner.md {
        width: 28px;
        height: 28px;
        border-width: 3px;
      }

      .spinner.lg {
        width: 40px;
        height: 40px;
        border-width: 3px;
      }

      /* Outer pulse ring */
      .ring {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .ring::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 1px solid var(--mm-accent);
        opacity: 0;
        animation: pulse-ring 1.5s ease-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes pulse-ring {
        0% { opacity: 0.4; transform: scale(0.9); }
        100% { opacity: 0; transform: scale(1.3); }
      }
    `];constructor(){super(),this.size="md"}render(){return o`
      <div class="ring">
        <div class="spinner ${this.size}"></div>
      </div>
    `}};customElements.define("mm-spinner",nt);var lt=class extends m{static properties={value:{type:Number},variant:{type:String},animated:{type:Boolean},label:{type:String},steps:{type:Array},currentStep:{type:Number}};static styles=[p,c`
      :host {
        display: block;
      }

      /* ── Bar progress ── */
      .bar-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--mm-space-xs);
      }

      .bar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .bar-label {
        font-size: var(--mm-text-xs);
        color: var(--mm-text-secondary);
        font-weight: var(--mm-weight-medium);
      }

      .bar-value {
        font-size: var(--mm-text-xs);
        color: var(--mm-text-muted);
        font-family: var(--mm-font-mono);
      }

      .track {
        height: 6px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--mm-radius-full);
        overflow: hidden;
      }

      .fill {
        height: 100%;
        border-radius: var(--mm-radius-full);
        transition: width var(--mm-transition-slow);
        position: relative;
      }

      .fill.default {
        background: linear-gradient(90deg, var(--mm-accent), var(--mm-accent-hover));
      }

      .fill.success {
        background: linear-gradient(90deg, #22c55e, var(--mm-success));
      }

      .fill.danger {
        background: linear-gradient(90deg, #ef4444, var(--mm-danger));
      }

      /* Shimmer animation */
      .fill.animated::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.15) 50%,
          transparent 100%
        );
        animation: shimmer 1.8s ease-in-out infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      /* ── Step progress ── */
      .steps {
        display: flex;
        align-items: center;
        gap: 0;
      }

      .step {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .step:last-child {
        flex: 0;
      }

      .step-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        flex-shrink: 0;
        transition:
          background var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast);
        position: relative;
        z-index: 1;
      }

      .step-dot.completed {
        background: var(--mm-accent);
      }

      .step-dot.active {
        background: var(--mm-accent);
        box-shadow: 0 0 0 4px var(--mm-accent-subtle), var(--mm-shadow-glow);
        animation: step-pulse 1.5s ease-in-out infinite;
      }

      @keyframes step-pulse {
        0%, 100% { box-shadow: 0 0 0 4px var(--mm-accent-subtle), 0 0 12px var(--mm-accent-glow); }
        50% { box-shadow: 0 0 0 6px var(--mm-accent-subtle), 0 0 20px var(--mm-accent-glow); }
      }

      .step-line {
        flex: 1;
        height: 2px;
        background: rgba(255, 255, 255, 0.08);
        margin: 0 -1px;
        transition: background var(--mm-transition-fast);
      }

      .step-line.completed {
        background: var(--mm-accent);
      }

      .step-labels {
        display: flex;
        justify-content: space-between;
        margin-top: var(--mm-space-sm);
      }

      .step-label {
        font-size: 0.625rem;
        color: var(--mm-text-muted);
        text-align: center;
        transition: color var(--mm-transition-fast);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: var(--mm-weight-medium);
      }

      .step-label.completed,
      .step-label.active {
        color: var(--mm-text-secondary);
      }

      .step-label.active {
        color: var(--mm-accent-text);
      }
    `];constructor(){super(),this.value=0,this.variant="default",this.animated=!1,this.label="",this.steps=[],this.currentStep=0}_renderBar(){let t=Math.min(100,Math.max(0,this.value));return o`
      <div class="bar-wrapper">
        ${this.label?o`
          <div class="bar-header">
            <span class="bar-label">${this.label}</span>
            <span class="bar-value">${Math.round(t)}%</span>
          </div>
        `:""}
        <div class="track">
          <div
            class="fill ${this.variant} ${this.animated?"animated":""}"
            style="width: ${t}%"
          ></div>
        </div>
      </div>
    `}_renderSteps(){return o`
      <div>
        <div class="steps">
          ${this.steps.map((t,e)=>o`
            <div class="step">
              <div class="step-dot ${e<this.currentStep?"completed":""} ${e===this.currentStep?"active":""}"></div>
              ${e<this.steps.length-1?o`
                <div class="step-line ${e<this.currentStep?"completed":""}"></div>
              `:""}
            </div>
          `)}
        </div>
        <div class="step-labels">
          ${this.steps.map((t,e)=>o`
            <span class="step-label ${e<this.currentStep?"completed":""} ${e===this.currentStep?"active":""}">
              ${typeof t=="string"?t:t.label||t}
            </span>
          `)}
        </div>
      </div>
    `}render(){return this.steps&&this.steps.length>0?this._renderSteps():this._renderBar()}};customElements.define("mm-progress",lt);var mt=class extends m{static properties={tabs:{type:Array},active:{type:String},_indicatorStyle:{state:!0}};static styles=[p,u,c`
      :host {
        display: block;
      }

      .tabs {
        display: flex;
        position: relative;
        border-bottom: 1px solid var(--mm-border);
        gap: var(--mm-space-xs);
      }

      .tab {
        position: relative;
        padding: var(--mm-space-md) var(--mm-space-lg);
        font-size: var(--mm-text-sm);
        font-weight: var(--mm-weight-medium);
        color: var(--mm-text-muted);
        transition:
          color var(--mm-transition-fast),
          background var(--mm-transition-fast);
        border-radius: var(--mm-radius-sm) var(--mm-radius-sm) 0 0;
        white-space: nowrap;
      }

      .tab:hover {
        color: var(--mm-text-secondary);
        background: rgba(255, 255, 255, 0.03);
      }

      .tab.active {
        color: var(--mm-accent-text);
      }

      /* Sliding indicator */
      .indicator {
        position: absolute;
        bottom: -1px;
        height: 2px;
        background: var(--mm-accent);
        border-radius: 1px 1px 0 0;
        transition:
          left var(--mm-transition-normal),
          width var(--mm-transition-normal);
        box-shadow: 0 0 8px var(--mm-accent-glow);
      }
    `];constructor(){super(),this.tabs=[],this.active="",this._indicatorStyle=""}firstUpdated(){this._updateIndicator()}updated(t){(t.has("active")||t.has("tabs"))&&this._updateIndicator()}_updateIndicator(){requestAnimationFrame(()=>{let t=this.shadowRoot.querySelector(".tab.active");t&&(this._indicatorStyle=`left: ${t.offsetLeft}px; width: ${t.offsetWidth}px;`)})}_selectTab(t){this.active=t,this.dispatchEvent(new CustomEvent("mm-tab-change",{detail:{tab:t},bubbles:!0,composed:!0}))}render(){return o`
      <div class="tabs">
        ${this.tabs.map(t=>o`
          <button
            class="tab ${this.active===t.id?"active":""}"
            @click=${()=>this._selectTab(t.id)}
          >
            ${t.label}
          </button>
        `)}
        <div class="indicator" style="${this._indicatorStyle}"></div>
      </div>
    `}};customElements.define("mm-tabs",mt);var ct=class extends m{static properties={label:{type:String},options:{type:Array},value:{type:String},disabled:{type:Boolean},_open:{state:!0}};static styles=[p,u,c`
      :host {
        display: block;
        position: relative;
      }

      .field-label {
        display: block;
        font-size: var(--mm-text-xs);
        font-weight: var(--mm-weight-medium);
        color: var(--mm-text-secondary);
        margin-bottom: var(--mm-space-xs);
      }

      .trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 44px;
        padding: 0 var(--mm-space-lg);
        background: var(--mm-bg-elevated);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-md);
        color: var(--mm-text-primary);
        font-size: var(--mm-text-sm);
        transition:
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast),
          background var(--mm-transition-fast);
      }

      .trigger:hover:not(:disabled) {
        border-color: var(--mm-border-hover);
      }

      .trigger.open {
        border-color: var(--mm-accent);
        box-shadow: 0 0 0 3px var(--mm-accent-subtle);
        background: var(--mm-bg-overlay);
      }

      .trigger:disabled {
        opacity: 0.4;
      }

      .trigger-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .trigger-text.placeholder {
        color: var(--mm-text-muted);
      }

      .chevron {
        flex-shrink: 0;
        transition: transform var(--mm-transition-fast);
        color: var(--mm-text-muted);
      }

      .chevron.open {
        transform: rotate(180deg);
      }

      /* Dropdown */
      .dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        z-index: var(--mm-z-dropdown);
        background: var(--mm-bg-overlay);
        border: 1px solid var(--mm-border-hover);
        border-radius: var(--mm-radius-md);
        box-shadow: var(--mm-shadow-lg);
        max-height: 240px;
        overflow-y: auto;
        padding: var(--mm-space-xs);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-4px);
        transition:
          opacity var(--mm-transition-fast),
          visibility var(--mm-transition-fast),
          transform var(--mm-transition-fast);
      }

      .dropdown.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .option {
        display: flex;
        align-items: center;
        width: 100%;
        padding: var(--mm-space-sm) var(--mm-space-md);
        font-size: var(--mm-text-sm);
        color: var(--mm-text-secondary);
        border-radius: var(--mm-radius-sm);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
        text-align: left;
      }

      .option:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-primary);
      }

      .option.selected {
        background: var(--mm-accent-subtle);
        color: var(--mm-accent-text);
      }

      /* Scrollbar */
      .dropdown::-webkit-scrollbar { width: 6px; }
      .dropdown::-webkit-scrollbar-track { background: transparent; }
      .dropdown::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.12);
        border-radius: var(--mm-radius-full);
      }
    `];constructor(){super(),this.label="",this.options=[],this.value="",this.disabled=!1,this._open=!1,this._onDocumentClick=this._onDocumentClick.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocumentClick)}_onDocumentClick(t){!this.contains(t.target)&&!this.shadowRoot.contains(t.composedPath()[0])&&(this._open=!1)}_toggle(){this.disabled||(this._open=!this._open)}_select(t){this.value=t.value,this._open=!1,this.dispatchEvent(new CustomEvent("mm-change",{detail:{value:t.value},bubbles:!0,composed:!0}))}_getSelectedLabel(){let t=this.options.find(e=>e.value===this.value);return t?t.label:""}render(){let t=this._getSelectedLabel();return o`
      ${this.label?o`<span class="field-label">${this.label}</span>`:""}
      <button
        class="trigger ${this._open?"open":""}"
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <span class="trigger-text ${t?"":"placeholder"}">
          ${t||"Select..."}
        </span>
        <span class="chevron ${this._open?"open":""}">
          <mm-icon name="chevron-down" size="16"></mm-icon>
        </span>
      </button>
      <div class="dropdown ${this._open?"open":""}">
        ${this.options.map(e=>o`
          <button
            class="option ${this.value===e.value?"selected":""}"
            @click=${()=>this._select(e)}
          >
            ${e.label}
          </button>
        `)}
      </div>
    `}};customElements.define("mm-select",ct);var dt=class extends m{static properties={title:{type:String},year:{type:String},posterUrl:{type:String,attribute:"poster-url"},type:{type:String},rating:{type:Number},overview:{type:String},quality:{type:String},_loaded:{state:!0},_hovered:{state:!0}};static styles=[p,c`
      :host {
        display: block;
      }

      .card {
        position: relative;
        border-radius: var(--mm-radius-lg);
        overflow: hidden;
        background: var(--mm-bg-surface);
        border: 1px solid var(--mm-border);
        cursor: pointer;
        transform: translateY(0);
        transition:
          transform var(--mm-transition-normal),
          box-shadow var(--mm-transition-normal),
          border-color var(--mm-transition-normal);
      }

      .card:hover {
        transform: translateY(-4px) scale(1.03);
        box-shadow: var(--mm-shadow-lg), 0 0 30px rgba(108, 140, 255, 0.08);
        border-color: var(--mm-border-hover);
      }

      /* Poster area */
      .poster {
        position: relative;
        aspect-ratio: 2/3;
        background: var(--mm-bg-elevated);
        overflow: hidden;
      }

      .poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity var(--mm-transition-slow);
      }

      .poster img.loaded {
        opacity: 1;
      }

      .poster-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--mm-text-muted);
      }

      /* Bottom gradient overlay */
      .poster::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(transparent, rgba(8, 9, 13, 0.9));
        pointer-events: none;
      }

      /* Type badge */
      .type-badge {
        position: absolute;
        top: var(--mm-space-sm);
        left: var(--mm-space-sm);
        z-index: 2;
        padding: 2px 8px;
        border-radius: var(--mm-radius-sm);
        font-size: 0.625rem;
        font-weight: var(--mm-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .type-badge.movie {
        background: rgba(108, 140, 255, 0.25);
        color: #a3baff;
        border: 1px solid rgba(108, 140, 255, 0.2);
      }

      .type-badge.tv {
        background: rgba(168, 85, 247, 0.25);
        color: #c4b5fd;
        border: 1px solid rgba(168, 85, 247, 0.2);
      }

      /* Quality badge */
      .quality-badge {
        position: absolute;
        top: var(--mm-space-sm);
        right: var(--mm-space-sm);
        z-index: 2;
        padding: 2px 6px;
        border-radius: var(--mm-radius-sm);
        font-size: 0.5625rem;
        font-weight: var(--mm-weight-bold);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .quality-badge.q4k {
        background: rgba(251, 191, 36, 0.2);
        color: var(--mm-warning);
        border: 1px solid rgba(251, 191, 36, 0.15);
      }

      .quality-badge.q1080 {
        background: rgba(108, 140, 255, 0.2);
        color: var(--mm-accent);
        border: 1px solid rgba(108, 140, 255, 0.15);
      }

      .quality-badge.q720 {
        background: rgba(255, 255, 255, 0.08);
        color: var(--mm-text-secondary);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      /* Hover overlay with overview */
      .overlay {
        position: absolute;
        inset: 0;
        z-index: 3;
        background: rgba(8, 9, 13, 0.85);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: var(--mm-space-lg);
        opacity: 0;
        transition: opacity var(--mm-transition-normal);
        pointer-events: none;
      }

      .card:hover .overlay {
        opacity: 1;
      }

      .overlay-text {
        font-size: var(--mm-text-xs);
        color: var(--mm-text-secondary);
        line-height: var(--mm-leading-normal);
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Bottom info */
      .info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        padding: var(--mm-space-sm) var(--mm-space-md);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .title-text {
        font-size: var(--mm-text-xs);
        font-weight: var(--mm-weight-medium);
        color: var(--mm-text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 70%;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: var(--mm-space-sm);
      }

      .year {
        font-size: 0.625rem;
        color: var(--mm-text-muted);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 0.625rem;
        color: var(--mm-warning);
        font-weight: var(--mm-weight-medium);
      }

      .rating mm-icon {
        color: var(--mm-warning);
      }
    `];constructor(){super(),this.title="",this.year="",this.posterUrl="",this.type="movie",this.rating=0,this.overview="",this.quality="",this._loaded=!1,this._hovered=!1}_onImageLoad(){this._loaded=!0}_qualityClass(){if(!this.quality)return"";let t=this.quality.toLowerCase();return t.includes("4k")||t.includes("2160")?"q4k":t.includes("1080")?"q1080":"q720"}render(){return o`
      <div class="card">
        <div class="poster">
          ${this._loaded?"":o`
            <div class="poster-placeholder">
              <mm-icon name="film" size="32"></mm-icon>
            </div>
          `}
          ${this.posterUrl?o`
            <img
              src="${this.posterUrl}"
              alt="${this.title}"
              class="${this._loaded?"loaded":""}"
              loading="lazy"
              @load=${this._onImageLoad}
            />
          `:""}

          <span class="type-badge ${this.type}">${this.type==="tv"?"TV":"MOVIE"}</span>

          ${this.quality?o`
            <span class="quality-badge ${this._qualityClass()}">${this.quality}</span>
          `:""}

          ${this.overview?o`
            <div class="overlay">
              <div class="overlay-text">${this.overview}</div>
            </div>
          `:""}

          <div class="info">
            <span class="title-text">${this.title}</span>
            <div class="meta">
              ${this.year?o`<span class="year">${this.year}</span>`:""}
              ${this.rating>0?o`
                <span class="rating">
                  <mm-icon name="star" size="10"></mm-icon>
                  ${this.rating.toFixed(1)}
                </span>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}};customElements.define("mm-media-card",dt);var pt=class extends m{static properties={title:{type:String},status:{type:String},steps:{type:Array},currentStep:{type:Number,attribute:"current-step"},progress:{type:Number},eta:{type:String},type:{type:String},posterUrl:{type:String,attribute:"poster-url"}};static styles=[p,u,c`
      :host {
        display: block;
      }

      .card {
        display: flex;
        background: var(--mm-bg-surface);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-lg);
        overflow: hidden;
        transition:
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast);
      }

      .card:hover {
        border-color: var(--mm-border-hover);
        box-shadow: var(--mm-shadow-md);
      }

      /* Status accent border */
      .accent {
        width: 3px;
        flex-shrink: 0;
        transition: background var(--mm-transition-fast);
      }

      .accent.pending { background: var(--mm-text-muted); }
      .accent.downloading { background: var(--mm-accent); }
      .accent.transferring { background: var(--mm-info); }
      .accent.processing { background: var(--mm-warning); }
      .accent.completed { background: var(--mm-success); }
      .accent.failed { background: var(--mm-danger); }

      /* Poster thumbnail */
      .poster {
        width: 52px;
        flex-shrink: 0;
        background: var(--mm-bg-elevated);
        overflow: hidden;
      }

      .poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .poster-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--mm-text-muted);
      }

      /* Content */
      .content {
        flex: 1;
        min-width: 0;
        padding: var(--mm-space-md) var(--mm-space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--mm-space-sm);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--mm-space-sm);
      }

      .title {
        font-size: var(--mm-text-sm);
        font-weight: var(--mm-weight-medium);
        color: var(--mm-text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-badge {
        flex-shrink: 0;
        padding: 2px 8px;
        border-radius: var(--mm-radius-full);
        font-size: 0.625rem;
        font-weight: var(--mm-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .status-badge.pending { background: rgba(255,255,255,0.06); color: var(--mm-text-muted); }
      .status-badge.downloading { background: var(--mm-accent-subtle); color: var(--mm-accent); }
      .status-badge.transferring { background: var(--mm-info-subtle); color: var(--mm-info); }
      .status-badge.processing { background: var(--mm-warning-subtle); color: var(--mm-warning); }
      .status-badge.completed { background: var(--mm-success-subtle); color: var(--mm-success); }
      .status-badge.failed { background: var(--mm-danger-subtle); color: var(--mm-danger); }

      /* Step indicators */
      .steps-row {
        display: flex;
        align-items: center;
        gap: 0;
      }

      .step-item {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .step-item:last-child { flex: 0; }

      .step-circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
        transition: all var(--mm-transition-fast);
      }

      .step-circle.done { background: var(--mm-success); }
      .step-circle.active {
        background: var(--mm-accent);
        box-shadow: 0 0 8px var(--mm-accent-glow);
        animation: step-glow 1.5s ease-in-out infinite;
      }

      @keyframes step-glow {
        0%, 100% { box-shadow: 0 0 6px var(--mm-accent-glow); }
        50% { box-shadow: 0 0 14px var(--mm-accent-glow); }
      }

      .step-connector {
        flex: 1;
        height: 2px;
        background: rgba(255, 255, 255, 0.06);
        margin: 0 2px;
      }

      .step-connector.done { background: var(--mm-success); }

      /* Progress bar */
      .progress-area {
        display: flex;
        align-items: center;
        gap: var(--mm-space-sm);
      }

      .progress-track {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--mm-radius-full);
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: var(--mm-radius-full);
        background: linear-gradient(90deg, var(--mm-accent), var(--mm-accent-hover));
        transition: width var(--mm-transition-slow);
        position: relative;
      }

      .progress-fill::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        animation: shimmer 2s ease-in-out infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .progress-pct {
        font-size: 0.625rem;
        color: var(--mm-text-muted);
        font-family: var(--mm-font-mono);
        min-width: 32px;
        text-align: right;
      }

      /* Footer */
      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .eta {
        font-size: 0.625rem;
        color: var(--mm-text-muted);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .actions {
        display: flex;
        gap: var(--mm-space-xs);
      }

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: var(--mm-radius-sm);
        color: var(--mm-text-muted);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
      }

      .action-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-primary);
      }

      .action-btn.danger:hover {
        background: var(--mm-danger-subtle);
        color: var(--mm-danger);
      }
    `];constructor(){super(),this.title="",this.status="pending",this.steps=[],this.currentStep=0,this.progress=0,this.eta="",this.type="movie",this.posterUrl=""}_onCancel(){this.dispatchEvent(new CustomEvent("mm-cancel",{bubbles:!0,composed:!0}))}_onRetry(){this.dispatchEvent(new CustomEvent("mm-retry",{bubbles:!0,composed:!0}))}render(){let t=Math.min(100,Math.max(0,this.progress));return o`
      <div class="card">
        <div class="accent ${this.status}"></div>

        <div class="poster">
          ${this.posterUrl?o`<img src="${this.posterUrl}" alt="" loading="lazy" />`:o`<div class="poster-placeholder"><mm-icon name="${this.type==="tv"?"tv":"film"}" size="18"></mm-icon></div>`}
        </div>

        <div class="content">
          <div class="header">
            <span class="title">${this.title}</span>
            <span class="status-badge ${this.status}">${this.status}</span>
          </div>

          ${this.steps.length>0?o`
            <div class="steps-row">
              ${this.steps.map((e,r)=>o`
                <div class="step-item">
                  <div class="step-circle ${r<this.currentStep?"done":""} ${r===this.currentStep?"active":""}"></div>
                  ${r<this.steps.length-1?o`
                    <div class="step-connector ${r<this.currentStep?"done":""}"></div>
                  `:""}
                </div>
              `)}
            </div>
          `:""}

          ${this.status!=="completed"&&this.status!=="failed"?o`
            <div class="progress-area">
              <div class="progress-track">
                <div class="progress-fill" style="width: ${t}%"></div>
              </div>
              <span class="progress-pct">${Math.round(t)}%</span>
            </div>
          `:""}

          <div class="footer">
            <span class="eta">
              ${this.eta?o`<mm-icon name="clock" size="12"></mm-icon> ${this.eta}`:""}
            </span>
            <div class="actions">
              ${this.status==="failed"?o`
                <button class="action-btn" @click=${this._onRetry} title="Retry">
                  <mm-icon name="refresh-cw" size="14"></mm-icon>
                </button>
              `:""}
              ${this.status!=="completed"?o`
                <button class="action-btn danger" @click=${this._onCancel} title="Cancel">
                  <mm-icon name="x" size="14"></mm-icon>
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}};customElements.define("mm-request-card",pt);var ht=class extends m{static properties={title:{type:String},size:{type:String},seeders:{type:Number},leechers:{type:Number},quality:{type:String},source:{type:String},score:{type:Number}};static styles=[p,u,c`
      :host {
        display: block;
      }

      .row {
        display: flex;
        align-items: center;
        gap: var(--mm-space-md);
        padding: var(--mm-space-md) var(--mm-space-lg);
        background: var(--mm-bg-surface);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-md);
        cursor: pointer;
        transition:
          background var(--mm-transition-fast),
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast);
      }

      .row:hover {
        background: var(--mm-bg-elevated);
        border-color: var(--mm-border-hover);
        box-shadow: var(--mm-shadow-sm);
      }

      /* Title */
      .title-col {
        flex: 1;
        min-width: 0;
      }

      .title-text {
        font-size: var(--mm-text-sm);
        color: var(--mm-text-primary);
        font-weight: var(--mm-weight-medium);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Badges row */
      .badges {
        display: flex;
        align-items: center;
        gap: var(--mm-space-xs);
        margin-top: 4px;
      }

      .badge {
        padding: 1px 6px;
        border-radius: var(--mm-radius-sm);
        font-size: 0.5625rem;
        font-weight: var(--mm-weight-bold);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        line-height: 1.6;
      }

      /* Quality badges */
      .badge.q4k {
        background: rgba(251, 191, 36, 0.15);
        color: var(--mm-warning);
      }

      .badge.q1080 {
        background: rgba(108, 140, 255, 0.15);
        color: var(--mm-accent);
      }

      .badge.q720 {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-secondary);
      }

      .badge.qother {
        background: rgba(255, 255, 255, 0.04);
        color: var(--mm-text-muted);
      }

      /* Source badges */
      .badge.source {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-secondary);
      }

      /* Stats columns */
      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 44px;
        flex-shrink: 0;
      }

      .stat-value {
        font-size: var(--mm-text-sm);
        font-weight: var(--mm-weight-semibold);
        font-family: var(--mm-font-mono);
        line-height: 1;
      }

      .stat-label {
        font-size: 0.5625rem;
        color: var(--mm-text-muted);
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      /* Seeder color coding */
      .seeders-high { color: var(--mm-success); }
      .seeders-med { color: var(--mm-warning); }
      .seeders-low { color: var(--mm-danger); }

      .leechers { color: var(--mm-text-muted); }

      /* Size */
      .size {
        font-size: var(--mm-text-xs);
        color: var(--mm-text-secondary);
        font-family: var(--mm-font-mono);
        min-width: 64px;
        text-align: right;
        flex-shrink: 0;
      }

      /* Score indicator */
      .score-bar {
        width: 40px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .score-track {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: var(--mm-radius-full);
        overflow: hidden;
      }

      .score-fill {
        height: 100%;
        border-radius: var(--mm-radius-full);
        transition: width var(--mm-transition-slow);
      }

      .score-fill.high { background: var(--mm-success); }
      .score-fill.med { background: var(--mm-warning); }
      .score-fill.low { background: var(--mm-danger); }

      .score-num {
        font-size: 0.5625rem;
        font-family: var(--mm-font-mono);
        color: var(--mm-text-muted);
      }

      /* Download button */
      .dl-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: var(--mm-radius-sm);
        color: var(--mm-accent);
        flex-shrink: 0;
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
      }

      .dl-btn:hover {
        background: var(--mm-accent-subtle);
        color: var(--mm-accent-hover);
      }
    `];constructor(){super(),this.title="",this.size="",this.seeders=0,this.leechers=0,this.quality="",this.source="",this.score=0}_seedersClass(){return this.seeders>=20?"seeders-high":this.seeders>=5?"seeders-med":"seeders-low"}_qualityClass(){if(!this.quality)return"qother";let t=this.quality.toLowerCase();return t.includes("4k")||t.includes("2160")?"q4k":t.includes("1080")?"q1080":t.includes("720")?"q720":"qother"}_scoreClass(){return this.score>=70?"high":this.score>=40?"med":"low"}_onDownload(){this.dispatchEvent(new CustomEvent("mm-download",{detail:{title:this.title},bubbles:!0,composed:!0}))}render(){return o`
      <div class="row">
        <div class="title-col">
          <div class="title-text">${this.title}</div>
          <div class="badges">
            ${this.quality?o`<span class="badge ${this._qualityClass()}">${this.quality}</span>`:""}
            ${this.source?o`<span class="badge source">${this.source}</span>`:""}
          </div>
        </div>

        <div class="stat">
          <span class="stat-value ${this._seedersClass()}">${this.seeders}</span>
          <span class="stat-label">seed</span>
        </div>

        <div class="stat">
          <span class="stat-value leechers">${this.leechers}</span>
          <span class="stat-label">leech</span>
        </div>

        <span class="size">${this.size}</span>

        ${this.score>0?o`
          <div class="score-bar">
            <div class="score-track">
              <div class="score-fill ${this._scoreClass()}" style="width: ${Math.min(100,this.score)}%"></div>
            </div>
            <span class="score-num">${this.score}</span>
          </div>
        `:""}

        <button class="dl-btn" @click=${this._onDownload} title="Download">
          <mm-icon name="download" size="16"></mm-icon>
        </button>
      </div>
    `}};customElements.define("mm-torrent-row",ht);var ut=class extends m{static properties={value:{type:String},placeholder:{type:String},type:{type:String},loading:{type:Boolean},_focused:{state:!0}};static styles=[p,u,c`
      :host {
        display: block;
      }

      .wrapper {
        display: flex;
        align-items: center;
        gap: var(--mm-space-md);
      }

      .search-field {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: var(--mm-space-lg);
        color: var(--mm-text-muted);
        pointer-events: none;
        display: flex;
        transition: color var(--mm-transition-fast);
      }

      .search-field.focused .search-icon {
        color: var(--mm-accent);
      }

      input {
        width: 100%;
        height: 48px;
        padding: 0 var(--mm-space-lg);
        padding-left: 48px;
        padding-right: 44px;
        background: var(--mm-bg-elevated);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-full);
        color: var(--mm-text-primary);
        font-size: var(--mm-text-base);
        transition:
          border-color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast),
          background var(--mm-transition-fast);
      }

      input::placeholder {
        color: var(--mm-text-muted);
      }

      input:focus {
        border-color: var(--mm-accent);
        box-shadow: 0 0 0 3px var(--mm-accent-subtle), var(--mm-shadow-glow);
        background: var(--mm-bg-overlay);
      }

      input:hover:not(:focus) {
        border-color: var(--mm-border-hover);
      }

      .clear-btn {
        position: absolute;
        right: var(--mm-space-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        color: var(--mm-text-muted);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity var(--mm-transition-fast),
          visibility var(--mm-transition-fast),
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
      }

      .clear-btn.visible {
        opacity: 1;
        visibility: visible;
      }

      .clear-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: var(--mm-text-primary);
      }

      /* Type toggle pills */
      .type-toggle {
        display: flex;
        background: var(--mm-bg-elevated);
        border: 1px solid var(--mm-border);
        border-radius: var(--mm-radius-full);
        padding: 3px;
        flex-shrink: 0;
      }

      .type-btn {
        padding: 6px 14px;
        border-radius: var(--mm-radius-full);
        font-size: var(--mm-text-xs);
        font-weight: var(--mm-weight-medium);
        color: var(--mm-text-muted);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast);
      }

      .type-btn:hover {
        color: var(--mm-text-secondary);
      }

      .type-btn.active {
        background: var(--mm-accent);
        color: #fff;
        box-shadow: 0 0 12px var(--mm-accent-glow);
      }

      /* Loading spinner in place of search icon */
      .search-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid var(--mm-accent-subtle);
        border-top-color: var(--mm-accent);
        border-radius: 50%;
        animation: spin 600ms linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `];constructor(){super(),this.value="",this.placeholder="Search movies and TV shows...",this.type="movie",this.loading=!1,this._focused=!1,this._debounceTimer=null}_onInput(t){this.value=t.target.value,clearTimeout(this._debounceTimer),this._debounceTimer=setTimeout(()=>{this.dispatchEvent(new CustomEvent("mm-search",{detail:{value:this.value,type:this.type},bubbles:!0,composed:!0}))},350)}_clear(){this.value="";let t=this.shadowRoot.querySelector("input");t&&t.focus(),this.dispatchEvent(new CustomEvent("mm-search",{detail:{value:"",type:this.type},bubbles:!0,composed:!0}))}_setType(t){this.type=t,this.dispatchEvent(new CustomEvent("mm-search",{detail:{value:this.value,type:this.type},bubbles:!0,composed:!0}))}render(){return o`
      <div class="wrapper">
        <div class="search-field ${this._focused?"focused":""}">
          <span class="search-icon">
            ${this.loading?o`<div class="search-spinner"></div>`:o`<mm-icon name="search" size="18"></mm-icon>`}
          </span>
          <input
            type="text"
            .value=${this.value}
            placeholder="${this.placeholder}"
            @input=${this._onInput}
            @focus=${()=>this._focused=!0}
            @blur=${()=>this._focused=!1}
          />
          <button
            class="clear-btn ${this.value?"visible":""}"
            @click=${this._clear}
          >
            <mm-icon name="x" size="16"></mm-icon>
          </button>
        </div>

        <div class="type-toggle">
          <button
            class="type-btn ${this.type==="movie"?"active":""}"
            @click=${()=>this._setType("movie")}
          >Movie</button>
          <button
            class="type-btn ${this.type==="tv"?"active":""}"
            @click=${()=>this._setType("tv")}
          >TV</button>
        </div>
      </div>
    `}};customElements.define("mm-search-bar",ut);var vt=class extends m{static properties={items:{type:Array},active:{type:String}};static styles=[p,u,c`
      :host {
        display: block;
      }

      nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: var(--mm-z-sticky);
        display: flex;
        align-items: stretch;
        justify-content: space-around;
        height: 64px;
        padding-bottom: env(safe-area-inset-bottom, 0);
        background: rgba(17, 19, 24, 0.8);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-top: 1px solid var(--mm-border);
      }

      .nav-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: var(--mm-text-muted);
        text-decoration: none;
        position: relative;
        transition:
          color var(--mm-transition-fast);
        -webkit-tap-highlight-color: transparent;
      }

      .nav-item:hover {
        color: var(--mm-text-secondary);
      }

      .nav-item.active {
        color: var(--mm-accent);
      }

      /* Active indicator dot */
      .nav-item.active::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background: var(--mm-accent);
        border-radius: 0 0 2px 2px;
        box-shadow: 0 0 8px var(--mm-accent-glow);
      }

      .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--mm-radius-md);
        transition: background var(--mm-transition-fast);
      }

      .nav-item.active .nav-icon {
        background: var(--mm-accent-subtle);
      }

      .nav-label {
        font-size: 0.625rem;
        font-weight: var(--mm-weight-medium);
        letter-spacing: 0.2px;
      }
    `];constructor(){super(),this.items=[],this.active=""}_select(t){this.active=t,this.dispatchEvent(new CustomEvent("mm-navigate",{detail:{id:t},bubbles:!0,composed:!0}))}render(){return o`
      <nav>
        ${this.items.map(t=>o`
          <button
            class="nav-item ${this.active===t.id?"active":""}"
            @click=${()=>this._select(t.id)}
          >
            <span class="nav-icon">
              <mm-icon name="${t.icon}" size="20"></mm-icon>
            </span>
            <span class="nav-label">${t.label}</span>
          </button>
        `)}
      </nav>
    `}};customElements.define("mm-nav-bar",vt);var gt=class extends m{static properties={items:{type:Array},active:{type:String},collapsed:{type:Boolean,reflect:!0}};static styles=[p,u,c`
      :host {
        display: block;
        height: 100%;
      }

      nav {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 220px;
        background: var(--mm-bg-surface);
        border-right: 1px solid var(--mm-border);
        padding: var(--mm-space-md);
        gap: var(--mm-space-xs);
        overflow: hidden;
        transition: width var(--mm-transition-normal);
      }

      :host([collapsed]) nav {
        width: 56px;
        padding: var(--mm-space-md) var(--mm-space-sm);
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: var(--mm-space-md);
        padding: var(--mm-space-sm) var(--mm-space-md);
        border-radius: var(--mm-radius-md);
        color: var(--mm-text-secondary);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast),
          box-shadow var(--mm-transition-fast);
        white-space: nowrap;
        overflow: hidden;
      }

      .nav-item:hover {
        background: rgba(255, 255, 255, 0.04);
        color: var(--mm-text-primary);
      }

      .nav-item.active {
        background: var(--mm-accent-subtle);
        color: var(--mm-accent-text);
        box-shadow: inset 0 0 0 1px rgba(108, 140, 255, 0.1);
      }

      :host([collapsed]) .nav-item {
        justify-content: center;
        padding: var(--mm-space-sm);
      }

      .nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 22px;
        height: 22px;
      }

      .nav-label {
        font-size: var(--mm-text-sm);
        font-weight: var(--mm-weight-medium);
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 1;
        transition: opacity var(--mm-transition-fast);
      }

      :host([collapsed]) .nav-label {
        opacity: 0;
        width: 0;
        overflow: hidden;
      }

      /* Spacer */
      .spacer {
        flex: 1;
      }

      /* Collapse toggle */
      .collapse-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--mm-space-md);
        padding: var(--mm-space-sm) var(--mm-space-md);
        border-radius: var(--mm-radius-md);
        color: var(--mm-text-muted);
        transition:
          background var(--mm-transition-fast),
          color var(--mm-transition-fast);
        margin-top: auto;
        white-space: nowrap;
        overflow: hidden;
      }

      .collapse-btn:hover {
        background: rgba(255, 255, 255, 0.04);
        color: var(--mm-text-secondary);
      }

      :host([collapsed]) .collapse-btn {
        justify-content: center;
        padding: var(--mm-space-sm);
      }

      .collapse-icon {
        display: flex;
        flex-shrink: 0;
        transition: transform var(--mm-transition-normal);
      }

      :host([collapsed]) .collapse-icon {
        transform: rotate(180deg);
      }

      .collapse-label {
        font-size: var(--mm-text-xs);
        overflow: hidden;
        opacity: 1;
        transition: opacity var(--mm-transition-fast);
      }

      :host([collapsed]) .collapse-label {
        opacity: 0;
        width: 0;
      }
    `];constructor(){super(),this.items=[],this.active="",this.collapsed=!1}_select(t){this.active=t,this.dispatchEvent(new CustomEvent("mm-navigate",{detail:{id:t},bubbles:!0,composed:!0}))}_toggleCollapse(){this.collapsed=!this.collapsed}render(){return o`
      <nav>
        ${this.items.map(t=>o`
          <button
            class="nav-item ${this.active===t.id?"active":""}"
            @click=${()=>this._select(t.id)}
            title="${this.collapsed?t.label:""}"
          >
            <span class="nav-icon">
              <mm-icon name="${t.icon}" size="18"></mm-icon>
            </span>
            <span class="nav-label">${t.label}</span>
          </button>
        `)}

        <button class="collapse-btn" @click=${this._toggleCollapse} title="${this.collapsed?"Expand":"Collapse"}">
          <span class="collapse-icon">
            <mm-icon name="chevron-left" size="16"></mm-icon>
          </span>
          <span class="collapse-label">Collapse</span>
        </button>
      </nav>
    `}};customElements.define("mm-sidebar",gt);export{D as MmIcon,B as MmToast};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
