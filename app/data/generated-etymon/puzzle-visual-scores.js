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
    }
  ]
};
