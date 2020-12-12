var _=Object.create,b=Object.defineProperty,D=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty,M=Object.getOwnPropertyNames,Z=Object.getOwnPropertyDescriptor,w=e=>b(e,"__esModule",{value:!0}),q=(e,t)=>{w(e);for(var s in t)b(e,s,{get:t[s],enumerable:!0})},z=(e,t,s)=>{if(w(e),t&&typeof t=="object"||typeof t=="function")for(let a of M(t))!K.call(e,a)&&a!=="default"&&b(e,a,{get:()=>t[a],enumerable:!(s=Z(t,a))||s.enumerable});return e},H=e=>e&&e.__esModule?e:z(b(e!=null?_(D(e)):{},"default",{value:e,enumerable:!0}),e);q(exports,{default:()=>j});var i=H(require("react")),G={data:""},I=e=>{try{let t=e?e.querySelector("#_goober"):self._goober;return t||(t=(e||document.head).appendChild(document.createElement("style")),t.innerHTML=" ",t.id="_goober"),t.firstChild}catch(t){}return e||G},J=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,Q=/\/\*[\s\S]*?\*\/|\s{2,}|\n/gm,f=(e,t)=>{let s,a="",d="",c="";for(let o in e){let n=e[o];typeof n=="object"?(s=t?t.replace(/([^,])+/g,l=>o.replace(/([^,])+/g,r=>/&/g.test(r)?r.replace(/&/g,l):l?l+" "+r:r)):o,d+=o[0]=="@"?o[1]=="f"?f(n,o):o+"{"+f(n,o[1]=="k"?"":t)+"}":f(n,s)):o[0]=="@"&&o[1]=="i"?a=o+" "+n+";":c+=f.p?f.p(o.replace(/[A-Z]/g,"-$&").toLowerCase(),n):o.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+n+";"}return c[0]?(s=t?t+"{"+c+"}":c,a+s+d):a+d},h={},C=e=>{let t="";for(let s in e)t+=s+(typeof e[s]=="object"?C(e[s]):e[s]);return t},U=(e,t,s,a,d)=>{let c=typeof e=="object"?C(e):e,o=h[c]||(h[c]="go"+c.split("").reduce((n,l)=>101*n+l.charCodeAt(0)>>>0,11));if(!h[o]){let n=typeof e=="object"?e:(l=>{let r,g=[{}];for(;r=J.exec(l.replace(Q,""));)r[4]&&g.shift(),r[3]?g.unshift(g[0][r[3]]=g[0][r[3]]||{}):r[4]||(g[0][r[1]]=r[2]);return g[0]})(e);h[o]=f(d?{["@keyframes "+o]:n}:n,s?"":"."+o)}return((n,l,r)=>{l.data.indexOf(n)<0&&(l.data=r?n+l.data:l.data+n)})(h[o],t,a),o},V=(e,t,s)=>e.reduce((a,d,c)=>{let o=t[c];if(o&&o.call){let n=o(s),l=n&&n.props&&n.props.className||/^go/.test(n)&&n;o=l?"."+l:n&&typeof n=="object"?n.props?"":f(n,""):n}return a+d+(o??"")},"");function y(e){let t=this||{},s=e.call?e(t.p):e;return U(s.map?V(s,[].slice.call(arguments,1),t.p):s,I(t.target),t.g,t.o,t.k)}var N,p,ee=y.bind({g:1}),te=y.bind({k:1});function k(e,t,s){f.p=t,N=e,p=s}function x(e,t){let s=this||{};return function(){let a=arguments;function d(c,o){let n=Object.assign({},c),l=n.className||d.className;return s.p=Object.assign({theme:p&&p()},n),s.o=/\s*go[0-9]+/g.test(l),n.className=y.apply(s,a)+(l?" "+l:""),t&&(n.ref=o),N(n.as||e,n)}return t?t(d):d}}k(i.default.createElement);var W=x("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,X=e=>y`
  display: inline-block;
  text-align: center;
  line-height: 4.5rem;
  padding: 0 0.7rem;
  cursor: pointer;

  color: ${e.state==="todo"?"silver":"black"};
  border-bottom: 4px solid ${e.state==="todo"?"silver":"#33C3F0"};

  &:before {
    position: relative;
    bottom: -3.99rem;
    float: left;
    left: 50%;

    ${e.state==="todo"?'content: "\u039F";':e.state==="doing"?'content: "\u2022";':'content: "\u2713";'}
    color: ${e.state==="todo"?"silver":"white"};
    background-color: ${e.state==="todo"?"white":"#33C3F0"};  
    width: 1.2em;
    line-height: ${e.state==="todo"?"1.2em":"1.4em"};
    border-radius: ${e.state==="todo"?"0":"1.2em"};
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
`,B=(e,t)=>{let s=[];for(let a=0;a<t;a++)a<e?s.push("done"):a===e?s.push("doing"):s.push("todo");return s},$=(e,t)=>e>0&&e<t-1?{showPreviousBtn:!0,showNextBtn:!0}:e===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function j(e){let t=!0,{activeComponentClassName:s,inactiveComponentClassName:a}=e;e.showNavigation&&(t=e.showNavigation);let d={};e.prevStyle&&(d=e.prevStyle);let c={};e.nextStyle&&(c=e.nextStyle);let[o,n]=i.useState(B(0,e.steps.length)),[l,r]=i.useState(0),[g,O]=i.useState($(0,e.steps.length)),v=u=>{n(B(u,e.steps.length)),r(u<e.steps.length?u:l),O($(u,e.steps.length))},S=()=>v(l+1),P=()=>v(l>0?l-1:l),A=u=>u.which===13?S(e.steps.length):{},F=u=>{u.currentTarget.value===e.steps.length-1&&l===e.steps.length-1?v(e.steps.length):v(u.currentTarget.value)},L=()=>e.steps.map((u,m)=>i.default.createElement("li",{className:X({state:o[m]}),onClick:F,key:m,value:m},i.default.createElement("span",null,m+1))),T=u=>u&&i.default.createElement("div",null,i.default.createElement("button",{style:g.showPreviousBtn?e.prevStyle:{display:"none"},onClick:P},"Prev"),i.default.createElement("button",{style:g.showNextBtn?e.nextStyle:{display:"none"},onClick:S},"Next"));return i.default.createElement("div",{onKeyDown:A},i.default.createElement(W,null,L()),a?e.steps.map((u,m)=>{let E=m===l?s:a;return i.default.createElement("div",{className:E},u.component)}):i.default.createElement("div",null,e.steps[l].component),i.default.createElement("div",null,T(t)))}
