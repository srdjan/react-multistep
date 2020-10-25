let e$=Object.defineProperty,f$=Object.hasOwnProperty,h$={},j$,k$=a$=>{let b$=h$[a$];return b$||(b$=h$[a$]={exports:{}},j$[a$](b$.exports,b$)),b$.exports},l$=a$=>{if(a$&&a$.__esModule)return a$;let b$={};for(let c$ in a$)f$.call(a$,c$)&&(b$[c$]=a$[c$]);return b$.default=a$,b$},p$=a$=>l$(k$(a$)),q$=(a$,b$)=>{e$(a$,"__esModule",{value:!0});for(let c$ in b$)e$(a$,c$,{get:b$[c$],enumerable:!0})};j$={1(J){let B={data:""},t=a=>{try{let b=a?a.querySelector("#_goober"):self._goober;return b||(b=(a||document.head).appendChild(document.createElement("style")),b.innerHTML=" ",b.id="_goober"),b.firstChild}catch(b){}return a||B},C=a=>{let b=t(a),e=b.data;return b.data="",e},D=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,E=/\/\*[\s\S]*?\*\/|\s{2,}|\n/gm,n=(a,b)=>{let e,h="",j="",i="";for(let c in a){let d=a[c];"object"==typeof d?(e=b?b.replace(/([^,])+/g,f=>c.replace(/([^,])+/g,g=>/&/g.test(g)?g.replace(/&/g,f):f?f+" "+g:g)):c,j+="@"==c[0]?"f"==c[1]?n(d,c):c+"{"+n(d,"k"==c[1]?"":b)+"}":n(d,e)):"@"==c[0]&&"i"==c[1]?h=c+" "+d+";":i+=n.p?n.p(c.replace(/[A-Z]/g,"-$&").toLowerCase(),d):c.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+d+";"}return i[0]?(e=b?b+"{"+i+"}":i,h+e+j):h+j},o={},u=a=>{let b="";for(let e in a)b+=e+("object"==typeof a[e]?u(a[e]):a[e]);return b},F=(a,b,e,h,j)=>{let i="object"==typeof a?u(a):a,c=o[i]||(o[i]="go"+i.split("").reduce((d,f)=>101*d+f.charCodeAt(0)>>>0,11));if(!o[c]){let d="object"==typeof a?a:(f=>{let g,l=[{}];for(;g=D.exec(f.replace(E,""));)g[4]&&l.shift(),g[3]?l.unshift(l[0][g[3]]=l[0][g[3]]||{}):g[4]||(l[0][g[1]]=g[2]);return l[0]})(a);o[c]=n(j?{["@keyframes "+c]:d}:d,e?"":"."+c)}return((d,f,g)=>{f.data.indexOf(d)<0&&(f.data=g?d+f.data:f.data+d)})(o[c],b,h),c},G=(a,b,e)=>a.reduce((h,j,i)=>{let c=b[i];if(c&&c.call){let d=c(e),f=d&&d.props&&d.props.className||/^go/.test(d)&&d;c=f?"."+f:d&&"object"==typeof d?d.props?"":n(d,""):d}return h+j+(null==c?"":c)},"");function p(a){let b=this||{},e=a.call?a(b.p):a;return F(e.map?G(e,[].slice.call(arguments,1),b.p):e,t(b.target),b.g,b.o,b.k)}let v,r,H=p.bind({g:1}),I=p.bind({k:1});function w(a,b,e){n.p=b,v=a,r=e}function x(a,b){let e=this||{};return function(){let h=arguments;function j(i,c){let d=Object.assign({},i),f=d.className||j.className;return e.p=Object.assign({theme:r&&r()},d),e.o=/\s*go[0-9]+/g.test(f),d.className=p.apply(e,h)+(f?" "+f:""),b&&(d.ref=c),v(d.as||a,d)}return b?b(j):j}}q$(J,{default:()=>Y});const W=l$(require("react"));w(W.default.createElement);const K=x("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,L=a=>p`
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
`,y=(a,b)=>{let e=[];for(let h=0;h<b;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},z=(a,b)=>a>0&&a<b-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function Y(a){let b=!0;a.showNavigation&&(b=a.showNavigation);let e={};a.prevStyle&&(e=a.prevStyle);let h={};a.nextStyle&&(h=a.nextStyle);const[j,i]=W.useState(y(0,a.steps.length)),[c,d]=W.useState(0),[f,g]=W.useState(z(0,a.steps.length)),l=k=>{i(y(k,a.steps.length)),d(k<a.steps.length?k:c),g(z(k,a.steps.length))},A=()=>l(c+1),M=()=>l(c>0?c-1:c),N=k=>k.which===13?A(a.steps.length):{},O=k=>{k.currentTarget.value===a.steps.length-1&&c===a.steps.length-1?l(a.steps.length):l(k.currentTarget.value)},P=()=>a.steps.map((k,q)=>W.default.createElement("li",{className:L({state:j[q]}),onClick:O,key:q,value:q},W.default.createElement("span",null,q+1))),Q=k=>k&&W.default.createElement("div",null,W.default.createElement("button",{style:f.showPreviousBtn?a.prevStyle:{display:"none"},onClick:M},"Prev"),W.default.createElement("button",{style:f.showNextBtn?a.nextStyle:{display:"none"},onClick:A},"Next"));return W.default.createElement("div",{onKeyDown:N},W.default.createElement(K,null,P()),W.default.createElement("div",null,a.steps[c].component),W.default.createElement("div",null,Q(b)))}}};module.exports=k$(1);
