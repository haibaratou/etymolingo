/* Reviewed inflected forms for common nouns and adjectives.
   Explicit records only: no guessed plurals for mass nouns or comparisons for
   adjectives such as 'unique'. POS-gated to protect homographs. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root)root.EtymonNominalAdjectiveInflections=api;
})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const nouns={
child:'children',person:'people',man:'men',woman:'women',mouse:'mice',goose:'geese',foot:'feet',tooth:'teeth',ox:'oxen',
sheep:'sheep',deer:'deer',fish:'fish',species:'species',series:'series',aircraft:'aircraft',
book:'books',cat:'cats',dog:'dogs',house:'houses',box:'boxes',bus:'buses',class:'classes',dish:'dishes',church:'churches',
city:'cities',baby:'babies',family:'families',story:'stories',party:'parties',country:'countries',
leaf:'leaves',knife:'knives',wife:'wives',life:'lives',wolf:'wolves',shelf:'shelves',
potato:'potatoes',tomato:'tomatoes',hero:'heroes',photo:'photos',piano:'pianos',
analysis:'analyses',basis:'bases',crisis:'crises',phenomenon:'phenomena',criterion:'criteria',datum:'data',
index:'indexes / indices',appendix:'appendixes / appendices',cactus:'cacti / cactuses',
day:'days',year:'years',word:'words',picture:'pictures',image:'images',game:'games',language:'languages',
apple:'apples',tree:'trees',flower:'flowers',bird:'birds',car:'cars',door:'doors',room:'rooms',table:'tables',
student:'students',teacher:'teachers',friend:'friends',idea:'ideas',question:'questions',answer:'answers',
hand:'hands',eye:'eyes',ear:'ears',arm:'arms',leg:'legs',finger:'fingers',toe:'toes',
water:'waters',paper:'papers'
};
const adjectives={
good:['better','best'],well:['better','best'],bad:['worse','worst'],far:['farther / further','farthest / furthest'],
little:['less','least'],many:['more','most'],much:['more','most'],old:['older / elder','oldest / eldest'],
big:['bigger','biggest'],small:['smaller','smallest'],large:['larger','largest'],long:['longer','longest'],
short:['shorter','shortest'],high:['higher','highest'],low:['lower','lowest'],fast:['faster','fastest'],
slow:['slower','slowest'],hot:['hotter','hottest'],cold:['colder','coldest'],warm:['warmer','warmest'],
cool:['cooler','coolest'],new:['newer','newest'],young:['younger','youngest'],easy:['easier','easiest'],
happy:['happier','happiest'],busy:['busier','busiest'],heavy:['heavier','heaviest'],
pretty:['prettier','prettiest'],funny:['funnier','funniest'],early:['earlier','earliest'],
late:['later','latest'],nice:['nicer','nicest'],safe:['safer','safest'],wide:['wider','widest'],
close:['closer','closest'],deep:['deeper','deepest'],dark:['darker','darkest'],light:['lighter','lightest'],
bright:['brighter','brightest'],strong:['stronger','strongest'],weak:['weaker','weakest'],
rich:['richer','richest'],poor:['poorer','poorest'],clean:['cleaner','cleanest'],
quiet:['quieter','quietest'],simple:['simpler','simplest'],clever:['cleverer / more clever','cleverest / most clever'],
beautiful:['more beautiful','most beautiful'],important:['more important','most important'],
difficult:['more difficult','most difficult'],interesting:['more interesting','most interesting'],
expensive:['more expensive','most expensive'],careful:['more careful','most careful'],
useful:['more useful','most useful'],famous:['more famous','most famous'],
comfortable:['more comfortable','most comfortable'],popular:['more popular','most popular']
};
const parts=pos=>String(pos||'').split(/[\\/・,、\\s]+/).filter(Boolean);
function lookup(word,pos){
 const w=String(word||'').toLowerCase(),tags=parts(pos),out=[];
 if(tags.some(t=>['名','名詞','noun'].includes(t))&&Object.prototype.hasOwnProperty.call(nouns,w))
  out.push({category:'名詞',forms:[{label:'単数形',value:w},{label:'複数形',value:nouns[w]}]});
 if(tags.some(t=>['形','形容詞','adjective'].includes(t))&&Object.prototype.hasOwnProperty.call(adjectives,w))
  out.push({category:'形容詞',forms:[{label:'原級',value:w},{label:'比較級',value:adjectives[w][0]},{label:'最上級',value:adjectives[w][1]}]});
 return out;
}
return {lookup,nounCount:Object.keys(nouns).length,adjectiveCount:Object.keys(adjectives).length};
});
