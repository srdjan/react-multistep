var p=Object.defineProperty,y=Object.prototype.hasOwnProperty,z=a=>p(a,"__esModule",{value:!0}),J=(a,b)=>{z(a);for(var e in b)p(a,e,{get:b[e],enumerable:!0})},K=(a,b)=>{z(a);if(typeof b==="object"||typeof b==="function")for(let e in b)y.call(b,e)&&!y.call(a,e)&&e!=="default"&&p(a,e,{get:()=>b[e],enumerable:!0});return a},L=a=>a&&a.__esModule?a:K(p({},"default",{value:a,enumerable:!0}),a);let A={data:""},B=a=>{try{let b=a?a.querySelector("#_goober"):self._goober;return b||(b=(a||document.head).appendChild(document.createElement("style")),b.innerHTML=" ",b.id="_goober"),b.firstChild}catch(b){}return A},C=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,D=/\/\*.*?\*\/|\s{2,}|\n/gm,m=(a,b,e)=>{let h="",g="",i="";for(let d in a){let c=a[d];if("object"==typeof c){let f=b+" "+d;/&/g.test(d)&&(f=d.replace(/&/g,b)),"@"==d[0]&&(f=b,"f"==d[1]&&(f=d)),/@k/.test(d)?g+=d+"{"+m(c,"","")+"}":g+=m(c,f,f==b?d:e||"")}else/^@i/.test(d)?h=d+" "+c+";":i+=m.p?m.p(d.replace(/[A-Z]/g,"-$&").toLowerCase(),c):d.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+c+";"}if(i[0]){let d=b+"{"+i+"}";return e?g+e+"{"+d+"}":h+d+g}return h+g},n={},E=(a,b,e,h)=>{let g=a.toLowerCase?a:function d(c){let f="";for(let l in c)"object"==typeof val?f+=l+d(c[l]):f+=l+c[l];return f}(a),i=n[g]||(n[g]=".go"+g.split("").reduce((d,c)=>101*d+c.charCodeAt(0)>>>0,11));return((d,c,f)=>{c.data.indexOf(d)<0&&(c.data=f?d+c.data:c.data+d)})(n[i]||(n[i]=m(a[0]?(d=>{let c,f=[{}];for(;c=C.exec(d.replace(D,""));)c[4]&&f.shift(),c[3]?f.unshift(f[0][c[3]]=f[0][c[3]]||{}):c[4]||(f[0][c[1]]=c[2]);return f[0]})(a):a,e?"":i)),b,h),i.slice(1)},F=(a,b,e)=>a.reduce((h,g,i)=>{let d=b[i];if(d&&d.call){let c=d(e),f=c&&c.props&&c.props.className||/^go/.test(c)&&c;d=f?"."+f:c&&c.props?"":c}return h+g+(null==d?"":d)},"");function o(a){let b=this||{},e=a.call?a(b.p):a;return E(e.map?F(e,[].slice.call(arguments,1),b.p):e,B(b.target),b.g,b.o)}let t,r,R=o.bind({g:1});function u(a,b,e){m.p=b,t=a,r=e}function v(a,b){let e=this||{};return function(){let h=arguments;function g(i,d){let c=e.p=Object.assign({theme:r&&r()},i),f=c.className;return e.o=/\s*go[0-9]+/g.test(f),c.className=o.apply(e,h)+(f?" "+f:""),b&&(c.ref=d),t(c.as||a,c)}return b?b(g):g}}J(exports,{default:()=>I});const T=L(require("react"));u(T.default.createElement);const G=v("ol")`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`,H=a=>o`
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
`,w=(a,b)=>{let e=[];for(let h=0;h<b;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},x=(a,b)=>a>0&&a<b-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function I(a){let b=!0;a.showNavigation&&a.showNavigation&&(b=a.showNavigation);const[e,h]=T.useState(w(0,a.steps.length)),[g,i]=T.useState(0),[d,c]=T.useState(x(0,a.steps.length)),f=j=>{h(w(j,a.steps.length)),i(j<a.steps.length?j:g),c(x(j,a.steps.length))},l=()=>f(g+1),M=()=>f(g>0?g-1:g),N=j=>j.which===13?l(a.steps.length):{},O=j=>{j.currentTarget.value===a.steps.length-1&&g===a.steps.length-1?f(a.steps.length):f(j.currentTarget.value)},P=()=>a.steps.map((j,q)=>T.default.createElement("li",{className:H({state:e[q]}),onClick:O,key:q,value:q},T.default.createElement("span",null,q+1))),Q=j=>j&&T.default.createElement("div",null,T.default.createElement("button",{style:d.showPreviousBtn?{}:{display:"none"},onClick:M},"Prev"),T.default.createElement("button",{style:d.showNextBtn?{}:{display:"none"},onClick:l},"Next"));return T.default.createElement("div",{onKeyDown:N},T.default.createElement(G,null,P()),T.default.createElement("div",null,a.steps[g].component),T.default.createElement("div",null,Q(b)))}
