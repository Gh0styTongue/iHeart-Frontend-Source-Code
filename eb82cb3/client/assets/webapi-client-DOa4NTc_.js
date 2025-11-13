import{b as je,a as Ge,j as Ye}from"./create-logger-DNtzi1_a.js";import{q as Z,c as He,k as Qe}from"./amp-client-C2ZZL0mA.js";import{o as q,a as ze,s as O,f as Je,l as pe}from"./http-error-DJhpcL-Y.js";import{r as F}from"./chunk-QMGIS6GS-CFDD2jAw.js";class w extends Error{response;request;constructor(t,n){const i=`${w.extractMessage(t)}: ${JSON.stringify({response:t,request:n})}`;super(i),Object.setPrototypeOf(this,w.prototype),this.response=t,this.request=n,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,w)}static extractMessage(t){return t.errors?.[0]?.message??`GraphQL Error (Code: ${String(t.status)})`}}const he=e=>e.toUpperCase(),Q=e=>typeof e=="function"?e():e,Oe=(e,t)=>e.map((n,i)=>[n,t[i]]),R=e=>{let t={};return e instanceof Headers?t=We(e):Array.isArray(e)?e.forEach(([n,i])=>{n&&i!==void 0&&(t[n]=i)}):e&&(t=e),t},We=e=>{const t={};return e.forEach((n,i)=>{t[i]=n}),t},Xe=e=>{try{const t=e();return Ze(t)?t.catch(n=>fe(n)):t}catch(t){return fe(t)}},fe=e=>e instanceof Error?e:new Error(String(e)),Ze=e=>typeof e=="object"&&e!==null&&"then"in e&&typeof e.then=="function"&&"catch"in e&&typeof e.catch=="function"&&"finally"in e&&typeof e.finally=="function",re=e=>{throw new Error(`Unhandled case: ${String(e)}`)},U=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),Ke=(e,t)=>e.documents?e:{documents:e,requestHeaders:t,signal:void 0},et=(e,t,n)=>e.query?e:{query:e,variables:t,requestHeaders:n,signal:void 0};function B(e,t){if(!!!e)throw new Error(t)}function tt(e){return typeof e=="object"&&e!==null}function nt(e,t){if(!!!e)throw new Error("Unexpected invariant triggered.")}const st=/\r\n|[\n\r]/g;function K(e,t){let n=0,i=1;for(const s of e.body.matchAll(st)){if(typeof s.index=="number"||nt(!1),s.index>=t)break;n=s.index+s[0].length,i+=1}return{line:i,column:t+1-n}}function it(e){return Se(e.source,K(e.source,e.start))}function Se(e,t){const n=e.locationOffset.column-1,i="".padStart(n)+e.body,s=t.line-1,r=e.locationOffset.line-1,a=t.line+r,l=t.line===1?n:0,h=t.column+l,c=`${e.name}:${a}:${h}
`,d=i.split(/\r\n|[\n\r]/g),m=d[s];if(m.length>120){const f=Math.floor(h/80),I=h%80,g=[];for(let T=0;T<m.length;T+=80)g.push(m.slice(T,T+80));return c+me([[`${a} |`,g[0]],...g.slice(1,f+1).map(T=>["|",T]),["|","^".padStart(I)],["|",g[f+1]]])}return c+me([[`${a-1} |`,d[s-1]],[`${a} |`,m],["|","^".padStart(h)],[`${a+1} |`,d[s+1]]])}function me(e){const t=e.filter(([i,s])=>s!==void 0),n=Math.max(...t.map(([i])=>i.length));return t.map(([i,s])=>i.padStart(n)+(s?" "+s:"")).join(`
`)}function rt(e){const t=e[0];return t==null||"kind"in t||"length"in t?{nodes:t,source:e[1],positions:e[2],path:e[3],originalError:e[4],extensions:e[5]}:t}class oe extends Error{constructor(t,...n){var i,s,r;const{nodes:a,source:l,positions:h,path:c,originalError:d,extensions:m}=rt(n);super(t),this.name="GraphQLError",this.path=c??void 0,this.originalError=d??void 0,this.nodes=ye(Array.isArray(a)?a:a?[a]:void 0);const f=ye((i=this.nodes)===null||i===void 0?void 0:i.map(g=>g.loc).filter(g=>g!=null));this.source=l??(f==null||(s=f[0])===null||s===void 0?void 0:s.source),this.positions=h??f?.map(g=>g.start),this.locations=h&&l?h.map(g=>K(l,g)):f?.map(g=>K(g.source,g.start));const I=tt(d?.extensions)?d?.extensions:void 0;this.extensions=(r=m??I)!==null&&r!==void 0?r:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),d!=null&&d.stack?Object.defineProperty(this,"stack",{value:d.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,oe):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let t=this.message;if(this.nodes)for(const n of this.nodes)n.loc&&(t+=`

`+it(n.loc));else if(this.source&&this.locations)for(const n of this.locations)t+=`

`+Se(this.source,n);return t}toJSON(){const t={message:this.message};return this.locations!=null&&(t.locations=this.locations),this.path!=null&&(t.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(t.extensions=this.extensions),t}}function ye(e){return e===void 0||e.length===0?void 0:e}function b(e,t,n){return new oe(`Syntax Error: ${n}`,{source:e,positions:[t]})}class ot{constructor(t,n,i){this.start=t.start,this.end=n.end,this.startToken=t,this.endToken=n,this.source=i}get[Symbol.toStringTag](){return"Location"}toJSON(){return{start:this.start,end:this.end}}}class De{constructor(t,n,i,s,r,a){this.kind=t,this.start=n,this.end=i,this.line=s,this.column=r,this.value=a,this.prev=null,this.next=null}get[Symbol.toStringTag](){return"Token"}toJSON(){return{kind:this.kind,value:this.value,line:this.line,column:this.column}}}const Ce={Name:[],Document:["definitions"],OperationDefinition:["name","variableDefinitions","directives","selectionSet"],VariableDefinition:["variable","type","defaultValue","directives"],Variable:["name"],SelectionSet:["selections"],Field:["alias","name","arguments","directives","selectionSet"],Argument:["name","value"],FragmentSpread:["name","directives"],InlineFragment:["typeCondition","directives","selectionSet"],FragmentDefinition:["name","variableDefinitions","typeCondition","directives","selectionSet"],IntValue:[],FloatValue:[],StringValue:[],BooleanValue:[],NullValue:[],EnumValue:[],ListValue:["values"],ObjectValue:["fields"],ObjectField:["name","value"],Directive:["name","arguments"],NamedType:["name"],ListType:["type"],NonNullType:["type"],SchemaDefinition:["description","directives","operationTypes"],OperationTypeDefinition:["type"],ScalarTypeDefinition:["description","name","directives"],ObjectTypeDefinition:["description","name","interfaces","directives","fields"],FieldDefinition:["description","name","arguments","type","directives"],InputValueDefinition:["description","name","type","defaultValue","directives"],InterfaceTypeDefinition:["description","name","interfaces","directives","fields"],UnionTypeDefinition:["description","name","directives","types"],EnumTypeDefinition:["description","name","directives","values"],EnumValueDefinition:["description","name","directives"],InputObjectTypeDefinition:["description","name","directives","fields"],DirectiveDefinition:["description","name","arguments","locations"],SchemaExtension:["directives","operationTypes"],ScalarTypeExtension:["name","directives"],ObjectTypeExtension:["name","interfaces","directives","fields"],InterfaceTypeExtension:["name","interfaces","directives","fields"],UnionTypeExtension:["name","directives","types"],EnumTypeExtension:["name","directives","values"],InputObjectTypeExtension:["name","directives","fields"]},at=new Set(Object.keys(Ce));function Ee(e){const t=e?.kind;return typeof t=="string"&&at.has(t)}var S;(function(e){e.QUERY="query",e.MUTATION="mutation",e.SUBSCRIPTION="subscription"})(S||(S={}));var ee;(function(e){e.QUERY="QUERY",e.MUTATION="MUTATION",e.SUBSCRIPTION="SUBSCRIPTION",e.FIELD="FIELD",e.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",e.FRAGMENT_SPREAD="FRAGMENT_SPREAD",e.INLINE_FRAGMENT="INLINE_FRAGMENT",e.VARIABLE_DEFINITION="VARIABLE_DEFINITION",e.SCHEMA="SCHEMA",e.SCALAR="SCALAR",e.OBJECT="OBJECT",e.FIELD_DEFINITION="FIELD_DEFINITION",e.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",e.INTERFACE="INTERFACE",e.UNION="UNION",e.ENUM="ENUM",e.ENUM_VALUE="ENUM_VALUE",e.INPUT_OBJECT="INPUT_OBJECT",e.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(ee||(ee={}));var p;(function(e){e.NAME="Name",e.DOCUMENT="Document",e.OPERATION_DEFINITION="OperationDefinition",e.VARIABLE_DEFINITION="VariableDefinition",e.SELECTION_SET="SelectionSet",e.FIELD="Field",e.ARGUMENT="Argument",e.FRAGMENT_SPREAD="FragmentSpread",e.INLINE_FRAGMENT="InlineFragment",e.FRAGMENT_DEFINITION="FragmentDefinition",e.VARIABLE="Variable",e.INT="IntValue",e.FLOAT="FloatValue",e.STRING="StringValue",e.BOOLEAN="BooleanValue",e.NULL="NullValue",e.ENUM="EnumValue",e.LIST="ListValue",e.OBJECT="ObjectValue",e.OBJECT_FIELD="ObjectField",e.DIRECTIVE="Directive",e.NAMED_TYPE="NamedType",e.LIST_TYPE="ListType",e.NON_NULL_TYPE="NonNullType",e.SCHEMA_DEFINITION="SchemaDefinition",e.OPERATION_TYPE_DEFINITION="OperationTypeDefinition",e.SCALAR_TYPE_DEFINITION="ScalarTypeDefinition",e.OBJECT_TYPE_DEFINITION="ObjectTypeDefinition",e.FIELD_DEFINITION="FieldDefinition",e.INPUT_VALUE_DEFINITION="InputValueDefinition",e.INTERFACE_TYPE_DEFINITION="InterfaceTypeDefinition",e.UNION_TYPE_DEFINITION="UnionTypeDefinition",e.ENUM_TYPE_DEFINITION="EnumTypeDefinition",e.ENUM_VALUE_DEFINITION="EnumValueDefinition",e.INPUT_OBJECT_TYPE_DEFINITION="InputObjectTypeDefinition",e.DIRECTIVE_DEFINITION="DirectiveDefinition",e.SCHEMA_EXTENSION="SchemaExtension",e.SCALAR_TYPE_EXTENSION="ScalarTypeExtension",e.OBJECT_TYPE_EXTENSION="ObjectTypeExtension",e.INTERFACE_TYPE_EXTENSION="InterfaceTypeExtension",e.UNION_TYPE_EXTENSION="UnionTypeExtension",e.ENUM_TYPE_EXTENSION="EnumTypeExtension",e.INPUT_OBJECT_TYPE_EXTENSION="InputObjectTypeExtension"})(p||(p={}));function te(e){return e===9||e===32}function $(e){return e>=48&&e<=57}function ke(e){return e>=97&&e<=122||e>=65&&e<=90}function Re(e){return ke(e)||e===95}function ct(e){return ke(e)||$(e)||e===95}function ut(e){var t;let n=Number.MAX_SAFE_INTEGER,i=null,s=-1;for(let a=0;a<e.length;++a){var r;const l=e[a],h=lt(l);h!==l.length&&(i=(r=i)!==null&&r!==void 0?r:a,s=a,a!==0&&h<n&&(n=h))}return e.map((a,l)=>l===0?a:a.slice(n)).slice((t=i)!==null&&t!==void 0?t:0,s+1)}function lt(e){let t=0;for(;t<e.length&&te(e.charCodeAt(t));)++t;return t}function dt(e,t){const n=e.replace(/"""/g,'\\"""'),i=n.split(/\r\n|[\n\r]/g),s=i.length===1,r=i.length>1&&i.slice(1).every(I=>I.length===0||te(I.charCodeAt(0))),a=n.endsWith('\\"""'),l=e.endsWith('"')&&!a,h=e.endsWith("\\"),c=l||h,d=!s||e.length>70||c||r||a;let m="";const f=s&&te(e.charCodeAt(0));return(d&&!f||r)&&(m+=`
`),m+=n,(d||c)&&(m+=`
`),'"""'+m+'"""'}var o;(function(e){e.SOF="<SOF>",e.EOF="<EOF>",e.BANG="!",e.DOLLAR="$",e.AMP="&",e.PAREN_L="(",e.PAREN_R=")",e.SPREAD="...",e.COLON=":",e.EQUALS="=",e.AT="@",e.BRACKET_L="[",e.BRACKET_R="]",e.BRACE_L="{",e.PIPE="|",e.BRACE_R="}",e.NAME="Name",e.INT="Int",e.FLOAT="Float",e.STRING="String",e.BLOCK_STRING="BlockString",e.COMMENT="Comment"})(o||(o={}));class pt{constructor(t){const n=new De(o.SOF,0,0,0,0);this.source=t,this.lastToken=n,this.token=n,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let t=this.token;if(t.kind!==o.EOF)do if(t.next)t=t.next;else{const n=ft(this,t.end);t.next=n,n.prev=t,t=n}while(t.kind===o.COMMENT);return t}}function ht(e){return e===o.BANG||e===o.DOLLAR||e===o.AMP||e===o.PAREN_L||e===o.PAREN_R||e===o.SPREAD||e===o.COLON||e===o.EQUALS||e===o.AT||e===o.BRACKET_L||e===o.BRACKET_R||e===o.BRACE_L||e===o.PIPE||e===o.BRACE_R}function P(e){return e>=0&&e<=55295||e>=57344&&e<=1114111}function j(e,t){return we(e.charCodeAt(t))&&Pe(e.charCodeAt(t+1))}function we(e){return e>=55296&&e<=56319}function Pe(e){return e>=56320&&e<=57343}function D(e,t){const n=e.source.body.codePointAt(t);if(n===void 0)return o.EOF;if(n>=32&&n<=126){const i=String.fromCodePoint(n);return i==='"'?`'"'`:`"${i}"`}return"U+"+n.toString(16).toUpperCase().padStart(4,"0")}function N(e,t,n,i,s){const r=e.line,a=1+n-e.lineStart;return new De(t,n,i,r,a,s)}function ft(e,t){const n=e.source.body,i=n.length;let s=t;for(;s<i;){const r=n.charCodeAt(s);switch(r){case 65279:case 9:case 32:case 44:++s;continue;case 10:++s,++e.line,e.lineStart=s;continue;case 13:n.charCodeAt(s+1)===10?s+=2:++s,++e.line,e.lineStart=s;continue;case 35:return mt(e,s);case 33:return N(e,o.BANG,s,s+1);case 36:return N(e,o.DOLLAR,s,s+1);case 38:return N(e,o.AMP,s,s+1);case 40:return N(e,o.PAREN_L,s,s+1);case 41:return N(e,o.PAREN_R,s,s+1);case 46:if(n.charCodeAt(s+1)===46&&n.charCodeAt(s+2)===46)return N(e,o.SPREAD,s,s+3);break;case 58:return N(e,o.COLON,s,s+1);case 61:return N(e,o.EQUALS,s,s+1);case 64:return N(e,o.AT,s,s+1);case 91:return N(e,o.BRACKET_L,s,s+1);case 93:return N(e,o.BRACKET_R,s,s+1);case 123:return N(e,o.BRACE_L,s,s+1);case 124:return N(e,o.PIPE,s,s+1);case 125:return N(e,o.BRACE_R,s,s+1);case 34:return n.charCodeAt(s+1)===34&&n.charCodeAt(s+2)===34?It(e,s):Et(e,s)}if($(r)||r===45)return yt(e,s,r);if(Re(r))return bt(e,s);throw b(e.source,s,r===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:P(r)||j(n,s)?`Unexpected character: ${D(e,s)}.`:`Invalid character: ${D(e,s)}.`)}return N(e,o.EOF,i,i)}function mt(e,t){const n=e.source.body,i=n.length;let s=t+1;for(;s<i;){const r=n.charCodeAt(s);if(r===10||r===13)break;if(P(r))++s;else if(j(n,s))s+=2;else break}return N(e,o.COMMENT,t,s,n.slice(t+1,s))}function yt(e,t,n){const i=e.source.body;let s=t,r=n,a=!1;if(r===45&&(r=i.charCodeAt(++s)),r===48){if(r=i.charCodeAt(++s),$(r))throw b(e.source,s,`Invalid number, unexpected digit after 0: ${D(e,s)}.`)}else s=z(e,s,r),r=i.charCodeAt(s);if(r===46&&(a=!0,r=i.charCodeAt(++s),s=z(e,s,r),r=i.charCodeAt(s)),(r===69||r===101)&&(a=!0,r=i.charCodeAt(++s),(r===43||r===45)&&(r=i.charCodeAt(++s)),s=z(e,s,r),r=i.charCodeAt(s)),r===46||Re(r))throw b(e.source,s,`Invalid number, expected digit but got: ${D(e,s)}.`);return N(e,a?o.FLOAT:o.INT,t,s,i.slice(t,s))}function z(e,t,n){if(!$(n))throw b(e.source,t,`Invalid number, expected digit but got: ${D(e,t)}.`);const i=e.source.body;let s=t+1;for(;$(i.charCodeAt(s));)++s;return s}function Et(e,t){const n=e.source.body,i=n.length;let s=t+1,r=s,a="";for(;s<i;){const l=n.charCodeAt(s);if(l===34)return a+=n.slice(r,s),N(e,o.STRING,t,s+1,a);if(l===92){a+=n.slice(r,s);const h=n.charCodeAt(s+1)===117?n.charCodeAt(s+2)===123?gt(e,s):Tt(e,s):Nt(e,s);a+=h.value,s+=h.size,r=s;continue}if(l===10||l===13)break;if(P(l))++s;else if(j(n,s))s+=2;else throw b(e.source,s,`Invalid character within String: ${D(e,s)}.`)}throw b(e.source,s,"Unterminated string.")}function gt(e,t){const n=e.source.body;let i=0,s=3;for(;s<12;){const r=n.charCodeAt(t+s++);if(r===125){if(s<5||!P(i))break;return{value:String.fromCodePoint(i),size:s}}if(i=i<<4|L(r),i<0)break}throw b(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+s)}".`)}function Tt(e,t){const n=e.source.body,i=ge(n,t+2);if(P(i))return{value:String.fromCodePoint(i),size:6};if(we(i)&&n.charCodeAt(t+6)===92&&n.charCodeAt(t+7)===117){const s=ge(n,t+8);if(Pe(s))return{value:String.fromCodePoint(i,s),size:12}}throw b(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+6)}".`)}function ge(e,t){return L(e.charCodeAt(t))<<12|L(e.charCodeAt(t+1))<<8|L(e.charCodeAt(t+2))<<4|L(e.charCodeAt(t+3))}function L(e){return e>=48&&e<=57?e-48:e>=65&&e<=70?e-55:e>=97&&e<=102?e-87:-1}function Nt(e,t){const n=e.source.body;switch(n.charCodeAt(t+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw b(e.source,t,`Invalid character escape sequence: "${n.slice(t,t+2)}".`)}function It(e,t){const n=e.source.body,i=n.length;let s=e.lineStart,r=t+3,a=r,l="";const h=[];for(;r<i;){const c=n.charCodeAt(r);if(c===34&&n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34){l+=n.slice(a,r),h.push(l);const d=N(e,o.BLOCK_STRING,t,r+3,ut(h).join(`
`));return e.line+=h.length-1,e.lineStart=s,d}if(c===92&&n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34&&n.charCodeAt(r+3)===34){l+=n.slice(a,r),a=r+1,r+=4;continue}if(c===10||c===13){l+=n.slice(a,r),h.push(l),c===13&&n.charCodeAt(r+1)===10?r+=2:++r,l="",a=r,s=r;continue}if(P(c))++r;else if(j(n,r))r+=2;else throw b(e.source,r,`Invalid character within String: ${D(e,r)}.`)}throw b(e.source,r,"Unterminated string.")}function bt(e,t){const n=e.source.body,i=n.length;let s=t+1;for(;s<i;){const r=n.charCodeAt(s);if(ct(r))++s;else break}return N(e,o.NAME,t,s,n.slice(t,s))}const xt=10,qe=2;function ae(e){return G(e,[])}function G(e,t){switch(typeof e){case"string":return JSON.stringify(e);case"function":return e.name?`[function ${e.name}]`:"[function]";case"object":return vt(e,t);default:return String(e)}}function vt(e,t){if(e===null)return"null";if(t.includes(e))return"[Circular]";const n=[...t,e];if(_t(e)){const i=e.toJSON();if(i!==e)return typeof i=="string"?i:G(i,n)}else if(Array.isArray(e))return Ot(e,n);return At(e,n)}function _t(e){return typeof e.toJSON=="function"}function At(e,t){const n=Object.entries(e);return n.length===0?"{}":t.length>qe?"["+St(e)+"]":"{ "+n.map(([s,r])=>s+": "+G(r,t)).join(", ")+" }"}function Ot(e,t){if(e.length===0)return"[]";if(t.length>qe)return"[Array]";const n=Math.min(xt,e.length),i=e.length-n,s=[];for(let r=0;r<n;++r)s.push(G(e[r],t));return i===1?s.push("... 1 more item"):i>1&&s.push(`... ${i} more items`),"["+s.join(", ")+"]"}function St(e){const t=Object.prototype.toString.call(e).replace(/^\[object /,"").replace(/]$/,"");if(t==="Object"&&typeof e.constructor=="function"){const n=e.constructor.name;if(typeof n=="string"&&n!=="")return n}return t}const Dt=globalThis.process&&!0,Ct=Dt?function(t,n){return t instanceof n}:function(t,n){if(t instanceof n)return!0;if(typeof t=="object"&&t!==null){var i;const s=n.prototype[Symbol.toStringTag],r=Symbol.toStringTag in t?t[Symbol.toStringTag]:(i=t.constructor)===null||i===void 0?void 0:i.name;if(s===r){const a=ae(t);throw new Error(`Cannot use ${s} "${a}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class Le{constructor(t,n="GraphQL request",i={line:1,column:1}){typeof t=="string"||B(!1,`Body must be a string. Received: ${ae(t)}.`),this.body=t,this.name=n,this.locationOffset=i,this.locationOffset.line>0||B(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||B(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function kt(e){return Ct(e,Le)}function Rt(e,t){const n=new wt(e,t),i=n.parseDocument();return Object.defineProperty(i,"tokenCount",{enumerable:!1,value:n.tokenCount}),i}class wt{constructor(t,n={}){const i=kt(t)?t:new Le(t);this._lexer=new pt(i),this._options=n,this._tokenCounter=0}get tokenCount(){return this._tokenCounter}parseName(){const t=this.expectToken(o.NAME);return this.node(t,{kind:p.NAME,value:t.value})}parseDocument(){return this.node(this._lexer.token,{kind:p.DOCUMENT,definitions:this.many(o.SOF,this.parseDefinition,o.EOF)})}parseDefinition(){if(this.peek(o.BRACE_L))return this.parseOperationDefinition();const t=this.peekDescription(),n=t?this._lexer.lookahead():this._lexer.token;if(n.kind===o.NAME){switch(n.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(t)throw b(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(n.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(n)}parseOperationDefinition(){const t=this._lexer.token;if(this.peek(o.BRACE_L))return this.node(t,{kind:p.OPERATION_DEFINITION,operation:S.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const n=this.parseOperationType();let i;return this.peek(o.NAME)&&(i=this.parseName()),this.node(t,{kind:p.OPERATION_DEFINITION,operation:n,name:i,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const t=this.expectToken(o.NAME);switch(t.value){case"query":return S.QUERY;case"mutation":return S.MUTATION;case"subscription":return S.SUBSCRIPTION}throw this.unexpected(t)}parseVariableDefinitions(){return this.optionalMany(o.PAREN_L,this.parseVariableDefinition,o.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:p.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(o.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(o.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const t=this._lexer.token;return this.expectToken(o.DOLLAR),this.node(t,{kind:p.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:p.SELECTION_SET,selections:this.many(o.BRACE_L,this.parseSelection,o.BRACE_R)})}parseSelection(){return this.peek(o.SPREAD)?this.parseFragment():this.parseField()}parseField(){const t=this._lexer.token,n=this.parseName();let i,s;return this.expectOptionalToken(o.COLON)?(i=n,s=this.parseName()):s=n,this.node(t,{kind:p.FIELD,alias:i,name:s,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(o.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(t){const n=t?this.parseConstArgument:this.parseArgument;return this.optionalMany(o.PAREN_L,n,o.PAREN_R)}parseArgument(t=!1){const n=this._lexer.token,i=this.parseName();return this.expectToken(o.COLON),this.node(n,{kind:p.ARGUMENT,name:i,value:this.parseValueLiteral(t)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const t=this._lexer.token;this.expectToken(o.SPREAD);const n=this.expectOptionalKeyword("on");return!n&&this.peek(o.NAME)?this.node(t,{kind:p.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(t,{kind:p.INLINE_FRAGMENT,typeCondition:n?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const t=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(t,{kind:p.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(t,{kind:p.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(t){const n=this._lexer.token;switch(n.kind){case o.BRACKET_L:return this.parseList(t);case o.BRACE_L:return this.parseObject(t);case o.INT:return this.advanceLexer(),this.node(n,{kind:p.INT,value:n.value});case o.FLOAT:return this.advanceLexer(),this.node(n,{kind:p.FLOAT,value:n.value});case o.STRING:case o.BLOCK_STRING:return this.parseStringLiteral();case o.NAME:switch(this.advanceLexer(),n.value){case"true":return this.node(n,{kind:p.BOOLEAN,value:!0});case"false":return this.node(n,{kind:p.BOOLEAN,value:!1});case"null":return this.node(n,{kind:p.NULL});default:return this.node(n,{kind:p.ENUM,value:n.value})}case o.DOLLAR:if(t)if(this.expectToken(o.DOLLAR),this._lexer.token.kind===o.NAME){const i=this._lexer.token.value;throw b(this._lexer.source,n.start,`Unexpected variable "$${i}" in constant value.`)}else throw this.unexpected(n);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const t=this._lexer.token;return this.advanceLexer(),this.node(t,{kind:p.STRING,value:t.value,block:t.kind===o.BLOCK_STRING})}parseList(t){const n=()=>this.parseValueLiteral(t);return this.node(this._lexer.token,{kind:p.LIST,values:this.any(o.BRACKET_L,n,o.BRACKET_R)})}parseObject(t){const n=()=>this.parseObjectField(t);return this.node(this._lexer.token,{kind:p.OBJECT,fields:this.any(o.BRACE_L,n,o.BRACE_R)})}parseObjectField(t){const n=this._lexer.token,i=this.parseName();return this.expectToken(o.COLON),this.node(n,{kind:p.OBJECT_FIELD,name:i,value:this.parseValueLiteral(t)})}parseDirectives(t){const n=[];for(;this.peek(o.AT);)n.push(this.parseDirective(t));return n}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(t){const n=this._lexer.token;return this.expectToken(o.AT),this.node(n,{kind:p.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(t)})}parseTypeReference(){const t=this._lexer.token;let n;if(this.expectOptionalToken(o.BRACKET_L)){const i=this.parseTypeReference();this.expectToken(o.BRACKET_R),n=this.node(t,{kind:p.LIST_TYPE,type:i})}else n=this.parseNamedType();return this.expectOptionalToken(o.BANG)?this.node(t,{kind:p.NON_NULL_TYPE,type:n}):n}parseNamedType(){return this.node(this._lexer.token,{kind:p.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(o.STRING)||this.peek(o.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("schema");const i=this.parseConstDirectives(),s=this.many(o.BRACE_L,this.parseOperationTypeDefinition,o.BRACE_R);return this.node(t,{kind:p.SCHEMA_DEFINITION,description:n,directives:i,operationTypes:s})}parseOperationTypeDefinition(){const t=this._lexer.token,n=this.parseOperationType();this.expectToken(o.COLON);const i=this.parseNamedType();return this.node(t,{kind:p.OPERATION_TYPE_DEFINITION,operation:n,type:i})}parseScalarTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("scalar");const i=this.parseName(),s=this.parseConstDirectives();return this.node(t,{kind:p.SCALAR_TYPE_DEFINITION,description:n,name:i,directives:s})}parseObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("type");const i=this.parseName(),s=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(t,{kind:p.OBJECT_TYPE_DEFINITION,description:n,name:i,interfaces:s,directives:r,fields:a})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(o.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(o.BRACE_L,this.parseFieldDefinition,o.BRACE_R)}parseFieldDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName(),s=this.parseArgumentDefs();this.expectToken(o.COLON);const r=this.parseTypeReference(),a=this.parseConstDirectives();return this.node(t,{kind:p.FIELD_DEFINITION,description:n,name:i,arguments:s,type:r,directives:a})}parseArgumentDefs(){return this.optionalMany(o.PAREN_L,this.parseInputValueDef,o.PAREN_R)}parseInputValueDef(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName();this.expectToken(o.COLON);const s=this.parseTypeReference();let r;this.expectOptionalToken(o.EQUALS)&&(r=this.parseConstValueLiteral());const a=this.parseConstDirectives();return this.node(t,{kind:p.INPUT_VALUE_DEFINITION,description:n,name:i,type:s,defaultValue:r,directives:a})}parseInterfaceTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("interface");const i=this.parseName(),s=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),a=this.parseFieldsDefinition();return this.node(t,{kind:p.INTERFACE_TYPE_DEFINITION,description:n,name:i,interfaces:s,directives:r,fields:a})}parseUnionTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("union");const i=this.parseName(),s=this.parseConstDirectives(),r=this.parseUnionMemberTypes();return this.node(t,{kind:p.UNION_TYPE_DEFINITION,description:n,name:i,directives:s,types:r})}parseUnionMemberTypes(){return this.expectOptionalToken(o.EQUALS)?this.delimitedMany(o.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("enum");const i=this.parseName(),s=this.parseConstDirectives(),r=this.parseEnumValuesDefinition();return this.node(t,{kind:p.ENUM_TYPE_DEFINITION,description:n,name:i,directives:s,values:r})}parseEnumValuesDefinition(){return this.optionalMany(o.BRACE_L,this.parseEnumValueDefinition,o.BRACE_R)}parseEnumValueDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseEnumValueName(),s=this.parseConstDirectives();return this.node(t,{kind:p.ENUM_VALUE_DEFINITION,description:n,name:i,directives:s})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw b(this._lexer.source,this._lexer.token.start,`${M(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("input");const i=this.parseName(),s=this.parseConstDirectives(),r=this.parseInputFieldsDefinition();return this.node(t,{kind:p.INPUT_OBJECT_TYPE_DEFINITION,description:n,name:i,directives:s,fields:r})}parseInputFieldsDefinition(){return this.optionalMany(o.BRACE_L,this.parseInputValueDef,o.BRACE_R)}parseTypeSystemExtension(){const t=this._lexer.lookahead();if(t.kind===o.NAME)switch(t.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(t)}parseSchemaExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const n=this.parseConstDirectives(),i=this.optionalMany(o.BRACE_L,this.parseOperationTypeDefinition,o.BRACE_R);if(n.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:p.SCHEMA_EXTENSION,directives:n,operationTypes:i})}parseScalarTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const n=this.parseName(),i=this.parseConstDirectives();if(i.length===0)throw this.unexpected();return this.node(t,{kind:p.SCALAR_TYPE_EXTENSION,name:n,directives:i})}parseObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const n=this.parseName(),i=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),r=this.parseFieldsDefinition();if(i.length===0&&s.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:p.OBJECT_TYPE_EXTENSION,name:n,interfaces:i,directives:s,fields:r})}parseInterfaceTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const n=this.parseName(),i=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),r=this.parseFieldsDefinition();if(i.length===0&&s.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:p.INTERFACE_TYPE_EXTENSION,name:n,interfaces:i,directives:s,fields:r})}parseUnionTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const n=this.parseName(),i=this.parseConstDirectives(),s=this.parseUnionMemberTypes();if(i.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:p.UNION_TYPE_EXTENSION,name:n,directives:i,types:s})}parseEnumTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const n=this.parseName(),i=this.parseConstDirectives(),s=this.parseEnumValuesDefinition();if(i.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:p.ENUM_TYPE_EXTENSION,name:n,directives:i,values:s})}parseInputObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const n=this.parseName(),i=this.parseConstDirectives(),s=this.parseInputFieldsDefinition();if(i.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:p.INPUT_OBJECT_TYPE_EXTENSION,name:n,directives:i,fields:s})}parseDirectiveDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("directive"),this.expectToken(o.AT);const i=this.parseName(),s=this.parseArgumentDefs(),r=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const a=this.parseDirectiveLocations();return this.node(t,{kind:p.DIRECTIVE_DEFINITION,description:n,name:i,arguments:s,repeatable:r,locations:a})}parseDirectiveLocations(){return this.delimitedMany(o.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const t=this._lexer.token,n=this.parseName();if(Object.prototype.hasOwnProperty.call(ee,n.value))return n;throw this.unexpected(t)}node(t,n){return this._options.noLocation!==!0&&(n.loc=new ot(t,this._lexer.lastToken,this._lexer.source)),n}peek(t){return this._lexer.token.kind===t}expectToken(t){const n=this._lexer.token;if(n.kind===t)return this.advanceLexer(),n;throw b(this._lexer.source,n.start,`Expected ${Fe(t)}, found ${M(n)}.`)}expectOptionalToken(t){return this._lexer.token.kind===t?(this.advanceLexer(),!0):!1}expectKeyword(t){const n=this._lexer.token;if(n.kind===o.NAME&&n.value===t)this.advanceLexer();else throw b(this._lexer.source,n.start,`Expected "${t}", found ${M(n)}.`)}expectOptionalKeyword(t){const n=this._lexer.token;return n.kind===o.NAME&&n.value===t?(this.advanceLexer(),!0):!1}unexpected(t){const n=t??this._lexer.token;return b(this._lexer.source,n.start,`Unexpected ${M(n)}.`)}any(t,n,i){this.expectToken(t);const s=[];for(;!this.expectOptionalToken(i);)s.push(n.call(this));return s}optionalMany(t,n,i){if(this.expectOptionalToken(t)){const s=[];do s.push(n.call(this));while(!this.expectOptionalToken(i));return s}return[]}many(t,n,i){this.expectToken(t);const s=[];do s.push(n.call(this));while(!this.expectOptionalToken(i));return s}delimitedMany(t,n){this.expectOptionalToken(t);const i=[];do i.push(n.call(this));while(this.expectOptionalToken(t));return i}advanceLexer(){const{maxTokens:t}=this._options,n=this._lexer.advance();if(n.kind!==o.EOF&&(++this._tokenCounter,t!==void 0&&this._tokenCounter>t))throw b(this._lexer.source,n.start,`Document contains more that ${t} tokens. Parsing aborted.`)}}function M(e){const t=e.value;return Fe(e.kind)+(t!=null?` "${t}"`:"")}function Fe(e){return ht(e)?`"${e}"`:e}function Pt(e){return`"${e.replace(qt,Lt)}"`}const qt=/[\x00-\x1f\x22\x5c\x7f-\x9f]/g;function Lt(e){return Ft[e.charCodeAt(0)]}const Ft=["\\u0000","\\u0001","\\u0002","\\u0003","\\u0004","\\u0005","\\u0006","\\u0007","\\b","\\t","\\n","\\u000B","\\f","\\r","\\u000E","\\u000F","\\u0010","\\u0011","\\u0012","\\u0013","\\u0014","\\u0015","\\u0016","\\u0017","\\u0018","\\u0019","\\u001A","\\u001B","\\u001C","\\u001D","\\u001E","\\u001F","","",'\\"',"","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","\\\\","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","\\u007F","\\u0080","\\u0081","\\u0082","\\u0083","\\u0084","\\u0085","\\u0086","\\u0087","\\u0088","\\u0089","\\u008A","\\u008B","\\u008C","\\u008D","\\u008E","\\u008F","\\u0090","\\u0091","\\u0092","\\u0093","\\u0094","\\u0095","\\u0096","\\u0097","\\u0098","\\u0099","\\u009A","\\u009B","\\u009C","\\u009D","\\u009E","\\u009F"],$t=Object.freeze({});function Mt(e,t,n=Ce){const i=new Map;for(const v of Object.values(p))i.set(v,Ut(t,v));let s,r=Array.isArray(e),a=[e],l=-1,h=[],c=e,d,m;const f=[],I=[];do{l++;const v=l===a.length,ue=v&&h.length!==0;if(v){if(d=I.length===0?void 0:f[f.length-1],c=m,m=I.pop(),ue)if(r){c=c.slice();let A=0;for(const[H,le]of h){const de=H-A;le===null?(c.splice(de,1),A++):c[de]=le}}else{c=Object.defineProperties({},Object.getOwnPropertyDescriptors(c));for(const[A,H]of h)c[A]=H}l=s.index,a=s.keys,h=s.edits,r=s.inArray,s=s.prev}else if(m){if(d=r?l:a[l],c=m[d],c==null)continue;f.push(d)}let _;if(!Array.isArray(c)){var g,T;Ee(c)||B(!1,`Invalid AST Node: ${ae(c)}.`);const A=v?(g=i.get(c.kind))===null||g===void 0?void 0:g.leave:(T=i.get(c.kind))===null||T===void 0?void 0:T.enter;if(_=A?.call(t,c,d,m,f,I),_===$t)break;if(_===!1){if(!v){f.pop();continue}}else if(_!==void 0&&(h.push([d,_]),!v))if(Ee(_))c=_;else{f.pop();continue}}if(_===void 0&&ue&&h.push([d,c]),v)f.pop();else{var Y;s={inArray:r,index:l,keys:a,edits:h,prev:s},r=Array.isArray(c),a=r?c:(Y=n[c.kind])!==null&&Y!==void 0?Y:[],l=-1,h=[],m&&I.push(m),m=c}}while(s!==void 0);return h.length!==0?h[h.length-1][1]:e}function Ut(e,t){const n=e[t];return typeof n=="object"?n:typeof n=="function"?{enter:n,leave:void 0}:{enter:e.enter,leave:e.leave}}function Bt(e){return Mt(e,jt)}const Vt=80,jt={Name:{leave:e=>e.value},Variable:{leave:e=>"$"+e.name},Document:{leave:e=>u(e.definitions,`

`)},OperationDefinition:{leave(e){const t=y("(",u(e.variableDefinitions,", "),")"),n=u([e.operation,u([e.name,t]),u(e.directives," ")]," ");return(n==="query"?"":n+" ")+e.selectionSet}},VariableDefinition:{leave:({variable:e,type:t,defaultValue:n,directives:i})=>e+": "+t+y(" = ",n)+y(" ",u(i," "))},SelectionSet:{leave:({selections:e})=>x(e)},Field:{leave({alias:e,name:t,arguments:n,directives:i,selectionSet:s}){const r=y("",e,": ")+t;let a=r+y("(",u(n,", "),")");return a.length>Vt&&(a=r+y(`(
`,V(u(n,`
`)),`
)`)),u([a,u(i," "),s]," ")}},Argument:{leave:({name:e,value:t})=>e+": "+t},FragmentSpread:{leave:({name:e,directives:t})=>"..."+e+y(" ",u(t," "))},InlineFragment:{leave:({typeCondition:e,directives:t,selectionSet:n})=>u(["...",y("on ",e),u(t," "),n]," ")},FragmentDefinition:{leave:({name:e,typeCondition:t,variableDefinitions:n,directives:i,selectionSet:s})=>`fragment ${e}${y("(",u(n,", "),")")} on ${t} ${y("",u(i," ")," ")}`+s},IntValue:{leave:({value:e})=>e},FloatValue:{leave:({value:e})=>e},StringValue:{leave:({value:e,block:t})=>t?dt(e):Pt(e)},BooleanValue:{leave:({value:e})=>e?"true":"false"},NullValue:{leave:()=>"null"},EnumValue:{leave:({value:e})=>e},ListValue:{leave:({values:e})=>"["+u(e,", ")+"]"},ObjectValue:{leave:({fields:e})=>"{"+u(e,", ")+"}"},ObjectField:{leave:({name:e,value:t})=>e+": "+t},Directive:{leave:({name:e,arguments:t})=>"@"+e+y("(",u(t,", "),")")},NamedType:{leave:({name:e})=>e},ListType:{leave:({type:e})=>"["+e+"]"},NonNullType:{leave:({type:e})=>e+"!"},SchemaDefinition:{leave:({description:e,directives:t,operationTypes:n})=>y("",e,`
`)+u(["schema",u(t," "),x(n)]," ")},OperationTypeDefinition:{leave:({operation:e,type:t})=>e+": "+t},ScalarTypeDefinition:{leave:({description:e,name:t,directives:n})=>y("",e,`
`)+u(["scalar",t,u(n," ")]," ")},ObjectTypeDefinition:{leave:({description:e,name:t,interfaces:n,directives:i,fields:s})=>y("",e,`
`)+u(["type",t,y("implements ",u(n," & ")),u(i," "),x(s)]," ")},FieldDefinition:{leave:({description:e,name:t,arguments:n,type:i,directives:s})=>y("",e,`
`)+t+(Te(n)?y(`(
`,V(u(n,`
`)),`
)`):y("(",u(n,", "),")"))+": "+i+y(" ",u(s," "))},InputValueDefinition:{leave:({description:e,name:t,type:n,defaultValue:i,directives:s})=>y("",e,`
`)+u([t+": "+n,y("= ",i),u(s," ")]," ")},InterfaceTypeDefinition:{leave:({description:e,name:t,interfaces:n,directives:i,fields:s})=>y("",e,`
`)+u(["interface",t,y("implements ",u(n," & ")),u(i," "),x(s)]," ")},UnionTypeDefinition:{leave:({description:e,name:t,directives:n,types:i})=>y("",e,`
`)+u(["union",t,u(n," "),y("= ",u(i," | "))]," ")},EnumTypeDefinition:{leave:({description:e,name:t,directives:n,values:i})=>y("",e,`
`)+u(["enum",t,u(n," "),x(i)]," ")},EnumValueDefinition:{leave:({description:e,name:t,directives:n})=>y("",e,`
`)+u([t,u(n," ")]," ")},InputObjectTypeDefinition:{leave:({description:e,name:t,directives:n,fields:i})=>y("",e,`
`)+u(["input",t,u(n," "),x(i)]," ")},DirectiveDefinition:{leave:({description:e,name:t,arguments:n,repeatable:i,locations:s})=>y("",e,`
`)+"directive @"+t+(Te(n)?y(`(
`,V(u(n,`
`)),`
)`):y("(",u(n,", "),")"))+(i?" repeatable":"")+" on "+u(s," | ")},SchemaExtension:{leave:({directives:e,operationTypes:t})=>u(["extend schema",u(e," "),x(t)]," ")},ScalarTypeExtension:{leave:({name:e,directives:t})=>u(["extend scalar",e,u(t," ")]," ")},ObjectTypeExtension:{leave:({name:e,interfaces:t,directives:n,fields:i})=>u(["extend type",e,y("implements ",u(t," & ")),u(n," "),x(i)]," ")},InterfaceTypeExtension:{leave:({name:e,interfaces:t,directives:n,fields:i})=>u(["extend interface",e,y("implements ",u(t," & ")),u(n," "),x(i)]," ")},UnionTypeExtension:{leave:({name:e,directives:t,types:n})=>u(["extend union",e,u(t," "),y("= ",u(n," | "))]," ")},EnumTypeExtension:{leave:({name:e,directives:t,values:n})=>u(["extend enum",e,u(t," "),x(n)]," ")},InputObjectTypeExtension:{leave:({name:e,directives:t,fields:n})=>u(["extend input",e,u(t," "),x(n)]," ")}};function u(e,t=""){var n;return(n=e?.filter(i=>i).join(t))!==null&&n!==void 0?n:""}function x(e){return y(`{
`,V(u(e,`
`)),`
}`)}function y(e,t,n=""){return t!=null&&t!==""?e+t+n:""}function V(e){return y("  ",e.replace(/\n/g,`
  `))}function Te(e){var t;return(t=e?.some(n=>n.includes(`
`)))!==null&&t!==void 0?t:!1}const Ne="Accept",ne="Content-Type",se="application/json",$e="application/graphql-response+json",Ie=e=>e.replace(/([\s,]|#[^\n\r]+)+/g," ").trim(),Gt=e=>{const t=e.toLowerCase();return t.includes($e)||t.includes(se)},be=e=>{try{if(Array.isArray(e))return{_tag:"Batch",executionResults:e.map(xe)};if(U(e))return{_tag:"Single",executionResult:xe(e)};throw new Error(`Invalid execution result: result is not object or array. 
Got:
${String(e)}`)}catch(t){return t}},xe=e=>{if(typeof e!="object"||e===null)throw new Error("Invalid execution result: result is not object");let t,n,i;if("errors"in e){if(!U(e.errors)&&!Array.isArray(e.errors))throw new Error("Invalid execution result: errors is not plain object OR array");t=e.errors}if("data"in e){if(!U(e.data)&&e.data!==null)throw new Error("Invalid execution result: data is not plain object");n=e.data}if("extensions"in e){if(!U(e.extensions))throw new Error("Invalid execution result: extensions is not plain object");i=e.extensions}return{data:n,errors:t,extensions:i}},Yt=e=>e._tag==="Batch"?e.executionResults.some(ve):ve(e.executionResult),ve=e=>Array.isArray(e.errors)?e.errors.length>0:!!e.errors,Me=e=>typeof e=="object"&&e!==null&&"kind"in e&&e.kind===p.OPERATION_DEFINITION,Ht=e=>{let t;const n=e.definitions.filter(Me);return n.length===1&&(t=n[0].name?.value),t},Qt=e=>{let t=!1;const n=e.definitions.filter(Me);return n.length===1&&(t=n[0].operation===S.MUTATION),t},J=(e,t)=>{const n=typeof e=="string"?e:Bt(e);let i=!1,s;if(t)return{expression:n,isMutation:i,operationName:s};const r=Xe(()=>typeof e=="string"?Rt(e):e);return r instanceof Error?{expression:n,isMutation:i,operationName:s}:(s=Ht(r),i=Qt(r),{expression:n,operationName:s,isMutation:i})},ce=JSON,W=async e=>{const t={...e,method:e.request._tag==="Single"?e.request.document.isMutation?"POST":he(e.method??"post"):e.request.hasMutations?"POST":he(e.method??"post"),fetchOptions:{...e.fetchOptions,errorPolicy:e.fetchOptions.errorPolicy??"none"}},i=await Jt(t.method)(t);if(!i.ok)return new w({status:i.status,headers:i.headers},{query:e.request._tag==="Single"?e.request.document.expression:e.request.query,variables:e.request.variables});const s=await zt(i,e.fetchOptions.jsonSerializer??ce);if(s instanceof Error)throw s;const r={status:i.status,headers:i.headers};if(Yt(s)&&t.fetchOptions.errorPolicy==="none"){const a=s._tag==="Batch"?{...s.executionResults,...r}:{...s.executionResult,...r};return new w(a,{query:e.request._tag==="Single"?e.request.document.expression:e.request.query,variables:e.request.variables})}switch(s._tag){case"Single":return{...r,..._e(t)(s.executionResult)};case"Batch":return{...r,data:s.executionResults.map(_e(t))};default:re(s)}},_e=e=>t=>({extensions:t.extensions,data:t.data,errors:e.fetchOptions.errorPolicy==="all"?t.errors:void 0}),zt=async(e,t)=>{const n=e.headers.get(ne),i=await e.text();return n&&Gt(n)?be(t.parse(i)):be(i)},Jt=e=>async t=>{const n=new Headers(t.headers);let i=null,s;n.has(Ne)||n.set(Ne,[$e,se].join(", ")),e==="POST"?(s=(t.fetchOptions.jsonSerializer??ce).stringify(Wt(t)),typeof s=="string"&&!n.has(ne)&&n.set(ne,se)):i=Xt(t);const r={method:e,headers:n,body:s,...t.fetchOptions};let a=new URL(t.url),l=r;if(t.middleware){const c=await Promise.resolve(t.middleware({...r,url:t.url,operationName:t.request._tag==="Single"?t.request.document.operationName:void 0,variables:t.request.variables})),{url:d,...m}=c;a=new URL(d),l=m}return i&&i.forEach((c,d)=>{a.searchParams.append(d,c)}),await(t.fetch??fetch)(a,l)},Wt=e=>{switch(e.request._tag){case"Single":return{query:e.request.document.expression,variables:e.request.variables,operationName:e.request.document.operationName};case"Batch":return Oe(e.request.query,e.request.variables??[]).map(([t,n])=>({query:t,variables:n}));default:throw re(e.request)}},Xt=e=>{const t=e.fetchOptions.jsonSerializer??ce,n=new URLSearchParams;switch(e.request._tag){case"Single":return n.append("query",Ie(e.request.document.expression)),e.request.variables&&n.append("variables",t.stringify(e.request.variables)),e.request.document.operationName&&n.append("operationName",e.request.document.operationName),n;case"Batch":{const i=e.request.variables?.map(a=>t.stringify(a))??[],s=e.request.query.map(Ie),r=Oe(s,i).map(([a,l])=>({query:a,variables:l}));return n.append("query",t.stringify(r)),n}default:throw re(e.request)}};class Zt{url;requestConfig;constructor(t,n={}){this.url=t,this.requestConfig=n}rawRequest=async(...t)=>{const[n,i,s]=t,r=et(n,i,s),{headers:a,fetch:l=globalThis.fetch,method:h="POST",requestMiddleware:c,responseMiddleware:d,excludeOperationName:m,...f}=this.requestConfig,{url:I}=this;r.signal!==void 0&&(f.signal=r.signal);const g=J(r.query,m),T=await W({url:I,request:{_tag:"Single",document:g,variables:r.variables},headers:{...R(Q(a)),...R(r.requestHeaders)},fetch:l,method:h,fetchOptions:f,middleware:c});if(d&&await d(T,{operationName:g.operationName,variables:i,url:this.url}),T instanceof Error)throw T;return T};async request(t,...n){const[i,s]=n,r=Kt(t,i,s),{headers:a,fetch:l=globalThis.fetch,method:h="POST",requestMiddleware:c,responseMiddleware:d,excludeOperationName:m,...f}=this.requestConfig,{url:I}=this;r.signal!==void 0&&(f.signal=r.signal);const g=J(r.document,m),T=await W({url:I,request:{_tag:"Single",document:g,variables:r.variables},headers:{...R(Q(a)),...R(r.requestHeaders)},fetch:l,method:h,fetchOptions:f,middleware:c});if(d&&await d(T,{operationName:g.operationName,variables:r.variables,url:this.url}),T instanceof Error)throw T;return T.data}async batchRequests(t,n){const i=Ke(t,n),{headers:s,excludeOperationName:r,...a}=this.requestConfig;i.signal!==void 0&&(a.signal=i.signal);const l=i.documents.map(({document:f})=>J(f,r)),h=l.map(({expression:f})=>f),c=l.some(({isMutation:f})=>f),d=i.documents.map(({variables:f})=>f),m=await W({url:this.url,request:{_tag:"Batch",operationName:void 0,query:h,hasMutations:c,variables:d},headers:{...R(Q(s)),...R(i.requestHeaders)},fetch:this.requestConfig.fetch??globalThis.fetch,method:this.requestConfig.method||"POST",fetchOptions:a,middleware:this.requestConfig.requestMiddleware});if(this.requestConfig.responseMiddleware&&await this.requestConfig.responseMiddleware(m,{operationName:void 0,variables:d,url:this.url}),m instanceof Error)throw m;return m.data}setHeaders(t){return this.requestConfig.headers=t,this}setHeader(t,n){const{headers:i}=this.requestConfig;return i?i[t]=n:this.requestConfig.headers={[t]:n},this}setEndpoint(t){return this.url=t,this}}const Kt=(e,t,n)=>e.document?e:{document:e,variables:t,requestHeaders:n,signal:void 0},E=(e,...t)=>e.reduce((n,i,s)=>`${n}${i}${s in t?String(t[s]):""}`,""),Ae=je({enabled:!0,namespace:"@iheartradio/web.api/webapi",pretty:!0}),en=E`
  query ArtistInterviewsContent($id: Int!) {
    artist(artistId: $id) {
      content(num: 10, offset: 0, categories: ["categories/interviews"]) {
        slug
        pub_start
        summary {
          image
          title
          description
        }
      }
    }
  }
`,tn=e=>{const{id:t}=e;return{document:en,variables:{id:t}}},nn=E`
  query ArtistNewsContent($id: Int!) {
    artist(artistId: $id) {
      content(num: 10, offset: 0, categories: ["categories/music-news"]) {
        slug
        pub_start
        summary {
          image
          title
          description
        }
      }
    }
  }
`,sn=e=>{const{id:t}=e;return{document:nn,variables:{id:t}}},rn=E`
  query SpotlightCarousels($id: ID!) {
    carousels {
      __typename
      byId(id: $id) {
        __typename
        id
        titleColor
        subtitleColor
        metadata {
          __typename
          title
          subtitle
          description
          image
          locales
          mobileUrl
          webUrl
        }
        catalogItems {
          __typename
          id
          record {
            __typename
            ... on CatalogRecordCommonFields {
              id
              name
              kind
              img
              device_link
            }
            ... on CatalogStation {
              description
            }
            ... on CatalogAlbum {
              amp {
                artistId
              }
            }
            ... on CatalogTrack {
              amp {
                artistId
                albumId
              }
            }
          }
        }
        linkedCarousels {
          __typename
          id
          titleColor
          subtitleColor
          metadata {
            __typename
            title
            subtitle
            description
            image
            locales
            mobileUrl
            webUrl
          }
          catalogItems {
            __typename
            id
            record {
              __typename
              ... on CatalogRecordCommonFields {
                id
                name
                kind
                img
                device_link
              }
              ... on CatalogStation {
                description
              }
              ... on CatalogAlbum {
                amp {
                  artistId
                }
              }
              ... on CatalogTrack {
                amp {
                  artistId
                  albumId
                }
              }
            }
          }
        }
      }
    }
  }
`,on=e=>{const{id:t}=e;return{document:rn,variables:{id:t}}},an=E`
  query Trending($tags: [String!]!) {
    pubsub {
      query(
        type: "content:trending"
        query: { limit: 1, subscription: [{ tags: $tags }] }
      ) {
        items {
          content {
            __typename
            ... on PubsubContentTrendingPayloadSelection {
              data {
                trending {
                  image {
                    public_uri
                  }
                  title
                  link
                  mobile_link
                }
              }
            }
          }
        }
      }
    }
  }
`,cn=e=>{const{tags:t}=e;return{document:an,variables:{tags:t}}},un=E`
  query GetArtistStationContests($artistId: String!) {
    aptivada(accountId: "") {
      campaigns(tag: $artistId) {
        accountName
        appId
        gridImage
        gridRedirect
        idExternal
        pageUrl
        scheduleStatus
        title
      }
    }
  }
`,ln=({artistId:e})=>({document:un,variables:{artistId:e}}),dn=E`
  query GetLiveStationContests($accountId: String!) {
    aptivada(accountId: $accountId) {
      apps {
        appId
        appType
        displayImage
        gridImage
        gridRedirect
        gridStatus
        pageUrl
        primaryImage
        prize
        scheduleStatus
        shareTitle
        subtitle
        thumbnailImage
        title
      }
    }
  }
`,pn=({accountId:e})=>({document:dn,variables:{accountId:e}});var C=(e=>(e.FeaturedPodcasts="collections/featured-podcasts",e.PlaylistDirectory="collections/playlist-directory",e.PlaylistGenres="collections/genre-playlists",e.PodcastCategories="collections/podcast-categories",e.PodcastDirectory="collections/podcast-directory",e.PopularPodcasts="collections/popular-podcasts",e.PodcastNetworks="collections/podcast-networks",e.PlaylistDecades="collections/decades",e.PlaylistActivities="collections/perfect-for",e))(C||{}),Ue=(e=>(e.FeaturedPlaylists="facets/featured-playlists",e.Decades="facets/decades",e.MoodsActivities="facets/moods-activities",e))(Ue||{});const k=E`
  fragment commonCardFields on Card {
    catalog {
      id
    }
    id
    img_uri
    link {
      urls {
        web
        device
      }
    }
    subtitle
    title
  }
`,hn=E`
  ${k}

  query FeaturedPlaylists($query: QueryInput!, $locale: String) {
    featured_playlists: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,fn=e=>{const{countryCode:t,locale:n,limit:i}=e;return{document:hn,variables:{locale:n,query:{limit:i,subscription:[{tags:[Ue.FeaturedPlaylists,`countries/${t}`]}]}}}},mn=E`
  ${k}

  query FeaturedPodcasts($query: QueryInput!, $locale: String) {
    featured_podcasts: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,yn=e=>{const{countryCode:t,locale:n,limit:i}=e;return{document:mn,variables:{locale:n,query:{limit:i,subscription:[{tags:[C.FeaturedPodcasts,`countries/${t}`]}]}}}},En=E`
  ${k}

  query Leads($query: QueryInput!, $locale: String) {
    leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,gn=e=>({document:En,variables:e}),Tn=E`
  ${k}

  query PlaylistDirectory($query: QueryInput!, $locale: String) {
    playlist_directory: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,Nn=e=>{const{countryCode:t,facet:n,locale:i,limit:s}=e;return{document:Tn,variables:{locale:i,query:{limit:s,subscription:[{tags:[C.PlaylistDirectory,`countries/${t}`,n]}]}}}},ts=q({playlist_subdirectory:ze(q({id:O(),img_uri:O().nullable(),subtitle:O().nullable(),title:O(),catalog:q({id:O(),isPremium:Je().nullable().optional()}),link:q({urls:q({web:O(),device:O().nullable().optional()})})}))}),In=E`
  ${k}

  query PlaylistSubdirectory($query: QueryInput!, $locale: String) {
    playlist_subdirectory: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,bn=e=>{const{countryCode:t,category:n,subcategory:i,locale:s,limit:r}=e;return{document:In,variables:{locale:s,query:{limit:r,subscription:[{tags:[C.PlaylistGenres,`countries/${t}`,`${n}/${i}`]}]}}}},xn=E`
  query PodcastNetworks($query: QueryInput!, $locale: String) {
    podcast_networks: leads(query: $query, locale: $locale) {
      title
      img_uri
      link {
        urls {
          web
          device
        }
      }
    }
  }
`,vn=e=>{const{countryCode:t,locale:n,limit:i}=e;return{document:xn,variables:{locale:n,query:{limit:i,subscription:[{tags:[C.PodcastNetworks,`countries/${t}`]}]}}}},_n=E`
  ${k}

  query PodcastTopics($query: QueryInput!, $locale: String) {
    podcast_topics: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,An=e=>{const{countryCode:t,locale:n,limit:i}=e;return{document:_n,variables:{locale:n,query:{limit:i,subscription:[{tags:[C.PodcastDirectory,`countries/${t}`]}]}}}},On=E`
  ${k}

  query PopularPodcasts($query: QueryInput!, $locale: String) {
    popular_podcasts: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`,Sn=e=>{const{countryCode:t,locale:n,limit:i}=e;return{document:On,variables:{locale:n,query:{limit:i,subscription:[{tags:[C.PopularPodcasts,`countries/${t}`]}]}}}},Dn=E`
  query streamInfo($id: Int!) {
    streams {
      streams {
        byId(id: $id) {
          recentlyPlayedEnabled
          amp {
            recentlyPlayed(paging: { take: 20 }) {
              tracks {
                artist {
                  artistName
                  id
                }
                startTime
                endTime
                title
                trackId
                albumId
                albumName
                trackDuration
                imagePath
                explicitLyrics
              }
            }
          }
        }
      }
    }
  }
`,Cn=e=>{const{id:t}=e;return{document:Dn,variables:{id:t}}},kn=e=>E`
  query PlaylistsDirectoriesItems($tags: [String!]!, $countries: [String!]!) {
    playlists {
      directories {
        list(
          args: {
            countries: $countries
            tags: $tags
            tagMatchType: EXACT
            take: 10
          }
        ) {
          items {
            id
            metadata {
              title
              subtitle
              imageUrl
              locales
            }
            children {
              id
              metadata(locales: "locales/${e}") {
                title
                subtitle
                imageUrl
              }
              resource {
                ... on PlaylistsPlaylistRecord {
                  title
                  description
                  author
                  urlImage
                  publishedUserId
                  publishedPlaylistId
                }
              }
            }
          }
        }
      }
    }
  }
`,Rn=e=>{const{countryCode:t,locale:n,tags:i}=e;let s=[];return i&&i.length>0?s=i:s.push("collections/playlist-directory","facets/featured-playlists"),{document:kn(n),variables:{tags:[...s],countries:[`countries/${t}`]}}},wn=e=>E`
  query PlaylistsDirectoriesMoodsGenres($countries: [String!]!) {
    playlists {
      directories {
        moods:list(args: { countries: $countries, tags: ["collections/playlist-directory", "collections/perfect-for"], tagMatchType: EXACT }) {
          items {
            id
            metadata (locales: "locales/${e}"){
              title
              locales
            }
            tags
            children {
              id
              tags
              metadata {
                title
                locales
              }
            }
          }
        }
        genres:list(args: {  countries: $countries, tags: ["collections/playlist-directory", "collections/genre-playlists"], tagMatchType: EXACT }) {
          items {
            id
            tags
            metadata (locales: "locales/${e}"){
              title
              locales
            }
            tags
            children {
              id
              tags
              metadata {
                title
                locales
              }
            }
          }
        }
      }
    }
  }
`,Pn=e=>{const{countryCode:t,locale:n}=e;return{document:wn(n),variables:{countries:[`countries/${t}`]}}},qn=E`
  query PodcastTranscription($episodeId: Int!) {
    podcastTranscriptionFormatter {
      format(
        episodeId: $episodeId
        options: {
          outputFormat: HTML
          stripNewlines: true
          collapseSpeakers: true
          includeTimes: true
          collapseTimes: true
          timeCollapseThreshold: 20
        }
      )
    }
  }
`,Ln=({episodeId:e})=>({document:qn,variables:{episodeId:e}}),Fn=e=>({document:E`
    query PolarisHomepageBanner($query: PubsubQueryInput!) {
      pubsub {
        query(type: "content:polaris-homepage-banner", query: $query) {
          items {
            content {
              ... on PubsubContentPolarisHomepageBannerPayloadSelection {
                data {
                  fields {
                    title {
                      value
                    }
                    small_image {
                      value {
                        public_uri
                      }
                    }
                    large_image {
                      value {
                        public_uri
                      }
                    }
                    background_color {
                      value
                    }
                    description {
                      value
                    }
                    link_text {
                      value
                    }
                    link {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,variables:e}),Be=E`
  fragment PublishRecord on PubsubPublishRecord {
    summary {
      title
      image
      description
    }
    payload
  }
`,$n=e=>{const t=e.map((i,s)=>`
        host${s}: get (
          type: "content:author"
          select: { id: "${i}" }
        ) {
        ...PublishRecord
      }`).join("");return{document:E`
    query GetPodcastHosts {
      pubsub {
        ${t}
      }
    }

    ${Be}  
  `,variables:{}}},Mn=e=>({document:E`
    query GetPodcastNews($query: PubsubQueryInput!) {
      pubsub {
        query(type: "content", query: $query) {
          items {
            ...PublishRecord
          }
        }
      }
    }

    ${Be}
  `,variables:{query:e}}),Un=E`
  # Write your query or mutation here
  query LiveProfile($streamId: String!, $timeZone: String) {
    sites {
      find(type: STREAM, value: $streamId) {
        onAirSchedule(timeZone: $timeZone) {
          current {
            ...scheduleFields
          }
          upcoming(take: 2) {
            ...scheduleFields
          }
        }
        canonicalHostname
        liveConfig {
          common {
            social {
              facebook: facebookName
              twitter: twitterName
              instagram: instagramName
              youtube: youtubeName
              snapchat: snapchatName
              pinterest: pinterestName
            }
            design {
              heroColor
              heroImage {
                asset {
                  href
                }
              }
            }
            contact {
              sms
              phone: requestPhone
            }
            partners {
              showIniHeartSwitch
            }
            content {
              podcasts {
                id
              }
              playlists {
                id
              }
            }
          }
          timeline: feed(
            params: { id: "USAGE:feed-usecases/Default Content", size: 10 }
          ) {
            results {
              type
              ... on SitesFeedPubsubResult {
                __typename
                record {
                  type
                  payload
                  slug
                  summary {
                    image
                    title
                  }
                }
              }
              ... on SitesFeedLeadsResult {
                ...leadFields
              }
            }
            resume {
              id
              from
              size
              context
              scopes
            }
          }
          leads: feed(
            params: { id: "USAGE:feed-usecases/Default Promotions", size: 10 }
          ) {
            results {
              ... on SitesFeedLeadsResult {
                ...leadFields
              }
            }
            resume {
              id
              from
              size
              context
              scopes
            }
          }
        }
      }
    }
  }

  fragment leadFields on SitesFeedLeadsResult {
    __typename
    record {
      title
      subtitle
      img_uri
      link {
        urls
      }
    }
  }

  fragment scheduleFields on SitesOnAirExtended {
    name
    coreShowId
    start: startTime12
    startMs
    stop: stopTime12
    stopMs
    destination {
      host
      thumbnail
      href
    }
  }
`,Bn=e=>{const{streamId:t,timeZone:n}=e;return{document:Un,variables:{streamId:t,timeZone:n}}},Vn=E`
  query PopularNews($slug: String!, $feedParams: SitesFeedResumeInput!) {
    sites {
      find(type: SLUG, value: $slug) {
        config: configByLookup(lookup: "site-config-lookups/live") {
          timeline: feed(params: $feedParams) {
            results {
              data
              type
            }
            resume {
              id
              context
              scopes
              size
              from
            }
          }
        }
      }
    }
  }
`,jn=e=>{const{slug:t="default",topic:n,size:i=12}=e;return{document:Vn,variables:{feedParams:n?{context:{"<topic>":n},id:"USAGE:feed-usecases/Default Topic",size:i}:{id:"USAGE:feed-usecases/Default Content",size:i},slug:t}}},Gn=E`
  query RecentlyPlayedEnabled($id: Int!) {
    streamsV2 {
      streams {
        byId(input: { id: $id }) {
          recently_played_enabled
        }
      }
    }
  }
`,Yn=e=>({document:Gn,variables:{id:e.id}}),Hn={artistContests:ln,artistInterviews:tn,artistNews:sn,leads:gn,homepageBanner:Fn,popularPodcasts:Sn,featuredPodcasts:yn,playlistDirectory:Nn,playlistDirectoriesItems:Rn,playlistDirectoriesMoodsGenres:Pn,playlistGenres:bn,featuredPlaylists:fn,podcastNetworks:vn,podcastTranscription:Ln,liveProfile:Bn,liveStationContests:pn,popularNews:jn,podcastTopics:An,podcastHosts:$n,podcastNews:Mn,recentlyPlayedEnabled:Yn,stream:Cn,trending:cn,spotlightContent:on},Qn=e=>{e&&!(e instanceof Error)&&"data"in e&&e?.data&&"extensions"in e&&e?.extensions&&"emits"in e?.extensions&&Reflect.set(e.data,"emits",e.extensions.emits)},zn=e=>{e.client??=new Zt(e.endpoint??"https://webapi.radioedit.iheart.com/graphql",{errorPolicy:"all",method:"GET",responseMiddleware:Qn});const{client:t}=e;return{queries:Hn,mutations:{},client:t,batchRequests:async(s,r)=>{const a=Object.entries(s),l=a.map(([c])=>c),h=a.map(([c,d])=>d);try{const c=await t.batchRequests({documents:h,...r,signal:AbortSignal.any([Z?AbortSignal.timeout(3e3):void 0,r?.signal].filter(pe))});return Object.fromEntries(c.map((m,f)=>[l[f],m]))}catch(c){throw c instanceof Error&&c.name==="AbortError"&&Ae.error("Request was aborted:",{...r,documents:h}),c}},request:async(s,r)=>{try{return await t.request({...r,signal:AbortSignal.any([Z?AbortSignal.timeout(3e3):void 0,r?.signal].filter(pe)),...s})}catch(a){throw a instanceof Error&&a.name==="AbortError"&&Ae.error("Request was aborted:",r),a}}}},Ve=F.createContext(null),Jn={};function ns(e){const t=Ge.c(8),{children:n,options:i}=e,s=i===void 0?Jn:i;let r;t[0]!==s?(r=()=>Wn(s),t[0]=s,t[1]=r):r=t[1];const[a,l]=F.useState(r),h=F.useRef(s);let c,d;t[2]!==s?(c=()=>{const{current:I}=h;Qe(s,I)||(h.current={...I,...s},l(ie(I)))},d=[s],t[2]=s,t[3]=c,t[4]=d):(c=t[3],d=t[4]),F.useEffect(c,d);const m=a;let f;return t[5]!==n||t[6]!==m?(f=Ye.jsx(Ve.Provider,{value:m,children:n}),t[5]=n,t[6]=m,t[7]=f):f=t[7],f}function ss(){const e=F.use(Ve);return He(e,"useWebApiClient must be used within WebApiClientProvider"),e}function ie(e={}){return zn(e)}let X;function Wn(e){return Z?ie(e):(X||(X=ie(e)),X)}export{ts as P,ns as W,Wn as g,ss as u};
//# sourceMappingURL=webapi-client-DOa4NTc_.js.map
