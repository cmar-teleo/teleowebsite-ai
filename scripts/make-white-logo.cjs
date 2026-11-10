// Writes public/brand/teleologo1-white.png: the brand logo with every pixel painted white, alpha kept.
// Run from the repo root: node scripts/make-white-logo.cjs
const sharp=require('sharp');
(async()=>{
 const src='public/brand/teleologo1.png';
 const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const px=(x,y)=>Array.from(data.slice((y*info.width+x)*4,(y*info.width+x)*4+4));
 console.log('corners',px(0,0),px(info.width-1,info.height-1),'centre',px(66,20));
 let opaque=0; for(let i=3;i<data.length;i+=4) if(data[i]>250) opaque++;
 console.log('opaque share',(opaque/(data.length/4)).toFixed(2));
 const out=Buffer.from(data);
 for(let i=0;i<out.length;i+=4){ out[i]=255;out[i+1]=255;out[i+2]=255 } // keep the file's own alpha, paint every pixel white
 await sharp(out,{raw:info}).png().toFile('public/brand/teleologo1-white.png');
 console.log('wrote white');
})()
