var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function o(){return Object.create(null)}function s(e){e.forEach(n)}function c(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(e,t,n){e.$$.on_destroy.push(function(e,t){const n=e.subscribe(t);return n.unsubscribe?()=>n.unsubscribe():n}(t,n))}const a="undefined"!=typeof window;let l=a?()=>window.performance.now():()=>Date.now(),u=a?e=>requestAnimationFrame(e):e;const d=new Set;function f(e){d.forEach(t=>{t.c(e)||(d.delete(t),t.f())}),0!==d.size&&u(f)}function g(e,t){e.appendChild(t)}function m(e,t,n){e.insertBefore(t,n||null)}function p(e){e.parentNode.removeChild(e)}function h(e){return document.createElement(e)}function v(e){return document.createTextNode(e)}function b(){return v(" ")}function $(){return v("")}function y(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function k(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function x(e,t){t=""+t,e.data!==t&&(e.data=t)}let T,_,A=0,E={};function w(e,t,n,o,s,c,i,r=0){const a=16.666/o;let l="{\n";for(let e=0;e<=1;e+=a){const o=t+(n-t)*c(e);l+=100*e+`%{${i(o,1-o)}}\n`}const u=l+`100% {${i(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${r}`;if(!E[d]){if(!T){const e=h("style");document.head.appendChild(e),T=e.sheet}E[d]=!0,T.insertRule(`@keyframes ${d} ${u}`,T.cssRules.length)}const f=e.style.animation||"";return e.style.animation=`${f?`${f}, `:""}${d} ${o}ms linear ${s}ms 1 both`,A+=1,d}function C(e,t){e.style.animation=(e.style.animation||"").split(", ").filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")).join(", "),t&&!--A&&u(()=>{if(A)return;let e=T.cssRules.length;for(;e--;)T.deleteRule(e);E={}})}function I(e){_=e}function D(e){(function(){if(!_)throw new Error("Function called outside component initialization");return _})().$$.on_mount.push(e)}const S=[],B=[],M=[],L=[],N=Promise.resolve();let H,O=!1;function R(e){M.push(e)}function j(){const e=new Set;do{for(;S.length;){const e=S.shift();I(e),z(e.$$)}for(;B.length;)B.pop()();for(let t=0;t<M.length;t+=1){const n=M[t];e.has(n)||(n(),e.add(n))}M.length=0}while(S.length);for(;L.length;)L.pop()();O=!1}function z(e){null!==e.fragment&&(e.update(),s(e.before_update),e.fragment&&e.fragment.p(e.ctx,e.dirty),e.dirty=[-1],e.after_update.forEach(R))}function P(e,t,n){e.dispatchEvent(function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(`${t?"intro":"outro"}${n}`))}const q=new Set;let F;function W(){F={r:0,c:[],p:F}}function Y(){F.r||s(F.c),F=F.p}function K(e,t){e&&e.i&&(q.delete(e),e.i(t))}function G(e,t,n,o){if(e&&e.o){if(q.has(e))return;q.add(e),F.c.push(()=>{q.delete(e),o&&(n&&e.d(1),o())}),e.o(t)}}const J={duration:0};function Q(n,o,i,r){let a=o(n,i),g=r?0:1,m=null,p=null,h=null;function v(){h&&C(n,h)}function b(e,t){const n=e.b-g;return t*=Math.abs(n),{a:g,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function $(o){const{delay:c=0,duration:i=300,easing:r=t,tick:$=e,css:y}=a||J,k={start:l()+c,b:o};o||(k.group=F,F.r+=1),m?p=k:(y&&(v(),h=w(n,g,o,i,c,r,y)),o&&$(0,1),m=b(k,i),R(()=>P(n,o,"start")),function(e){let t;0===d.size&&u(f),new Promise(n=>{d.add(t={c:e,f:n})})}(e=>{if(p&&e>p.start&&(m=b(p,i),p=null,P(n,m.b,"start"),y&&(v(),h=w(n,g,m.b,m.duration,0,r,a.css))),m)if(e>=m.end)$(g=m.b,1-g),P(n,m.b,"end"),p||(m.b?v():--m.group.r||s(m.group.c)),m=null;else if(e>=m.start){const t=e-m.start;g=m.a+m.d*r(t/m.duration),$(g,1-g)}return!(!m&&!p)}))}return{run(e){c(a)?(H||(H=Promise.resolve(),H.then(()=>{H=null})),H).then(()=>{a=a(),$(e)}):$(e)},end(){v(),m=p=null}}}function U(e,t){-1===e.$$.dirty[0]&&(S.push(e),O||(O=!0,N.then(j)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function V(t,i,r,a,l,u,d=[-1]){const f=_;I(t);const g=i.props||{},m=t.$$={fragment:null,ctx:null,props:u,update:e,not_equal:l,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:o(),dirty:d};let p=!1;m.ctx=r?r(t,g,(e,n,o=n)=>(m.ctx&&l(m.ctx[e],m.ctx[e]=o)&&(m.bound[e]&&m.bound[e](o),p&&U(t,e)),n)):[],m.update(),p=!0,s(m.before_update),m.fragment=!!a&&a(m.ctx),i.target&&(i.hydrate?m.fragment&&m.fragment.l(function(e){return Array.from(e.childNodes)}(i.target)):m.fragment&&m.fragment.c(),i.intro&&K(t.$$.fragment),function(e,t,o){const{fragment:i,on_mount:r,on_destroy:a,after_update:l}=e.$$;i&&i.m(t,o),R(()=>{const t=r.map(n).filter(c);a?a.push(...t):s(t),e.$$.on_mount=[]}),l.forEach(R)}(t,i.target,i.anchor),j()),I(f)}class X{$destroy(){!function(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}const Z=[];function ee(t,n=e){let o;const s=[];function c(e){if(i(t,e)&&(t=e,o)){const e=!Z.length;for(let e=0;e<s.length;e+=1){const n=s[e];n[1](),Z.push(n,t)}if(e){for(let e=0;e<Z.length;e+=2)Z[e][0](Z[e+1]);Z.length=0}}}return{set:c,update:function(e){c(e(t))},subscribe:function(i,r=e){const a=[i,r];return s.push(a),1===s.length&&(o=n(c)||e),i(t),()=>{const e=s.indexOf(a);-1!==e&&s.splice(e,1),0===s.length&&(o(),o=null)}}}}const te=ee(!1),ne=ee({localStorageId:"CookieConsentByMagenta-v1-0-0",messages:{title:"Cookie consent",introduction:"We would like to store information on your device for the following purposes:",purposes:["No purpose"],additionalInfo:'Read more about our use of cookies on our <a href="#">dedicated cookie page.</a>',acceptButtonTxt:"I accept",declineButtonTxt:"No thanks",acceptedTxt:"accepted",declinedTxt:"declined",revisionTitleDeclined:"You did not consent to cookies",revisionAskToAccept:"Will you consider accepting cookies?",revisionTitleAccepted:"You are OK with cookies",revisionAskToDecline:"Have you changed your mind?",revisionDeclineAction:"Retract cookie consent",revisionCloseDiag:"Close this dialog"}});function oe(e){const t=e-1;return t*t*t+1}function se(e,{delay:t=0,duration:n=400,easing:o=oe,x:s=0,y:c=0,opacity:i=0}){const r=getComputedStyle(e),a=+r.opacity,l="none"===r.transform?"":r.transform,u=a*(1-i);return{delay:t,duration:n,easing:o,css:(e,t)=>`\n\t\t\ttransform: ${l} translate(${(1-e)*s}px, ${(1-e)*c}px);\n\t\t\topacity: ${a-u*t}`}}let ce,ie=document.createEvent("Event"),re=document.createEvent("Event");ie.initEvent("consentgiven",!0,!0),re.initEvent("consentdeclined",!0,!0);ne.subscribe(e=>{ce=e});function ae(){ue(!0),de(!0)}function le(){ue(!1),de(!1)}function ue(e){te.set(e),localStorage.setItem(ce.localStorageId,e)}function de(e){!0===e?document.dispatchEvent(ie):!1===e&&document.dispatchEvent(re)}function fe(e,t,n){const o=e.slice();return o[4]=t[n],o}function ge(e){let t,n,o,c,i,r,a,l,u,d,f,$,T,_,A,E,w,C,I,D,S=e[0].messages.title+"",B=e[0].messages.introduction+"",M=e[0].messages.additionalInfo+"",L=e[0].messages.acceptButtonTxt+"",N=e[0].messages.declineButtonTxt+"",H=e[0].messages.purposes,O=[];for(let t=0;t<H.length;t+=1)O[t]=me(fe(e,H,t));return{c(){t=h("div"),n=h("h2"),o=v(S),c=b(),i=h("p"),r=v(B),a=b(),l=h("ul");for(let e=0;e<O.length;e+=1)O[e].c();u=b(),d=h("p"),f=b(),$=h("p"),T=h("button"),_=v(L),A=b(),E=h("button"),w=v(N),k(n,"id","give-consent-title"),k(n,"class","cc-title"),k(i,"class","cc-intro"),k(l,"class","cc-list"),k(d,"class","cc-additional"),k(T,"aria-controls","cookie-consent-diag"),k(T,"class","cc-accept"),k(E,"aria-controls","cookie-consent-diag"),k(E,"class","cc-decline"),k($,"class","cc-actions"),k(t,"class","cc-diag"),k(t,"role","alertdialog"),k(t,"aria-live","assertive"),k(t,"aria-labelledby","give-consent-title"),D=[y(T,"click",ae),y(E,"click",le)]},m(e,s){m(e,t,s),g(t,n),g(n,o),g(t,c),g(t,i),g(i,r),g(t,a),g(t,l);for(let e=0;e<O.length;e+=1)O[e].m(l,null);g(t,u),g(t,d),d.innerHTML=M,g(t,f),g(t,$),g($,T),g(T,_),g($,A),g($,E),g(E,w),I=!0},p(e,t){if((!I||1&t[0])&&S!==(S=e[0].messages.title+"")&&x(o,S),(!I||1&t[0])&&B!==(B=e[0].messages.introduction+"")&&x(r,B),1&t[0]){let n;for(H=e[0].messages.purposes,n=0;n<H.length;n+=1){const o=fe(e,H,n);O[n]?O[n].p(o,t):(O[n]=me(o),O[n].c(),O[n].m(l,null))}for(;n<O.length;n+=1)O[n].d(1);O.length=H.length}(!I||1&t[0])&&M!==(M=e[0].messages.additionalInfo+"")&&(d.innerHTML=M),(!I||1&t[0])&&L!==(L=e[0].messages.acceptButtonTxt+"")&&x(_,L),(!I||1&t[0])&&N!==(N=e[0].messages.declineButtonTxt+"")&&x(w,N)},i(e){I||(R(()=>{C||(C=Q(t,se,{y:-300,duration:300},!0)),C.run(1)}),I=!0)},o(e){C||(C=Q(t,se,{y:-300,duration:300},!1)),C.run(0),I=!1},d(e){e&&p(t),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(O,e),e&&C&&C.end(),s(D)}}}function me(e){let t,n,o=e[4]+"";return{c(){t=h("li"),n=v(o),k(t,"class","cc-list-item")},m(e,o){m(e,t,o),g(t,n)},p(e,t){1&t[0]&&o!==(o=e[4]+"")&&x(n,o)},d(e){e&&p(t)}}}function pe(e){let t,n,o=null===e[1]&&ge(e);return{c(){o&&o.c(),t=$()},m(e,s){o&&o.m(e,s),m(e,t,s),n=!0},p(e,n){null===e[1]?o?(o.p(e,n),K(o,1)):(o=ge(e),o.c(),K(o,1),o.m(t.parentNode,t)):o&&(W(),G(o,1,1,()=>{o=null}),Y())},i(e){n||(K(o),n=!0)},o(e){G(o),n=!1},d(e){o&&o.d(e),e&&p(t)}}}function he(e,t,n){let o,s;r(e,ne,e=>n(0,o=e)),r(e,te,e=>n(1,s=e));let{cc_config:c}=t;return D(async()=>{ne.update(e=>{let t=e;if(c.localStorageId&&(t.localStorageId=c.localStorageId),c.messages)for(let e in c.messages)t.messages[e]=c.messages[e];return t}),function(){let e=localStorage.getItem(o.localStorageId);if(e){let t="true"===e;te.set(t),de(t)}else te.set(null)}()}),e.$set=e=>{"cc_config"in e&&n(2,c=e.cc_config)},[o,s,c]}function ve(e){let t,n,o,s,c,i,r,a=(e[1]?e[2].messages.acceptedTxt:e[2].messages.declinedTxt)+"",l=e[2].messages.editConsent+"";return{c(){t=h("p"),n=v("Cookies "),o=v(a),s=b(),c=h("button"),i=v(l),k(c,"class","cc-toggle-btn"),k(t,"class","cc-toggle"),k(t,"role","status"),k(t,"aria-live","assertive"),r=y(c,"click",e[5])},m(e,r){m(e,t,r),g(t,n),g(t,o),g(t,s),g(t,c),g(c,i)},p(e,t){6&t[0]&&a!==(a=(e[1]?e[2].messages.acceptedTxt:e[2].messages.declinedTxt)+"")&&x(o,a),4&t[0]&&l!==(l=e[2].messages.editConsent+"")&&x(i,l)},d(e){e&&p(t),r()}}}function be(e){let t,n,o,s,c,i,r,a;function l(e,t){return e[1]?ye:$e}let u=l(e),d=u(e);return{c(){t=h("div"),n=h("button"),c=b(),d.c(),k(n,"class","cc-close"),k(n,"title",o=e[2].messages.revisionCloseDiag),k(n,"aria-label",s=e[2].messages.revisionCloseDiag),k(t,"class","cc-revise-diag"),k(t,"role","alertdialog"),k(t,"aria-live","assertive"),k(t,"aria-labelledby","revise-consent-title"),a=y(n,"click",e[5])},m(e,o){m(e,t,o),g(t,n),g(t,c),d.m(t,null),r=!0},p(e,c){(!r||4&c[0]&&o!==(o=e[2].messages.revisionCloseDiag))&&k(n,"title",o),(!r||4&c[0]&&s!==(s=e[2].messages.revisionCloseDiag))&&k(n,"aria-label",s),u===(u=l(e))&&d?d.p(e,c):(d.d(1),d=u(e),d&&(d.c(),d.m(t,null)))},i(e){r||(R(()=>{i||(i=Q(t,se,{y:300,duration:300},!0)),i.run(1)}),r=!0)},o(e){i||(i=Q(t,se,{y:300,duration:300},!1)),i.run(0),r=!1},d(e){e&&p(t),d.d(),e&&i&&i.end(),a()}}}function $e(e){let t,n,o,s,c,i,r,a,l,u,d,f,$=e[2].messages.revisionTitleDeclined+"",T=e[2].messages.additionalInfo+"",_=e[2].messages.revisionAskToAccept+"",A=e[2].messages.acceptButtonTxt+"";return{c(){t=h("h2"),n=v($),o=b(),s=h("p"),c=b(),i=h("p"),r=v(_),a=b(),l=h("p"),u=h("button"),d=v(A),k(t,"id","revise-consent-title"),k(t,"class","cc-title"),k(s,"class","cc-additional"),k(i,"class","cc-ask-again"),k(u,"aria-controls","cookie-consent-diag"),k(u,"class","cc-accept"),k(l,"class","cc-actions"),f=y(u,"click",e[3])},m(e,f){m(e,t,f),g(t,n),m(e,o,f),m(e,s,f),s.innerHTML=T,m(e,c,f),m(e,i,f),g(i,r),m(e,a,f),m(e,l,f),g(l,u),g(u,d)},p(e,t){4&t[0]&&$!==($=e[2].messages.revisionTitleDeclined+"")&&x(n,$),4&t[0]&&T!==(T=e[2].messages.additionalInfo+"")&&(s.innerHTML=T),4&t[0]&&_!==(_=e[2].messages.revisionAskToAccept+"")&&x(r,_),4&t[0]&&A!==(A=e[2].messages.acceptButtonTxt+"")&&x(d,A)},d(e){e&&p(t),e&&p(o),e&&p(s),e&&p(c),e&&p(i),e&&p(a),e&&p(l),f()}}}function ye(e){let t,n,o,s,c,i,r,a,l,u,d,f,$=e[2].messages.revisionTitleAccepted+"",T=e[2].messages.additionalInfo+"",_=e[2].messages.revisionAskToDecline+"",A=e[2].messages.revisionDeclineAction+"";return{c(){t=h("h2"),n=v($),o=b(),s=h("p"),c=b(),i=h("p"),r=v(_),a=b(),l=h("p"),u=h("button"),d=v(A),k(t,"id","revise-consent-title"),k(t,"class","cc-title"),k(s,"class","cc-additional"),k(i,"class","cc-ask-again"),k(u,"aria-controls","cookie-consent-diag"),k(u,"class","cc-decline"),k(l,"class","cc-actions"),f=y(u,"click",e[4])},m(e,f){m(e,t,f),g(t,n),m(e,o,f),m(e,s,f),s.innerHTML=T,m(e,c,f),m(e,i,f),g(i,r),m(e,a,f),m(e,l,f),g(l,u),g(u,d)},p(e,t){4&t[0]&&$!==($=e[2].messages.revisionTitleAccepted+"")&&x(n,$),4&t[0]&&T!==(T=e[2].messages.additionalInfo+"")&&(s.innerHTML=T),4&t[0]&&_!==(_=e[2].messages.revisionAskToDecline+"")&&x(r,_),4&t[0]&&A!==(A=e[2].messages.revisionDeclineAction+"")&&x(d,A)},d(e){e&&p(t),e&&p(o),e&&p(s),e&&p(c),e&&p(i),e&&p(a),e&&p(l),f()}}}function ke(e){let t,n,o,s=null!==e[1]&&!e[0]&&ve(e),c=null!==e[1]&&e[0]&&be(e);return{c(){s&&s.c(),t=b(),c&&c.c(),n=$()},m(e,i){s&&s.m(e,i),m(e,t,i),c&&c.m(e,i),m(e,n,i),o=!0},p(e,o){null===e[1]||e[0]?s&&(s.d(1),s=null):s?s.p(e,o):(s=ve(e),s.c(),s.m(t.parentNode,t)),null!==e[1]&&e[0]?c?(c.p(e,o),K(c,1)):(c=be(e),c.c(),K(c,1),c.m(n.parentNode,n)):c&&(W(),G(c,1,1,()=>{c=null}),Y())},i(e){o||(K(c),o=!0)},o(e){G(c),o=!1},d(e){s&&s.d(e),e&&p(t),c&&c.d(e),e&&p(n)}}}function xe(e,t,n){let o,s;r(e,te,e=>n(1,o=e)),r(e,ne,e=>n(2,s=e));let c=!1;function i(){n(0,c=!c)}return[c,o,s,function(){i(),ae()},function(){i(),le()},i]}return{cc_give_consent:new class extends X{constructor(e){super(),V(this,e,he,pe,i,{cc_config:2})}}({target:document.body,anchor:document.body.children[0],props:{cc_config:cookie_consent_config}}),cc_revise_consent:new class extends X{constructor(e){super(),V(this,e,xe,ke,i,{})}}({target:document.body})}}();
//# sourceMappingURL=cookie-consent.js.map
