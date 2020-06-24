let p=Object.defineProperty,y=Object.prototype.hasOwnProperty,z=a=>p(a,"__esModule",{value:!0}),J=(a,c)=>{z(a);for(let e in c)p(a,e,{get:c[e],enumerable:!0})},K=(a,c)=>{z(a);for(let e in c)y.call(c,e)&&!y.call(a,e)&&e!=="default"&&p(a,e,{get:()=>c[e],enumerable:!0});return a},L=a=>a&&a.__esModule?a:K(p({},"default",{value:a,enumerable:!0}),a);let A={data:""},B=a=>{try{let c=a?a.querySelector("#_goober"):self._goober;return c||(c=(a||document.head).appendChild(document.createElement("style")),c.innerHTML=" ",c.id="_goober"),c.firstChild}catch(c){}return A},C=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,D=/\/\*.*?\*\/|\s{2,}|\n/gm,m=(a,c,e)=>{let h="",g="",i="";for(let d in a){let b=a[d];if("object"==typeof b){let f=c+" "+d;/&/g.test(d)&&(f=d.replace(/&/g,c)),"@"==d[0]&&(f=c,"f"==d[1]&&(f=d)),/@k/.test(d)?g+=d+"{"+m(b,"","")+"}":g+=m(b,f,f==c?d:e||"")}else/^@i/.test(d)?h=d+" "+b+";":i+=m.p?m.p(d.replace(/[A-Z]/g,"-$&").toLowerCase(),b):d.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+b+";"}if(i[0]){let d=c+"{"+i+"}";return e?g+e+"{"+d+"}":h+d+g}return h+g},n={},E=(a,c,e,h)=>{let g=a.toLowerCase?a:function d(b){let f="";for(let l in b)"object"==typeof val?f+=l+d(b[l]):f+=l+b[l];return f}(a),i=n[g]||(n[g]=".go"+g.split("").reduce((d,b)=>101*d+b.charCodeAt(0)>>>0,11));return((d,b,f)=>{b.data.indexOf(d)<0&&(b.data=f?d+b.data:b.data+d)})(n[i]||(n[i]=m(a[0]?(d=>{let b,f=[{}];for(;b=C.exec(d.replace(D,""));)b[4]&&f.shift(),b[3]?f.unshift(f[0][b[3]]=f[0][b[3]]||{}):b[4]||(f[0][b[1]]=b[2]);return f[0]})(a):a,e?"":i)),c,h),i.slice(1)},F=(a,c,e)=>a.reduce((h,g,i)=>{let d=c[i];if(d&&d.call){let b=d(e),f=b&&b.props&&b.props.className||/^go/.test(b)&&b;d=f?"."+f:b&&b.props?"":b}return h+g+(null==d?"":d)},"");function o(a){let c=this||{},e=a.call?a(c.p):a;return E(e.map?F(e,[].slice.call(arguments,1),c.p):e,B(c.target),c.g,c.o)}let t,r,R=o.bind({g:1});function u(a,c,e){m.p=c,t=a,r=e}function v(a,c){let e=this||{};return function(){let h=arguments;function g(i,d){let b=e.p=Object.assign({theme:r&&r()},i),f=b.className;return e.o=/\s*go[0-9]+/g.test(f),b.className=o.apply(e,h)+(f?" "+f:""),c&&(b.ref=d),t(b.as||a,b)}return c?c(g):g}}J(exports,{default:()=>I});const T=L(require("react"));u(T.default.createElement);const G=v("ol")`
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
`,w=(a,c)=>{let e=[];for(let h=0;h<c;h++)h<a?e.push("done"):h===a?e.push("doing"):e.push("todo");return e},x=(a,c)=>a>0&&a<c-1?{showPreviousBtn:!0,showNextBtn:!0}:a===0?{showPreviousBtn:!1,showNextBtn:!0}:{showPreviousBtn:!0,showNextBtn:!1};function I(a){let c=!0;a.showNavigation&&a.showNavigation&&(c=a.showNavigation);const[e,h]=T.useState(w(0,a.steps.length)),[g,i]=T.useState(0),[d,b]=T.useState(x(0,a.steps.length)),f=j=>{h(w(j,a.steps.length)),i(j<a.steps.length?j:g),b(x(j,a.steps.length))},l=()=>f(g+1),M=()=>f(g>0?g-1:g),N=j=>j.which===13?l(a.steps.length):{},O=j=>{j.currentTarget.value===a.steps.length-1&&g===a.steps.length-1?f(a.steps.length):f(j.currentTarget.value)},P=()=>a.steps.map((j,q)=>T.default.createElement("li",{className:H({state:e[q]}),onClick:O,key:q,value:q},T.default.createElement("span",null,q+1))),Q=j=>j&&T.default.createElement("div",null,T.default.createElement("button",{style:d.showPreviousBtn?{}:{display:"none"},onClick:M},"Prev"),T.default.createElement("button",{style:d.showNextBtn?{}:{display:"none"},onClick:l},"Next"));return T.default.createElement("div",{onKeyDown:N},T.default.createElement(G,null,P()),T.default.createElement("div",null,a.steps[g].component),T.default.createElement("div",null,Q(c)))}
