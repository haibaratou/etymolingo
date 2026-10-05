# えいごのえ のカテゴリー(いらすとや式)。build.py が読む。
# 語は英単語のつづり(同じつづりが複数あるときは、よく使うほうの絵)。
# 特定の絵を指すときは 'see@sekw2' のように絵IDで書く。台帳に無い語は build.py が黙って外す。
# 初版は WordNet の自動分類を下書きにして、人の目で選び直したもの。

CATEGORIES = [
  ('animals', '動物', 'Animals', 'cat', [
    ('pets', 'ペット・家畜', 'Pets & farm', 'dog cat puppy rabbit pet horse cow pig sheep goat lamb calf cattle hen chicken duck goose mouse rat hamster'),
    ('wild', '野生の動物', 'Wild animals', 'lion elephant monkey wolf fox deer giraffe panda tiger zebra meerkat bat snake frog dinosaur kangaroo koala gorilla squirrel'),
    ('birds', '鳥', 'Birds', 'bird eagle owl crow hawk pigeon sparrow penguin parrot swan cormorant'),
    ('sea', '海・水の生き物', 'Sea life', 'fish shark octopus squid crab salmon trout eel mackerel turtle whale dolphin jellyfish prawn shellfish'),
    ('bugs', '虫', 'Bugs', 'fly insect butterfly ant spider mosquito cockroach mantis cicada worm beetle'),
    ('fantasy', 'おばけ・空想', 'Fantasy', 'dragon monster giant angel devil demon witch ghost'),
  ]),
  ('food', '食べ物', 'Food', 'apple', [
    ('meals', '料理・食事', 'Meals', 'food meal breakfast lunch dinner supper soup salad pizza sandwich pasta spaghetti steak hamburger sushi sashimi tempura croquette barbecue snack sausage bacon ham rice bread curry'),
    ('fruitveg', 'くだもの・野菜', 'Fruit & vegetables', 'fruit apple orange banana grape strawberry watermelon lemon peach cherry pineapple persimmon coconut vegetable tomato potato carrot onion cabbage cucumber pumpkin mushroom bean garlic ginger celery'),
    ('sweets', 'おかし・デザート', 'Sweets', 'cake chocolate candy cookie dessert pie jelly jam honey pastry'),
    ('drinks', '飲み物', 'Drinks', 'water milk tea juice coffee beer cocoa cocktail champagne whiskey'),
    ('cooking', '食材・調味料', 'Ingredients', 'meat beef pork egg cheese butter salt sugar pepper flour sauce vinegar syrup tofu dough'),
  ]),
  ('people', '人・家族', 'People & family', 'family', [
    ('family', '家族', 'Family', 'family mother father dad parent son wife husband grandmother grandfather uncle aunt cousin twin baby child children'),
    ('people', 'いろいろな人', 'People', 'man woman boy girl kid infant adult friend guest stranger neighbor partner lover bride hero student reader passenger customer people'),
    ('royal', '王さま・お話の人', 'Royalty & tales', 'king queen prince princess emperor knight lord gentleman'),
  ]),
  ('jobs', '仕事', 'Jobs', 'doctor', [
    ('care', '病院・くらしの仕事', 'Care & service', 'doctor nurse surgeon physician therapist caregiver veterinary waiter maid clerk secretary assistant attendant'),
    ('make', 'つくる仕事', 'Makers', 'farmer cook chef carpenter tailor engineer scientist inventor designer researcher craftsman shepherd hunter'),
    ('art', '芸術・スポーツの仕事', 'Arts & sports', 'artist singer musician actor actress photographer illustrator writer poet composer conductor performer player coach trainer'),
    ('public', '社会の仕事', 'Public jobs', 'police judge lawyer soldier captain pilot officer president mayor teacher professor detective firefighter driver manager boss worker'),
  ]),
  ('body', '体', 'Body', 'hand', [
    ('face', '顔', 'Face', 'face eye ear nose mouth lip tongue tooth cheek chin forehead eyebrow beard hair'),
    ('body', '体', 'Body', 'body hand arm leg foot feet@x knee elbow shoulder neck finger thumb fist palm wrist ankle toe heel nail back belly'),
    ('inside', '体の中', 'Inside the body', 'heart brain stomach lung liver kidney bone skeleton blood sweat'),
  ]),
  ('clothes', '服・おしゃれ', 'Clothes', 'dress', [
    ('wear', '服', 'Clothes', 'dress shirt T-shirt coat jacket sweater vest pants trousers shorts skirt uniform costume gown robe kimono pajamas underwear clothing'),
    ('acc', '帽子・くつ・小物', 'Accessories', 'hat cap helmet crown mask shoe sandal glove necklace jewelry ring belt glasses veil'),
  ]),
  ('home', '家・くらし', 'Home', 'house', [
    ('rooms', '家の中', 'Rooms', 'home house room kitchen bedroom bathroom toilet door window wall floor roof ceiling stairs garden garage'),
    ('furniture', '家具', 'Furniture', 'furniture bed chair desk table sofa couch bench stool shelf cabinet drawer curtain carpet lamp clock mirror pillow blanket cradle'),
    ('kitchen', '台所・食器', 'Kitchen', 'pot pan kettle oven stove fridge refrigerator freezer plate dish cup mug bottle jar fork spoon knife tray bucket vase pitcher'),
    ('bags', 'かばん・持ち物', 'Bags & things', 'bag backpack suitcase luggage wallet purse pocket umbrella towel candle key'),
  ]),
  ('things', '道具・もの', 'Things', 'computer', [
    ('tools', '道具', 'Tools', 'tool hammer rope wire chain hook ladder brick stick wheel lock needle thread fan net tape ink'),
    ('tech', '機械・電気', 'Machines', 'machine computer phone telephone television camera robot engine motor elevator button switch screen monitor battery speaker'),
    ('paper', '本・文房具', 'Books & stationery', 'book paper pen pencil card envelope map letter notebook calendar photo picture painting'),
  ]),
  ('vehicles', '乗り物', 'Vehicles', 'car', [
    ('road', '道を走る乗り物', 'On the road', 'car bus truck taxi ambulance bicycle bike motorcycle wagon cart train'),
    ('skysea', '空・海の乗り物', 'Sky & sea', 'plane aircraft helicopter boat ship yacht canoe submarine rocket'),
  ]),
  ('places', '建物・まち', 'Places', 'school', [
    ('buildings', '建物', 'Buildings', 'building school hospital library museum hotel restaurant station factory church temple castle palace tower office store bank theater cinema prison'),
    ('town', 'まち・道', 'Town', 'city street road bridge park tunnel gate fence corner highway countryside farm'),
  ]),
  ('nature', '自然', 'Nature', 'tree', [
    ('sky', '空・宇宙', 'Sky & space', 'sky sun moon star planet earth universe cloud'),
    ('land', '山・海・川', 'Land & water', 'mountain hill valley river sea ocean island beach coast desert cave cliff forest stone rocks sand'),
    ('plants', '植物・花', 'Plants', 'tree flower rose leaf grass seed bush bamboo moss bloom'),
    ('weather', '天気', 'Weather', 'weather rain snow storm typhoon fog mist wind sunshine'),
  ]),
  ('seasons', '季節・行事', 'Seasons & events', 'summer', [
    ('seasons', '季節', 'Seasons', 'spring summer autumn winter season'),
    ('time', '一日・時間', 'Time', 'morning noon afternoon evening night midnight dawn sunset day week month year today tomorrow yesterday weekend'),
    ('events', '行事・イベント', 'Events', 'birthday holiday vacation festival party wedding picnic ceremony celebration anniversary'),
  ]),
  ('play', 'スポーツ・遊び', 'Sports & play', 'ball', [
    ('sports', 'スポーツ', 'Sports', 'sport soccer baseball basketball golf football hockey judo sumo gymnastics swimming racing cycling curling'),
    ('play', '遊び', 'Play', 'game play cards ball toy fishing'),
  ]),
  ('arts', '音楽・芸術', 'Music & art', 'music', [
    ('music', '音楽', 'Music', 'music song melody piano guitar violin drum xylophone opera symphony karaoke concert'),
    ('art', '芸術', 'Art', 'art painting sketch portrait statue film'),
  ]),
  ('school', '学校・勉強', 'School', 'student', [
    ('school', '学校', 'School', 'school classroom class student teacher lesson homework test question answer study learning education graduate'),
    ('words', 'ことば・数', 'Words & numbers', 'word language letter story news one two three four five six ten hundred thousand'),
  ]),
  ('feelings', '気持ち', 'Feelings', 'smile', [
    ('good', 'うれしい気持ち', 'Good feelings', 'happy glad love joy hope pleasure delighted excitement enjoy smile laugh pride surprise thrill'),
    ('bad', 'かなしい・こわい気持ち', 'Hard feelings', 'sad cry angry anger fear afraid worried shock despair hate jealousy envy embarrassment disgust panic terrified lonely'),
  ]),
  ('actions', '動き', 'Actions', 'run', [
    ('move', '移動する', 'Moving', 'go come walk run jump swim climb fall dance arrive leave escape follow travel'),
    ('bodymove', '体の動き', 'Body', 'sit stand sleep wake breathe sigh nod grin stretch wash wear hug kick'),
    ('hand', '手でする', 'With hands', 'carry put throw catch push pull lift grab hang touch pack draw write'),
    ('eat', '食べる・飲む', 'Eat & drink', 'eat drink cook swallow'),
    ('talk', '話す・伝える', 'Talking', 'say talk tell ask answer call teach explain sing listen hear'),
    ('think', '考える・見る', 'Thinking', 'think know remember forget decide choose understand look see@sekw2 watch find discover'),
    ('life', 'くらし・はたらく', 'Daily life', 'help work buy sell give send build make repair clean marry'),
  ]),
  ('describe', 'ようす', 'Describing', 'big', [
    ('size', '大きさ・形', 'Size & shape', 'big large small little long tall high low heavy thick thin round flat full empty'),
    ('quality', 'ようす', 'How things are', 'new old hot cold warm cool fresh dry wet soft hard sweet beautiful strong fast slow quick quiet dangerous safe clean dirty rich poor'),
    ('colors', '色', 'Colors', 'red blue green yellow white black brown pink purple gray grey orange silver gold'),
  ]),
  ('society', '社会・お金', 'Society & money', 'money', [
    ('money', 'お金', 'Money', 'money cash coin price pay payment tax income budget'),
    ('society', '社会', 'Society', 'country nation world government law police army war team meeting community culture'),
  ]),
  ('basics', 'きほんのことば', 'Basic words', 'up', [
    ('place', '場所をあらわす', 'Where', 'in on under over above below between behind among across along through up down@dheue inside outside near far here there'),
    ('person', '人・もの', 'Who & what', 'I you he she we they it this that what who'),
  ]),
]

# 絵と合わない辞書の第一義を、表示用に差し替える
JA_OVERRIDE = {
  'key': '鍵', 'ball': 'ボール', 'card': 'カード', 'screen': '画面', 'mouse': 'ネズミ', 'fog': '霧',
  'peach': '桃', 'glove': '手袋', 'plate': '皿', 'net': '網', 'lock': '錠', 'dish': '料理・皿',
  'cards': 'トランプ', 'play': '遊ぶ', 'chicken': 'ニワトリ', 'turtle': 'カメ', 'bank': '銀行',
  'class': 'クラス・授業', 'fan': 'うちわ・扇風機', 'lights': '明かり', 'bat': 'コウモリ',
  'mum': 'お母さん', 'fly': 'ハエ', 'speaker': 'スピーカー', 'hide': '隠れる', 'store': '店', 'ring': '指輪', 'glasses': 'めがね',
}

# JA_OVERRIDE で差し替えた訳の読み(ひらがな検索用)
JA_KANA = {
  'key': 'かぎ', 'peach': 'もも', 'fog': 'きり', 'plate': 'さら', 'net': 'あみ', 'glove': 'てぶくろ',
  'lock': 'じょう', 'ring': 'ゆびわ', 'store': 'みせ', 'dish': 'りょうり、さら', 'bank': 'ぎんこう',
  'hide': 'かくれる', 'play': 'あそぶ', 'mum': 'おかあさん', 'class': 'くらす、じゅぎょう', 'lights': 'あかり',
}
