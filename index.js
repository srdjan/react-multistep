var f=Object.defineProperty,F=Object.prototype.hasOwnProperty,p=t=>f(t,"__esModule",{value:!0}),T=(t,s)=>{p(t);for(var n in s)f(t,n,{get:s[n],enumerable:!0})},E=(t,s)=>{if(p(t),typeof s=="object"||typeof s=="function")for(let n in s)!F.call(t,n)&&n!=="default"&&f(t,n,{get:()=>s[n],enumerable:!0});return t},_=t=>t&&t.__esModule?t:E(f({},"default",{value:t,enumerable:!0}),t);let D={data:""},K=t=>{try{let s=t?t.querySelector("#_goober"):self._goober;return s||(s=(t||document.head).appendChild(document.createElement("style")),s.innerHTML=" ",s.id="_goober"),s.firstChild}catch(s){}return t||D},M=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,Z=/\/\*[\s\S]*?\*\/|\s{2,}|\n/gm,d=(t,s,n)=>{let a,r="",i="",o="";for(let e in t){let l=t[e];typeof l=="object"?(a=s.replace(/([^,])+/g,"$& "+e)||e,/&/g.test(e)&&(a=e.replace(/&/g,s)),i+=e[0]=="@"?e[1]=="f"?d(l,e):e+"{"+d(l,e[1]=="k"?"":s)+"}":d(l,a,n)):e[0]=="@"&&e[1]=="i"?r=e+" "+l+";":o+=d.p?d.p(e.replace(/[A-Z]/g,"-$&").toLowerCase(),l):e.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+l+";"}return o[0]?(a=s+"{"+o+"}",n?i+n+"{"+(n[0]=="@"?a:s+o)+"}":r+a+i):r+i},m={},S=t=>{let s="";for(let n in t)s+=n+(typeof t[n]=="object"?S(t[n]):t[n]);return s},q=(t,s,n,a)=>{let r=t.toLowerCase?t:S(t),i=m[r]||(m[r]="go"+r.split("").reduce((o,e)=>101*o+e.charCodeAt(0)>>>0,11));return((o,e,l)=>{e.data.indexOf(o)<0&&(e.data=l?o+e.data:e.data+o)})(m[i]||(m[i]=d(t[0]?(o=>{let e,l=[{}];for(;e=M.exec(o.replace(Z,""));)e[4]&&l.shift(),e[3]?l.unshift(l[0][e[3]]=l[0][e[3]]||{}):e[4]||(l[0][e[1]]=e[2]);return l[0]})(t):t,n?"":"."+i)),s,a),i},z=(t,s,n)=>t.reduce((a,r,i)=>{let o=s[i];if(o&&o.call){let e=o(n),l=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=l?"."+l:e&&e.props?"":e}return a+r+(o??"")},"");function v(t){let s=this||{},n=t.call?t(s.p):t;return q(n.map?z(n,[].slice.call(arguments,1),s.p):n,K(s.target),s.g,s.o)}let w,y,Q=v.bind({g:1});function C(t,s,n){d.p=s,w=t,y=n}function N(t,s){let n=this||{};return function(){let a=arguments;function r(i,o){let e=Object.assign({},i),l=e.className||r.className;return n.p=Object.assign({theme:y&&y()},e),n.o=/\s*go[0-9]+/g.test(l),e.className=v.apply(n,a)+(l?" "+l:""),s&&(e.ref=o),w(e.as||t,e)}return s?s(r):r}}T(exports,{default:()=>$});const c=_(require("react"));C(c.default.createElement);const H=N("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,G=t=>v`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${t.state==="todo"?"silver":"black"};
  border-bottom: 4px solid ${t.state==="todo"?"silver":"#33C3F0"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${t.state==="todo"?'content: "Ο";':t.state==="doing"?'content: "•";':'content: "✓";'}
    color: ${t.state==="todo"?"silver":"white"};
    background-color: ${t.state==="todo"?"white":"#33C3F0"};  
    width: 1.2em;
    line-height: ${t.state==="todo"?"1.2em":"1.4em"};
    border-radius: ${t.state==="todo"?"0":"1.2em"};
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
`,x=(t,s)=>{let n=[];for(let a=0;a<s;a++)a<t?n.push("done"):a===t?n.push("doing"):n.push("todo");return n},B=(t,s)=>t>0&&t<s-1?{showPreviousBtn:!0,showNextBtn:!0}:t===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function $(t){let s=!0;t.showNavigation&&(s=t.showNavigation);let n={};t.prevStyle&&(n=t.prevStyle);let a={};t.nextStyle&&(a=t.nextStyle);const[r,i]=c.useState(x(0,t.steps.length)),[o,e]=c.useState(0),[l,k]=c.useState(B(0,t.steps.length)),g=u=>{i(x(u,t.steps.length)),e(u<t.steps.length?u:o),k(B(u,t.steps.length))},b=()=>g(o+1),O=()=>g(o>0?o-1:o),L=u=>u.which===13?b(t.steps.length):{},P=u=>{u.currentTarget.value===t.steps.length-1&&o===t.steps.length-1?g(t.steps.length):g(u.currentTarget.value)},j=()=>t.steps.map((u,h)=>c.default.createElement("li",{className:G({state:r[h]}),onClick:P,key:h,value:h},c.default.createElement("span",null,h+1))),A=u=>u&&c.default.createElement("div",null,c.default.createElement("button",{style:l.showPreviousBtn?t.prevStyle:{display:"none"},onClick:O},"Prev"),c.default.createElement("button",{style:l.showNextBtn?t.nextStyle:{display:"none"},onClick:b},"Next"));return c.default.createElement("div",{onKeyDown:L},c.default.createElement(H,null,j()),c.default.createElement("div",null,t.steps[o].component),c.default.createElement("div",null,A(s)))}
