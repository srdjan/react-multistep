let e$=Object.defineProperty,f$=Object.hasOwnProperty,h$={},j$,k$=a$=>{let b$=h$[a$];return b$||(b$=h$[a$]={exports:{}},j$[a$](b$.exports,b$)),b$.exports},l$=a$=>{if(a$&&a$.__esModule)return a$;let b$={};for(let c$ in a$)f$.call(a$,c$)&&(b$[c$]=a$[c$]);return b$.default=a$,b$},p$=a$=>l$(k$(a$)),q$=(a$,b$)=>{e$(a$,"__esModule",{value:!0});for(let c$ in b$)e$(a$,c$,{get:b$[c$],enumerable:!0})};j$={1(K){let C={data:""},u=a=>{try{let b=a?a.querySelector("#_goober"):self._goober;return b||(b=(a||document.head).appendChild(document.createElement("style")),b.innerHTML=" ",b.id="_goober"),b.firstChild}catch(b){}return a||C},D=a=>{let b=u(a),d=b.data;return b.data="",d},E=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,F=/\/\*[\s\S]*?\*\/|\s{2,}|\n/gm,n=(a,b)=>{let d,g="",k="",i="";for(let e in a){let c=a[e];"object"==typeof c?(d=b?b.replace(/([^,])+/g,f=>e.replace(/([^,])+/g,h=>/&/g.test(h)?h.replace(/&/g,f):f?f+" "+h:h)):e,k+="@"==e[0]?"f"==e[1]?n(c,e):e+"{"+n(c,"k"==e[1]?"":b)+"}":n(c,d)):"@"==e[0]&&"i"==e[1]?g=e+" "+c+";":i+=n.p?n.p(e.replace(/[A-Z]/g,"-$&").toLowerCase(),c):e.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+c+";"}return i[0]?(d=b?b+"{"+i+"}":i,g+d+k):g+k},p={},v=a=>{let b="";for(let d in a)b+=d+("object"==typeof a[d]?v(a[d]):a[d]);return b},G=(a,b,d,g,k)=>{let i="object"==typeof a?v(a):a,e=p[i]||(p[i]="go"+i.split("").reduce((c,f)=>101*c+f.charCodeAt(0)>>>0,11));if(!p[e]){let c="object"==typeof a?a:(f=>{let h,m=[{}];for(;h=E.exec(f.replace(F,""));)h[4]&&m.shift(),h[3]?m.unshift(m[0][h[3]]=m[0][h[3]]||{}):h[4]||(m[0][h[1]]=h[2]);return m[0]})(a);p[e]=n(k?{["@keyframes "+e]:c}:c,d?"":"."+e)}return((c,f,h)=>{f.data.indexOf(c)<0&&(f.data=h?c+f.data:f.data+c)})(p[e],b,g),e},H=(a,b,d)=>a.reduce((g,k,i)=>{let e=b[i];if(e&&e.call){let c=e(d),f=c&&c.props&&c.props.className||/^go/.test(c)&&c;e=f?"."+f:c&&"object"==typeof c?c.props?"":n(c,""):c}return g+k+(null==e?"":e)},"");function q(a){let b=this||{},d=a.call?a(b.p):a;return G(d.map?H(d,[].slice.call(arguments,1),b.p):d,u(b.target),b.g,b.o,b.k)}let w,s,I=q.bind({g:1}),J=q.bind({k:1});function x(a,b,d){n.p=b,w=a,s=d}function y(a,b){let d=this||{};return function(){let g=arguments;function k(i,e){let c=Object.assign({},i),f=c.className||k.className;return d.p=Object.assign({theme:s&&s()},c),d.o=/\s*go[0-9]+/g.test(f),c.className=q.apply(d,g)+(f?" "+f:""),b&&(c.ref=e),w(c.as||a,c)}return b?b(k):k}}q$(K,{default:()=>$});const Z=l$(require("react"));x(Z.default.createElement);const L=y("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,M=a=>q`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${a.state==="todo"?"silver":"black"};
  border-bottom: 4px solid ${a.state==="todo"?"silver":"#33C3F0"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${a.state==="todo"?'content: "Ο";':a.state==="doing"?'content: "•";':'content: "✓";'}
    color: ${a.state==="todo"?"silver":"white"};
    background-color: ${a.state==="todo"?"white":"#33C3F0"};  
    width: 1.2em;
    line-height: ${a.state==="todo"?"1.2em":"1.4em"};
    border-radius: ${a.state==="todo"?"0":"1.2em"};
  }
  &:hover,
  &::before {
    color: #0FA0CE;
  }
  &:after {
    content: "\\00a0\\00a0";
  }   
  span {
    padding: 0 1.5rem;
  }
`,z=(a,b)=>{let d=[];for(let g=0;g<b;g++)g<a?d.push("done"):g===a?d.push("doing"):d.push("todo");return d},A=(a,b)=>a>0&&a<b-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function $(a){let b=!0;const{activeComponentClassName:d,inactiveComponentClassName:g}=a;a.showNavigation&&(b=a.showNavigation);let k={};a.prevStyle&&(k=a.prevStyle);let i={};a.nextStyle&&(i=a.nextStyle);const[e,c]=Z.useState(z(0,a.steps.length)),[f,h]=Z.useState(0),[m,N]=Z.useState(A(0,a.steps.length)),r=j=>{c(z(j,a.steps.length)),h(j<a.steps.length?j:f),N(A(j,a.steps.length))},B=()=>r(f+1),O=()=>r(f>0?f-1:f),P=j=>j.which===13?B(a.steps.length):{},Q=j=>{j.currentTarget.value===a.steps.length-1&&f===a.steps.length-1?r(a.steps.length):r(j.currentTarget.value)},R=()=>a.steps.map((j,o)=>Z.default.createElement("li",{className:M({state:e[o]}),onClick:Q,key:o,value:o},Z.default.createElement("span",null,o+1))),S=j=>j&&Z.default.createElement("div",null,Z.default.createElement("button",{style:m.showPreviousBtn?a.prevStyle:{display:"none"},onClick:O},"Prev"),Z.default.createElement("button",{style:m.showNextBtn?a.nextStyle:{display:"none"},onClick:B},"Next"));return Z.default.createElement("div",{onKeyDown:P},Z.default.createElement(L,null,R()),g?a.steps.map((j,o)=>{const T=o===f?d:g;return Z.default.createElement("div",{className:T},j.component)}):Z.default.createElement("div",null,a.steps[f].component),Z.default.createElement("div",null,S(b)))}}};module.exports=k$(1);
