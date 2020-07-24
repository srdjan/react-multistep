var p=Object.defineProperty,z=Object.prototype.hasOwnProperty,A=a=>p(a,"__esModule",{value:!0}),L=(a,c)=>{A(a);for(var e in c)p(a,e,{get:c[e],enumerable:!0})},M=(a,c)=>{A(a);if(typeof c==="object"||typeof c==="function")for(let e in c)z.call(c,e)&&!z.call(a,e)&&e!=="default"&&p(a,e,{get:()=>c[e],enumerable:!0});return a},N=a=>a&&a.__esModule?a:M(p({},"default",{value:a,enumerable:!0}),a);let C={data:""},D=a=>{try{let c=a?a.querySelector("#_goober"):self._goober;return c||(c=(a||document.head).appendChild(document.createElement("style")),c.innerHTML=" ",c.id="_goober"),c.firstChild}catch(c){}return C},E=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,F=/\/\*[\s\S]*?\*\/|\s{2,}|\n/gm,l=(a,c,e)=>{let h="",g="",i="";for(let d in a){let b=a[d];if("object"==typeof b){let f=c+" "+d;/&/g.test(d)&&(f=d.replace(/&/g,c)),"@"==d[0]&&(f=c,"f"==d[1]&&(f=d)),/@k/.test(d)?g+=d+"{"+l(b,"","")+"}":g+=l(b,f,f==c?d:e||"")}else/^@i/.test(d)?h=d+" "+b+";":i+=l.p?l.p(d.replace(/[A-Z]/g,"-$&").toLowerCase(),b):d.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+b+";"}if(i[0]){let d=c+"{"+i+"}";return e?g+e+"{"+d+"}":h+d+g}return h+g},n={},G=(a,c,e,h)=>{let g=a.toLowerCase?a:function d(b){let f="";for(let m in b)f+=m+("object"==typeof b[m]?d(b[m]):b[m]);return f}(a),i=n[g]||(n[g]=".go"+g.split("").reduce((d,b)=>101*d+b.charCodeAt(0)>>>0,11));return((d,b,f)=>{b.data.indexOf(d)<0&&(b.data=f?d+b.data:b.data+d)})(n[i]||(n[i]=l(a[0]?(d=>{let b,f=[{}];for(;b=E.exec(d.replace(F,""));)b[4]&&f.shift(),b[3]?f.unshift(f[0][b[3]]=f[0][b[3]]||{}):b[4]||(f[0][b[1]]=b[2]);return f[0]})(a):a,e?"":i)),c,h),i.slice(1)},H=(a,c,e)=>a.reduce((h,g,i)=>{let d=c[i];if(d&&d.call){let b=d(e),f=b&&b.props&&b.props.className||/^go/.test(b)&&b;d=f?"."+f:b&&b.props?"":b}return h+g+(null==d?"":d)},"");function o(a){let c=this||{},e=a.call?a(c.p):a;return G(e.map?H(e,[].slice.call(arguments,1),c.p):e,D(c.target),c.g,c.o)}let u,s,T=o.bind({g:1});function v(a,c,e){l.p=c,u=a,s=e}function w(a,c){let e=this||{};return function(){let h=arguments;function g(i,d){let b=Object.assign({},i),f=b.className||g.className;return e.p=Object.assign({theme:s&&s()},b),e.o=/\s*go[0-9]+/g.test(f),b.className=o.apply(e,h)+(f?" "+f:""),c&&(b.ref=d),u(b.as||a,b)}return c?c(g):g}}L(exports,{default:()=>K});const V=N(require("react"));v(V.default.createElement);const I=w("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,J=a=>o`
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
`,x=(a,c)=>{let e=[];for(let h=0;h<c;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},y=(a,c)=>a>0&&a<c-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function K(a){let c=!0;a.showNavigation&&(c=a.showNavigation);let e={};a.prevStyle&&(e=a.prevStyle);let h={};a.nextStyle&&(h=a.nextStyle);const[g,i]=V.useState(x(0,a.steps.length)),[d,b]=V.useState(0),[f,m]=V.useState(y(0,a.steps.length)),q=j=>{i(x(j,a.steps.length)),b(j<a.steps.length?j:d),m(y(j,a.steps.length))},B=()=>q(d+1),O=()=>q(d>0?d-1:d),P=j=>j.which===13?B(a.steps.length):{},Q=j=>{j.currentTarget.value===a.steps.length-1&&d===a.steps.length-1?q(a.steps.length):q(j.currentTarget.value)},R=()=>a.steps.map((j,r)=>V.default.createElement("li",{className:J({state:g[r]}),onClick:Q,key:r,value:r},V.default.createElement("span",null,r+1))),S=j=>j&&V.default.createElement("div",null,V.default.createElement("button",{style:f.showPreviousBtn?a.prevStyle:{display:"none"},onClick:O},"Prev"),V.default.createElement("button",{style:f.showNextBtn?a.nextStyle:{display:"none"},onClick:B},"Next"));return V.default.createElement("div",{onKeyDown:P},V.default.createElement(I,null,R()),V.default.createElement("div",null,a.steps[d].component),V.default.createElement("div",null,S(c)))}
