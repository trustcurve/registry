import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function read(folder){return fs.readdirSync(path.join(root,folder)).filter(f=>f.endsWith('.json')).sort().map(f=>{const record=JSON.parse(fs.readFileSync(path.join(root,folder,f),'utf8'));if(record.id!==f.slice(0,-5))throw Error('ID must match filename: '+f);return record;});}
export function check(value,schema,where){
 const t=value===null?'null':Array.isArray(value)?'array':typeof value;
 if(schema.type&&![schema.type].flat().includes(t))throw Error(where+': invalid type');
 if(schema.enum&&!schema.enum.includes(value))throw Error(where+': invalid value');
 if(t==='string'&&schema.minLength&&value.trim().length<schema.minLength)throw Error(where+': empty string');
 if(t==='array'){if(schema.minItems&&value.length<schema.minItems)throw Error(where+': missing items');value.forEach((v,i)=>check(v,schema.items,where+'['+i+']'));}
 if(t==='object'){
  for(const key of schema.required||[])if(!(key in value))throw Error(where+': missing '+key);
  for(const [key,v] of Object.entries(value)){if(!schema.properties?.[key]){if(schema.additionalProperties===false)throw Error(where+': unknown '+key);}else check(v,schema.properties[key],where+'.'+key);}
 }
}
function url(u){const parsed=new URL(u);if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password)throw Error('Unsafe URL: '+u);}
export function validate(){
 const sources=read('data/sources'),orgs=read('data/organizations');const ids=new Set(sources.map(s=>s.id));
 const schemas=Object.fromEntries(['source','organization'].map(n=>[n,JSON.parse(fs.readFileSync(path.join(root,'schemas',n+'.schema.json'),'utf8'))]));
 for(const s of sources){check(s,schemas.source,s.id);url(s.url);for(const k of ['published_at','accessed_at'])if(s[k]!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(s[k])||!Number.isFinite(Date.parse(s[k]))))throw Error(s.id+': invalid '+k);}
 const names=new Set();
 for(const o of orgs){check(o,schemas.organization,o.id);if(names.has(o.name.toLowerCase()))throw Error('Duplicate name: '+o.name);names.add(o.name.toLowerCase());if(o.website)url(o.website);const claims=new Set();for(const c of o.claims){if(claims.has(c.id))throw Error(o.id+': duplicate claim');claims.add(c.id);for(const id of c.source_ids)if(!ids.has(id))throw Error(o.id+': missing source '+id);}if(o.political_affiliation.status==='documented'&&!o.claims.some(c=>c.field==='political_affiliation'&&c.review_status==='reviewed'))throw Error(o.id+': affiliation requires reviewed evidence');}
 console.log(`Validated ${orgs.length} organizations and ${sources.length} sources.`);return {orgs,sources};
}
if(process.argv[1]===fileURLToPath(import.meta.url))validate();
