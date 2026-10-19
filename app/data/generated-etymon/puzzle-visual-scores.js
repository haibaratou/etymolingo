window.ETYMON_PUZZLE_VISUAL_SCORES={
  "schema": 1,
  "rubricVersion": "visual-answer-v1",
  "scale": 100,
  "titleJa": "絵から英単語を推測できる度合い",
  "method": "AI visual review of actual GitHub image pixels; not measured player accuracy",
  "assumptionsJa": "英単語自体は知っている人が、語義・文字数・選択肢なしで絵だけを見て答える条件。出現頻度や英語学習難易度は点数に含めない。",
  "rubric": [
    {
      "key": "meaningVisible",
      "max": 40,
      "ja": "狙った意味・動作が絵から直接読める"
    },
    {
      "key": "conceptDistinct",
      "max": 25,
      "ja": "別の物や行為との取り違えが少ない"
    },
    {
      "key": "answerSpecific",
      "max": 25,
      "ja": "英語の類義語・品詞違いなどに答えが分散しにくい"
    },
    {
      "key": "smallImageReadable",
      "max": 10,
      "ja": "小さな表示でも主役と手掛かりを読み取れる"
    }
  ],
  "bands": [
    {
      "min": 85,
      "ja": "推測しやすい"
    },
    {
      "min": 70,
      "ja": "比較的推測しやすい"
    },
    {
      "min": 50,
      "ja": "ヒントが欲しい"
    },
    {
      "min": 25,
      "ja": "答えが分かれやすい"
    },
    {
      "min": 0,
      "ja": "絵だけでは困難"
    }
  ],
  "unreviewedPolicy": "null score; never infer a score from OK status, caption, rank, or update date",
  "entries": [
    {
      "id": "car",
      "w": "car",
      "p": [
        "kers-2"
      ],
      "imagePath": "assets/word/car.png",
      "imageGitBlobSha": "943b3f74b32b861292cecc490097f42f01e7409c",
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "車そのものが大きく描かれ、形も明瞭。automobile以外の答えに分かれにくい。",
      "alternativeAnswersEn": [
        "automobile"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "one",
      "w": "one",
      "p": [
        "oi-no-"
      ],
      "imagePath": "assets/word/one.png",
      "imageGitBlobSha": "b9917c166f8e17c414f889bcd568fc8a8b434915",
      "score": 37,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "洋梨が主役に見える。個数を問う手掛かりがなく、oneよりpearを答えやすい。",
      "alternativeAnswersEn": [
        "pear",
        "fruit"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "other",
      "w": "other",
      "p": [
        "al-1"
      ],
      "imagePath": "assets/word/other.png",
      "imageGitBlobSha": "ffe4b5b3342604e2f775b7555270604938840476",
      "score": 31,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "左右の帽子を比べているが、『別の』を特定できる対比や文脈が足りない。",
      "alternativeAnswersEn": [
        "hat",
        "choose",
        "blue"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "time",
      "w": "time",
      "p": [
        "dā-"
      ],
      "imagePath": "assets/word/time.png",
      "imageGitBlobSha": "3e660d8a052d3d596196b5ae567aa76af1524b28",
      "score": 68,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "時間の象徴としては分かるが、具体物のhourglassやsandが先に浮かびやすい。",
      "alternativeAnswersEn": [
        "hourglass",
        "sand",
        "timer"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "some",
      "w": "some",
      "p": [
        "sem-1"
      ],
      "imagePath": "assets/word/some.png",
      "imageGitBlobSha": "881c46c5fe2f938469e7a6e6c51c548028cf6c61",
      "score": 31,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "いちごを取り分ける場面は読めるが、『いくつか』という数量表現に絞れない。",
      "alternativeAnswersEn": [
        "strawberry",
        "pick",
        "fruit"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "two",
      "w": "two",
      "p": [
        "dwo-"
      ],
      "imagePath": "assets/word/two.png",
      "imageGitBlobSha": "bcc81328294c2618585a48d159a2e8d3b89f73fe",
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "2個という数は明瞭。ただし個数を答える指定がないとpearsも有力になる。",
      "alternativeAnswersEn": [
        "pears",
        "pair",
        "fruit"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "see@sekw2",
      "w": "see",
      "p": [
        "sekʷ-2"
      ],
      "imagePath": "assets/word/see@sekw2.png",
      "imageGitBlobSha": "d6a0d856d596f32b3842a89b58db5db73bb5f663",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "目の近くに手を添えて蝶を見る動作。see・look・watchの区別は絵だけでは難しい。",
      "alternativeAnswersEn": [
        "look",
        "watch",
        "butterfly"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "such",
      "w": "such",
      "p": [
        "swo-",
        "līk-"
      ],
      "imagePath": "assets/word/such.png",
      "imageGitBlobSha": "3c67741e54a691577e72e0d70fe715a3bf584411",
      "score": 15,
      "components": {
        "meaningVisible": 5,
        "conceptDistinct": 0,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "同じカップを指しているだけで、suchに必要な『そのような』という文脈が伝わらない。",
      "alternativeAnswersEn": [
        "cup",
        "point",
        "three"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "back",
      "w": "back",
      "p": [],
      "imagePath": "assets/word/back.png",
      "imageGitBlobSha": "a7f0f1fd793c46afabceb7c8f42c34a6521ed657",
      "score": 82,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "人物の背面が中心でbackは連想しやすい。矢印はturnを示す可能性もある。",
      "alternativeAnswersEn": [
        "turn",
        "behind"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "people",
      "w": "people",
      "p": [],
      "imagePath": "assets/word/people.png",
      "imageGitBlobSha": "0c40c3a1007bcc8cb47ed4aa87be5acc9d5f9bd7",
      "score": 87,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "複数の人々が年齢や外見を変えて並び、peopleを推測しやすい。familyやgroupも候補。",
      "alternativeAnswersEn": [
        "group",
        "family"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "way",
      "w": "way",
      "p": [
        "wegh-"
      ],
      "imagePath": "assets/word/way.png",
      "imageGitBlobSha": "74e69e57c8ec62465b644c4d1c1b0122dd4e0b62",
      "score": 55,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "門まで続く道は見えるが、wayよりpath・garden・gateを答える余地が大きい。",
      "alternativeAnswersEn": [
        "path",
        "garden",
        "gate"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "know",
      "w": "know",
      "p": [
        "gnō-"
      ],
      "imagePath": "assets/word/know.png",
      "imageGitBlobSha": "f5aa5410c03d21d57cbe4644834e687addb67e62",
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "鍵で扉を開ける行為が主で、知っているという内面の状態は特定できない。",
      "alternativeAnswersEn": [
        "key",
        "open",
        "door"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "most",
      "w": "most",
      "p": [
        "mē-3"
      ],
      "imagePath": "assets/word/most.png",
      "imageGitBlobSha": "070d3cb32c7dcd57c15493a2b10fe4297f17fafe",
      "score": 50,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "赤いりんごが多数なのは分かるが、most・many・moreの違いを特定できない。",
      "alternativeAnswersEn": [
        "many",
        "apple",
        "more"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "down@dheue",
      "w": "down",
      "p": [
        "dheuə-"
      ],
      "imagePath": "assets/word/down@dheue.png",
      "imageGitBlobSha": "19c1b1d9fdea9d9f5c97d960c665ab5f2311d542",
      "score": 88,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "下向きの矢印と階段を下りる動作が一致し、downを読み取りやすい。",
      "alternativeAnswersEn": [
        "descend",
        "stairs"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "work",
      "w": "work",
      "p": [
        "werg-"
      ],
      "imagePath": "assets/word/work.png",
      "imageGitBlobSha": "24d7bc5e5a6c40d2120216adb28445d62d7e4cd1",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "木工作業は明確だが、workだけでなくcarpenter・wood・planeにも見える。",
      "alternativeAnswersEn": [
        "carpenter",
        "wood",
        "plane"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "new",
      "w": "new",
      "p": [
        "newo-"
      ],
      "imagePath": "assets/word/new.png",
      "imageGitBlobSha": "633d356c28bbab8581b3d316925fc629f0ece571",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "箱から出した光る靴が新品を示す。newは連想できるがshoesやbuyも自然な答え。",
      "alternativeAnswersEn": [
        "shoes",
        "buy",
        "gift"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "make",
      "w": "make",
      "p": [
        "mag-"
      ],
      "imagePath": "assets/word/make.png",
      "imageGitBlobSha": "5b12d957605ca24f9849b34ddb5fc862830ce026",
      "score": 54,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "陶芸の制作は分かるが、makeよりpot・pottery・clayという具体物に寄りやすい。",
      "alternativeAnswersEn": [
        "pottery",
        "pot",
        "clay"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "much",
      "w": "much",
      "p": [
        "meg-"
      ],
      "imagePath": "assets/word/much.png",
      "imageGitBlobSha": "08fc954a6ab04c70fdbedbcb620d139a8adaee46",
      "score": 37,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "大盛りの米は見えるが、muchという数量表現よりrice・bowl・fullが目立つ。",
      "alternativeAnswersEn": [
        "rice",
        "bowl",
        "full"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "use",
      "w": "use",
      "p": [
        "oit-"
      ],
      "imagePath": "assets/word/use.png",
      "imageGitBlobSha": "f3cfcb7a6d257ff3bca2c2087cb3775441b91b9e",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "工具を使う行為は見えるものの、useという汎用動詞よりrepair・toolを選びやすい。",
      "alternativeAnswersEn": [
        "repair",
        "tool",
        "stool"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "good",
      "w": "good",
      "p": [
        "ghedh-"
      ],
      "imagePath": "assets/word/good.png",
      "imageGitBlobSha": "75c32358dbb7430bd3c78ce3b42e932012b7cad4",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "財布を返す親切な行為だが、goodよりkind・help・returnを答える可能性が高い。",
      "alternativeAnswersEn": [
        "kind",
        "help",
        "return"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "man",
      "w": "man",
      "p": [
        "man-1"
      ],
      "imagePath": "assets/word/man.png",
      "imageGitBlobSha": "02a9d807cc2716fc353c3ab97efce5b57e87addb",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "男性が単独で大きく描かれている。manは有力だが若い外見なのでboyも候補。",
      "alternativeAnswersEn": [
        "boy",
        "person"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "long",
      "w": "long",
      "p": [
        "del-1"
      ],
      "imagePath": "assets/word/long.png",
      "imageGitBlobSha": "b2c146db09e75a6bae4abade18c1df0e94969957",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "長いマフラーを伸ばして見せており、長さは読み取れる。scarfとの競合が残る。",
      "alternativeAnswersEn": [
        "scarf",
        "length"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "different",
      "w": "different",
      "p": [],
      "imagePath": "assets/word/different.png",
      "imageGitBlobSha": "53aa2ba2a3e9edcf1c5673c40855a62add59f036",
      "score": 70,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "色と形が異なる2体の対比は明瞭。ただしdifferent以外にshape・square・circleも浮かぶ。",
      "alternativeAnswersEn": [
        "shape",
        "square",
        "circle"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "take",
      "w": "take",
      "p": [
        "tak-2"
      ],
      "imagePath": "assets/word/take.png",
      "imageGitBlobSha": "2891ace316335474ad908ab888409157b0587bb3",
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "クッキーを取る動作は見えるが、take・pick・eatのどれを意図するか絞りにくい。",
      "alternativeAnswersEn": [
        "pick",
        "eat",
        "cookie"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "think",
      "w": "think",
      "p": [
        "tong-"
      ],
      "imagePath": "assets/word/think.png",
      "imageGitBlobSha": "489d792c55c4dff3e14a476c6d566aa69f492488",
      "score": 87,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "あごに手を当ててパズルを考える姿勢が明瞭でthinkを連想しやすい。",
      "alternativeAnswersEn": [
        "solve",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "world",
      "w": "world",
      "p": [
        "wī̆-ro-",
        "al-3"
      ],
      "imagePath": "assets/word/world.png",
      "imageGitBlobSha": "e6c0b422ea366daf712af0758ce49b801976c5e8",
      "score": 82,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "地球全体が明瞭。worldは適合するがearth・globe・planetも非常に自然な答え。",
      "alternativeAnswersEn": [
        "earth",
        "globe",
        "planet"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "data",
      "w": "data",
      "p": [
        "dō-"
      ],
      "imagePath": "assets/word/data.png",
      "imageGitBlobSha": "c4eaed2847a97315dc045c4a56137d222cef4fc2",
      "score": 35,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "測定と記録の場面だが、dataそのものよりexperiment・scientist・thermometerが目立つ。",
      "alternativeAnswersEn": [
        "experiment",
        "scientist",
        "thermometer"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "want",
      "w": "want",
      "p": [
        "euə-"
      ],
      "imagePath": "assets/word/want.png",
      "imageGitBlobSha": "9ccd2f16071fe95bf7eb79894913c8e74b85c6d1",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "店の模型を欲しそうに眺める姿は伝わるが、want・wish・lookの区別が残る。",
      "alternativeAnswersEn": [
        "wish",
        "look",
        "boat"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "part",
      "w": "part",
      "p": [
        "perə-2"
      ],
      "imagePath": "assets/word/part.png",
      "imageGitBlobSha": "b28583d3d0601da639be2cd9b363a5f166ee4216",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "円を分けた一片を持ち上げておりpartを連想できる。piece・sliceとの区別は難しい。",
      "alternativeAnswersEn": [
        "piece",
        "slice"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "place",
      "w": "place",
      "p": [
        "plat-"
      ],
      "imagePath": "assets/word/place.png",
      "imageGitBlobSha": "2f512f36b5fee64d632a0f12ae800c38321808e1",
      "score": 35,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "自転車を駐輪場に置く場面だが、placeよりpark・bicycle・rackを答えやすい。",
      "alternativeAnswersEn": [
        "park",
        "bicycle",
        "rack"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "system",
      "w": "system",
      "p": [
        "ksun",
        "stā-"
      ],
      "imagePath": "assets/word/system.png",
      "imageGitBlobSha": "714df0dd48f162819e39ebf2689b5b844459a9ac",
      "score": 46,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "樽から複数の鉢へ水を送る仕組みは読めるが、systemは抽象的でwater・irrigationが優勢。",
      "alternativeAnswersEn": [
        "water",
        "irrigation",
        "pipe"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "head",
      "w": "head",
      "p": [
        "kaput-"
      ],
      "imagePath": "assets/word/head.png",
      "imageGitBlobSha": "218bb76cb1cdb588a87bef8aab30b76ca6578967",
      "score": 85,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "頭部が大きく単独で描かれ、headは連想しやすい。ただしfaceやhairにも答えが分かれる。",
      "alternativeAnswersEn": [
        "face",
        "hair"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "say",
      "w": "say",
      "p": [
        "sekʷ-3"
      ],
      "imagePath": "assets/word/say.png",
      "imageGitBlobSha": "0ac63588b99d57d94c2f20d9563d84a3d1854f58",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "相手に話す動作は伝わるが、say・talk・speak・tellは絵だけで区別しにくい。",
      "alternativeAnswersEn": [
        "talk",
        "speak",
        "tell"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "thought",
      "w": "thought",
      "p": [
        "tong-"
      ],
      "imagePath": "assets/word/thought.png",
      "imageGitBlobSha": "65e78b6761af2cf8f8adc509065f8ce03934e2d4",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "設計を思い付く場面に見える。thoughtよりidea・think・planが自然で、名詞を指定する根拠が弱い。",
      "alternativeAnswersEn": [
        "idea",
        "think",
        "plan"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "high",
      "w": "high",
      "p": [
        "keu-2",
        "gue-"
      ],
      "imagePath": "assets/word/high.png",
      "imageGitBlobSha": "ca7424ffefe8328f5b6be96c5240318f90141628",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "木より高く揚がる凧で高さは表せているが、kite・fly・skyとの競合が強い。",
      "alternativeAnswersEn": [
        "kite",
        "fly",
        "sky"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "case",
      "w": "case",
      "p": [
        "kad-"
      ],
      "imagePath": "assets/word/case.png",
      "imageGitBlobSha": "7cb7e460e03b8217cc76c61d542582b6a72592a9",
      "score": 13,
      "components": {
        "meaningVisible": 5,
        "conceptDistinct": 0,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "雨に備えて傘を鞄に入れる場面。in caseの文脈は補えても、case単独を絵から答えるのは難しい。",
      "alternativeAnswersEn": [
        "umbrella",
        "rain",
        "bag"
      ],
      "assessedAt": "2026-10-19T01:37:35Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "every",
      "w": "every",
      "p": [
        "aiw-",
        "līk-"
      ],
      "imagePath": "assets/word/every.png",
      "imageGitBlobSha": "93113430f9d338d93f39d44aecaaad4307d9eca3",
      "score": 30,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "子ども全員が絵を描く場面だが、everyという限定表現を特定する情報がない。",
      "alternativeAnswersEn": [
        "children",
        "draw",
        "all"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "number",
      "w": "number",
      "p": [
        "nem-"
      ],
      "imagePath": "assets/word/number.png",
      "imageGitBlobSha": "2610fe16e7c7459f1df3f5d71ae8114d9d5cc3b0",
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "4という数字と4個の石で数量は示せるが、numberよりfour・countと答えやすい。",
      "alternativeAnswersEn": [
        "four",
        "count",
        "stones"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "state",
      "w": "state",
      "p": [
        "stā-"
      ],
      "imagePath": "assets/word/state.png",
      "imageGitBlobSha": "f2f98f9728fa16a6c5545f2ec4f9b78c8c34f4e9",
      "score": 42,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "傷んだ自転車の状態は見えるが、stateという抽象語よりbroken・repair・bicycleが自然。",
      "alternativeAnswersEn": [
        "broken",
        "repair",
        "bicycle"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "process",
      "w": "process",
      "p": [
        "per1",
        "ked-"
      ],
      "imagePath": "assets/word/process.png",
      "imageGitBlobSha": "790e198c9d3b1d802d3626733ebd57aab139b608",
      "score": 36,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "パンを作る工程の一場面だけで、processよりknead・dough・bakeが強く浮かぶ。",
      "alternativeAnswersEn": [
        "knead",
        "dough",
        "bake"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "power",
      "w": "power",
      "p": [
        "poti-"
      ],
      "imagePath": "assets/word/power.png",
      "imageGitBlobSha": "a711d462676b34d4e1f83d1b7408b6bafea57a75",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "重いバーベルを持ち上げる力強さは明瞭。ただしpower・strength・strongの区別が難しい。",
      "alternativeAnswersEn": [
        "strength",
        "strong",
        "weightlifting"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "body",
      "w": "body",
      "p": [],
      "imagePath": "assets/word/body.png",
      "imageGitBlobSha": "8f7b042406652e6f37d66772cba0c32069c37436",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "全身の人物と胴を指す矢印でbodyを連想できる。torso・chestも候補になる。",
      "alternativeAnswersEn": [
        "torso",
        "chest",
        "person"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "find",
      "w": "find",
      "p": [
        "pent-"
      ],
      "imagePath": "assets/word/find.png",
      "imageGitBlobSha": "afa0e02b35000b2c5108312e076a5f8289ba9148",
      "score": 85,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "ソファの下で玩具を見つけて喜ぶ場面は明瞭。findとsearchの区別には表情が手掛かり。",
      "alternativeAnswersEn": [
        "discover",
        "search",
        "toy"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "set@sed",
      "w": "set",
      "p": [
        "sed-"
      ],
      "imagePath": "assets/word/set@sed.png",
      "imageGitBlobSha": "daabd6f9409c3ce6485a392d81fa804fae36598a",
      "score": 53,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "カップを皿に置く動作は分かるが、set・put・placeは絵だけでは特定できない。",
      "alternativeAnswersEn": [
        "put",
        "place",
        "cup"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "look",
      "w": "look",
      "p": [],
      "imagePath": "assets/word/look.png",
      "imageGitBlobSha": "40b3eff4851d27866ff8593c038b117765730234",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "蝶へ目を向けていることは伝わるが、look・see・watchのどれかには絞れない。",
      "alternativeAnswersEn": [
        "see",
        "watch",
        "butterfly"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "information",
      "w": "information",
      "p": [
        "en",
        "merph-"
      ],
      "imagePath": "assets/word/information.png",
      "imageGitBlobSha": "9a55c8660595160df5e4e54b3a65954e8f30d91a",
      "score": 48,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "案内図から情報を得る場面だが、map・direction・guideを答える方が自然。",
      "alternativeAnswersEn": [
        "map",
        "direction",
        "guide"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "end",
      "w": "end",
      "p": [
        "ant-"
      ],
      "imagePath": "assets/word/end.png",
      "imageGitBlobSha": "94c09f9766302ec42f619b6caf08a5aeedb3fab5",
      "score": 67,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "ゴールテープを切る終わりの場面。endよりfinish・win・goalが先に浮かびやすい。",
      "alternativeAnswersEn": [
        "finish",
        "win",
        "goal"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "old",
      "w": "old",
      "p": [
        "al-3"
      ],
      "imagePath": "assets/word/old.png",
      "imageGitBlobSha": "554a3d9e4d1ee77b50a7c2d83ca40d70d3c6f8a9",
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "古びた木箱の傷や色で古さは伝わるが、chest・treasure・woodも有力。",
      "alternativeAnswersEn": [
        "chest",
        "treasure",
        "wood"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "family",
      "w": "family",
      "p": [],
      "imagePath": "assets/word/family.png",
      "imageGitBlobSha": "8daaf8b07dcd436c70552bfaaf4c1d5424fe45de",
      "score": 94,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "大人2人と幼い子が寄り添い、家族という関係が読み取りやすい。",
      "alternativeAnswersEn": [
        "parents",
        "people"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "room",
      "w": "room",
      "p": [
        "reuə-"
      ],
      "imagePath": "assets/word/room.png",
      "imageGitBlobSha": "b17ae228f622363df0c07ab5004f63ae9a7324d8",
      "score": 85,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "壁と家具を含めた一室全体が見える。roomは有力だがliving roomがより具体的。",
      "alternativeAnswersEn": [
        "living room",
        "interior"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "year",
      "w": "year",
      "p": [
        "yēr-"
      ],
      "imagePath": "assets/word/year.png",
      "imageGitBlobSha": "d9135cfd3fad2f546e8935d522b00c799d93ad25",
      "score": 62,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "年号と複数月のカレンダーでyearは連想できるが、calendar・monthに答えが分かれる。",
      "alternativeAnswersEn": [
        "calendar",
        "month"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "order",
      "w": "order",
      "p": [
        "ōrd-"
      ],
      "imagePath": "assets/word/order.png",
      "imageGitBlobSha": "eb28a300514188af9e3ce769f42f57ac28257edb",
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "窓口に並ぶ人々は明瞭だが、orderよりqueue・line・waitを答えやすい。",
      "alternativeAnswersEn": [
        "queue",
        "line",
        "wait"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "better",
      "w": "better",
      "p": [
        "bhad-"
      ],
      "imagePath": "assets/word/better.png",
      "imageGitBlobSha": "9dc78c9f1b700d88af8845f5891bc3efff6f0d70",
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "しおれた花から元気な花への改善は示せるが、better・grow・recover・healthyの区別がつかない。",
      "alternativeAnswersEn": [
        "grow",
        "recover",
        "healthy"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "change",
      "w": "change",
      "p": [
        "kemb-"
      ],
      "imagePath": "assets/word/change.png",
      "imageGitBlobSha": "75c35f1f0e3453d016ae7799df2f8b7b3045bf57",
      "score": 37,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "椅子を動かす場面だけで、変更前後の違いが見えずchangeを特定しにくい。",
      "alternativeAnswersEn": [
        "move",
        "chair",
        "arrange"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "put",
      "w": "put",
      "p": [],
      "imagePath": "assets/word/put.png",
      "imageGitBlobSha": "5e6d3a3d639c28517c0e82adc9c9e83efd910ecf",
      "score": 53,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "テーブルにカップを置く動作は読めるが、put・place・setに答えが分散する。",
      "alternativeAnswersEn": [
        "place",
        "set",
        "cup"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "study",
      "w": "study",
      "p": [
        "(s)teu-1"
      ],
      "imagePath": "assets/word/study.png",
      "imageGitBlobSha": "2dfcc6ceec20a44c74886aba575a85d72ad24f31",
      "score": 86,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "机で本とノートを使う学習場面でstudyが有力。read・learnも候補になる。",
      "alternativeAnswersEn": [
        "read",
        "learn"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "let",
      "w": "let",
      "p": [
        "lē-2"
      ],
      "imagePath": "assets/word/let.png",
      "imageGitBlobSha": "fba7d1f2154f53a42cb1f98dab17e2fa2aa83659",
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "大人が子どもを庭へ通す場面だが、letの許可の意味は文脈なしでは伝わりにくい。",
      "alternativeAnswersEn": [
        "allow",
        "open",
        "garden"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "felt",
      "w": "felt",
      "p": [
        "pel-6"
      ],
      "imagePath": "assets/word/felt.png",
      "imageGitBlobSha": "7ea1e57ce3cb0a28e7c04db9334dfb4213bcf99d",
      "score": 54,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "厚めの布とハサミは見えるが、フェルト特有の質感だけでfeltを特定するのは難しい。",
      "alternativeAnswersEn": [
        "fabric",
        "cloth",
        "scissors"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "door",
      "w": "door",
      "p": [
        "dhwer-"
      ],
      "imagePath": "assets/word/door.png",
      "imageGitBlobSha": "d8169f2b00e5dec411746f0316b0b712bb315562",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "扉そのものが単独で大きく描かれ、doorを推測しやすい。",
      "alternativeAnswersEn": [
        "entrance"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "book",
      "w": "book",
      "p": [
        "bhāgo-"
      ],
      "imagePath": "assets/word/book.png",
      "imageGitBlobSha": "e4979aa97aa414127a7d1e7a64d9a0732d7bcc1d",
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた本が主役として大きく描かれ、bookを推測しやすい。",
      "alternativeAnswersEn": [
        "volume",
        "read"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "heart",
      "w": "heart",
      "p": [
        "kerd-"
      ],
      "imagePath": "assets/word/heart.png",
      "imageGitBlobSha": "d9c556d68838cea4922c4c17f987befc7896d312",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "心臓の特徴的な形と血管が明瞭で、heartにほぼ絞れる。",
      "alternativeAnswersEn": [
        "organ"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "business",
      "w": "business",
      "p": [],
      "imagePath": "assets/word/business.png",
      "imageGitBlobSha": "6ccc0e962e29bb61841f92d0f44b7c6eb33dc329",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "店で商品を渡す商売の場面だが、businessよりshop・buy・sellが浮かびやすい。",
      "alternativeAnswersEn": [
        "shop",
        "buy",
        "sell"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "support",
      "w": "support",
      "p": [
        "upo",
        "per-2"
      ],
      "imagePath": "assets/word/support.png",
      "imageGitBlobSha": "c15d545dd84e04e476d542feec96d53d4ca4a76a",
      "score": 77,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "支柱が苗木を支える関係は読み取れるが、support以外にstake・plantも候補。",
      "alternativeAnswersEn": [
        "stake",
        "plant",
        "hold"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "learning",
      "w": "learning",
      "p": [
        "leis-1"
      ],
      "imagePath": "assets/word/learning.png",
      "imageGitBlobSha": "96319ad30b8ecabe9fd418d5c21b79ee23c866e1",
      "score": 57,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "本を読む学習場面だが、learning・reading・studyという行為名の区別がつかない。",
      "alternativeAnswersEn": [
        "reading",
        "study",
        "book"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "keep",
      "w": "keep",
      "p": [],
      "imagePath": "assets/word/keep.png",
      "imageGitBlobSha": "fb015726c909584342b4f3778e1e403d85310a3c",
      "score": 43,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "大事な物を手で包む表現で、keepよりprotect・treasure・holdが浮かびやすい。",
      "alternativeAnswersEn": [
        "protect",
        "treasure",
        "hold"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "question",
      "w": "question",
      "p": [],
      "imagePath": "assets/word/question.png",
      "imageGitBlobSha": "ecc261dadc67289356474503c210cfd75d50a86f",
      "score": 87,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "疑問符と挙手する生徒でquestionは連想しやすい。askとの品詞の違いは残る。",
      "alternativeAnswersEn": [
        "ask",
        "student"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "sense",
      "w": "sense",
      "p": [
        "sent-"
      ],
      "imagePath": "assets/word/sense.png",
      "imageGitBlobSha": "0d7e88b616cf043f9dad4daede9c223ffeafb113",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "木の表面に触れて感じる行為だが、senseよりtouch・feel・roughが強く浮かぶ。",
      "alternativeAnswersEn": [
        "touch",
        "feel",
        "rough"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "energy",
      "w": "energy",
      "p": [
        "en",
        "werg-"
      ],
      "imagePath": "assets/word/energy.png",
      "imageGitBlobSha": "6dcab07331e862715f42957ddb76b1ff6c92703e",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "元気に縄跳びする様子は伝わるが、energyよりjump・rope・exerciseが自然な答え。",
      "alternativeAnswersEn": [
        "jump",
        "rope",
        "exercise"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "government",
      "w": "government",
      "p": [],
      "imagePath": "assets/word/government.png",
      "imageGitBlobSha": "746b8f69922ae20bdb41bf4e330a89a491b241c9",
      "score": 61,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 8
      },
      "reasonJa": "公的な建物と会議でgovernmentを連想できるが、politics・meeting・councilも有力。",
      "alternativeAnswersEn": [
        "politics",
        "meeting",
        "council"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "knowledge",
      "w": "knowledge",
      "p": [
        "gnō-"
      ],
      "imagePath": "assets/word/knowledge.png",
      "imageGitBlobSha": "fdf20e71102c81afcb0b7f46818b872455239858",
      "score": 48,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "図鑑と植物を照合する場面だが、knowledgeという蓄積よりstudy・botany・plantが目立つ。",
      "alternativeAnswersEn": [
        "study",
        "botany",
        "plant"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "area",
      "w": "area",
      "p": [
        "as-"
      ],
      "imagePath": "assets/word/area.png",
      "imageGitBlobSha": "e22869ea3f998a33b17648cfb79600ae40601f0c",
      "score": 67,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "地図上で囲まれた範囲は分かるが、area・region・map・routeに答えが分かれる。",
      "alternativeAnswersEn": [
        "region",
        "map",
        "route"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "terms",
      "w": "terms",
      "p": [],
      "imagePath": "assets/word/terms.png",
      "imageGitBlobSha": "0a18584f40ffb334691fe9f28f03e66836c3861a",
      "score": 30,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "図と英語ラベルで専門用語を示すが、termsよりgeometry・circle・diagramが浮かぶ。文字ラベルへの依存も大きい。",
      "alternativeAnswersEn": [
        "geometry",
        "circle",
        "diagram"
      ],
      "assessedAt": "2026-10-19T01:54:33Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "risk",
      "w": "risk",
      "p": [
        "leuk-"
      ],
      "imagePath": "assets/word/risk.png",
      "imageGitBlobSha": "996a93a6161afab79f050b39cd37b012af470763",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "壊れた橋へ進みかける危険は明瞭。ただしriskよりdanger・unsafeと答える可能性も高い。",
      "alternativeAnswersEn": [
        "danger",
        "unsafe",
        "bridge"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "future",
      "w": "future",
      "p": [
        "bheuə-"
      ],
      "imagePath": "assets/word/future.png",
      "imageGitBlobSha": "e4e19cf4c6d7bd233802aabe478875c6f7dbe5d0",
      "score": 46,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "完成模型と建設途中の橋は見えるが、futureという時間概念には絞りにくい。",
      "alternativeAnswersEn": [
        "plan",
        "bridge",
        "construction"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "practice",
      "w": "practice",
      "p": [],
      "imagePath": "assets/word/practice.png",
      "imageGitBlobSha": "925622cb040a8f479d113ccc0278d9e4e0d825e5",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "バイオリンを弾く様子だけでは練習か本番かを区別できず、practiceよりplay・violinが有力。",
      "alternativeAnswersEn": [
        "play",
        "violin",
        "music"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "attention",
      "w": "attention",
      "p": [
        "ad-",
        "ten-"
      ],
      "imagePath": "assets/word/attention.png",
      "imageGitBlobSha": "b780c7ea7ac238d12dca81ff62bc262637787498",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "実演を見つめる姿で注意を向ける様子は示せるが、attention・watch・learnに答えが分かれる。",
      "alternativeAnswersEn": [
        "watch",
        "learn",
        "knot"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "understanding",
      "w": "understanding",
      "p": [
        "n̥dher-",
        "stā-"
      ],
      "imagePath": "assets/word/understanding.png",
      "imageGitBlobSha": "d35b99c6db47244babd2bd1e12936c526c63feeb",
      "score": 49,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "パズルの解き方が分かった表情はあるが、understandingよりsolve・learn・puzzleが自然。",
      "alternativeAnswersEn": [
        "solve",
        "learn",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "decision",
      "w": "decision",
      "p": [
        "de-",
        "kaə-id-"
      ],
      "imagePath": "assets/word/decision.png",
      "imageGitBlobSha": "f7b6a72fd5b66965fb4a66bed57a36fc6096e482",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "分かれ道で方向を選ぶ行為は明瞭。decisionは連想できるがchoice・chooseも有力。",
      "alternativeAnswersEn": [
        "choice",
        "choose",
        "direction"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "loss",
      "w": "loss",
      "p": [
        "leu-"
      ],
      "imagePath": "assets/word/loss.png",
      "imageGitBlobSha": "c6040c79d51c039c9e94e953c47bb02c9cc7deec",
      "score": 67,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "破れた袋から穀物が失われる場面だが、lossよりspill・leak・grainに答えやすい。",
      "alternativeAnswersEn": [
        "spill",
        "leak",
        "grain"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "pressure",
      "w": "pressure",
      "p": [
        "per-4"
      ],
      "imagePath": "assets/word/pressure.png",
      "imageGitBlobSha": "4ef2ff1e3527def48d2a5ffe3224823b4367f65c",
      "score": 85,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "重りでスポンジが押しつぶされる関係が明瞭で、pressureを連想しやすい。",
      "alternativeAnswersEn": [
        "weight",
        "press",
        "compress"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "purpose",
      "w": "purpose",
      "p": [
        "per1",
        "paus-"
      ],
      "imagePath": "assets/word/purpose.png",
      "imageGitBlobSha": "c19ecce0fd0716c2dcf89a74ba04f34d443886ca",
      "score": 28,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "鳥のために巣箱を作る目的は想像できるが、絵だけならbirdhouse・buildが主な答えになる。",
      "alternativeAnswersEn": [
        "birdhouse",
        "build",
        "bird"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "difference",
      "w": "difference",
      "p": [
        "dwis-",
        "bher-1"
      ],
      "imagePath": "assets/word/difference.png",
      "imageGitBlobSha": "5f32955f3a0892e3e849e4518e0292de6de6a1e0",
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "服のボタンを指しているが、何と何の違いかが明確でなくdifferenceを特定しにくい。",
      "alternativeAnswersEn": [
        "button",
        "jacket",
        "point"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "respect",
      "w": "respect",
      "p": [
        "re-",
        "spek-"
      ],
      "imagePath": "assets/word/respect.png",
      "imageGitBlobSha": "9a5162e8ce4efb05987b65b5e43f8799a12b6773",
      "score": 79,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 15,
        "smallImageReadable": 9
      },
      "reasonJa": "年長者に丁寧にお辞儀する姿で敬意は伝わる。respect以外にbow・politeも候補。",
      "alternativeAnswersEn": [
        "bow",
        "polite"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "arts",
      "w": "arts",
      "p": [],
      "imagePath": "assets/word/arts.png",
      "imageGitBlobSha": "76651ea57e6ee1f8af85248c0c53739fd9cdb7af",
      "score": 92,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "絵画と音楽を並べることでartsという共通概念を連想しやすい。artとの単複の区別は残る。",
      "alternativeAnswersEn": [
        "art",
        "painting",
        "music"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "stimulus",
      "w": "stimulus",
      "p": [],
      "imagePath": "assets/word/stimulus.png",
      "imageGitBlobSha": "0f31dc8ca626dfdfeeeae71f2b3be6c62500ed06",
      "score": 60,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "ベルに犬が反応する関係は見えるが、stimulusよりbell・sound・listenを答えやすい。",
      "alternativeAnswersEn": [
        "bell",
        "sound",
        "listen"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "well@wel2",
      "w": "well",
      "p": [
        "wel-2"
      ],
      "imagePath": "assets/word/well@wel2.png",
      "imageGitBlobSha": "228eaaf90d56e0afd1f23eee9034e3eecbdeeb08",
      "score": 29,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "カップを丁寧に梱包した状態は見えるが、wellという副詞を選ぶ根拠は弱い。",
      "alternativeAnswersEn": [
        "pack",
        "cup",
        "carefully"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "right",
      "w": "right",
      "p": [
        "reg-"
      ],
      "imagePath": "assets/word/right.png",
      "imageGitBlobSha": "d83669d6924b3ea2973173b3e09120853473a5ed",
      "score": 60,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "合う穴へブロックを入れる正しさは示せるが、right・correct・fitの区別が難しい。",
      "alternativeAnswersEn": [
        "correct",
        "fit",
        "block"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "less",
      "w": "less",
      "p": [
        "leis-2"
      ],
      "imagePath": "assets/word/less.png",
      "imageGitBlobSha": "2b108bdd53c3058871b7db9c31c0a17bd9506553",
      "score": 44,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "2つのスープを比べているが、量の差が目立たずlessを絵だけで特定しにくい。",
      "alternativeAnswersEn": [
        "soup",
        "bowl",
        "compare"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "mean@medhyo",
      "w": "mean",
      "p": [
        "medhyo-"
      ],
      "imagePath": "assets/word/mean@medhyo.png",
      "imageGitBlobSha": "54da7192b0bfd2af9cc9cc4f72cdee88c838732f",
      "score": 55,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "棒グラフ中央の線は平均を連想させるが、mean・average・middleの区別は難しい。",
      "alternativeAnswersEn": [
        "average",
        "middle",
        "graph"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "living",
      "w": "living",
      "p": [
        "leip-"
      ],
      "imagePath": "assets/word/living.png",
      "imageGitBlobSha": "0d9454d4471db59e881defae2d8fd7402292ee30",
      "score": 55,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "発芽した植物は生命を示すが、livingよりsprout・grow・plantが直接的な答えになる。",
      "alternativeAnswersEn": [
        "sprout",
        "grow",
        "plant"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "table",
      "w": "table",
      "p": [],
      "imagePath": "assets/word/table.png",
      "imageGitBlobSha": "18ae0e9a9e9f33b81896bc6ac41dd67c357bff7b",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "机が単独で大きく描かれ、tableを推測しやすい。",
      "alternativeAnswersEn": [
        "desk"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "function",
      "w": "function",
      "p": [
        "bheug-2"
      ],
      "imagePath": "assets/word/function.png",
      "imageGitBlobSha": "1397ca664a29d284a0f69af1abc020d64ff85057",
      "score": 29,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "傘が雨を防ぐ働きは見えるが、functionという抽象語よりumbrella・rainが圧倒的に強い。",
      "alternativeAnswersEn": [
        "umbrella",
        "rain",
        "protect"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "minutes",
      "w": "minutes",
      "p": [],
      "imagePath": "assets/word/minutes.png",
      "imageGitBlobSha": "e7663a907d149d135ae96450da471cbd03a88ba0",
      "score": 50,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "針付き時計は読めるが、minutes・hours・time・clockのどれを答えるかは指定できない。",
      "alternativeAnswersEn": [
        "clock",
        "time",
        "hours"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "step",
      "w": "step",
      "p": [
        "stebh-"
      ],
      "imagePath": "assets/word/step.png",
      "imageGitBlobSha": "348a2944512141021920a8be21e0f582de6558da",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "水たまりをまたぐ一歩は示せるが、step以外にwalk・stride・jumpも浮かぶ。",
      "alternativeAnswersEn": [
        "walk",
        "stride",
        "jump"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "law",
      "w": "law",
      "p": [
        "legh-"
      ],
      "imagePath": "assets/word/law.png",
      "imageGitBlobSha": "ed1ef1169369a79f82aa30f18ac6eeb0a899abd1",
      "score": 66,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 8,
        "smallImageReadable": 8
      },
      "reasonJa": "裁判官と法律の本で法の分野は伝わるが、law・judge・courtの区別が残る。",
      "alternativeAnswersEn": [
        "judge",
        "court",
        "justice"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "values",
      "w": "values",
      "p": [],
      "imagePath": "assets/word/values.png",
      "imageGitBlobSha": "403226a0254953108cd9df9e2cc28e3120544e57",
      "score": 36,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "宝石と貨幣で価値は示せるが、valuesという複数形よりvalue・money・wealthが自然。",
      "alternativeAnswersEn": [
        "value",
        "money",
        "wealth"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "black",
      "w": "black",
      "p": [
        "bhel-1"
      ],
      "imagePath": "assets/word/black.png",
      "imageGitBlobSha": "b90eb7eca4a88676b1f2e54cd84b68586980a387",
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "黒色は明瞭だが、色を答える指定がないためumbrellaも同程度に有力。",
      "alternativeAnswersEn": [
        "umbrella",
        "dark"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "chapter",
      "w": "chapter",
      "p": [
        "kaput-"
      ],
      "imagePath": "assets/word/chapter.png",
      "imageGitBlobSha": "33199fa6d369708dcfc395a776e665efb6c2ea88",
      "score": 64,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "本の章扉らしいページは見えるが、chapterよりbook・page・readを答えやすい。",
      "alternativeAnswersEn": [
        "book",
        "page",
        "read"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "method",
      "w": "method",
      "p": [
        "me-2",
        "sed-2"
      ],
      "imagePath": "assets/word/method.png",
      "imageGitBlobSha": "7da8309a6de8734a79ffece65d8f8aa1c3a20bfc",
      "score": 46,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "木箱を組み立てる方法の一例だが、methodという抽象語よりbuild・assemble・boxが強い。",
      "alternativeAnswersEn": [
        "build",
        "assemble",
        "box"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "war",
      "w": "war",
      "p": [
        "wers-"
      ],
      "imagePath": "assets/word/war.png",
      "imageGitBlobSha": "756a0e6c8d157410ac85f85a6980fd0e52c8ba72",
      "score": 92,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "対立する兵士と戦車が戦闘を明瞭に示し、warを連想しやすい。battleも有力。",
      "alternativeAnswersEn": [
        "battle",
        "combat"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "century",
      "w": "century",
      "p": [
        "dekm̥"
      ],
      "imagePath": "assets/word/century.png",
      "imageGitBlobSha": "f138743292dd77f0b552c194a82119f23ac413a4",
      "score": 43,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 10,
        "answerSpecific": 10,
        "smallImageReadable": 8
      },
      "reasonJa": "100 yearsの文字を読めばcenturyに結び付くが、絵そのものには100年間を示す手掛かりが少ない。",
      "alternativeAnswersEn": [
        "years",
        "timeline",
        "history"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "top",
      "w": "top",
      "p": [],
      "imagePath": "assets/word/top.png",
      "imageGitBlobSha": "a3b5e5b16449ab29c5cee82eaa50de6925a96802",
      "score": 82,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "山頂の旗が頂上を強調している。topは連想できるがpeak・summitとの競合が強い。",
      "alternativeAnswersEn": [
        "peak",
        "summit",
        "mountain"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "thinking",
      "w": "thinking",
      "p": [],
      "imagePath": "assets/word/thinking.png",
      "imageGitBlobSha": "900a5f6baac5cecdde8f8b0972035691bac05166",
      "score": 69,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 15,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "思考を示す吹き出しと考える姿勢は明瞭だが、thinking・think・thoughtの語形は区別できない。",
      "alternativeAnswersEn": [
        "think",
        "thought",
        "idea"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "big",
      "w": "big",
      "p": [
        "beu-"
      ],
      "imagePath": "assets/word/big.png",
      "imageGitBlobSha": "2a318e78a1bc48bd8abbea13319f75dabe363f8c",
      "score": 76,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "人物より大きなカボチャとの比較で大きさは伝わる。big・large・hugeが競合する。",
      "alternativeAnswersEn": [
        "large",
        "huge",
        "pumpkin"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "increase",
      "w": "increase",
      "p": [
        "en",
        "ker-3"
      ],
      "imagePath": "assets/word/increase.png",
      "imageGitBlobSha": "4e05f399957667fe7c5fcd9a50efaa54b2371f33",
      "score": 37,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 5,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "容器に水を注いでいるが増加前後の比較がなく、increaseよりfill・water・pourが自然。",
      "alternativeAnswersEn": [
        "fill",
        "water",
        "pour"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "ask",
      "w": "ask",
      "p": [
        "ais-"
      ],
      "imagePath": "assets/word/ask.png",
      "imageGitBlobSha": "af32a2d362e34415914a29bd878ad5a518524afb",
      "score": 86,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "疑問符を添えた問いかける動作が明瞭でaskを連想しやすい。questionも候補。",
      "alternativeAnswersEn": [
        "question",
        "talk"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "structure",
      "w": "structure",
      "p": [
        "sterə-"
      ],
      "imagePath": "assets/word/structure.png",
      "imageGitBlobSha": "04348cf519d6d4036b54c5a3794cfa87ec47cea3",
      "score": 80,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "建物の骨組みが主役で構造を示している。structureよりframe・buildingと答える余地もある。",
      "alternativeAnswersEn": [
        "frame",
        "building",
        "wood"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "response",
      "w": "response",
      "p": [
        "re-",
        "spend-"
      ],
      "imagePath": "assets/word/response.png",
      "imageGitBlobSha": "4c1a6badb005cda9cb42312896344dd440556974",
      "score": 31,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "飲み物を差し出す人へグラスを掲げているが、responseよりdrink・serve・waterが強く浮かぶ。",
      "alternativeAnswersEn": [
        "drink",
        "serve",
        "water"
      ],
      "assessedAt": "2026-10-19T02:00:30Z",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "alone",
      "w": "alone",
      "p": [
        "al-5",
        "oi-no-"
      ],
      "imagePath": "assets/word/alone.png",
      "imageGitBlobSha": "88d342c76fb93ac1130d64374ed8f9b9696054a5",
      "score": 69,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "ベンチに一人で座る姿は読めるが、座る・待つなどにも見える。",
      "alternativeAnswersEn": [
        "sit",
        "wait",
        "lonely"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "design",
      "w": "design",
      "p": [
        "de-",
        "sāg-"
      ],
      "imagePath": "assets/word/design.png",
      "imageGitBlobSha": "2ba22816faa0f0ce133512841bf8253508b61dd5",
      "score": 78,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "椅子の図面を描く作業が見える。設計以外に描画や計画にも答えが分かれる。",
      "alternativeAnswersEn": [
        "draw",
        "plan",
        "drawing"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "rest",
      "w": "rest",
      "p": [
        "re-",
        "stā-"
      ],
      "imagePath": "assets/word/rest.png",
      "imageGitBlobSha": "83f25f00a7249a73e275065c7af7c9cc86f580f2",
      "score": 29,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 6,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "皿に残るオレンジは見えるが、残りを指す語だと特定する手掛かりが弱い。",
      "alternativeAnswersEn": [
        "orange",
        "slice",
        "eat"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "start",
      "w": "start",
      "p": [
        "ster-1"
      ],
      "imagePath": "assets/word/start.png",
      "imageGitBlobSha": "27f6d21996aec7a1c7fcb1d3ca53cfb376f0a86d",
      "score": 57,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 15,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "先頭のドミノを押す動作は明瞭だが、開始より押す・倒すが先に浮かぶ。",
      "alternativeAnswersEn": [
        "push",
        "domino",
        "fall"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "cell",
      "w": "cell",
      "p": [
        "kel-2"
      ],
      "imagePath": "assets/word/cell.png",
      "imageGitBlobSha": "3741be356b400ad29a722bb1c8ead56e0b7876f0",
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 22,
        "smallImageReadable": 9
      },
      "reasonJa": "核などを持つ細胞の模式図として識別しやすい。",
      "alternativeAnswersEn": [
        "biology"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "market",
      "w": "market",
      "p": [
        "merk-3"
      ],
      "imagePath": "assets/word/market.png",
      "imageGitBlobSha": "1abce33b73b880867c1c4fa311ee4065a6ccfecf",
      "score": 81,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 8
      },
      "reasonJa": "青果の露店と売買は分かるが、店・買う・売るにも答えが分散する。",
      "alternativeAnswersEn": [
        "shop",
        "buy",
        "sell"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "section",
      "w": "section",
      "p": [
        "sek-"
      ],
      "imagePath": "assets/word/section.png",
      "imageGitBlobSha": "9861445038f85b89d3042aa9ca9c681ac2e949ab",
      "score": 38,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 9,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "切ったパンが主役で、一般的な部分・区分という語は限定できない。",
      "alternativeAnswersEn": [
        "bread",
        "slice",
        "cut"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "strong",
      "w": "strong",
      "p": [
        "strenk-"
      ],
      "imagePath": "assets/word/strong.png",
      "imageGitBlobSha": "fc45b3f49feb9261399c3625db3eeb0f794d6421",
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "重いバーベルを頭上に持ち上げる姿から力の強さが読み取れる。",
      "alternativeAnswersEn": [
        "lift",
        "weightlifting"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "talk",
      "w": "talk",
      "p": [
        "del-2"
      ],
      "imagePath": "assets/word/talk.png",
      "imageGitBlobSha": "3276f04f7f6a9c41014dc6d129af322c0116e8b6",
      "score": 91,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 9
      },
      "reasonJa": "二人が口と手を動かして会話する様子が明瞭。話すという類義語は残る。",
      "alternativeAnswersEn": [
        "speak",
        "chat"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "cause",
      "w": "cause",
      "p": [],
      "imagePath": "assets/word/cause.png",
      "imageGitBlobSha": "86b16d714a01d36c6b740efe071bbd61254faa12",
      "score": 38,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "肘が当たって水をこぼす因果は見えるが、原因という抽象名詞には絞れない。",
      "alternativeAnswersEn": [
        "spill",
        "accident",
        "knock"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "material",
      "w": "material",
      "p": [
        "māter-"
      ],
      "imagePath": "assets/word/material.png",
      "imageGitBlobSha": "7eaab3aa8cc76ddbe1affa2e35c8b1eba4c3f729",
      "score": 71,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 8
      },
      "reasonJa": "木材・布・金属の集まりから材料を連想できるが、複数形や個々の素材も候補になる。",
      "alternativeAnswersEn": [
        "materials",
        "wood",
        "fabric"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "building",
      "w": "building",
      "p": [],
      "imagePath": "assets/word/building.png",
      "imageGitBlobSha": "15a06da4e2ddcf76cf64ee33528e57379eeeb207",
      "score": 92,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "窓と入口を備えた多層の建物が大きく描かれている。",
      "alternativeAnswersEn": [
        "apartment",
        "office"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "answer",
      "w": "answer",
      "p": [
        "ant-",
        "swer-"
      ],
      "imagePath": "assets/word/answer.png",
      "imageGitBlobSha": "8799baebe3359c6b621d175797e0a3981a3be70c",
      "score": 60,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 9,
        "smallImageReadable": 8
      },
      "reasonJa": "黒板の計算結果を示す場面。答えのほか計算・正解・教えるとも読める。",
      "alternativeAnswersEn": [
        "solve",
        "correct",
        "teach"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "friend",
      "w": "friend",
      "p": [
        "prī-"
      ],
      "imagePath": "assets/word/friend.png",
      "imageGitBlobSha": "4921bce4cfd19386971f445369d9b903a1024edc",
      "score": 83,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "親しげに肩を組む二人から友人を連想できるが、きょうだいなど関係は確定しない。",
      "alternativeAnswersEn": [
        "friends",
        "siblings"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "party",
      "w": "party",
      "p": [
        "perə-2"
      ],
      "imagePath": "assets/word/party.png",
      "imageGitBlobSha": "87266e5557b0a2d67932caada35d6f1b4f6bdd54",
      "score": 95,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 9
      },
      "reasonJa": "ケーキ・飾り・集まる人から誕生日の集まりを識別しやすい。",
      "alternativeAnswersEn": [
        "birthday",
        "celebrate"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "hear",
      "w": "hear",
      "p": [
        "kous-"
      ],
      "imagePath": "assets/word/hear.png",
      "imageGitBlobSha": "348c64068937780bc810b6bec17b1711141d94d5",
      "score": 71,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "耳と鳴るベルは聞く行為を示すが、自分で鳴らす動作やlistenとも競合する。",
      "alternativeAnswersEn": [
        "listen",
        "ring",
        "bell"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "environment",
      "w": "environment",
      "p": [
        "en"
      ],
      "imagePath": "assets/word/environment.png",
      "imageGitBlobSha": "7b2a9e48a4b4a2be52d747c1d1b9e682f62e56dc",
      "score": 48,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 13,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "池・植物・カエルの生息環境は見えるが、池や生息地がより直接的な答えになる。",
      "alternativeAnswersEn": [
        "pond",
        "habitat",
        "frog"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "growth",
      "w": "growth",
      "p": [
        "ghrē-"
      ],
      "imagePath": "assets/word/growth.png",
      "imageGitBlobSha": "863dcb395973ee0946aa6085fddc7c1566e6954e",
      "score": 87,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "植物が順に大きくなる図で成長が分かる。動詞growとの区別は絵だけでは難しい。",
      "alternativeAnswersEn": [
        "grow",
        "growing"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "activity",
      "w": "activity",
      "p": [
        "ag-"
      ],
      "imagePath": "assets/word/activity.png",
      "imageGitBlobSha": "b479f7c72015f8f542b985e1235caad29ec828f1",
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "土を掘り水をまく具体的作業が強く、一般的な活動という答えには絞れない。",
      "alternativeAnswersEn": [
        "gardening",
        "plant",
        "water"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "bed",
      "w": "bed",
      "p": [
        "bhedh-"
      ],
      "imagePath": "assets/word/bed.png",
      "imageGitBlobSha": "e76d4ee8bebd2aa7eaba227756b8eabaa5f23367",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "枕・掛け布団・フレームを持つベッドが単独で大きく描かれている。",
      "alternativeAnswersEn": [
        "bedstead"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "lower",
      "w": "lower",
      "p": [
        "legh-"
      ],
      "imagePath": "assets/word/lower.png",
      "imageGitBlobSha": "24aebb6cc1d520d95746ee0121fe27911171f4be",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "滑車と鉢の操作は分かるが、下げているか上げているか静止画では曖昧。",
      "alternativeAnswersEn": [
        "raise",
        "lift",
        "pulley"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "disease",
      "w": "disease",
      "p": [
        "dwis-",
        "yē-"
      ],
      "imagePath": "assets/word/disease.png",
      "imageGitBlobSha": "2e1195d53ce04871b5321172cbc4cfa43388d28e",
      "score": 68,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 9
      },
      "reasonJa": "体温計と冷却布で病気は伝わるが、発熱・風邪・病人も自然な答え。",
      "alternativeAnswersEn": [
        "fever",
        "sick",
        "flu"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "pain",
      "w": "pain",
      "p": [
        "kʷei-1"
      ],
      "imagePath": "assets/word/pain.png",
      "imageGitBlobSha": "92bd786820bf03024fd4ae1985e5b55eda9a6c1d",
      "score": 89,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "膝を抱えた苦痛の表情と痛みの印から身体の痛みが明瞭。",
      "alternativeAnswersEn": [
        "hurt",
        "ache"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "focus",
      "w": "focus",
      "p": [],
      "imagePath": "assets/word/focus.png",
      "imageGitBlobSha": "7795fd8525a57843e44b1dc76118be962fb8875d",
      "score": 52,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 14,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "レンズ内の花は見えるが、焦点よりカメラや写真が主役に見える。",
      "alternativeAnswersEn": [
        "camera",
        "lens",
        "photograph"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "size",
      "w": "size",
      "p": [
        "sed-"
      ],
      "imagePath": "assets/word/size.png",
      "imageGitBlobSha": "24d9884196db336ea9a1bc6d255f0580b063d704",
      "score": 56,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "巻尺で衣服を測る場面だが、サイズより測定や仕立てという答えになりやすい。",
      "alternativeAnswersEn": [
        "measure",
        "tailor"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "activities",
      "w": "activities",
      "p": [],
      "imagePath": "assets/word/activities.png",
      "imageGitBlobSha": "d5f296e1fbd28e607a0f52b669826836c07d0cfc",
      "score": 38,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "複数人の園芸作業で、活動全般やその複数形を指定する手掛かりが弱い。",
      "alternativeAnswersEn": [
        "gardening",
        "planting",
        "work"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "lead",
      "w": "lead",
      "p": [
        "leit-2"
      ],
      "imagePath": "assets/word/lead.png",
      "imageGitBlobSha": "3e83068e2a517857eb1e5bd39fba8b6ccc8e86cb",
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 16,
        "smallImageReadable": 8
      },
      "reasonJa": "旗を持った先導者と後ろに続く人から導く動作が読み取れる。",
      "alternativeAnswersEn": [
        "guide",
        "leader",
        "follow"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "dark",
      "w": "dark",
      "p": [
        "dher-1"
      ],
      "imagePath": "assets/word/dark.png",
      "imageGitBlobSha": "6e97a68ef59cae873ec5b1883abde7d38069a86b",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 19,
        "smallImageReadable": 8
      },
      "reasonJa": "暗い部屋と小さな灯りの対比が明瞭。夜という答えもありうる。",
      "alternativeAnswersEn": [
        "night",
        "dim"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "image",
      "w": "image",
      "p": [
        "aim-"
      ],
      "imagePath": "assets/word/image.png",
      "imageGitBlobSha": "ada9d5b8d96e1efbfece011cfae153f671cdbacf",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "額入りの風景は絵と分かるが、imageよりpictureやpaintingが自然。",
      "alternativeAnswersEn": [
        "picture",
        "painting"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "plan",
      "w": "plan",
      "p": [
        "plat-"
      ],
      "imagePath": "assets/word/plan.png",
      "imageGitBlobSha": "9e8c32e262388dfd4936664df0a12cface7841af",
      "score": 70,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 8
      },
      "reasonJa": "地図と荷物を前に相談する場面から計画を連想できる。旅行や準備とも競合。",
      "alternativeAnswersEn": [
        "trip",
        "prepare",
        "map"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "training",
      "w": "training",
      "p": [
        "tragh-"
      ],
      "imagePath": "assets/word/training.png",
      "imageGitBlobSha": "a28794e1ca8396adfbca2cbfb2d02f81fe9474c6",
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 13,
        "smallImageReadable": 8
      },
      "reasonJa": "指導者と学習者のテニス練習が見える。練習・授業・指導にも答えが分かれる。",
      "alternativeAnswersEn": [
        "practice",
        "lesson",
        "coach"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "act",
      "w": "act",
      "p": [
        "ag-"
      ],
      "imagePath": "assets/word/act.png",
      "imageGitBlobSha": "4fc3573721151ae04dcdb0a29ad115ab5cc779aa",
      "score": 33,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "荷物を持つ高齢者を助ける場面で、行為一般を表すactには特定できない。",
      "alternativeAnswersEn": [
        "help",
        "kind",
        "carry"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "methods",
      "w": "methods",
      "p": [
        "sed-2"
      ],
      "imagePath": "assets/word/methods.png",
      "imageGitBlobSha": "633c62488bd2552cb1a6d6884ae7b77071275f0e",
      "score": 45,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 8
      },
      "reasonJa": "ハンマーとドライバーによる違う作業は見えるが、方法という複数名詞は弱い。",
      "alternativeAnswersEn": [
        "tools",
        "hammer",
        "screw"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "cost",
      "w": "cost",
      "p": [
        "kom",
        "stā-"
      ],
      "imagePath": "assets/word/cost.png",
      "imageGitBlobSha": "16d0adcc94e1dfb12612ec29ef40cbdc99598574",
      "score": 76,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 13,
        "smallImageReadable": 9
      },
      "reasonJa": "値札と所持金を比べる場面で費用を連想できる。priceとの区別はつかない。",
      "alternativeAnswersEn": [
        "price",
        "money",
        "expensive"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "culture",
      "w": "culture",
      "p": [
        "kʷel-1"
      ],
      "imagePath": "assets/word/culture.png",
      "imageGitBlobSha": "b8083e074ff73a4b97a2bec28ec680d1f2f0a8c2",
      "score": 53,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "着物や茶道の場面から文化を連想できるが、日本・家族・茶道とも読める。",
      "alternativeAnswersEn": [
        "Japan",
        "kimono",
        "tea"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "range",
      "w": "range",
      "p": [
        "(s)ker-3"
      ],
      "imagePath": "assets/word/range.png",
      "imageGitBlobSha": "85acfb5e4f31e87282f3095183469dc42240eac7",
      "score": 41,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "散水器と円形の芝生は見えるが、届く範囲より水まきが直接的な答えになる。",
      "alternativeAnswersEn": [
        "sprinkler",
        "water",
        "lawn"
      ],
      "assessedAt": "2026-10-19T04:09:48.293589+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "try",
      "w": "try",
      "p": [],
      "imagePath": "assets/word/try.png",
      "imageGitBlobSha": "a4ae492b5f4efadf0bd24c1339221d67660d3639",
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "動かない岩を押して努力する姿は分かるが、試すより押す・力が先に浮かぶ。",
      "alternativeAnswersEn": [
        "push",
        "effort",
        "struggle"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "project",
      "w": "project",
      "p": [
        "per1",
        "yē-"
      ],
      "imagePath": "assets/word/project.png",
      "imageGitBlobSha": "f1680d7b0660d53d6e6f95706db02877d4b4c5dd",
      "score": 51,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "設計図を見ながら箱庭を作る場面。具体的な工作や園芸からprojectへの限定は難しい。",
      "alternativeAnswersEn": [
        "gardening",
        "build",
        "model"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "red",
      "w": "red",
      "p": [
        "reudh-"
      ],
      "imagePath": "assets/word/red.png",
      "imageGitBlobSha": "a90bc42be49f0a7f0f067e3c30845ff2c67a78ba",
      "score": 88,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 22,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "赤色が面積の大半を占めるが、色を答える指定がないとじょうろも自然な答え。",
      "alternativeAnswersEn": [
        "watering can"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "technology",
      "w": "technology",
      "p": [
        "teks-",
        "leg-"
      ],
      "imagePath": "assets/word/technology.png",
      "imageGitBlobSha": "f2f47325cb0140b9a622e27e6361ec9e4e2dee39",
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 8
      },
      "reasonJa": "ロボットを操作する場面は技術を連想させるが、ロボット・機械・工場と競合する。",
      "alternativeAnswersEn": [
        "robot",
        "machine",
        "factory"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "total",
      "w": "total",
      "p": [
        "teutā-"
      ],
      "imagePath": "assets/word/total.png",
      "imageGitBlobSha": "66c18536f1de153a63bbdd0c0009d1224b49dfac",
      "score": 34,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "トレーの硬貨は見えるが、合計という概念や計算操作が示されていない。",
      "alternativeAnswersEn": [
        "coins",
        "money",
        "count"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "bad",
      "w": "bad",
      "p": [],
      "imagePath": "assets/word/bad.png",
      "imageGitBlobSha": "7277129e316cf3221958bd1b504ae87bb3bf8bcc",
      "score": 50,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 13,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "割れたカップで状態の悪さは伝わるが、壊れた・ひびが入ったという語が直接的。",
      "alternativeAnswersEn": [
        "broken",
        "cracked",
        "cup"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "team",
      "w": "team",
      "p": [
        "deuk-"
      ],
      "imagePath": "assets/word/team.png",
      "imageGitBlobSha": "655c05cf0b6cf7b9b416719f40a1bb4d2e8f86ad",
      "score": 92,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 9
      },
      "reasonJa": "同じユニフォームで手を重ねるサッカー仲間からチームが分かりやすい。",
      "alternativeAnswersEn": [
        "teamwork",
        "players"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "paper",
      "w": "paper",
      "p": [],
      "imagePath": "assets/word/paper.png",
      "imageGitBlobSha": "84bb81848c3ecda1873847b7d1c0194f79928c1a",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "折れた角を持つ一枚の白い紙が単独で描かれている。",
      "alternativeAnswersEn": [
        "sheet"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "presence",
      "w": "presence",
      "p": [
        "per1",
        "es-"
      ],
      "imagePath": "assets/word/presence.png",
      "imageGitBlobSha": "e2ce64d8162ba6380b381074845add16ce916059",
      "score": 34,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "部屋へ来た人と迎える人が見えるが、存在・出席という抽象名詞には絞れない。",
      "alternativeAnswersEn": [
        "greet",
        "visit",
        "hello"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "smile",
      "w": "smile",
      "p": [
        "smei-"
      ],
      "imagePath": "assets/word/smile.png",
      "imageGitBlobSha": "89728601512f0976fe8a10062b1a6ecd5e99970f",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "口角の上がった顔が大きく、笑顔を読み取りやすい。嬉しいという形容詞も候補。",
      "alternativeAnswersEn": [
        "happy",
        "grin"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "office",
      "w": "office",
      "p": [
        "op-",
        "dhē-"
      ],
      "imagePath": "assets/word/office.png",
      "imageGitBlobSha": "232a2272cfcf82d274e62db1e2e1df9618383999",
      "score": 90,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 8
      },
      "reasonJa": "机・書類棚・仕事をする人がそろい、事務所の場面として識別できる。",
      "alternativeAnswersEn": [
        "workplace",
        "work"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "security",
      "w": "security",
      "p": [
        "s(w)e-",
        "kʷei-3"
      ],
      "imagePath": "assets/word/security.png",
      "imageGitBlobSha": "8bf29feb7878f2d04a24951922f2f6006848e1c2",
      "score": 64,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 8,
        "smallImageReadable": 8
      },
      "reasonJa": "鍵を掛けて守る行為は読めるが、安全より鍵・施錠・防犯に分散する。",
      "alternativeAnswersEn": [
        "lock",
        "safety",
        "protect"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "movement",
      "w": "movement",
      "p": [
        "meuə-"
      ],
      "imagePath": "assets/word/movement.png",
      "imageGitBlobSha": "cb39c30b959ed6689d087bcbb4dd5fbc50e10843",
      "score": 40,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "振り子の動きの印はあるが、時計という物体が強くmovement全般には絞れない。",
      "alternativeAnswersEn": [
        "clock",
        "pendulum",
        "swing"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "media",
      "w": "media",
      "p": [
        "medhyo-"
      ],
      "imagePath": "assets/word/media.png",
      "imageGitBlobSha": "5b63f158004fc082379c98b4a87c14b211893831",
      "score": 62,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 8
      },
      "reasonJa": "ニュース撮影の場面で報道を連想できるが、テレビ・取材・カメラが競合する。",
      "alternativeAnswersEn": [
        "news",
        "television",
        "reporter"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "source",
      "w": "source",
      "p": [
        "upo",
        "reg-"
      ],
      "imagePath": "assets/word/source.png",
      "imageGitBlobSha": "0b6758402c1467e2b2e8081893049d16c6ecce88",
      "score": 65,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 18,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "岩間から水が流れ出す場所は分かるが、泉や小川がより直接的な答えになる。",
      "alternativeAnswersEn": [
        "spring",
        "stream",
        "water"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "follow",
      "w": "follow",
      "p": [],
      "imagePath": "assets/word/follow.png",
      "imageGitBlobSha": "a779ecec020d0a3fd6b43278fd4416a36e92f714",
      "score": 81,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "一人の後ろをもう一人が歩く配置で追従を連想できる。単に一緒に歩くとも見える。",
      "alternativeAnswersEn": [
        "walk",
        "following"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "court",
      "w": "court",
      "p": [
        "kom",
        "gher-1"
      ],
      "imagePath": "assets/word/court.png",
      "imageGitBlobSha": "08be88727bae95853cded27cf8756d43c8d6fa9d",
      "score": 92,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 8
      },
      "reasonJa": "裁判官と向かい合う席から法廷として識別しやすい。",
      "alternativeAnswersEn": [
        "courtroom",
        "trial"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "phone",
      "w": "phone",
      "p": [
        "bhā-2"
      ],
      "imagePath": "assets/word/phone.png",
      "imageGitBlobSha": "d4be082dc6d5387120611e932b53c2c438945b36",
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "受話器と電話機が明瞭。phoneとtelephoneの語の選択は残る。",
      "alternativeAnswersEn": [
        "telephone",
        "call"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "poor",
      "w": "poor",
      "p": [
        "pau-",
        "perə-1"
      ],
      "imagePath": "assets/word/poor.png",
      "imageGitBlobSha": "9293dd35aadb374bb32b38e9ccd1ade9ec4f21c8",
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 14,
        "smallImageReadable": 8
      },
      "reasonJa": "少ない食事・継ぎのある服・乏しい金銭から貧しさを連想できる。",
      "alternativeAnswersEn": [
        "poverty",
        "hungry"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "stage",
      "w": "stage",
      "p": [
        "stā-"
      ],
      "imagePath": "assets/word/stage.png",
      "imageGitBlobSha": "75ec048754177816d4ffc791e08680a013c35e7f",
      "score": 26,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 6,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "ろくろで器を作る場面で、段階や舞台というstageの手掛かりがほぼない。",
      "alternativeAnswersEn": [
        "pottery",
        "potter",
        "clay"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "property",
      "w": "property",
      "p": [
        "per1"
      ],
      "imagePath": "assets/word/property.png",
      "imageGitBlobSha": "fd884135b55fd99c4346df1c59a329f44b7f637d",
      "score": 60,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "家と鍵を持つ人物から所有物を連想できるが、家・所有者などに分かれる。",
      "alternativeAnswersEn": [
        "house",
        "owner",
        "home"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "features",
      "w": "features",
      "p": [],
      "imagePath": "assets/word/features.png",
      "imageGitBlobSha": "38fe3035e23ad3471a9ac61b8ca2bc5f74709610",
      "score": 39,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "虫眼鏡でテントウムシを見る場面で、特徴という複数名詞は特定しにくい。",
      "alternativeAnswersEn": [
        "ladybug",
        "inspect",
        "spots"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "application",
      "w": "application",
      "p": [
        "ad-",
        "plek-"
      ],
      "imagePath": "assets/word/application.png",
      "imageGitBlobSha": "ea2ffc23db1f74b10f0c96a651d35d54da08f2c2",
      "score": 29,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 7,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "工具を木枠に当てて使う場面だが、applicationより計測・工具が自然。",
      "alternativeAnswersEn": [
        "measure",
        "tool",
        "use"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "issue",
      "w": "issue",
      "p": [
        "eghs",
        "ei-"
      ],
      "imagePath": "assets/word/issue.png",
      "imageGitBlobSha": "e61cac56ba71fa8d06060db2d4fde87ab477c89f",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "水漏れという問題は分かるが、problem・leak・repairが直接的な答え。",
      "alternativeAnswersEn": [
        "problem",
        "leak",
        "repair"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "fear",
      "w": "fear",
      "p": [
        "per-3"
      ],
      "imagePath": "assets/word/fear.png",
      "imageGitBlobSha": "92193b3d8c4eaa36e3ee6cc12e5b46dadb281856",
      "score": 89,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "震える姿と怯えた表情で恐怖が明瞭。名詞と形容詞の区別は絵だけでは難しい。",
      "alternativeAnswersEn": [
        "afraid",
        "scared"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "product",
      "w": "product",
      "p": [
        "per1",
        "deuk-"
      ],
      "imagePath": "assets/word/product.png",
      "imageGitBlobSha": "ea6fdc5057c215b654e30f593c12f3bffd04c6b1",
      "score": 55,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "完成した椅子を並べる場面は製品を連想できるが、椅子や家具が強い。",
      "alternativeAnswersEn": [
        "stool",
        "furniture",
        "make"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "church",
      "w": "church",
      "p": [
        "keuə-"
      ],
      "imagePath": "assets/word/church.png",
      "imageGitBlobSha": "df49d9c6ae36e769d6ba3995256b57478021de13",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "十字架・鐘・尖った窓を持つ教会の建物が明瞭。",
      "alternativeAnswersEn": [
        "chapel"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "cut",
      "w": "cut",
      "p": [
        "(s)kel-1"
      ],
      "imagePath": "assets/word/cut.png",
      "imageGitBlobSha": "3e8b71bd6f1595cb654d92ecc8acbb15626b5f8d",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 9
      },
      "reasonJa": "包丁でキュウリを切る接点と切片が見え、切る動作が分かりやすい。",
      "alternativeAnswersEn": [
        "slice",
        "chop"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "report",
      "w": "report",
      "p": [
        "re-",
        "per-2"
      ],
      "imagePath": "assets/word/report.png",
      "imageGitBlobSha": "e17389924b59cde310598ed7fafac6c407704635",
      "score": 58,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "橋の不具合を伝える作業員は見えるが、報告・点検・説明が競合する。",
      "alternativeAnswersEn": [
        "inspect",
        "explain",
        "damage"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "lines",
      "w": "lines",
      "p": [],
      "imagePath": "assets/word/lines.png",
      "imageGitBlobSha": "c36874e24fe61fc3c0fb635c1b90b14fe6ee3080",
      "score": 87,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "直線・曲線・波線が並ぶが、lineとlinesの単複やdrawへの分散は残る。",
      "alternativeAnswersEn": [
        "line",
        "draw"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "temperature",
      "w": "temperature",
      "p": [
        "temp-"
      ],
      "imagePath": "assets/word/temperature.png",
      "imageGitBlobSha": "7237227d74b56c63e98e8f573813d2f3ca86abdf",
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "温度計と温かい飲み物・冷たい飲み物の対比から温度を連想しやすい。",
      "alternativeAnswersEn": [
        "hot",
        "cold",
        "thermometer"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "week",
      "w": "week",
      "p": [
        "weik-4"
      ],
      "imagePath": "assets/word/week.png",
      "imageGitBlobSha": "750cfd4385cbfe5cc25bfd94087e63501928000c",
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 9,
        "smallImageReadable": 8
      },
      "reasonJa": "七つの区画が週を示しうるが、日付や曜日がなくカレンダー・天気とも見える。",
      "alternativeAnswersEn": [
        "calendar",
        "days",
        "weather"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "direction",
      "w": "direction",
      "p": [
        "dwis-",
        "reg-"
      ],
      "imagePath": "assets/word/direction.png",
      "imageGitBlobSha": "5355fdf69c91037d58d8d5316a00ed1b066a7722",
      "score": 74,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "分かれ道で指さす姿が方向を示すが、道・右・指さすとも読める。",
      "alternativeAnswersEn": [
        "way",
        "point",
        "right"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "distance",
      "w": "distance",
      "p": [
        "dwis-",
        "stā-"
      ],
      "imagePath": "assets/word/distance.png",
      "imageGitBlobSha": "0fef481399c9695dc6fc9e2f02e749ad559fdb51",
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "二本の柱の間を巻尺で測る様子から隔たりが分かる。測る・長さとも競合する。",
      "alternativeAnswersEn": [
        "measure",
        "length"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "species",
      "w": "species",
      "p": [
        "spek-"
      ],
      "imagePath": "assets/word/species.png",
      "imageGitBlobSha": "839a3cd9c1a2f249b72f3f67f095593293287bce",
      "score": 41,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "複数の蝶は見えるが、種という分類単位を示す情報が乏しい。",
      "alternativeAnswersEn": [
        "butterflies",
        "butterfly",
        "insect"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "beginning",
      "w": "beginning",
      "p": [],
      "imagePath": "assets/word/beginning.png",
      "imageGitBlobSha": "f14badaae6e83c6fcf79d634626a6f65258e1a71",
      "score": 67,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "旗のそばのスタート姿勢から開始を連想できるが、startやraceと分かれる。",
      "alternativeAnswersEn": [
        "start",
        "race",
        "runner"
      ],
      "assessedAt": "2026-10-19T04:16:57.640288+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "series",
      "w": "series",
      "p": [
        "ser-3"
      ],
      "imagePath": "assets/word/series.png",
      "imageGitBlobSha": "b3172dab94f6ff630b58533e6ea417251ea900ff",
      "score": 47,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 13,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "並んだ本は分かるが、同じシリーズであるという関係が絵だけでは確定しない。",
      "alternativeAnswersEn": [
        "books",
        "collection",
        "row"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "allow",
      "w": "allow",
      "p": [
        "ad-"
      ],
      "imagePath": "assets/word/allow.png",
      "imageGitBlobSha": "639039f23cc64446e73328bdbfa104f8a5e4ed09",
      "score": 65,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 8
      },
      "reasonJa": "門を開けて通す動作は読めるが、許す・迎える・開けるが競合する。",
      "alternativeAnswersEn": [
        "welcome",
        "let",
        "open"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "road",
      "w": "road",
      "p": [
        "reidh-"
      ],
      "imagePath": "assets/word/road.png",
      "imageGitBlobSha": "9c3dfc2c55e314ecff54b63ca5ba14525d3b5259",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "車が走る舗装道路の形が大きく描かれ、道を識別しやすい。",
      "alternativeAnswersEn": [
        "highway"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "behavior",
      "w": "behavior",
      "p": [
        "ambhi",
        "kap-"
      ],
      "imagePath": "assets/word/behavior.png",
      "imageGitBlobSha": "7ad2dd9ac1ea9d5bfe53338ba1c8e42343664a85",
      "score": 33,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "店で買う人と待つ子供の場面で、行動一般を指すbehaviorは特定しにくい。",
      "alternativeAnswersEn": [
        "wait",
        "buy",
        "queue"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "direct",
      "w": "direct",
      "p": [
        "dwis-",
        "reg-"
      ],
      "imagePath": "assets/word/direct.png",
      "imageGitBlobSha": "c5be14e485fae7d7c20bc42e49c96232f22d3fdc",
      "score": 70,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "分かれ道で相手に方向を示す行為は分かる。指さす・案内すると競合する。",
      "alternativeAnswersEn": [
        "guide",
        "point",
        "direction"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "meeting",
      "w": "meeting",
      "p": [
        "mōd-"
      ],
      "imagePath": "assets/word/meeting.png",
      "imageGitBlobSha": "1a5074a2eb38adc06f84d5eda3725758ea2550c4",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "書類を囲んで話し合う複数人から会議を連想しやすい。",
      "alternativeAnswersEn": [
        "discussion",
        "discuss"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "music",
      "w": "music",
      "p": [
        "men-1"
      ],
      "imagePath": "assets/word/music.png",
      "imageGitBlobSha": "c277cf834f78211ef4b36cd102d837123f6cdde2",
      "score": 90,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "ギター演奏と音符で音楽は明瞭だが、歌う・弾くも自然な答え。",
      "alternativeAnswersEn": [
        "sing",
        "play",
        "guitar"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "fall",
      "w": "fall",
      "p": [
        "pō̆l-"
      ],
      "imagePath": "assets/word/fall.png",
      "imageGitBlobSha": "942f0628b3d73e3d2ad044627d6306fd5b2766aa",
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "リンゴと下向きの動線から落下が分かる。リンゴやdropとの分散はある。",
      "alternativeAnswersEn": [
        "drop",
        "apple"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "heat",
      "w": "heat",
      "p": [
        "kai-"
      ],
      "imagePath": "assets/word/heat.png",
      "imageGitBlobSha": "559e76861b11dfe659c1ba0521f980e884c0373d",
      "score": 87,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "強い日差しと汗・熱気の印から暑さが分かる。heatとhotは絵で区別しにくい。",
      "alternativeAnswersEn": [
        "hot",
        "summer"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "region",
      "w": "region",
      "p": [
        "reg-"
      ],
      "imagePath": "assets/word/region.png",
      "imageGitBlobSha": "6a4a3475c3b51aab0d4ffbc697224a4874c8a1f1",
      "score": 55,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "地形図の一部を指す場面で、地域のほか地図・国・場所と読める。",
      "alternativeAnswersEn": [
        "map",
        "area",
        "country"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "communication",
      "w": "communication",
      "p": [
        "kom",
        "mei-1"
      ],
      "imagePath": "assets/word/communication.png",
      "imageGitBlobSha": "3417ee1a9d5b994c054227dff8da9ee2c858df59",
      "score": 73,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 21,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "糸電話でやりとりする行為は見えるが、communicationより話す・電話が直接的。",
      "alternativeAnswersEn": [
        "talk",
        "telephone",
        "communicate"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "earth",
      "w": "earth",
      "p": [
        "er-2"
      ],
      "imagePath": "assets/word/earth.png",
      "imageGitBlobSha": "c9a9afe598d6054c2c3605d140961f87a4398d2c",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "大陸と海を持つ地球の球形が明瞭。globeとの候補競合は少し残る。",
      "alternativeAnswersEn": [
        "globe",
        "planet"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "condition",
      "w": "condition",
      "p": [
        "kom",
        "deik-"
      ],
      "imagePath": "assets/word/condition.png",
      "imageGitBlobSha": "b93bbb110962c90ce50090dbceddfb71b3028edc",
      "score": 45,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 8
      },
      "reasonJa": "さびた自転車と困る整備士は状態の悪さを示すが、condition一般には絞れない。",
      "alternativeAnswersEn": [
        "rust",
        "repair",
        "broken"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "standard",
      "w": "standard",
      "p": [
        "stā-",
        "kar-"
      ],
      "imagePath": "assets/word/standard.png",
      "imageGitBlobSha": "e879ba71ba253633f2e7dc3e4f69f48c6b40a5b9",
      "score": 52,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "天秤と分銅は分かるが、基準という意味より重さ・比較・測定が強い。",
      "alternativeAnswersEn": [
        "weight",
        "balance",
        "measure"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "note",
      "w": "note",
      "p": [
        "gnō-"
      ],
      "imagePath": "assets/word/note.png",
      "imageGitBlobSha": "a759309addcc34c1cb94a9e429a0a9928fe17d6f",
      "score": 88,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "ピンで留める短い書き付けが大きく、メモとして分かりやすい。",
      "alternativeAnswersEn": [
        "memo",
        "message"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "stand",
      "w": "stand",
      "p": [
        "stā-"
      ],
      "imagePath": "assets/word/stand.png",
      "imageGitBlobSha": "7665e0efdbabf669f8dca868423699b3ac896dba",
      "score": 88,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "椅子の横で直立する姿から立つ動作が読める。standingなど語形は分かれる。",
      "alternativeAnswersEn": [
        "standing",
        "man"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "object",
      "w": "object",
      "p": [
        "epi",
        "yē-"
      ],
      "imagePath": "assets/word/object.png",
      "imageGitBlobSha": "8c09a14251324332dbd17b74d553383b64f2c80a",
      "score": 35,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "台の上の赤い立方体が主役で、物体一般を指すobjectには絞れない。",
      "alternativeAnswersEn": [
        "cube",
        "block",
        "red"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "game",
      "w": "game",
      "p": [],
      "imagePath": "assets/word/game.png",
      "imageGitBlobSha": "aba75734ecc99cbc31e76bac5e3d0ff143532397",
      "score": 89,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "盤と駒を使って遊ぶ二人からゲームが分かる。遊ぶという動詞も候補。",
      "alternativeAnswersEn": [
        "play",
        "board game"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "beautiful",
      "w": "beautiful",
      "p": [
        "deu-2",
        "pelə-1"
      ],
      "imagePath": "assets/word/beautiful.png",
      "imageGitBlobSha": "96df135593a3df9c136db154178429e880d6033c",
      "score": 63,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "花の美しさは連想できるが、花・桜・花瓶が具体的な答えになる。",
      "alternativeAnswersEn": [
        "flowers",
        "cherry blossom",
        "vase"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "sea",
      "w": "sea",
      "p": [],
      "imagePath": "assets/word/sea.png",
      "imageGitBlobSha": "8aa2049d0961110b21dab6f6242a632b975a45ef",
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "広い波と海上の景色で海が明瞭。oceanとの語の選択は残る。",
      "alternativeAnswersEn": [
        "ocean",
        "waves"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "industry",
      "w": "industry",
      "p": [
        "en",
        "sterə-"
      ],
      "imagePath": "assets/word/industry.png",
      "imageGitBlobSha": "8797773d8871612f17bee2819cbf7c128ca92318",
      "score": 62,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 8
      },
      "reasonJa": "織機で布を作る仕事は読めるが、産業一般より織る・織物が直接的。",
      "alternativeAnswersEn": [
        "weaving",
        "textile",
        "loom"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "science",
      "w": "science",
      "p": [
        "skei-"
      ],
      "imagePath": "assets/word/science.png",
      "imageGitBlobSha": "ef3c412968f303e1a899aca463f489275dbb74c0",
      "score": 72,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 8
      },
      "reasonJa": "植物を測定して記録する実験場面で科学を連想できるが、実験や生物学も候補。",
      "alternativeAnswersEn": [
        "experiment",
        "biology",
        "measure"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "boy",
      "w": "boy",
      "p": [],
      "imagePath": "assets/word/boy.png",
      "imageGitBlobSha": "50810050505cd1b29c71c9bebff0f1c07ca1b2e9",
      "score": 95,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "幼い男の子が単独で大きく描かれている。childとの競合は少し残る。",
      "alternativeAnswersEn": [
        "child"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "percent",
      "w": "percent",
      "p": [
        "per1",
        "dekm̥"
      ],
      "imagePath": "assets/word/percent.png",
      "imageGitBlobSha": "3097d67d699545859283ce5aac6578c204fdf253",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 9
      },
      "reasonJa": "25%と四分の一を示す図で百分率が明瞭。英語語形はpercentageとも分かれる。",
      "alternativeAnswersEn": [
        "percentage",
        "quarter"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "police",
      "w": "police",
      "p": [
        "pelə-3"
      ],
      "imagePath": "assets/word/police.png",
      "imageGitBlobSha": "1904e845fac23a85d3c68a334984011f9cd7a0f4",
      "score": 96,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 9
      },
      "reasonJa": "制服・帽子・警察車両の組合せで警察と分かりやすい。",
      "alternativeAnswersEn": [
        "police officers"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "author",
      "w": "author",
      "p": [
        "aug-"
      ],
      "imagePath": "assets/word/author.png",
      "imageGitBlobSha": "732df93aeb15a16a832a919e1f403d2c3e28c231",
      "score": 79,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "本をそばに置いて執筆する人物で著者を連想できるが、writerやwriteとも競合。",
      "alternativeAnswersEn": [
        "writer",
        "write"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "blue",
      "w": "blue",
      "p": [
        "bhel-1"
      ],
      "imagePath": "assets/word/blue.png",
      "imageGitBlobSha": "0f0bfec3b4742872c1c6ea714a8f97275e2dbfff",
      "score": 88,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 22,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "青色が面の大半を占めるが、色の指定がないと水差しも答えになる。",
      "alternativeAnswersEn": [
        "jug",
        "pitcher"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "distribution",
      "w": "distribution",
      "p": [
        "dwis-",
        "trei-"
      ],
      "imagePath": "assets/word/distribution.png",
      "imageGitBlobSha": "faa2a5260d0e3b46512701bbe30c1bc1577c4536",
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 8
      },
      "reasonJa": "列に並ぶ人へパンを配る動作は分かるが、give・hand outなどにも分かれる。",
      "alternativeAnswersEn": [
        "give",
        "hand out",
        "bread"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "window",
      "w": "window",
      "p": [
        "wē-",
        "okʷ-"
      ],
      "imagePath": "assets/word/window.png",
      "imageGitBlobSha": "e2f9bf365898d724b90ba2bb7e3989e98d9c9973",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた窓枠とガラスが明瞭で窓として識別しやすい。",
      "alternativeAnswersEn": [
        "open window"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "importance",
      "w": "importance",
      "p": [
        "en",
        "per-2"
      ],
      "imagePath": "assets/word/importance.png",
      "imageGitBlobSha": "7b3feba8ac3a8dac56dcf093f4efb8c592e8afae",
      "score": 39,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "屋根を支える柱と作業員は見えるが、重要性という抽象概念の答えは特定しにくい。",
      "alternativeAnswersEn": [
        "support",
        "pillar",
        "builder"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "program",
      "w": "program",
      "p": [
        "per1",
        "gerbh-"
      ],
      "imagePath": "assets/word/program.png",
      "imageGitBlobSha": "320c70061f70dfe0a883f2d36a7a6b9bde0e1f5a",
      "score": 68,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 8
      },
      "reasonJa": "テレビの料理番組を見ている場面で番組を連想できるが、テレビや料理も候補。",
      "alternativeAnswersEn": [
        "television",
        "show",
        "cooking"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "stress",
      "w": "stress",
      "p": [
        "streig-"
      ],
      "imagePath": "assets/word/stress.png",
      "imageGitBlobSha": "03a16d75837f0644e608b442ef076b0430cec616",
      "score": 86,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "仕事に追われ頭を抱える表情からストレスが読み取りやすい。",
      "alternativeAnswersEn": [
        "overwhelmed",
        "worry"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "news",
      "w": "news",
      "p": [],
      "imagePath": "assets/word/news.png",
      "imageGitBlobSha": "a512792ce199e5f46daeccb5eb4943533b045b99",
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "新聞・スマートフォンの記事・マイクからニュースを連想できる。媒体そのものも候補。",
      "alternativeAnswersEn": [
        "media",
        "newspaper"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "organization",
      "w": "organization",
      "p": [
        "werg-"
      ],
      "imagePath": "assets/word/organization.png",
      "imageGitBlobSha": "a7e404593c69254eb17aa308e04a41eb19be12ea",
      "score": 47,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 8
      },
      "reasonJa": "箱を扱う作業員と指示する人は見えるが、組織より会社や配送作業が具体的。",
      "alternativeAnswersEn": [
        "company",
        "delivery",
        "work"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "reality",
      "w": "reality",
      "p": [
        "rē-"
      ],
      "imagePath": "assets/word/reality.png",
      "imageGitBlobSha": "3ca677ab5248a26b5e768eccf9182c543d6dee17",
      "score": 49,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "楽しい想像と散らかった部屋の対比はあるが、現実という抽象名詞には絞れない。",
      "alternativeAnswersEn": [
        "dream",
        "mess",
        "wake"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "date",
      "w": "date",
      "p": [
        "dō-"
      ],
      "imagePath": "assets/word/date.png",
      "imageGitBlobSha": "def52aad28890688df64b8a3bbf624c673dc8cbe",
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "カレンダーの一日を丸で囲む場面で日付が分かる。カレンダーや予定とも競合。",
      "alternativeAnswersEn": [
        "calendar",
        "day",
        "schedule"
      ],
      "assessedAt": "2026-10-19T04:22:57.830274+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "continue",
      "w": "continue",
      "p": [
        "kom",
        "ten-"
      ],
      "imagePath": "assets/word/continue.png",
      "imageGitBlobSha": "b1ea36cabe54b624f05637b1911982bb5a66ea24",
      "score": 41,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "長いマフラーを編む姿は見えるが、継続という動作の時間的な条件は絵だけでは弱い。",
      "alternativeAnswersEn": [
        "knit",
        "scarf",
        "knitting"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "correct",
      "w": "correct",
      "p": [
        "kom",
        "reg-"
      ],
      "imagePath": "assets/word/correct.png",
      "imageGitBlobSha": "4736e523d6ba2e62a78064b497c6ed050d7339b9",
      "score": 67,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "形合わせで合うピースを入れる場面は正しさを示しうるが、fit・shapeも候補。",
      "alternativeAnswersEn": [
        "fit",
        "shape",
        "triangle"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "event",
      "w": "event",
      "p": [
        "eghs",
        "gʷā-"
      ],
      "imagePath": "assets/word/event.png",
      "imageGitBlobSha": "b9a5506a843b712b523730f98ee29c1e54637cff",
      "score": 61,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 18,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "テープカットの催しは分かるが、式典・開店などの具体名に答えが分散する。",
      "alternativeAnswersEn": [
        "ceremony",
        "opening",
        "celebrate"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "reach",
      "w": "reach",
      "p": [
        "reig-2"
      ],
      "imagePath": "assets/word/reach.png",
      "imageGitBlobSha": "0bd80a2c7e2594797efa0ebc2356c808e90efba4",
      "score": 74,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "道を登って旗のある場所へ着いた姿が分かる。到着・登る・達成も競合。",
      "alternativeAnswersEn": [
        "arrive",
        "climb",
        "achieve"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "success",
      "w": "success",
      "p": [
        "upo",
        "ked-"
      ],
      "imagePath": "assets/word/success.png",
      "imageGitBlobSha": "47e0630e64d1dd75ba9d50691302f5e25e8376c8",
      "score": 79,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "頂上に登って喜ぶ姿から成功を連想できるが、達成や勝利とも読める。",
      "alternativeAnswersEn": [
        "achievement",
        "climb",
        "victory"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "income",
      "w": "income",
      "p": [
        "en",
        "gʷā-"
      ],
      "imagePath": "assets/word/income.png",
      "imageGitBlobSha": "3e999d009f2216c27e132f61541a8bafc51cbf60",
      "score": 60,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "椅子と金銭の受け渡しは分かるが、収入より売買・支払いが直接的。",
      "alternativeAnswersEn": [
        "sell",
        "buy",
        "payment"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "capacity",
      "w": "capacity",
      "p": [
        "kap-"
      ],
      "imagePath": "assets/word/capacity.png",
      "imageGitBlobSha": "e3808becd6f820da073e5045e4b0c6956cfb7237",
      "score": 49,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "水が入った計量容器で容量を連想できるが、水の量・計量カップが強い。",
      "alternativeAnswersEn": [
        "volume",
        "water",
        "jug"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "faith",
      "w": "faith",
      "p": [
        "bheidh-"
      ],
      "imagePath": "assets/word/faith.png",
      "imageGitBlobSha": "987c69578ceda7025a42ad5e38bf84e22b75315f",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "支えてもらい水に浮く姿から信頼は連想できるが、faithよりtrust・泳ぐが自然。",
      "alternativeAnswersEn": [
        "trust",
        "float",
        "swim"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "phase",
      "w": "phase",
      "p": [
        "bhā-1"
      ],
      "imagePath": "assets/word/phase.png",
      "imageGitBlobSha": "402599257b10e58aa2803d5475329ddc8c65c02f",
      "score": 34,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "苗を観察する一場面で、段階や局面というphaseに絞る手掛かりが乏しい。",
      "alternativeAnswersEn": [
        "plant",
        "observe",
        "growth"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "student",
      "w": "student",
      "p": [
        "(s)teu-1"
      ],
      "imagePath": "assets/word/student.png",
      "imageGitBlobSha": "e57ae1101bd760d23fd14320a366cd16a9469caf",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 9
      },
      "reasonJa": "教科書・机・かばんと勉強する子供で学生を識別しやすい。",
      "alternativeAnswersEn": [
        "pupil",
        "study"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "volume",
      "w": "volume",
      "p": [
        "wel-3"
      ],
      "imagePath": "assets/word/volume.png",
      "imageGitBlobSha": "ee57e7b69e7cf2cffb7b5f98e65b248df734ff79",
      "score": 65,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "計量容器の水位を指す場面で量を連想できるが、容量・測定とも競合する。",
      "alternativeAnswersEn": [
        "capacity",
        "measure",
        "amount"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "appear",
      "w": "appear",
      "p": [
        "ad-"
      ],
      "imagePath": "assets/word/appear.png",
      "imageGitBlobSha": "9f5b7cfe48ef4b3492653b5007f661bb4990daf8",
      "score": 59,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "茂みからウサギが出てくる様子は見えるが、出現よりウサギ・隠れるとも読める。",
      "alternativeAnswersEn": [
        "rabbit",
        "emerge",
        "hide"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "glass",
      "w": "glass",
      "p": [
        "ghel-2"
      ],
      "imagePath": "assets/word/glass.png",
      "imageGitBlobSha": "9749801bd505ece65233a92d133ad3aa8fac421e",
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "透けて見える大きな板からガラスを読み取りやすい。窓ガラスも候補。",
      "alternativeAnswersEn": [
        "pane",
        "window"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "contact",
      "w": "contact",
      "p": [
        "kom",
        "tag-"
      ],
      "imagePath": "assets/word/contact.png",
      "imageGitBlobSha": "fbe136bae644183797df2c2e185e016c8e2b7433",
      "score": 74,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "二人の指先が触れる接点は明瞭だが、contactとtouchの区別はつかない。",
      "alternativeAnswersEn": [
        "touch",
        "finger"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "online",
      "w": "online",
      "p": [],
      "imagePath": "assets/word/online.png",
      "imageGitBlobSha": "051afca5b5070f50849a7a7756ac652b43d6bc8a",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "端末と通信のアイコンでネット接続を連想できる。internet・networkも候補。",
      "alternativeAnswersEn": [
        "internet",
        "network",
        "wifi"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "couple",
      "w": "couple",
      "p": [
        "kom",
        "ap-1"
      ],
      "imagePath": "assets/word/couple.png",
      "imageGitBlobSha": "2fc1c2084eba0536ad372601fb933b34eb6c9b90",
      "score": 57,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 17,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "二つで一組の手袋は見えるが、coupleよりpair・mittensが自然な答え。",
      "alternativeAnswersEn": [
        "pair",
        "mittens"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "plant",
      "w": "plant",
      "p": [
        "plat-"
      ],
      "imagePath": "assets/word/plant.png",
      "imageGitBlobSha": "fb9002ead8d7216e0f5f7fa26999ab610410245b",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "鉢と葉・茎を持つ植物が単独で描かれている。豆の植物という具体名も候補。",
      "alternativeAnswersEn": [
        "bean",
        "potted plant"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "task",
      "w": "task",
      "p": [
        "tag-"
      ],
      "imagePath": "assets/word/task.png",
      "imageGitBlobSha": "3a95205e202841a008ccc4dc55ec201d5362ad61",
      "score": 46,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "掃き掃除をする姿から作業は連想できるが、task一般より掃除・ほうきが直接的。",
      "alternativeAnswersEn": [
        "sweep",
        "clean",
        "chore"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "address",
      "w": "address",
      "p": [
        "ad-",
        "reg-"
      ],
      "imagePath": "assets/word/address.png",
      "imageGitBlobSha": "ef21d9b89a0e3b0edf597541542b128c5cb86d13",
      "score": 56,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "家と位置ピン・郵便受けが住所を連想させるが、location・homeとも読める。",
      "alternativeAnswersEn": [
        "location",
        "house",
        "home"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "opportunity",
      "w": "opportunity",
      "p": [
        "epi",
        "per-2"
      ],
      "imagePath": "assets/word/opportunity.png",
      "imageGitBlobSha": "3c1a5f216266f9195b97d86a0038483ae23360e3",
      "score": 41,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "電車へ乗り込む場面で、機会という抽象名詞に限定する情報は少ない。",
      "alternativeAnswersEn": [
        "board",
        "train",
        "welcome"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "manner",
      "w": "manner",
      "p": [
        "man-2"
      ],
      "imagePath": "assets/word/manner.png",
      "imageGitBlobSha": "c892fdcb959791bf644bd8620b575e70578700ad",
      "score": 30,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 7,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "餃子を包む料理人が見えるが、方法や態度を指すmannerは特定できない。",
      "alternativeAnswersEn": [
        "cook",
        "dumpling",
        "make"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "hot",
      "w": "hot",
      "p": [
        "kai-"
      ],
      "imagePath": "assets/word/hot.png",
      "imageGitBlobSha": "e8168f70a09d36bc22361d95759660760b954d9d",
      "score": 90,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 9
      },
      "reasonJa": "湯気の立つカップと手を引く反応で熱さが明瞭。heatとの語形は分かれる。",
      "alternativeAnswersEn": [
        "heat",
        "burn"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "discussion",
      "w": "discussion",
      "p": [],
      "imagePath": "assets/word/discussion.png",
      "imageGitBlobSha": "75c58c0f6e929d1dc7a9dfc9ee7d0384cec47a05",
      "score": 86,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "図を指しながら意見を交わす二人で話し合いが分かる。会話や計画とも競合。",
      "alternativeAnswersEn": [
        "talk",
        "conversation",
        "plan"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "write",
      "w": "write",
      "p": [
        "wreid-"
      ],
      "imagePath": "assets/word/write.png",
      "imageGitBlobSha": "554575a60c548b8e8f7d75bb9cfc68b0d7380726",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "ペン先と紙の線の接点が大きく、書く動作が明瞭。",
      "alternativeAnswersEn": [
        "writing"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "wish",
      "w": "wish",
      "p": [
        "wen-1"
      ],
      "imagePath": "assets/word/wish.png",
      "imageGitBlobSha": "bf2a524f8a4c17a7af95ea41a0da6025c299dd1a",
      "score": 53,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "ケーキに手を伸ばす姿は欲しがる気持ちを示すが、wishよりwantが自然。",
      "alternativeAnswersEn": [
        "want",
        "desire",
        "cake"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "shoulder",
      "w": "shoulder",
      "p": [],
      "imagePath": "assets/word/shoulder.png",
      "imageGitBlobSha": "7a0b72ac37e12ca207e5a870df0d05515d31e869",
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "触れている肩の位置は明瞭だが、痛むという答えも強い。",
      "alternativeAnswersEn": [
        "pain",
        "ache"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "rise",
      "w": "rise",
      "p": [
        "er-1"
      ],
      "imagePath": "assets/word/rise.png",
      "imageGitBlobSha": "5ef07d88446aae7e1555fd0943348d71d4b92cb7",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "上へ浮く風船と矢印で上昇が分かる。float・balloonも候補。",
      "alternativeAnswersEn": [
        "float",
        "balloon",
        "up"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "economy",
      "w": "economy",
      "p": [
        "weik-1",
        "nem-"
      ],
      "imagePath": "assets/word/economy.png",
      "imageGitBlobSha": "34bae218b3855f13e1f083a6b4d93c488a3ed808",
      "score": 60,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 7
      },
      "reasonJa": "製造・運搬・販売のつながりは経済を連想させるが、小さな場面が多く業界や物流とも読める。",
      "alternativeAnswersEn": [
        "industry",
        "trade",
        "supply chain"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "sun",
      "w": "sun",
      "p": [
        "saəwel-"
      ],
      "imagePath": "assets/word/sun.png",
      "imageGitBlobSha": "c94eaf06ce98950e4f768f26e79e0d3a290cf84f",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "放射状の光を持つ黄色い太陽が単独で大きく描かれている。",
      "alternativeAnswersEn": [
        "sunshine"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "failure",
      "w": "failure",
      "p": [],
      "imagePath": "assets/word/failure.png",
      "imageGitBlobSha": "df42b5afcc0351422e10607be5599a65882865ad",
      "score": 73,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 21,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "崩れた積み木と落胆した姿が失敗を示すが、壊れる・悲しいとも読める。",
      "alternativeAnswersEn": [
        "fail",
        "collapse",
        "disappointed"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "staff",
      "w": "staff",
      "p": [
        "stebh-"
      ],
      "imagePath": "assets/word/staff.png",
      "imageGitBlobSha": "b7c47579b4894b4d4ee48b3840907e2ac2630bbc",
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "店で働く制服姿の複数人からスタッフが分かる。employeesなどと答えが競合。",
      "alternativeAnswersEn": [
        "employees",
        "workers"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "target",
      "w": "target",
      "p": [
        "dergh-"
      ],
      "imagePath": "assets/word/target.png",
      "imageGitBlobSha": "19aa0386b21f974a400148e0e695d531daf65b74",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "同心円の的と刺さった矢でターゲットが明瞭。中心点という答えも少し残る。",
      "alternativeAnswersEn": [
        "bullseye"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "center",
      "w": "center",
      "p": [
        "kent-"
      ],
      "imagePath": "assets/word/center.png",
      "imageGitBlobSha": "12a1bf7e9152652e47a182783a9ce17a862abc27",
      "score": 36,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "星が円形に複数並ぶが、中央の星を選ぶ強調がなくcenterを特定しにくい。",
      "alternativeAnswersEn": [
        "stars",
        "circle",
        "pattern"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "gas",
      "w": "gas",
      "p": [
        "ghēu-"
      ],
      "imagePath": "assets/word/gas.png",
      "imageGitBlobSha": "5dc1b1b61f775181511b5e4a52f9048449844059",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "ガス容器から噴き出す雲状のものが描かれ、ガスを連想しやすい。",
      "alternativeAnswersEn": [
        "cylinder",
        "air"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "speed",
      "w": "speed",
      "p": [
        "spē-"
      ],
      "imagePath": "assets/word/speed.png",
      "imageGitBlobSha": "c591e03415ddf4f5b85c0f490267579e4c7ce351",
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "車と長い動線から速さは分かるが、speedよりfast・raceとも答えられる。",
      "alternativeAnswersEn": [
        "fast",
        "race"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "add",
      "w": "add",
      "p": [
        "ad-",
        "dō-"
      ],
      "imagePath": "assets/word/add.png",
      "imageGitBlobSha": "8d4b6f410efded66e5df019c5b8e4bfb331569cb",
      "score": 74,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "果物入りの器へリンゴを一つ加える動作は見えるが、put・appleとも競合する。",
      "alternativeAnswersEn": [
        "put",
        "apple"
      ],
      "assessedAt": "2026-10-19T04:28:15.774650+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "all",
      "w": "all",
      "p": [
        "al-5"
      ],
      "imagePath": "assets/word/all.png",
      "imageGitBlobSha": "1ee4ca9f4bc4fea68a3d7a6097f12855c943d444",
      "score": 41,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "収穫したリンゴと実のない木は見えるが、全部を取り切ったかは静止画だけでは確定しない。",
      "alternativeAnswersEn": [
        "harvest",
        "apples",
        "collect"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "been",
      "w": "been",
      "p": [
        "bheuə-"
      ],
      "imagePath": "assets/word/been.png",
      "imageGitBlobSha": "436ccfb3db8e3cc4619b4ee7ba5c11de35b85612",
      "score": 26,
      "components": {
        "meaningVisible": 11,
        "conceptDistinct": 7,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "昔の写真を持つ高齢者は過去を連想させるが、beenという文法形は特定できない。",
      "alternativeAnswersEn": [
        "past",
        "memory",
        "retired"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "but",
      "w": "but",
      "p": [
        "ambhi",
        "ud-"
      ],
      "imagePath": "assets/word/but.png",
      "imageGitBlobSha": "4f2afaebca2b9b3d75eb1e091827bceae5d1653a",
      "score": 29,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 8,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "雨でも楽しそうな人物という対比はあるが、接続詞butを絵だけで特定できない。",
      "alternativeAnswersEn": [
        "rain",
        "umbrella",
        "happy"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "can",
      "w": "can",
      "p": [
        "gnō-"
      ],
      "imagePath": "assets/word/can.png",
      "imageGitBlobSha": "c204e64c341b9c1b056dffb6df4c96a1c1983a97",
      "score": 50,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "自転車に乗れる子供は能力の一例だが、canよりride・bicycleが直接的な答え。",
      "alternativeAnswersEn": [
        "ride",
        "bicycle",
        "learn"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "have",
      "w": "have",
      "p": [
        "kap-"
      ],
      "imagePath": "assets/word/have.png",
      "imageGitBlobSha": "e5d4b739bd8e5c200810958ea6d147cf44a05a33",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "ぬいぐるみを持つ姿から所有は連想できるが、抱く・持つという動作とも競合。",
      "alternativeAnswersEn": [
        "hold",
        "hug",
        "teddy bear"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "like",
      "w": "like",
      "p": [
        "līk-"
      ],
      "imagePath": "assets/word/like.png",
      "imageGitBlobSha": "0fd505718ca0c3c6d4349b8f6eb6042fc073c6f7",
      "score": 62,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "鏡の前で服を気に入る表情は見えるが、満足・服・鏡などにも分かれる。",
      "alternativeAnswersEn": [
        "enjoy",
        "pleased",
        "jacket"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "more",
      "w": "more",
      "p": [
        "mē-3"
      ],
      "imagePath": "assets/word/more.png",
      "imageGitBlobSha": "e3299479715f7a0e7698895e359fe1576f7fcb44",
      "score": 56,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "リンゴをさらに渡す場面だが、比較する量が示されずmoreへの特定は弱い。",
      "alternativeAnswersEn": [
        "give",
        "add",
        "apples"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "out",
      "w": "out",
      "p": [
        "ud-"
      ],
      "imagePath": "assets/word/out.png",
      "imageGitBlobSha": "7cd09a7c9d463480fd97d7fd7dade7ba9db04bc2",
      "score": 78,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 9
      },
      "reasonJa": "犬が戸口の外へ出る位置関係は明瞭。outside・exitなども候補。",
      "alternativeAnswersEn": [
        "outside",
        "exit",
        "dog"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "said",
      "w": "said",
      "p": [],
      "imagePath": "assets/word/said.png",
      "imageGitBlobSha": "43d68d2d8c15f8bf8140a63cb68ee6f46199f80a",
      "score": 26,
      "components": {
        "meaningVisible": 11,
        "conceptDistinct": 7,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "手を振り声を掛ける場面でsayは連想できても、過去形saidは示されていない。",
      "alternativeAnswersEn": [
        "say",
        "goodbye",
        "wave"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "their",
      "w": "their",
      "p": [
        "to-"
      ],
      "imagePath": "assets/word/their.png",
      "imageGitBlobSha": "9e0872e30dfc6ffd6d1a7941020cfd660f8949e2",
      "score": 33,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 9,
        "answerSpecific": 1,
        "smallImageReadable": 8
      },
      "reasonJa": "別の二人とテントを指す場面だが、所有関係やtheirという語形は特定しにくい。",
      "alternativeAnswersEn": [
        "them",
        "tent",
        "camp"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "was",
      "w": "was",
      "p": [
        "wes-3"
      ],
      "imagePath": "assets/word/was.png",
      "imageGitBlobSha": "cc07388d5bebd4257c781815c21e9e8b6afa35eb",
      "score": 25,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "一人の肖像と時計の矢印は過去を示しうるが、wasというbe動詞の形には絞れない。",
      "alternativeAnswersEn": [
        "past",
        "portrait",
        "time"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "were",
      "w": "were",
      "p": [
        "wes-3"
      ],
      "imagePath": "assets/word/were.png",
      "imageGitBlobSha": "6ae4ab4d3bbf19595d7f680337d3693342586019",
      "score": 25,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "二人の肖像と時計の矢印だけではwereという文法形は特定できない。",
      "alternativeAnswersEn": [
        "past",
        "people",
        "time"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "which",
      "w": "which",
      "p": [
        "kʷo-",
        "līk-"
      ],
      "imagePath": "assets/word/which.png",
      "imageGitBlobSha": "43ec7ae70d4ca25da927361327cffa34df2c2c08",
      "score": 52,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "二つの帽子を前に選ぶ場面は分かるが、whichよりchoose・hatも自然。",
      "alternativeAnswersEn": [
        "choose",
        "hat",
        "choice"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "will",
      "w": "will",
      "p": [
        "wel-2"
      ],
      "imagePath": "assets/word/will.png",
      "imageGitBlobSha": "cfcc9e2af9166eec72d9ccc04d7c25c2d8e0f485",
      "score": 50,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "旗の横で拳を握る人物から決意は連想できるが、willという名詞には絞りにくい。",
      "alternativeAnswersEn": [
        "determination",
        "resolve",
        "brave"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "only",
      "w": "only",
      "p": [
        "oi-no-"
      ],
      "imagePath": "assets/word/only.png",
      "imageGitBlobSha": "df65df0f260ad115de72f34d4ac82c4262178cfa",
      "score": 57,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "皿に一つだけのクッキーは見えるが、one・last・cookieとも読める。",
      "alternativeAnswersEn": [
        "one",
        "last",
        "cookie"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "our",
      "w": "our",
      "p": [
        "nes-2"
      ],
      "imagePath": "assets/word/our.png",
      "imageGitBlobSha": "b99498c61b964415c19d6c76a021a167d7809252",
      "score": 42,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 12,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "鍵を持つ二人と家で共有の所有は連想できるが、ourとoursやhomeの区別はつかない。",
      "alternativeAnswersEn": [
        "ours",
        "home",
        "keys"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "over",
      "w": "over",
      "p": [
        "uper"
      ],
      "imagePath": "assets/word/over.png",
      "imageGitBlobSha": "5699f9374ecc0bebe47543c13b20a90e85bf04a9",
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "橋の上を飛ぶ鳥で上下関係は分かるが、overとabove・flyが競合する。",
      "alternativeAnswersEn": [
        "above",
        "fly",
        "bridge"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "any",
      "w": "any",
      "p": [
        "oi-no-"
      ],
      "imagePath": "assets/word/any.png",
      "imageGitBlobSha": "81547032ffbd785e90f4bb4f7836fe2edba4f0a8",
      "score": 38,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "複数の物を示しているが、どれでもよいというanyの条件は絵では確定しない。",
      "alternativeAnswersEn": [
        "choose",
        "objects",
        "choice"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "first",
      "w": "first",
      "p": [
        "per1"
      ],
      "imagePath": "assets/word/first.png",
      "imageGitBlobSha": "dbc48a7b078c90f6afbe665ae9a5e02ca8c34f72",
      "score": 90,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 9
      },
      "reasonJa": "ほかの走者より先にゴールする姿から一番が読み取りやすい。",
      "alternativeAnswersEn": [
        "win",
        "winner"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "just@yeug",
      "w": "just",
      "p": [
        "yeug-"
      ],
      "imagePath": "assets/word/just@yeug.png",
      "imageGitBlobSha": "2d32d6b2125217a9aa8651509834bbeb729b79a9",
      "score": 62,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "登録語義に沿う馬上の槍試合は見えるが、答えとしてjoustが強くjustを特定しにくい。",
      "alternativeAnswersEn": [
        "joust",
        "knights",
        "tournament"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "made@mag",
      "w": "made",
      "p": [
        "mag-"
      ],
      "imagePath": "assets/word/made@mag.png",
      "imageGitBlobSha": "d0ab17e0fd6e478a3712ec386b0eca1159bb7f82",
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 17,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "職人と完成した椅子は作成済みを示しうるが、makeとmadeの時制は絵だけでは区別できない。",
      "alternativeAnswersEn": [
        "make",
        "stool",
        "finished"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "now",
      "w": "now",
      "p": [
        "nu-"
      ],
      "imagePath": "assets/word/now.png",
      "imageGitBlobSha": "7435f76023d629b8a27804da4b450a4b4bdcf23d",
      "score": 27,
      "components": {
        "meaningVisible": 11,
        "conceptDistinct": 7,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "靴ひもを結ぶ子供と待つ大人の場面で、今という時間指定は読み取れない。",
      "alternativeAnswersEn": [
        "tie",
        "wait",
        "shoes"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "life",
      "w": "life",
      "p": [
        "leip-"
      ],
      "imagePath": "assets/word/life.png",
      "imageGitBlobSha": "b0d305863e7e9db6417962c3b4bb86ab97123163",
      "score": 64,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "手の中の苗から命を連想できるが、植物・成長・育てるとも競合する。",
      "alternativeAnswersEn": [
        "plant",
        "growth",
        "care"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "being",
      "w": "being",
      "p": [
        "bheuə-"
      ],
      "imagePath": "assets/word/being.png",
      "imageGitBlobSha": "13ef67b26133b4f7894a205b32a607c12be46a28",
      "score": 32,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "ウサギという生物は見えるが、存在を意味するbeing一般には特定できない。",
      "alternativeAnswersEn": [
        "rabbit",
        "animal"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "get",
      "w": "get",
      "p": [
        "ghend-"
      ],
      "imagePath": "assets/word/get.png",
      "imageGitBlobSha": "074ac9db68428ab8f3451ef8920c8339c0425968",
      "score": 74,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "本を受け取る動作は明瞭だが、getとreceive・borrowが競合する。",
      "alternativeAnswersEn": [
        "receive",
        "borrow",
        "book"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "used",
      "w": "used",
      "p": [],
      "imagePath": "assets/word/used.png",
      "imageGitBlobSha": "cd9ec735f141c8951b72c8679d4da77fdafd9f9a",
      "score": 30,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 8,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "包丁で調理している姿からuseは連想できるが、過去形usedは示されていない。",
      "alternativeAnswersEn": [
        "cut",
        "cook",
        "use"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "many",
      "w": "many",
      "p": [
        "menegh-"
      ],
      "imagePath": "assets/word/many.png",
      "imageGitBlobSha": "68ff0f7f444cc2e8bf6d1bbc30f9a9f320148a79",
      "score": 71,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "多くのリンゴは見えるが、リンゴ・いっぱい・たくさんという候補に分かれる。",
      "alternativeAnswersEn": [
        "apples",
        "lots",
        "full"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "both",
      "w": "both",
      "p": [
        "ambhō-",
        "to-"
      ],
      "imagePath": "assets/word/both.png",
      "imageGitBlobSha": "17d5ab494a51d3678ce501ffc7816b2e733cc0e8",
      "score": 58,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "二つの菓子を両手に持つ姿で両方は連想できるが、two・cupcakesとも読める。",
      "alternativeAnswersEn": [
        "two",
        "cupcakes",
        "pair"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "same",
      "w": "same",
      "p": [
        "sem-1"
      ],
      "imagePath": "assets/word/same.png",
      "imageGitBlobSha": "eb10c305e3274c0551d6ef826fc460efa1203d6c",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "同じ色柄と形のカップが並び、同一であることを読み取りやすい。",
      "alternativeAnswersEn": [
        "identical",
        "matching"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "each",
      "w": "each",
      "p": [
        "aiw-",
        "līk-"
      ],
      "imagePath": "assets/word/each.png",
      "imageGitBlobSha": "ea5745677a7b9850a7964c475052b5bc0495ea00",
      "score": 64,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "各皿にリンゴが一つずつある配置は分かるが、eachとevery・oneが競合する。",
      "alternativeAnswersEn": [
        "every",
        "one",
        "serve"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "own",
      "w": "own",
      "p": [
        "aik-1"
      ],
      "imagePath": "assets/word/own.png",
      "imageGitBlobSha": "24466b1ebe9d736f3903b9739f8a30c67ec14165",
      "score": 53,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "自転車に名札状の印を付ける様子は所有を連想させるが、mine・bicycleとも読める。",
      "alternativeAnswersEn": [
        "mine",
        "bicycle",
        "label"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "need",
      "w": "need",
      "p": [
        "nāu-1"
      ],
      "imagePath": "assets/word/need.png",
      "imageGitBlobSha": "6856f0fcad4a977596ccc3cb3baf8b2cb385ab7a",
      "score": 58,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "空の容器と喉の渇きから水が必要とは分かるが、thirsty・drinkが直接的。",
      "alternativeAnswersEn": [
        "thirsty",
        "water",
        "drink"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "day",
      "w": "day",
      "p": [
        "agh-2"
      ],
      "imagePath": "assets/word/day.png",
      "imageGitBlobSha": "f994348dd716f1fccf3e63021883a7f314db5541",
      "score": 66,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 9
      },
      "reasonJa": "太陽の下で遊ぶ明るい場面は昼を示すが、dayよりplay・sunも自然な答え。",
      "alternativeAnswersEn": [
        "daytime",
        "play",
        "sun"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "still",
      "w": "still",
      "p": [
        "stel-"
      ],
      "imagePath": "assets/word/still.png",
      "imageGitBlobSha": "71241f710c0b0cbc23c4e38e2093a09c67533eb8",
      "score": 48,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "静かに読書する人と眠る猫は落ち着きを示すが、動かないというstillは限定しにくい。",
      "alternativeAnswersEn": [
        "quiet",
        "read",
        "calm"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "off",
      "w": "off",
      "p": [
        "apo-"
      ],
      "imagePath": "assets/word/off.png",
      "imageGitBlobSha": "3b51eb7b1c3303487a3af8be3d75069d0e1bb521",
      "score": 56,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "鍋のふたを外した状態は見えるが、offよりlid・remove・openが自然。",
      "alternativeAnswersEn": [
        "remove",
        "lid",
        "open"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "hand",
      "w": "hand",
      "p": [],
      "imagePath": "assets/word/hand.png",
      "imageGitBlobSha": "79b7e0ebac78a2921b40780b0068dc21981d2f5d",
      "score": 99,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 24,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた手のひらと五本の指が大きく単独で描かれている。",
      "alternativeAnswersEn": [
        "palm"
      ],
      "assessedAt": "2026-10-19T04:34:58.641608+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "going",
      "w": "going",
      "p": [
        "ghē-"
      ],
      "imagePath": "assets/word/going.png",
      "imageGitBlobSha": "631bb5f64bd2dbc0c974ef08140d8ea65f872d84",
      "score": 54,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "バスへ乗り込み別れを告げる場面で行くことは連想できるが、goingという語形には絞れない。",
      "alternativeAnswersEn": [
        "go",
        "leave",
        "board"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "little",
      "w": "little",
      "p": [
        "leud-"
      ],
      "imagePath": "assets/word/little.png",
      "imageGitBlobSha": "1082605278103ec941469159473d3a6f3e343b95",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "靴との大きさの対比で子猫の小ささは明瞭。littleとsmall・kittenが競合する。",
      "alternativeAnswersEn": [
        "small",
        "kitten"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "found@bhudh",
      "w": "found",
      "p": [
        "bhudh-"
      ],
      "imagePath": "assets/word/found@bhudh.png",
      "imageGitBlobSha": "042e891aacd7998d73029d0352edd3e84d113e69",
      "score": 58,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 8
      },
      "reasonJa": "学校を思い描いて土台を積む姿から設立を連想できるが、build・foundationが直接的。",
      "alternativeAnswersEn": [
        "build",
        "foundation",
        "school"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "three",
      "w": "three",
      "p": [
        "trei-"
      ],
      "imagePath": "assets/word/three.png",
      "imageGitBlobSha": "655d702c42019e137d1b8aa7ed92e92f9aecfe7a",
      "score": 93,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "三つのオレンジが重ならず数えやすい。果物を答える可能性は残る。",
      "alternativeAnswersEn": [
        "oranges"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "another",
      "w": "another",
      "p": [
        "oi-no-",
        "al-1"
      ],
      "imagePath": "assets/word/another.png",
      "imageGitBlobSha": "138c50112230e500c29a1fd4ef40e91f3fc727f0",
      "score": 53,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "既に一杯を持つ人へ別の一杯が差し出されるが、anotherよりmore・giveも候補。",
      "alternativeAnswersEn": [
        "more",
        "give",
        "cup"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "come",
      "w": "come",
      "p": [
        "gʷā-"
      ],
      "imagePath": "assets/word/come.png",
      "imageGitBlobSha": "eb6730347ae395420b8a7e265be2972fa8d0bf1f",
      "score": 79,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "迎える人物へ走り寄る動作は分かる。comeとarrive・runが競合する。",
      "alternativeAnswersEn": [
        "arrive",
        "run"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "away",
      "w": "away",
      "p": [
        "ne",
        "wegh-"
      ],
      "imagePath": "assets/word/away.png",
      "imageGitBlobSha": "7d6b1ffafb6ed1535ca41062083ed64b466666b7",
      "score": 70,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "吠える犬から離れて走る方向が明瞭だが、awayより逃げる動詞も自然。",
      "alternativeAnswersEn": [
        "escape",
        "run",
        "afraid"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "are@er1",
      "w": "are",
      "p": [
        "er-1"
      ],
      "imagePath": "assets/word/are@er1.png",
      "imageGitBlobSha": "bbced066af3506a9563ad35e240e29131a35a8b3",
      "score": 25,
      "components": {
        "meaningVisible": 9,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "二人が自分を指す姿だけではareというbe動詞の語形を特定できない。",
      "alternativeAnswersEn": [
        "people",
        "we",
        "father"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "came@gwa",
      "w": "came",
      "p": [
        "gʷā-"
      ],
      "imagePath": "assets/word/came@gwa.png",
      "imageGitBlobSha": "284a71e4f6be095ed11f202b10d84ea1e225b2ad",
      "score": 31,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "入口の人物と時計の逆向き矢印は過去を示しうるが、cameに絞る手掛かりは弱い。",
      "alternativeAnswersEn": [
        "arrive",
        "past",
        "door"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "social",
      "w": "social",
      "p": [
        "sekʷ-1"
      ],
      "imagePath": "assets/word/social.png",
      "imageGitBlobSha": "ebdaab0216707ba6d21787458ac58b590dd45d09",
      "score": 52,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "食卓を囲む人々は交流を示すが、socialより家族・食事・会話が強い。",
      "alternativeAnswersEn": [
        "family",
        "meal",
        "together"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "face",
      "w": "face",
      "p": [
        "dhē-"
      ],
      "imagePath": "assets/word/face.png",
      "imageGitBlobSha": "00c21bd74ea23985dbf058ccb1c141f0a4ed969c",
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "目・鼻・口を持つ顔が単独で大きく示されている。",
      "alternativeAnswersEn": [
        "head"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "water",
      "w": "water",
      "p": [
        "wed-1"
      ],
      "imagePath": "assets/word/water.png",
      "imageGitBlobSha": "399187075e3c449442049587b53de7257cb0bdd2",
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "透明な液体をコップへ注ぐ様子で水を連想できる。注ぐという動詞も候補。",
      "alternativeAnswersEn": [
        "pour",
        "drink"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "few",
      "w": "few",
      "p": [
        "pau-"
      ],
      "imagePath": "assets/word/few.png",
      "imageGitBlobSha": "64e6d070db4403c1055f1313623a95f092be8265",
      "score": 78,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "大きな皿に少数の豆だけがあり、少なさを読み取りやすい。threeやpeasも候補。",
      "alternativeAnswersEn": [
        "three",
        "peas",
        "little"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "things",
      "w": "things",
      "p": [],
      "imagePath": "assets/word/things.png",
      "imageGitBlobSha": "4d49729f43ee70ef9c98c84d210e74fe0c89849b",
      "score": 63,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 9,
        "smallImageReadable": 9
      },
      "reasonJa": "種類の異なる日用品の集まりで物全般を連想できるが、objects・stuffとも分かれる。",
      "alternativeAnswersEn": [
        "objects",
        "stuff",
        "basket"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "help",
      "w": "help",
      "p": [
        "kelb-"
      ],
      "imagePath": "assets/word/help.png",
      "imageGitBlobSha": "2f617d2d64b17f1c9178d3f34a2dea8fca9ff1e2",
      "score": 88,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "二人で重い箱を持つ姿から助け合う行為が明瞭。carry・liftとも競合する。",
      "alternativeAnswersEn": [
        "carry",
        "lift"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "important",
      "w": "important",
      "p": [
        "en",
        "per-2"
      ],
      "imagePath": "assets/word/important.png",
      "imageGitBlobSha": "7e6f139c4026fd683a664175809f7772f435c55c",
      "score": 36,
      "components": {
        "meaningVisible": 16,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "鍵の掛かった薬棚と鍵を持つ人物は見えるが、重要という性質は特定しにくい。",
      "alternativeAnswersEn": [
        "key",
        "medicine",
        "lock"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "using",
      "w": "using",
      "p": [],
      "imagePath": "assets/word/using.png",
      "imageGitBlobSha": "d9a3d81124e9a52528be72a12ff102dc03b46ad4",
      "score": 32,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "掃除機を使う行為は分かるが、usingという一般的な進行形よりvacuumが自然。",
      "alternativeAnswersEn": [
        "vacuum",
        "clean",
        "use"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "example",
      "w": "example",
      "p": [
        "eghs",
        "em-"
      ],
      "imagePath": "assets/word/example.png",
      "imageGitBlobSha": "2c7d15d590162f005627723e8b8ff313f15a485b",
      "score": 59,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 17,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "折り紙を見せて教える場面は例示を連想できるが、teach・origamiも強い。",
      "alternativeAnswersEn": [
        "teach",
        "origami",
        "show"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "last@le2",
      "w": "last",
      "p": [
        "lē-2"
      ],
      "imagePath": "assets/word/last@le2.png",
      "imageGitBlobSha": "fc2c8f4dd343d25467b56bbc182eb4dfa9c14cb3",
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "一列の最後尾のアヒルが指で示され、最後という位置が分かりやすい。",
      "alternativeAnswersEn": [
        "duck",
        "end"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "human",
      "w": "human",
      "p": [
        "dhghem-"
      ],
      "imagePath": "assets/word/human.png",
      "imageGitBlobSha": "55da34d7876560ac00dada2d6c8c9ff1d3e72eda",
      "score": 34,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 8
      },
      "reasonJa": "針仕事をする女性が主役で、人類一般を指すhumanには特定しにくい。",
      "alternativeAnswersEn": [
        "sew",
        "woman",
        "needle"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "small",
      "w": "small",
      "p": [
        "(s)mēlo-"
      ],
      "imagePath": "assets/word/small.png",
      "imageGitBlobSha": "1fbec5697fed67d4ec6face5dcd3d48a7cb5ba5a",
      "score": 45,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 8
      },
      "reasonJa": "小さなカップは見えるが、人物や椅子が大きくsmallの対象が明確ではない。",
      "alternativeAnswersEn": [
        "cup",
        "drink",
        "man"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "great",
      "w": "great",
      "p": [
        "ghrēu-"
      ],
      "imagePath": "assets/word/great.png",
      "imageGitBlobSha": "cbe9641d607f580c0a92d1bc92568096de00e65b",
      "score": 48,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 8
      },
      "reasonJa": "表彰される研究者の場面で称賛は連想できるが、greatよりaward・scientistが直接的。",
      "alternativeAnswersEn": [
        "award",
        "scientist",
        "honor"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "home",
      "w": "home",
      "p": [
        "tkei-"
      ],
      "imagePath": "assets/word/home.png",
      "imageGitBlobSha": "e98db5d486e7b0af1bbfc7b423ddfe31beb69359",
      "score": 86,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "家に迎えられる人物と生活の雰囲気からhomeを連想できる。houseとの競合は残る。",
      "alternativeAnswersEn": [
        "house",
        "welcome"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "following",
      "w": "following",
      "p": [],
      "imagePath": "assets/word/following.png",
      "imageGitBlobSha": "674dad52f39aa0d0c7e79a8d9be08f593ae055e9",
      "score": 74,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "足跡と矢印で後を追う関係は分かるが、followとfollowingの語形は限定できない。",
      "alternativeAnswersEn": [
        "follow",
        "behind"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "men@man1",
      "w": "men",
      "p": [
        "man-1"
      ],
      "imagePath": "assets/word/men@man1.png",
      "imageGitBlobSha": "eb951c42c9904c393e0b16988a739440dfca8130",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "成人男性が三人並び、複数の男性として読み取りやすい。peopleも候補。",
      "alternativeAnswersEn": [
        "people",
        "adults"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "point",
      "w": "point",
      "p": [
        "peuk-"
      ],
      "imagePath": "assets/word/point.png",
      "imageGitBlobSha": "9cdeb24e85e53bb8745bd9053664aa728abb36c1",
      "score": 62,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "ペン先の点は見えるが、点を指すpointよりdot・writeの答えも強い。",
      "alternativeAnswersEn": [
        "dot",
        "write"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "love",
      "w": "love",
      "p": [
        "leubh-"
      ],
      "imagePath": "assets/word/love.png",
      "imageGitBlobSha": "83621701b2c16585491de33d3e5f475e18494fe4",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 9
      },
      "reasonJa": "親しげに寄り添い手をつなぐ二人から愛情が読み取りやすい。恋人という名詞も候補。",
      "alternativeAnswersEn": [
        "couple",
        "romance"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "given",
      "w": "given",
      "p": [],
      "imagePath": "assets/word/given.png",
      "imageGitBlobSha": "7f7f3b8bf6b092df94d2d26afa2a40f216cf1982",
      "score": 41,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 12,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "贈り物を差し出す動作は分かるが、givenという過去分詞は絵だけで特定できない。",
      "alternativeAnswersEn": [
        "give",
        "gift",
        "present"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "got@ghend",
      "w": "got",
      "p": [
        "ghend-"
      ],
      "imagePath": "assets/word/got@ghend.png",
      "imageGitBlobSha": "2e92536ac7f680a2d441f681c7af9ed4059f074a",
      "score": 38,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 11,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "星を持つ人物と時計の矢印は獲得後を示しうるが、gotという過去形は限定できない。",
      "alternativeAnswersEn": [
        "get",
        "star",
        "past"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "got@x",
      "w": "got",
      "p": [],
      "imagePath": "assets/word/got@x.png",
      "imageGitBlobSha": "f41d0cf6c9db2d8f3f2a275785ba8f51db2feb6a",
      "score": 44,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 13,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "贈られた自転車と写真は入手を連想させるが、gotよりbike・giftが強い。",
      "alternativeAnswersEn": [
        "bicycle",
        "gift",
        "get"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "side",
      "w": "side",
      "p": [
        "sē-2"
      ],
      "imagePath": "assets/word/side.png",
      "imageGitBlobSha": "c08386019078a9fcc75687f75c5dc9c46c2b1bb8",
      "score": 70,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 20,
        "answerSpecific": 11,
        "smallImageReadable": 9
      },
      "reasonJa": "家具の横の面を拭く位置は分かるが、sideより拭く・家具が直接的にも読める。",
      "alternativeAnswersEn": [
        "wipe",
        "cabinet",
        "clean"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "went",
      "w": "went",
      "p": [
        "wendh-"
      ],
      "imagePath": "assets/word/went.png",
      "imageGitBlobSha": "664593af8076e7b2128bc7160fbe91ea4b0d01f2",
      "score": 34,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 10,
        "answerSpecific": 1,
        "smallImageReadable": 8
      },
      "reasonJa": "旅行の写真と荷物は過去の旅を示すが、wentという動詞の過去形には絞れない。",
      "alternativeAnswersEn": [
        "trip",
        "travel",
        "holiday"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "children",
      "w": "children",
      "p": [],
      "imagePath": "assets/word/children.png",
      "imageGitBlobSha": "8343eef19fca8f783d619e0513e213c889e41c4b",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 9
      },
      "reasonJa": "複数の幼い子供が遊ぶ様子が明瞭。kidsという類義語も候補。",
      "alternativeAnswersEn": [
        "kids",
        "play"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "next",
      "w": "next",
      "p": [
        "nēhw-iz"
      ],
      "imagePath": "assets/word/next.png",
      "imageGitBlobSha": "4accd608ba8f73da21ea89a2f4659e1283d1adcb",
      "score": 53,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 8
      },
      "reasonJa": "会計で後ろに待つ人は見えるが、次の人という指定がなくqueue・shopも強い。",
      "alternativeAnswersEn": [
        "queue",
        "wait",
        "shop"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "person",
      "w": "person",
      "p": [],
      "imagePath": "assets/word/person.png",
      "imageGitBlobSha": "8b6af298a49355e203187cf7bd9caf6db26aec6e",
      "score": 83,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "一人の人物が単独で示されるが、personよりmanという具体名にも答えが分かれる。",
      "alternativeAnswersEn": [
        "man",
        "human"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "form",
      "w": "form",
      "p": [
        "merph-"
      ],
      "imagePath": "assets/word/form.png",
      "imageGitBlobSha": "17e6d7f1a59678ff8feb12cbb492a7c7895b6e04",
      "score": 58,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "粘土を形作る行為は見えるが、formとshape・makeの区別は絵だけではつかない。",
      "alternativeAnswersEn": [
        "shape",
        "make",
        "clay"
      ],
      "assessedAt": "2026-10-19T04:40:16.626093+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "women",
      "w": "women",
      "p": [],
      "imagePath": "assets/word/women.png",
      "imageGitBlobSha": "9b932f91e57712fe8e7dda6c870c1f1b01a480a7",
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "成人女性が三人並び、複数の女性が明瞭。peopleとの競合は残る。",
      "alternativeAnswersEn": [
        "people",
        "adults"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "large",
      "w": "large",
      "p": [],
      "imagePath": "assets/word/large.png",
      "imageGitBlobSha": "683d2ee6aa6886bbb394e78d744b164c4547b161",
      "score": 89,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "大小二つのリンゴのうち大きい方を指し、比較が明確。bigとの区別はつかない。",
      "alternativeAnswersEn": [
        "big",
        "apple"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "give",
      "w": "give",
      "p": [
        "ghabh-"
      ],
      "imagePath": "assets/word/give.png",
      "imageGitBlobSha": "ac038cf5c423116f8f3409fbb46dc136f2ccf256",
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "贈り物を相手へ差し出す動作が明瞭。giftやpresentも自然な答え。",
      "alternativeAnswersEn": [
        "gift",
        "present"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "seen@sekw2",
      "w": "seen",
      "p": [
        "sekʷ-2"
      ],
      "imagePath": "assets/word/seen@sekw2.png",
      "imageGitBlobSha": "cf5811eeab3c094ff1b1fe7f5dab6708786b0687",
      "score": 33,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 9,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "蝶を思い出す人物と逆向き時計は見えるが、seenという過去分詞は特定できない。",
      "alternativeAnswersEn": [
        "remember",
        "butterfly",
        "think"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "seen@x",
      "w": "seen",
      "p": [],
      "imagePath": "assets/word/seen@x.png",
      "imageGitBlobSha": "317ad499b4eda603ec4447230d58160be85c3508",
      "score": 37,
      "components": {
        "meaningVisible": 16,
        "conceptDistinct": 11,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "観察した鳥の写真を示す姿は分かるが、seenの語形には絞れない。",
      "alternativeAnswersEn": [
        "bird",
        "photo",
        "observe"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "others",
      "w": "others",
      "p": [
        "al-1"
      ],
      "imagePath": "assets/word/others.png",
      "imageGitBlobSha": "80d691bc2b9d49de8447e30628f28481927fd9ef",
      "score": 42,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 8
      },
      "reasonJa": "一人と離れて待つ三人の対比は見えるが、othersという指示対象は曖昧。",
      "alternativeAnswersEn": [
        "friends",
        "wait",
        "group"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "best",
      "w": "best",
      "p": [
        "bhad-"
      ],
      "imagePath": "assets/word/best.png",
      "imageGitBlobSha": "b9eb7b5445740329a5e57a6756a1231eaec2d02b",
      "score": 68,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 9,
        "smallImageReadable": 8
      },
      "reasonJa": "三つのケーキの一つに賞の印があり最良を示すが、winnerやcakeも強い。",
      "alternativeAnswersEn": [
        "winner",
        "cake",
        "prize"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "left@leip",
      "w": "left",
      "p": [
        "leip-"
      ],
      "imagePath": "assets/word/left@leip.png",
      "imageGitBlobSha": "c4d11c2bfd52e3fc42ff6049c39eec0d1ede30d1",
      "score": 40,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 12,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "扉を後にする動作と逆向き時計は見えるが、leftという過去形を特定しにくい。",
      "alternativeAnswersEn": [
        "leave",
        "door",
        "past"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "mind",
      "w": "mind",
      "p": [
        "men-1"
      ],
      "imagePath": "assets/word/mind.png",
      "imageGitBlobSha": "9cbcccc02abd79308d8baf4a448e0659fc950660",
      "score": 55,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "パズルを考える姿から思考は読めるが、mindよりthinkやpuzzleが直接的。",
      "alternativeAnswersEn": [
        "think",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "research",
      "w": "research",
      "p": [
        "re-",
        "(s)ker-3"
      ],
      "imagePath": "assets/word/research.png",
      "imageGitBlobSha": "401ea6e4f3f191ef0b211c67c2a0a1dcb202d18f",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "植物を虫眼鏡で観察して記録する行為から研究を連想できる。studyも候補。",
      "alternativeAnswersEn": [
        "study",
        "observe",
        "plant"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "development",
      "w": "development",
      "p": [
        "dwis-"
      ],
      "imagePath": "assets/word/development.png",
      "imageGitBlobSha": "10d1b05f227e864e327bdaa461c9fe39da5c766c",
      "score": 54,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "芽のある植物を見守る場面で成長は連想できるが、developmentよりgrowやplantが強い。",
      "alternativeAnswersEn": [
        "growth",
        "plant",
        "grow"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "public",
      "w": "public",
      "p": [],
      "imagePath": "assets/word/public.png",
      "imageGitBlobSha": "3ef0a0cfbbc6d20f6a8d5f02b6384058a84d21bd",
      "score": 39,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 11,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "ベンチの周りの人々は見えるが、publicという公共性は示しきれていない。",
      "alternativeAnswersEn": [
        "people",
        "friends",
        "bench"
      ],
      "assessedAt": "2026-10-19T05:17:48.881433+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "second",
      "w": "second",
      "p": [
        "sekʷ-1"
      ],
      "imagePath": "assets/word/second.png",
      "imageGitBlobSha": "2bd6f95b718034fb70c25825796850d40f9ffaf7",
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 23,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "ストップウォッチの一秒表示から時間の単位は読み取れるが、数字とs表記への依存が強い。",
      "alternativeAnswersEn": [
        "stopwatch",
        "time"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "level",
      "w": "level",
      "p": [
        "līthrā"
      ],
      "imagePath": "assets/word/level.png",
      "imageGitBlobSha": "2739a03a2719fe4382fc74d0e44eec6716aa0375",
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 9
      },
      "reasonJa": "水槽の水面と目盛りを指す位置が明確で、水位を連想できる。waterやmeasureも候補。",
      "alternativeAnswersEn": [
        "water",
        "measure"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "wanted",
      "w": "wanted",
      "p": [],
      "imagePath": "assets/word/wanted.png",
      "imageGitBlobSha": "fb9a3890c7f67322d5cc5dc91147991666a1ba96",
      "score": 48,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 15,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "ぬいぐるみを欲しがる姿は見えるが、wantedという過去形は示されていない。",
      "alternativeAnswersEn": [
        "want",
        "wish",
        "toy"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "enough",
      "w": "enough",
      "p": [
        "nek-2"
      ],
      "imagePath": "assets/word/enough.png",
      "imageGitBlobSha": "a22e4aeb44e7e0a47e19b169b423f063dda20418",
      "score": 55,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 8
      },
      "reasonJa": "全員のコップに飲み物が配られるが、十分という判断は伝わりにくい。",
      "alternativeAnswersEn": [
        "share",
        "pour",
        "juice"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "light@leuk",
      "w": "light",
      "p": [
        "leuk-"
      ],
      "imagePath": "assets/word/light@leuk.png",
      "imageGitBlobSha": "f8d0c4432667cd69b04935f431abad5448222be9",
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "ろうそくの炎と光線から光を連想できるが、candleやflameの答えも強い。",
      "alternativeAnswersEn": [
        "candle",
        "flame"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "model",
      "w": "model",
      "p": [
        "med-"
      ],
      "imagePath": "assets/word/model.png",
      "imageGitBlobSha": "a4fba980143038ffa623bf5ba548235dbe90eb72",
      "score": 85,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "小型飛行機を組み立てる姿から模型が伝わる。airplaneやbuildも候補。",
      "alternativeAnswersEn": [
        "airplane",
        "build"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "name",
      "w": "name",
      "p": [
        "no-men"
      ],
      "imagePath": "assets/word/name.png",
      "imageGitBlobSha": "998fde8654a9334b141ee4b7a53d3b43c2362e90",
      "score": 70,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "名札を示す人物から名前を連想できるが、文字の読取りに一部依存する。",
      "alternativeAnswersEn": [
        "introduce",
        "badge"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "feel",
      "w": "feel",
      "p": [
        "pāl-"
      ],
      "imagePath": "assets/word/feel.png",
      "imageGitBlobSha": "5c9fc30e1e300358cf3d1a25cba212aedfef2c27",
      "score": 53,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "温かい飲み物を持つ表情から感覚は伝わるが、feelよりwarmやrelaxが自然。",
      "alternativeAnswersEn": [
        "warm",
        "relax",
        "drink"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "group",
      "w": "group",
      "p": [
        "g(e)r-2"
      ],
      "imagePath": "assets/word/group.png",
      "imageGitBlobSha": "d4cdb2bcaaaf753fd3de0db525519a853533f09b",
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "地図を囲む複数人がまとまりを作り、groupを連想できる。friendsやteamも候補。",
      "alternativeAnswersEn": [
        "friends",
        "team"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "fact",
      "w": "fact",
      "p": [
        "dhē-"
      ],
      "imagePath": "assets/word/fact.png",
      "imageGitBlobSha": "d1b87af7bc2dbbd95709cc46e36d33b9d3d9329d",
      "score": 27,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "卵の入った瓶を指す場面だけでは事実という抽象概念は特定できない。",
      "alternativeAnswersEn": [
        "eggs",
        "jar",
        "count"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "far",
      "w": "far",
      "p": [
        "per1"
      ],
      "imagePath": "assets/word/far.png",
      "imageGitBlobSha": "2de6f99cb09fbe1439b7afe5ccf3ec219ce62f40",
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "遠くの家と長い道の対比で距離の遠さが読み取りやすい。journeyやroadも候補。",
      "alternativeAnswersEn": [
        "distance",
        "road",
        "journey"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "night",
      "w": "night",
      "p": [
        "nekʷ-t-"
      ],
      "imagePath": "assets/word/night.png",
      "imageGitBlobSha": "f94a9d5c52ca477ad03bf79e3abcb25c2f26c4cd",
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 9
      },
      "reasonJa": "窓外の月と星、眠る人物がそろい夜を明確に示す。sleepも候補。",
      "alternativeAnswersEn": [
        "sleep",
        "bedtime"
      ],
      "assessedAt": "2026-10-19T05:24:01.643064+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "possible",
      "w": "possible",
      "p": [
        "poti-",
        "es-"
      ],
      "imagePath": "assets/word/possible.png",
      "imageGitBlobSha": "0df54221c29964e9eff2af07aa03b8cdcf3a84c9",
      "score": 48,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "台に乗れば本に手が届く場面は見えるが、可能という性質よりreachやstoolが直接的。",
      "alternativeAnswersEn": [
        "reach",
        "stool",
        "book"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "control",
      "w": "control",
      "p": [
        "kom",
        "ret-"
      ],
      "imagePath": "assets/word/control.png",
      "imageGitBlobSha": "3d4a400ee1daa23553026d1d38a79ff3182e7e2a",
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "弁を回して水の流れを調整する様子から制御を連想できる。valveやadjustも候補。",
      "alternativeAnswersEn": [
        "valve",
        "adjust",
        "water"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "thing",
      "w": "thing",
      "p": [],
      "imagePath": "assets/word/thing.png",
      "imageGitBlobSha": "b8fa4bc661ad29d58f2f11acfd2e07d53257aebc",
      "score": 43,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "箱を指す絵では具体物のboxが最も自然で、thingという一般名には絞れない。",
      "alternativeAnswersEn": [
        "box",
        "object"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "become",
      "w": "become",
      "p": [
        "ambhi",
        "gʷā-"
      ],
      "imagePath": "assets/word/become.png",
      "imageGitBlobSha": "26821b58242e81d810b0ec69603ebd8fd3d9606c",
      "score": 57,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 17,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "さなぎから出た蝶は変化を示すが、becomeよりbutterflyやtransformが強い。",
      "alternativeAnswersEn": [
        "butterfly",
        "transform",
        "emerge"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "course",
      "w": "course",
      "p": [
        "kers-2"
      ],
      "imagePath": "assets/word/course.png",
      "imageGitBlobSha": "5f8cb75ac0e0d637f3ebe17e86a930cf19a06a83",
      "score": 55,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "岩の間を進む船の航路は見えるが、courseよりsailやrouteも自然。",
      "alternativeAnswersEn": [
        "sail",
        "route",
        "boat"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "later",
      "w": "later",
      "p": [],
      "imagePath": "assets/word/later.png",
      "imageGitBlobSha": "c4031171dc0fd1c4087f4e82525537f822ffc27d",
      "score": 33,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 10,
        "answerSpecific": 1,
        "smallImageReadable": 8
      },
      "reasonJa": "夕方の読書場面と時計は見えるが、比較する前の時点がなくlaterは分かりにくい。",
      "alternativeAnswersEn": [
        "evening",
        "read",
        "relax"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "value",
      "w": "value",
      "p": [
        "wal-"
      ],
      "imagePath": "assets/word/value.png",
      "imageGitBlobSha": "b55fa21c9ea7851d8c66666f5d2da8f702e6e5f5",
      "score": 58,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "写真入りの品を大切にする様子から価値を連想できるが、memoryやtreasureも強い。",
      "alternativeAnswersEn": [
        "memory",
        "treasure",
        "love"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "means",
      "w": "means",
      "p": [
        "medhyo-"
      ],
      "imagePath": "assets/word/means.png",
      "imageGitBlobSha": "951f7c0bc2d70484bc3270e82fbd555bf160f00b",
      "score": 49,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "道具を使って果実を採る方法は見えるが、meansよりpickやtoolが直接的。",
      "alternativeAnswersEn": [
        "pick",
        "tool",
        "apple"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "tell",
      "w": "tell",
      "p": [
        "del-2"
      ],
      "imagePath": "assets/word/tell.png",
      "imageGitBlobSha": "dc2e1c5adab84c0755bcb1804d6ab5c51035393e",
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "写真を示して相手に話す場面が明瞭。tellとtalkやexplainが競合する。",
      "alternativeAnswersEn": [
        "talk",
        "explain",
        "show"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "done",
      "w": "done",
      "p": [],
      "imagePath": "assets/word/done.png",
      "imageGitBlobSha": "aaa5c642cf793d051c564a9748112e5f8ca51908",
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 20,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "完成した巣箱と達成した表情は完了を示すが、doneよりfinishやsuccessも候補。",
      "alternativeAnswersEn": [
        "finish",
        "success",
        "birdhouse"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "open",
      "w": "open",
      "p": [
        "upo"
      ],
      "imagePath": "assets/word/open.png",
      "imageGitBlobSha": "25a73f1fc01f6d74bd64de886f183de2475224fc",
      "score": 93,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた門と通れる空間が明確で、openを読み取りやすい。gateも候補。",
      "alternativeAnswersEn": [
        "gate"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    },
    {
      "id": "care",
      "w": "care",
      "p": [
        "gar-"
      ],
      "imagePath": "assets/word/care.png",
      "imageGitBlobSha": "b1e4cdc6772055dca35553ecad2305dec08ae8bf",
      "score": 51,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "夜に電話を手に心配する様子は見えるが、careよりworryが自然。",
      "alternativeAnswersEn": [
        "worry",
        "anxious",
        "wait"
      ],
      "assessedAt": "2026-10-19T05:24:24.423669+00:00",
      "reviewer": "dot",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1"
    }
  ]
};
