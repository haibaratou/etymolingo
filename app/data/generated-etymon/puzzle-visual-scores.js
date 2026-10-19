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
    }
  ]
};
