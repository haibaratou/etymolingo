# 漢字SURVIVOR の効果音・BGM・墨の素材をまとめて作る（numpy だけで生成）
import numpy as np, wave, os, math
from PIL import Image, ImageFilter
R=44100
OUT=os.path.join(os.path.dirname(__file__),'..','assets')
rng=np.random.default_rng(7)
def add(x,o,k):
    m=min(len(k),len(x)-o)
    if m>0:x[o:o+m]+=k[:m]
def save(name,x,rate=R):
    x=np.clip(x,-1,1);x=(x*32767*.9).astype(np.int16)
    with wave.open(os.path.join(OUT,'sfx',name+'.wav'),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(x.tobytes())
def env(n,a=.005,d=.3):
    t=np.arange(n)/R;e=np.minimum(1,t/a)*np.exp(-t/d);return e
def ks(f,dur,damp=.996,bright=.5):
    # Karplus-Strong（琴の撥弦）
    n=int(dur*R);N=max(2,int(R/f));buf=rng.uniform(-1,1,N)*bright+np.sign(rng.uniform(-1,1,N))*(1-bright)*.3
    out=np.zeros(n+N)
    for i in range(0,n,N):
        out[i:i+N]=buf; buf=damp*.5*(buf+np.roll(buf,-1))
    return out[:n]
from scipy.signal import lfilter
def lp(x,a=.2):
    return lfilter([a],[1,-(1-a)],x)
def noise(n):return rng.uniform(-1,1,n)
def bandnoise(n,a1,a2):return lp(noise(n),a1)-lp(noise(n),a2)*0
t=lambda d:np.arange(int(d*R))/R
# 打鍵: 筆先が紙に触れる小さな音
n=int(.05*R);x=lp(noise(n),.5)*env(n,.001,.012)*.5+np.sin(2*np.pi*2400*t(.05))*env(n,.001,.008)*.15;save('tick',x)
# 斬撃の琴（音程は再生側で五音音階にずらす）
x=ks(392,1.2,.9965,.6);x=x*env(len(x),.002,.5)*.9;h=np.sin(2*np.pi*784*t(1.2))*env(len(x),.002,.15)*.12;save('koto',x+h)
# 斬る音: 紙を裂く＋低い胴鳴り
n=int(.35*R);tear=lp(noise(n),.6)*env(n,.002,.06);body=np.sin(2*np.pi*(150*np.exp(-t(.35)*6))*t(.35))*env(n,.002,.12);save('slash',tear*.7+body*.8)
# 突進の風
n=int(.22*R);w=lp(noise(n),.15);w=w*np.sin(np.pi*np.arange(n)/n)**2;save('dash',w*1.4)
# 鈍い音
n=int(.2*R);save('thud',np.sin(2*np.pi*(110*np.exp(-t(.2)*5))*t(.2))*env(n,.002,.07)+lp(noise(n),.3)*env(n,.001,.03)*.4)
# 軽い墨はね
n=int(.09*R);save('soft',lp(noise(n),.35)*env(n,.001,.03)*.6)
# ミス: 墨がかすれる低音
n=int(.18*R);save('miss',(np.sign(np.sin(2*np.pi*95*t(.18)))*.3+lp(noise(n),.1)*.6)*env(n,.002,.07))
# 被弾
n=int(.45*R);save('hurt',(lp(noise(n),.2)*.9+np.sin(2*np.pi*(80*np.exp(-t(.45)*2))*t(.45))*.6)*env(n,.002,.15))
# 段位: 琴の分散和音（五音）
x=np.zeros(int(1.4*R))
for i,s in enumerate([0,4,7,12]):
    f=392*2**(s/12);k=ks(f,1.2,.997,.5)*env(int(1.2*R),.002,.6);o=int(i*.07*R);add(x,o,k*.5)
save('lv',x)
# 太鼓
n=int(.7*R);b=np.sin(2*np.pi*(72*np.exp(-t(.7)*1.5))*t(.7))*env(n,.002,.25);skin=lp(noise(n),.3)*env(n,.001,.02)*.5;save('taiko',b+skin)
# 大きな衝撃（銅鑼＋太鼓）
n=int(2.2*R);g=sum(np.sin(2*np.pi*f*t(2.2)+rng.uniform(0,6))*a for f,a in[(98,1),(147,.6),(233,.4),(311,.3),(415,.2)])*env(n,.01,.9)*.35
b=np.sin(2*np.pi*(55*np.exp(-t(2.2)*.8))*t(2.2))*env(n,.002,.5);save('boom',g+b*.8+lp(noise(n),.1)*env(n,.002,.3)*.3)
# 合体: 鈴と琴の上昇
x=np.zeros(int(2.6*R))
for i,s in enumerate([0,7,12,16,19,24]):
    f=196*2**(s/12);k=ks(f,1.6,.998,.4)*env(int(1.6*R),.002,.9);o=int(i*.06*R);add(x,o,k*.35)
bell=sum(np.sin(2*np.pi*f*t(2.6))*a for f,a in[(1568,.3),(2349,.2),(3136,.12)])*env(int(2.6*R),.003,.8)
add(x,0,bell*.6);o=int(.7*R);sw=lp(noise(int(1.2*R)),.08)*np.sin(np.pi*np.arange(int(1.2*R))/int(1.2*R))**2*.35;add(x,o,sw);save('fuse',x)
# 墨の粒を拾う（小さな鈴）
n=int(.12*R);save('xp',np.sin(2*np.pi*3136*t(.12))*env(n,.001,.03)*.35)
# 雷
n=int(.4*R);save('zap',(lp(noise(n),.7)*.7+np.sign(np.sin(2*np.pi*60*t(.4)))*.2)*env(n,.001,.12))
# 警告（拍子木）
x=np.zeros(int(.5*R));k=(lp(noise(int(.06*R)),.9)*.4+np.sin(2*np.pi*1800*t(.06))*.6)*env(int(.06*R),.0005,.015)
add(x,0,k);o=int(.18*R);add(x,o,k);save('warn',x)
# 印を押す
n=int(.25*R);save('stamp',np.sin(2*np.pi*(180*np.exp(-t(.25)*9))*t(.25))*env(n,.001,.05)+lp(noise(n),.4)*env(n,.001,.02)*.4)
# 筆で書く（漢詩が現れる）
n=int(1.0*R);br=lp(noise(n),.05)*(.6+.4*np.sin(2*np.pi*3*t(1.0)))*np.sin(np.pi*np.arange(n)/n);save('brush',br*1.6)
# 犬の噛みつき
n=int(.12*R);save('bite',(lp(noise(n),.5)*.6+np.sin(2*np.pi*420*t(.12))*.3)*env(n,.001,.035))

# ---- BGM（昼: 琴の間、夜: 低い持続音と鈴） ----
def loop(secs,penta,base,dens,seed,low):
    r=np.random.default_rng(seed);n=int(secs*R);x=np.zeros(n)
    drone=np.sin(2*np.pi*base/2*t(secs))*.05+np.sin(2*np.pi*base*1.5/2*t(secs))*.03
    if low: drone=drone*2+lp(noise(n),.002)*.25
    x+=drone*(0.7+0.3*np.sin(2*np.pi*t(secs)/secs))
    tt=0.4
    while tt<secs-2.2:
        s=r.choice(penta);oc=r.choice([0,12,12,24]);f=base*2**((s+oc)/12)
        k=ks(f,2.0,.9975,.45)*env(int(2.0*R),.002,.9)*r.uniform(.25,.45)
        o=int(tt*R);add(x,o,k)
        if r.random()<.3:
            k2=ks(f*1.5,1.5,.997,.4)*env(int(1.5*R),.002,.6)*.18;o2=o+int(.18*R);add(x,o2,k2)
        tt+=r.choice(dens)
    # 継ぎ目をなめらかに
    fade=int(1.5*R);x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
    return x*.8
save('bgm_day',loop(64,[0,2,4,7,9],196,[.6,.9,1.2,1.8,2.4],1,False),R)
save('bgm_night',loop(48,[0,1,5,7,8],110,[1.2,1.8,2.6,3.2],2,True),R)

# ---- 墨のにじみ（6種）: 薄い滲みの面＋縁の濃いたまり＋紙の繊維に沿ったにじみ＋飛沫 ----
def fbm(r,S,octs=((8,.5),(16,.3),(48,.2))):
    acc=np.zeros((S,S))
    for g,w in octs:
        acc+=np.array(Image.fromarray((r.random((g,g))*255).astype(np.uint8)).resize((S,S),Image.BICUBIC))/255*w
    return acc
def blot(seed,S=256):
    r=np.random.default_rng(seed+100);yy,xx=np.mgrid[0:S,0:S]/S-.5
    a=np.zeros((S,S))
    for i in range(r.integers(4,8)):
        cx,cy=r.normal(0,.07,2);rad=r.uniform(.07,.17)
        d=np.sqrt((xx-cx)**2+(yy-cy)**2);a=np.maximum(a,np.clip(1-d/rad,0,1))
    n=fbm(r,S);field=a*1.15-n*.55
    body=np.clip((field-.05)/.25,0,1)
    edge=np.exp(-((field-.08)/.05)**2)          # 縁のたまり
    fib=fbm(r,S,((64,.6),(128,.4)))
    halo=np.clip((field+.12-fib*.25)/.18,0,1)*(1-body)  # 繊維に沿った薄いにじみ
    al=body*.55+edge*.35+halo*.18
    for i in range(r.integers(8,18)):
        ang=r.uniform(0,6.28);dd=r.uniform(.24,.46);rad=r.uniform(.005,.02)
        cx,cy=math.cos(ang)*dd,math.sin(ang)*dd;d=np.sqrt((xx-cx)**2+(yy-cy)**2);al=np.maximum(al,np.clip(1-d/rad,0,1)**.3*.8)
    img=Image.fromarray((np.clip(al,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))
    rgba=np.zeros((S,S,4),np.uint8);rgba[...,0]=23;rgba[...,1]=20;rgba[...,2]=15;rgba[...,3]=np.array(img)
    Image.fromarray(rgba,'RGBA').save(os.path.join(OUT,'tex',f'stain{seed}.png'))
for s in range(6):blot(s)
# 筆の帯（見出しの背景）: 入りは濃く、払いはかすれる
W2,H2=1024,160;r=np.random.default_rng(11);yy,xx=np.mgrid[0:H2,0:W2]
top=12+np.cumsum(r.normal(0,.5,W2))*.6;top=top-top.min()+8
bot=H2-12-np.abs(np.cumsum(r.normal(0,.6,W2)))*.6
a=((yy>top[None,:])&(yy<bot[None,:])).astype(float)
a*=np.clip(xx/14,0,1)
bristle=np.array(Image.fromarray((r.random((H2//3,4))*255).astype(np.uint8)).resize((W2,H2),Image.BICUBIC))/255
tail=np.clip((xx-W2*.62)/(W2*.38),0,1)
a*=np.clip(1-(bristle>1-tail*0.75)*1.0,0,1)
a*=np.clip((W2-xx)/30,0,1)
img=Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.9))
rgba=np.zeros((H2,W2,4),np.uint8);rgba[...,:3]=255;rgba[...,3]=np.array(img);Image.fromarray(rgba,'RGBA').save(os.path.join(OUT,'tex','brush_band.png'))
# 落款（印の縁のかすれ）
S=192;r=np.random.default_rng(5);yy,xx=np.mgrid[0:S,0:S]
m=((xx>10)&(xx<S-10)&(yy>10)&(yy<S-10)).astype(float)
nz=np.array(Image.fromarray((r.random((S//6,S//6))*255).astype(np.uint8)).resize((S,S),Image.BICUBIC))/255
m*=np.clip(1.3-nz*.7,0,1)
inner=((xx>22)&(xx<S-22)&(yy>22)&(yy<S-22)).astype(float)
rgba=np.zeros((S,S,4),np.uint8);rgba[...,:3]=255;rgba[...,3]=(np.clip(m,0,1)*255).astype(np.uint8)
Image.fromarray(rgba,'RGBA').save(os.path.join(OUT,'tex','seal.png'))
print('done')

# ---- 梵鐘（決戦の怪物・野の鐘）: 倍音のずれた長い響きと、ゆっくりしたうなり ----
n=int(4.0*R);tt=t(4.0);g=np.zeros(n)
for f,amp,dec in [(98,1.0,2.2),(98*2.02,.55,1.6),(98*2.76,.4,1.1),(98*4.1,.25,.7),(98*5.43,.15,.45),(98*6.8,.08,.3)]:
    g+=amp*np.sin(2*np.pi*f*tt)*(1+.25*np.sin(2*np.pi*1.3*tt))*np.exp(-tt/dec)
strike=lp(noise(n),.4)*env(n,.001,.02)*.6
g=g*np.minimum(1,tt/.004)*.42+strike
save('gong',g)
