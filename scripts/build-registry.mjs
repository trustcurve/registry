import fs from 'node:fs';
import path from 'node:path';
import {root,validate} from './validate-data.mjs';
const {orgs,sources}=validate();const byId=new Map(sources.map(s=>[s.id,s]));
const records=orgs.map((o,i)=>{
 const funding=o.claims.find(c=>c.field==='funding'),policy=o.claims.find(c=>c.field==='policy_position');
 const r={id:i+1,slug:o.id,name:o.name,category:o.category,sourceCategory:o.category,description:o.summary,type:o.category,tags:[o.category],status:'Source review pending',visual:'evaluator',funding:'Funding not yet documented.',affiliation:'Not established. Funding does not imply political affiliation.',policy:policy?.statement||'No policy position documented.',orientation:'No unsourced political characterization included.'};
 if(funding){const source=byId.get(funding.source_ids[0]);r.fundingEvidence=funding.statement;r.fundingUrl=source.url;r.reviewedAt=source.accessed_at;}
 if(policy)r.policyUrl=byId.get(policy.source_ids[0]).url;
 return r;
});
fs.writeFileSync(path.join(root,'site/registry-data.js'),'const registryDataset = '+JSON.stringify({metadata:{total_entities_cataloged:records.length},records},null,2)+';\n');
console.log('Built site/registry-data.js');
