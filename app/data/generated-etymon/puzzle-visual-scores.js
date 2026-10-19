window.ETYMON_PUZZLE_VISUAL_SCORES={
  "schema": 1,
  "rubricVersion": "visual-answer-v1",
  "scale": 100,
  "titleJa": "絵から英単語を推測できる度合い",
  "method": "AI visual review of actual image pixels, matched to published Git blobs; not measured player accuracy",
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
    },
    {
      "id": "a@oino",
      "w": "a",
      "p": [
        "oi-no-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/a@oino.png",
      "imageGitBlobSha": "91220ef2b1ad43b8b966c23895d45f5b919347ea",
      "localImageExists": true,
      "sourceOrdinal": 0,
      "reviewOrder": 1,
      "score": 26,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "リンゴを持つ少年で、冠詞aを特定する手掛かりがない。",
      "alternativeAnswersEn": [
        "apple",
        "boy",
        "one"
      ],
      "assessedAt": "2026-10-19T08:06:51.740919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "about",
      "w": "about",
      "p": [
        "an-",
        "ambhi",
        "ud-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/about.png",
      "imageGitBlobSha": "6e96e398a997a9229697c5d1ef87bb2e0d9bb501",
      "localImageExists": true,
      "sourceOrdinal": 48,
      "reviewOrder": 2,
      "score": 21,
      "components": {
        "meaningVisible": 8,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "貝を説明する二人に見え、aboutの関係は特定できない。",
      "alternativeAnswersEn": [
        "shell",
        "explain",
        "teach"
      ],
      "assessedAt": "2026-10-19T08:06:51.741919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "also",
      "w": "also",
      "p": [
        "al-5",
        "swo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/also.png",
      "imageGitBlobSha": "81849e3aa76713c7dc7d59874817673a388a05a9",
      "localImageExists": true,
      "sourceOrdinal": 539,
      "reviewOrder": 3,
      "score": 27,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "二人でお茶を飲む場面で、追加を表すalsoには絞れない。",
      "alternativeAnswersEn": [
        "tea",
        "together",
        "drink"
      ],
      "assessedAt": "2026-10-19T08:06:51.741919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "an",
      "w": "an",
      "p": [
        "oi-no-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/an.png",
      "imageGitBlobSha": "c24d67c22ec58b78e814ad26d0a70d2cbba6fa51",
      "localImageExists": true,
      "sourceOrdinal": 662,
      "reviewOrder": 4,
      "score": 30,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "卵一個を取り上げているが、冠詞anよりeggが直接的。",
      "alternativeAnswersEn": [
        "egg",
        "one",
        "take"
      ],
      "assessedAt": "2026-10-19T08:06:51.742919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "and",
      "w": "and",
      "p": [
        "en"
      ],
      "rarity": 1,
      "imagePath": "assets/word/and.png",
      "imageGitBlobSha": "e00f75a54b79876187a84bf7093011e562dca4c2",
      "localImageExists": true,
      "sourceOrdinal": 718,
      "reviewOrder": 5,
      "score": 33,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "紅茶とトーストの組合せは見えるが、andを答える指定がない。",
      "alternativeAnswersEn": [
        "breakfast",
        "waitress",
        "serve"
      ],
      "assessedAt": "2026-10-19T08:06:51.742919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "as",
      "w": "as",
      "p": [
        "al-5",
        "swo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/as.png",
      "imageGitBlobSha": "1be25a4a741099db68213e6c0bbad8b4611a9533",
      "localImageExists": true,
      "sourceOrdinal": 1102,
      "reviewOrder": 6,
      "score": 20,
      "components": {
        "meaningVisible": 8,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "少年が鳥のまねをするように見えるが、asの用法は定まらない。",
      "alternativeAnswersEn": [
        "bird",
        "imitate",
        "fly"
      ],
      "assessedAt": "2026-10-19T08:06:51.742919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "at",
      "w": "at",
      "p": [
        "ad-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/at.png",
      "imageGitBlobSha": "0e186e806b45ab2a39bb523917ef8d350819b9b8",
      "localImageExists": true,
      "sourceOrdinal": 1204,
      "reviewOrder": 7,
      "score": 38,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "バス停にいる位置関係は見えるが、atよりwaitやbus stopが強い。",
      "alternativeAnswersEn": [
        "wait",
        "bus stop",
        "bus"
      ],
      "assessedAt": "2026-10-19T08:06:51.743919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "be",
      "w": "be",
      "p": [
        "bheuə-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/be.png",
      "imageGitBlobSha": "e37ff53470e36d3d41e3f90ef0b3566802402631",
      "localImageExists": true,
      "sourceOrdinal": 1529,
      "reviewOrder": 8,
      "score": 16,
      "components": {
        "meaningVisible": 5,
        "conceptDistinct": 2,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "パン職人の紹介に見え、beという状態動詞を絵だけで特定できない。",
      "alternativeAnswersEn": [
        "baker",
        "bread",
        "bake"
      ],
      "assessedAt": "2026-10-19T08:06:51.743919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "by",
      "w": "by",
      "p": [
        "ambhi"
      ],
      "rarity": 1,
      "imagePath": "assets/word/by.png",
      "imageGitBlobSha": "d9cad1865d4d9852bb31e9ed2a97bf87b2accafb",
      "localImageExists": true,
      "sourceOrdinal": 2141,
      "reviewOrder": 9,
      "score": 61,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "木のそばの自転車という位置関係が明瞭だが、besideも自然。",
      "alternativeAnswersEn": [
        "beside",
        "bicycle",
        "tree"
      ],
      "assessedAt": "2026-10-19T08:06:51.744919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "do",
      "w": "do",
      "p": [
        "dhē-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/do.png",
      "imageGitBlobSha": "12c87f7b5a430bbd07a498e19ef3413e6e7c078f",
      "localImageExists": true,
      "sourceOrdinal": 4638,
      "reviewOrder": 10,
      "score": 28,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "皿を洗う動作が明瞭で、doという汎用動詞には絞れない。",
      "alternativeAnswersEn": [
        "wash",
        "dishes",
        "clean"
      ],
      "assessedAt": "2026-10-19T08:06:51.744919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "for",
      "w": "for",
      "p": [
        "per1"
      ],
      "rarity": 1,
      "imagePath": "assets/word/for.png",
      "imageGitBlobSha": "dd766af3b94a8c0b1fce3a9809d7e84966c063e2",
      "localImageExists": true,
      "sourceOrdinal": 6272,
      "reviewOrder": 11,
      "score": 45,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "祖母への贈物は分かるが、forよりgiveやpresentを答えやすい。",
      "alternativeAnswersEn": [
        "give",
        "gift",
        "grandmother"
      ],
      "assessedAt": "2026-10-19T08:06:51.745919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "from",
      "w": "from",
      "p": [
        "per1"
      ],
      "rarity": 1,
      "imagePath": "assets/word/from.png",
      "imageGitBlobSha": "767a2b06a55ae447f8ccc439818844ceac97ce3c",
      "localImageExists": true,
      "sourceOrdinal": 6462,
      "reviewOrder": 12,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "家から出る足跡は起点を示すが、leaveやdepartも競合する。",
      "alternativeAnswersEn": [
        "leave",
        "depart",
        "home"
      ],
      "assessedAt": "2026-10-19T08:06:51.745919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "he",
      "w": "he",
      "p": [
        "ko-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/he.png",
      "imageGitBlobSha": "5e61cabf9949e71fc63df6e155cffa18c5fde0e1",
      "localImageExists": true,
      "sourceOrdinal": 7236,
      "reviewOrder": 13,
      "score": 35,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "男性を指しているが、heという代名詞の指定は読み取れない。",
      "alternativeAnswersEn": [
        "man",
        "father",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.746919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "her",
      "w": "her",
      "p": [
        "ko-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/her.png",
      "imageGitBlobSha": "2b903058e4fd036548f7ba12cfd62bbd81252ebc",
      "localImageExists": true,
      "sourceOrdinal": 7331,
      "reviewOrder": 14,
      "score": 34,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "女性を指す構図だが、目的格herとsheは区別できない。",
      "alternativeAnswersEn": [
        "she",
        "girl",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.746919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "him",
      "w": "him",
      "p": [
        "ko-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/him.png",
      "imageGitBlobSha": "d5cee1adb53666f3cd2f1c661e0ea3570729e58f",
      "localImageExists": true,
      "sourceOrdinal": 7408,
      "reviewOrder": 15,
      "score": 28,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "男性への贈物が描かれるが、himという目的格は示されない。",
      "alternativeAnswersEn": [
        "give",
        "man",
        "present"
      ],
      "assessedAt": "2026-10-19T08:06:51.747919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "his",
      "w": "his",
      "p": [
        "ko-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/his.png",
      "imageGitBlobSha": "556c7cf10954cfd30bdd83bb47a9e7b603986a7f",
      "localImageExists": true,
      "sourceOrdinal": 7431,
      "reviewOrder": 16,
      "score": 29,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "自転車を持つ少年を指すが、所有格hisよりboyやbicycleが先に浮かぶ。",
      "alternativeAnswersEn": [
        "boy",
        "bicycle",
        "he"
      ],
      "assessedAt": "2026-10-19T08:06:51.747919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "if",
      "w": "if",
      "p": [
        "i-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/if.png",
      "imageGitBlobSha": "365acd57cbdfeabfc24230b4389bbf78f0b78ccb",
      "localImageExists": true,
      "sourceOrdinal": 7718,
      "reviewOrder": 18,
      "score": 23,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "温室の鍵を持つ人物で、条件を表すifは絵だけで特定できない。",
      "alternativeAnswersEn": [
        "enter",
        "greenhouse",
        "key"
      ],
      "assessedAt": "2026-10-19T08:06:51.748919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "in",
      "w": "in",
      "p": [
        "en"
      ],
      "rarity": 1,
      "imagePath": "assets/word/in.png",
      "imageGitBlobSha": "e3140d49127b3ef3de2f1fafeb549914b3d49ed7",
      "localImageExists": true,
      "sourceOrdinal": 7890,
      "reviewOrder": 19,
      "score": 78,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "箱の中の猫が明瞭でinの位置関係を読み取れるが、catも有力。",
      "alternativeAnswersEn": [
        "cat",
        "box",
        "inside"
      ],
      "assessedAt": "2026-10-19T08:06:51.749919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "is",
      "w": "is",
      "p": [
        "es-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/is.png",
      "imageGitBlobSha": "2c7fed59ff4eeba60a10107e3ce12dcf43093928",
      "localImageExists": true,
      "sourceOrdinal": 8447,
      "reviewOrder": 20,
      "score": 27,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "カップを示す場面ではyouという相手の代名詞に特定できない。",
      "alternativeAnswersEn": [
        "cup",
        "offer",
        "boy"
      ],
      "assessedAt": "2026-10-19T08:06:51.749919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "it",
      "w": "it",
      "p": [
        "ko-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/it.png",
      "imageGitBlobSha": "c251fc85a9a1b634feeca5ef154fd22cdece9c8c",
      "localImageExists": true,
      "sourceOrdinal": 8466,
      "reviewOrder": 21,
      "score": 26,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "スープを指しており、itよりsoupやhotの答えが自然。",
      "alternativeAnswersEn": [
        "soup",
        "hot",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.750919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "me",
      "w": "me",
      "p": [
        "me-1"
      ],
      "rarity": 1,
      "imagePath": "assets/word/me.png",
      "imageGitBlobSha": "fd7a4821aac9c615904c8a7faea18a710060aae0",
      "localImageExists": true,
      "sourceOrdinal": 9561,
      "reviewOrder": 22,
      "score": 26,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "ボールの受渡しは見えるが、meを示す視点が定まらない。",
      "alternativeAnswersEn": [
        "throw",
        "catch",
        "ball"
      ],
      "assessedAt": "2026-10-19T08:06:51.750919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "my",
      "w": "my",
      "p": [
        "me-1"
      ],
      "rarity": 1,
      "imagePath": "assets/word/my.png",
      "imageGitBlobSha": "46a79afb39f34f4bc590bc45f66a9f5253797cef",
      "localImageExists": true,
      "sourceOrdinal": 10217,
      "reviewOrder": 23,
      "score": 40,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "帽子を抱えて自分を指すが、myとmineやIを区別できない。",
      "alternativeAnswersEn": [
        "mine",
        "hat",
        "I"
      ],
      "assessedAt": "2026-10-19T08:06:51.751919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "no@ne-aiw",
      "w": "no",
      "p": [
        "ne",
        "aiw-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/no@ne-aiw.png",
      "imageGitBlobSha": "71c656bbbb637b91b3c514f2b46ddf924d34bb90",
      "localImageExists": true,
      "sourceOrdinal": 10446,
      "reviewOrder": 24,
      "score": 88,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "腕の交差と拒否する表情からnoを推測しやすい。",
      "alternativeAnswersEn": [
        "stop",
        "refuse"
      ],
      "assessedAt": "2026-10-19T08:06:51.751919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "not",
      "w": "not",
      "p": [
        "ne",
        "wekti-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/not.png",
      "imageGitBlobSha": "2283873e7e7dc9ed08860795e965377453ab4e8b",
      "localImageExists": true,
      "sourceOrdinal": 10540,
      "reviewOrder": 25,
      "score": 61,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "果物を拒否する様子は見えるが、notよりnoやdislikeも自然。",
      "alternativeAnswersEn": [
        "no",
        "dislike",
        "pear"
      ],
      "assessedAt": "2026-10-19T08:06:51.752919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "of",
      "w": "of",
      "p": [
        "apo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/of.png",
      "imageGitBlobSha": "87e17597e7e6fd879824b512d7b257d904983df6",
      "localImageExists": true,
      "sourceOrdinal": 10755,
      "reviewOrder": 26,
      "score": 21,
      "components": {
        "meaningVisible": 8,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "カップの取っ手を指しているだけで、ofという関係語は定まらない。",
      "alternativeAnswersEn": [
        "handle",
        "cup",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.752919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "on",
      "w": "on",
      "p": [
        "an-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/on.png",
      "imageGitBlobSha": "20aa019f28d869c0735b0d574342faf2d1de4b4d",
      "localImageExists": true,
      "sourceOrdinal": 10812,
      "reviewOrder": 27,
      "score": 86,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "テーブルの上のカップで、onの上下関係は明瞭。",
      "alternativeAnswersEn": [
        "cup",
        "table",
        "above"
      ],
      "assessedAt": "2026-10-19T08:06:51.752919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "or@kwo",
      "w": "or",
      "p": [
        "kʷo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/or@kwo.png",
      "imageGitBlobSha": "e08e841a038c68a7852cd56cb0bdcce2e75899e5",
      "localImageExists": true,
      "sourceOrdinal": 10894,
      "reviewOrder": 28,
      "score": 62,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "二股の矢印が選択を示すが、or以外にchoiceやdirectionも強い。",
      "alternativeAnswersEn": [
        "choice",
        "direction",
        "fork"
      ],
      "assessedAt": "2026-10-19T08:06:51.753919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "she",
      "w": "she",
      "p": [
        "so-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/she.png",
      "imageGitBlobSha": "1732e0623f063bde8a0fdc8f42ca6321f33d179f",
      "localImageExists": true,
      "sourceOrdinal": 14410,
      "reviewOrder": 29,
      "score": 29,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 6,
        "answerSpecific": 1,
        "smallImageReadable": 8
      },
      "reasonJa": "絵を描く女性を指すが、sheよりartistやpaintが直接的。",
      "alternativeAnswersEn": [
        "artist",
        "paint",
        "woman"
      ],
      "assessedAt": "2026-10-19T08:06:51.753919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "so",
      "w": "so",
      "p": [
        "swo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/so.png",
      "imageGitBlobSha": "04253f2a72d839a21ea11e6103e1d85a7fc1b0e6",
      "localImageExists": true,
      "sourceOrdinal": 14693,
      "reviewOrder": 30,
      "score": 36,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "スイッチと点灯の因果は読めるが、soという接続詞には絞れない。",
      "alternativeAnswersEn": [
        "switch",
        "light",
        "on"
      ],
      "assessedAt": "2026-10-19T08:06:51.754919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "than",
      "w": "than",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/than.png",
      "imageGitBlobSha": "a3d6d1c5dfe16cd281e741ddc7bf4f7977c20c63",
      "localImageExists": true,
      "sourceOrdinal": 15876,
      "reviewOrder": 31,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "二人の身長差を比べる構図だが、thanよりtallerやcompareが自然。",
      "alternativeAnswersEn": [
        "taller",
        "compare",
        "height"
      ],
      "assessedAt": "2026-10-19T08:06:51.754919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "that",
      "w": "that",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/that.png",
      "imageGitBlobSha": "34268e62a02d599aabf0baa27a279a17e82feeb8",
      "localImageExists": true,
      "sourceOrdinal": 15882,
      "reviewOrder": 32,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 12,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "離れた傘を指しているが、thatとthereやumbrellaが競合する。",
      "alternativeAnswersEn": [
        "umbrella",
        "there",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.754919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "the@so",
      "w": "the",
      "p": [
        "so-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/the@so.png",
      "imageGitBlobSha": "6d264fca388ab45629851fed5e5babb978f50cb5",
      "localImageExists": true,
      "sourceOrdinal": 15886,
      "reviewOrder": 33,
      "score": 22,
      "components": {
        "meaningVisible": 9,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "三個中のリンゴを指すだけでは定冠詞theを特定できない。",
      "alternativeAnswersEn": [
        "apple",
        "red",
        "middle"
      ],
      "assessedAt": "2026-10-19T08:06:51.755919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "them",
      "w": "them",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/them.png",
      "imageGitBlobSha": "d0ea1a54e8cc59d55fc5a0fbe4a2d5d0a124b865",
      "localImageExists": true,
      "sourceOrdinal": 15893,
      "reviewOrder": 34,
      "score": 26,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "写真を撮られる二人は見えるが、themの代名詞・目的格は示されない。",
      "alternativeAnswersEn": [
        "photo",
        "children",
        "photograph"
      ],
      "assessedAt": "2026-10-19T08:06:51.755919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "there",
      "w": "there",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/there.png",
      "imageGitBlobSha": "ac2acdb61464101751de355f594b9aedb5b40d90",
      "localImageExists": true,
      "sourceOrdinal": 15910,
      "reviewOrder": 35,
      "score": 53,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 13,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "座席を指すためthereは連想できるが、seatやsitも有力。",
      "alternativeAnswersEn": [
        "seat",
        "sit",
        "train"
      ],
      "assessedAt": "2026-10-19T08:06:51.756919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "they",
      "w": "they",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/they.png",
      "imageGitBlobSha": "841440291f3b2371e3c76ac4a1b98bfcdfe3f4e5",
      "localImageExists": true,
      "sourceOrdinal": 15923,
      "reviewOrder": 36,
      "score": 25,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "植樹する家族の場面で、theyよりfamilyやplantが先に浮かぶ。",
      "alternativeAnswersEn": [
        "family",
        "plant",
        "together"
      ],
      "assessedAt": "2026-10-19T08:06:51.756919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "this",
      "w": "this",
      "p": [
        "to-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/this.png",
      "imageGitBlobSha": "7bbccd57df2bd769d2f45361136a553764230e10",
      "localImageExists": true,
      "sourceOrdinal": 15937,
      "reviewOrder": 37,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "手元のみかんを指すが、thisとorangeやpointが競合する。",
      "alternativeAnswersEn": [
        "orange",
        "point",
        "fruit"
      ],
      "assessedAt": "2026-10-19T08:06:51.757919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "to",
      "w": "to",
      "p": [
        "de-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/to.png",
      "imageGitBlobSha": "58c635d8f92bb76807b59f402bde6c7555cbffbf",
      "localImageExists": true,
      "sourceOrdinal": 16035,
      "reviewOrder": 38,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 17,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "家へ向かう足跡は方向を示すが、toよりgoやhomeも自然。",
      "alternativeAnswersEn": [
        "go",
        "home",
        "toward"
      ],
      "assessedAt": "2026-10-19T08:06:51.757919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "up",
      "w": "up",
      "p": [
        "upo"
      ],
      "rarity": 1,
      "imagePath": "assets/word/up.png",
      "imageGitBlobSha": "5f4ce9cadcc0e0b9089bb5d1e64092de98515449",
      "localImageExists": true,
      "sourceOrdinal": 16594,
      "reviewOrder": 39,
      "score": 82,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "上へ飛ぶ風船と伸ばす手からupが読み取れるが、balloonも強い。",
      "alternativeAnswersEn": [
        "balloon",
        "rise",
        "reach"
      ],
      "assessedAt": "2026-10-19T08:06:51.758919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "we",
      "w": "we",
      "p": [
        "we-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/we.png",
      "imageGitBlobSha": "a2f5f3a79960710002406d8dba5498186dfcd414",
      "localImageExists": true,
      "sourceOrdinal": 17112,
      "reviewOrder": 40,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "二人が自分たちを指すが、weとusやfriendsの区別がつかない。",
      "alternativeAnswersEn": [
        "us",
        "friends",
        "together"
      ],
      "assessedAt": "2026-10-19T08:06:51.758919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "what",
      "w": "what",
      "p": [
        "kʷo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/what.png",
      "imageGitBlobSha": "145f0104b19119bc3b9e8ef89861baa8b65bff9a",
      "localImageExists": true,
      "sourceOrdinal": 17186,
      "reviewOrder": 41,
      "score": 34,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "松ぼっくりを尋ねる様子はあるが、whatという疑問語自体は特定できない。",
      "alternativeAnswersEn": [
        "pinecone",
        "ask",
        "question"
      ],
      "assessedAt": "2026-10-19T08:06:51.759919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "when",
      "w": "when",
      "p": [
        "kʷo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/when.png",
      "imageGitBlobSha": "9c692164afe233533bd840e974f966779f963bba",
      "localImageExists": true,
      "sourceOrdinal": 17194,
      "reviewOrder": 42,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "駅の時計と腕時計で時刻を尋ねる構図だが、whenよりtimeも自然。",
      "alternativeAnswersEn": [
        "time",
        "clock",
        "train"
      ],
      "assessedAt": "2026-10-19T08:06:51.759919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "who",
      "w": "who",
      "p": [
        "kʷo-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/who.png",
      "imageGitBlobSha": "17618e1d8dcfdcd9ec876e9bbae0e906f9c7d7fc",
      "localImageExists": true,
      "sourceOrdinal": 17219,
      "reviewOrder": 43,
      "score": 37,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "複数の人物を尋ねる場面だが、whoを示す視覚的指定が弱い。",
      "alternativeAnswersEn": [
        "people",
        "ask",
        "question"
      ],
      "assessedAt": "2026-10-19T08:06:51.760919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "with",
      "w": "with",
      "p": [
        "wi-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/with.png",
      "imageGitBlobSha": "4a344896ee634eea986040e8f7654a8c4480fdbd",
      "localImageExists": true,
      "sourceOrdinal": 17286,
      "reviewOrder": 44,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "手をつないで歩く二人からwithの同行を連想できるが、togetherも自然。",
      "alternativeAnswersEn": [
        "together",
        "walk",
        "mother"
      ],
      "assessedAt": "2026-10-19T08:06:51.760919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "would",
      "w": "would",
      "p": [
        "wel-2"
      ],
      "rarity": 1,
      "imagePath": "assets/word/would.png",
      "imageGitBlobSha": "14e42a3149136eca63521463c5c5c6f113f3029f",
      "localImageExists": true,
      "sourceOrdinal": 17347,
      "reviewOrder": 45,
      "score": 20,
      "components": {
        "meaningVisible": 8,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "雨を考える人物で、仮定や意志のwouldは絵から特定できない。",
      "alternativeAnswersEn": [
        "think",
        "rain",
        "umbrella"
      ],
      "assessedAt": "2026-10-19T08:06:51.761919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "you",
      "w": "you",
      "p": [
        "yu-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/you.png",
      "imageGitBlobSha": "1fd51eee12d62d84197ec98ba465a21ee572a17e",
      "localImageExists": true,
      "sourceOrdinal": 17423,
      "reviewOrder": 46,
      "score": 43,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "相手を示す身振りは見えるが、youよりwomanやtalkも自然。",
      "alternativeAnswersEn": [
        "woman",
        "talk",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.761919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "your",
      "w": "your",
      "p": [
        "yu-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/your.png",
      "imageGitBlobSha": "a86b7d8095143a9dd17ca4847ac3aec2a2d0e860",
      "localImageExists": true,
      "sourceOrdinal": 17427,
      "reviewOrder": 47,
      "score": 37,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "マフラーの受渡しは見えるが、yourという所有関係は定まらない。",
      "alternativeAnswersEn": [
        "give",
        "scarf",
        "offer"
      ],
      "assessedAt": "2026-10-19T08:06:51.762919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "could",
      "w": "could",
      "p": [
        "gnō-"
      ],
      "rarity": 1,
      "imagePath": "assets/word/could.png",
      "imageGitBlobSha": "bdc234912eeba8b1d895c3cf0bfb12274dd5f0a8",
      "localImageExists": true,
      "sourceOrdinal": 17854,
      "reviewOrder": 48,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "水泳写真とメダルから能力は連想できるが、couldという助動詞には絞れない。",
      "alternativeAnswersEn": [
        "swimmer",
        "memory",
        "medal"
      ],
      "assessedAt": "2026-10-19T08:06:51.762919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "its",
      "w": "its",
      "p": [],
      "rarity": 1,
      "imagePath": "assets/word/its.png",
      "imageGitBlobSha": "f5631711aea866721a9841c083441c9a2f6d1bca",
      "localImageExists": true,
      "sourceOrdinal": 20857,
      "reviewOrder": 49,
      "score": 27,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "犬と餌皿の絵で、itsという所有格は読み取れない。",
      "alternativeAnswersEn": [
        "dog",
        "food",
        "pet"
      ],
      "assessedAt": "2026-10-19T08:06:51.762919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "these",
      "w": "these",
      "p": [
        "to-"
      ],
      "rarity": 20,
      "imagePath": "assets/word/these.png",
      "imageGitBlobSha": "4aa6815f8600b14e6405b48b0bd4c2bbdb34f6ce",
      "localImageExists": true,
      "sourceOrdinal": 15919,
      "reviewOrder": 50,
      "score": 30,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "貝を見せる場面からtheseという複数指示語には絞れない。",
      "alternativeAnswersEn": [
        "shells",
        "show",
        "collection"
      ],
      "assessedAt": "2026-10-19T08:06:51.763919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "then",
      "w": "then",
      "p": [
        "to-"
      ],
      "rarity": 21,
      "imagePath": "assets/word/then.png",
      "imageGitBlobSha": "b21bee69bcffe802f430f09035ca7dac2417c58f",
      "localImageExists": true,
      "sourceOrdinal": 15898,
      "reviewOrder": 51,
      "score": 40,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "誕生日の写真と思い出を示すが、thenの時点は特定できない。",
      "alternativeAnswersEn": [
        "birthday",
        "memory",
        "photo"
      ],
      "assessedAt": "2026-10-19T08:06:51.764919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "through",
      "w": "through",
      "p": [
        "terə-2"
      ],
      "rarity": 28,
      "imagePath": "assets/word/through.png",
      "imageGitBlobSha": "3c17d37483475c0a29b97489100da8b90db7f23a",
      "localImageExists": true,
      "sourceOrdinal": 15971,
      "reviewOrder": 52,
      "score": 89,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "トンネルを通り抜ける自転車でthroughの経路が明瞭。",
      "alternativeAnswersEn": [
        "tunnel",
        "cycle",
        "pass"
      ],
      "assessedAt": "2026-10-19T08:06:51.764919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "how",
      "w": "how",
      "p": [
        "kʷo-"
      ],
      "rarity": 33,
      "imagePath": "assets/word/how.png",
      "imageGitBlobSha": "a2a9bff8ca8856ffdbab8300d3034ad9539254f8",
      "localImageExists": true,
      "sourceOrdinal": 7560,
      "reviewOrder": 53,
      "score": 48,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "靴ひもの結び方を教える構図だが、howよりtieやteachも自然。",
      "alternativeAnswersEn": [
        "tie",
        "teach",
        "shoelace"
      ],
      "assessedAt": "2026-10-19T08:06:51.765919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "between",
      "w": "between",
      "p": [
        "ambhi",
        "dwo-"
      ],
      "rarity": 39,
      "imagePath": "assets/word/between.png",
      "imageGitBlobSha": "2a37eecf180e964d3ace100f64ecebb6e4406c0e",
      "localImageExists": true,
      "sourceOrdinal": 1672,
      "reviewOrder": 54,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "二つの箱の間のボールで、betweenの位置関係が明瞭。",
      "alternativeAnswersEn": [
        "ball",
        "middle"
      ],
      "assessedAt": "2026-10-19T08:06:51.765919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "should",
      "w": "should",
      "p": [],
      "rarity": 47,
      "imagePath": "assets/word/should.png",
      "imageGitBlobSha": "59fe6d797b3e20a0eccfb604309ff94efb8e01ea",
      "localImageExists": true,
      "sourceOrdinal": 18880,
      "reviewOrder": 55,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "ごみを捨てる行為と正解印は見えるが、shouldという助言には絞れない。",
      "alternativeAnswersEn": [
        "trash",
        "correct",
        "throw"
      ],
      "assessedAt": "2026-10-19T08:06:51.765919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "where",
      "w": "where",
      "p": [
        "kʷo-"
      ],
      "rarity": 49,
      "imagePath": "assets/word/where.png",
      "imageGitBlobSha": "4be04802e851c1ee53dd17b8b1c19668d80ab916",
      "localImageExists": true,
      "sourceOrdinal": 17197,
      "reviewOrder": 56,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "帽子を探す様子はあるが、whereよりhatやsearchが自然。",
      "alternativeAnswersEn": [
        "hat",
        "search",
        "ask"
      ],
      "assessedAt": "2026-10-19T08:06:51.766919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "even",
      "w": "even",
      "p": [
        "apo-"
      ],
      "rarity": 54,
      "imagePath": "assets/word/even.png",
      "imageGitBlobSha": "f73b66edcdcda61446539f682780c54b0dbbaf1a",
      "localImageExists": true,
      "sourceOrdinal": 5576,
      "reviewOrder": 57,
      "score": 25,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "家族で水やりをする構図で、evenという副詞は特定できない。",
      "alternativeAnswersEn": [
        "water",
        "family",
        "garden"
      ],
      "assessedAt": "2026-10-19T08:06:51.767919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "us",
      "w": "us",
      "p": [
        "nes-2"
      ],
      "rarity": 54,
      "imagePath": "assets/word/us.png",
      "imageGitBlobSha": "622d5a307f87232b7f5399881a178a2d46beec83",
      "localImageExists": true,
      "sourceOrdinal": 16621,
      "reviewOrder": 58,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "写真を撮られる二人が自分たちを指すが、usとweを区別できない。",
      "alternativeAnswersEn": [
        "we",
        "friends",
        "photo"
      ],
      "assessedAt": "2026-10-19T08:06:51.767919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "made@x",
      "w": "made",
      "p": [],
      "rarity": 54,
      "imagePath": "assets/word/made@x.png",
      "imageGitBlobSha": "a4260b20cce97b2fa8529cc769e01fc5135b1ac3",
      "localImageExists": true,
      "sourceOrdinal": 20864,
      "reviewOrder": 59,
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "ドラゴンを想像しながら読書する人物で、madeの動作や時制は見えない。",
      "alternativeAnswersEn": [
        "read",
        "imagine",
        "dragon"
      ],
      "assessedAt": "2026-10-19T08:06:51.768919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "before",
      "w": "before",
      "p": [
        "ambhi",
        "per1"
      ],
      "rarity": 55,
      "imagePath": "assets/word/before.png",
      "imageGitBlobSha": "0ea8c287e94ed5a5795d93a5357a454afeebfba4",
      "localImageExists": true,
      "sourceOrdinal": 1570,
      "reviewOrder": 60,
      "score": 58,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 15,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "食事の横で手を洗う場面だが、beforeの時間順序は補う必要がある。",
      "alternativeAnswersEn": [
        "wash",
        "hands",
        "dinner"
      ],
      "assessedAt": "2026-10-19T08:06:51.768919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "after",
      "w": "after",
      "p": [
        "apo-"
      ],
      "rarity": 59,
      "imagePath": "assets/word/after.png",
      "imageGitBlobSha": "e9d90c9f643199ca406a419bca16baf80ab56fb8",
      "localImageExists": true,
      "sourceOrdinal": 352,
      "reviewOrder": 61,
      "score": 60,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "食べ終えた皿と皿洗いからafterは連想できるが、washが強い。",
      "alternativeAnswersEn": [
        "wash",
        "dishes",
        "clean"
      ],
      "assessedAt": "2026-10-19T08:06:51.768919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "because",
      "w": "because",
      "p": [
        "ambhi"
      ],
      "rarity": 61,
      "imagePath": "assets/word/because.png",
      "imageGitBlobSha": "28df91a3268ba03c9e34024d4bcc31f6831d802c",
      "localImageExists": true,
      "sourceOrdinal": 1550,
      "reviewOrder": 62,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "雨と傘の因果は分かるが、becauseという接続詞には絞れない。",
      "alternativeAnswersEn": [
        "rain",
        "umbrella",
        "because of"
      ],
      "assessedAt": "2026-10-19T08:06:51.769919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "very",
      "w": "very",
      "p": [
        "wērə-o-"
      ],
      "rarity": 70,
      "imagePath": "assets/word/very.png",
      "imageGitBlobSha": "5d0ab0c85675b7f86bb8b1dc6c96cb0ec6811a04",
      "localImageExists": true,
      "sourceOrdinal": 16827,
      "reviewOrder": 63,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "巨大なアイスが強調されるが、veryよりbigやice creamも自然。",
      "alternativeAnswersEn": [
        "big",
        "ice cream",
        "huge"
      ],
      "assessedAt": "2026-10-19T08:06:51.769919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "here",
      "w": "here",
      "p": [
        "ko-"
      ],
      "rarity": 74,
      "imagePath": "assets/word/here.png",
      "imageGitBlobSha": "8b0f3667b577e27982fd5cbc541dd6d616c5130a",
      "localImageExists": true,
      "sourceOrdinal": 7339,
      "reviewOrder": 64,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "足元の円を指してhereを示すが、standやcircleも候補。",
      "alternativeAnswersEn": [
        "stand",
        "circle",
        "place"
      ],
      "assessedAt": "2026-10-19T08:06:51.770919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "those",
      "w": "those",
      "p": [
        "to-"
      ],
      "rarity": 74,
      "imagePath": "assets/word/those.png",
      "imageGitBlobSha": "14c418f66d84d0c93e035cfbe33ea81b986e3425",
      "localImageExists": true,
      "sourceOrdinal": 15949,
      "reviewOrder": 65,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "離れた風船を指すが、thoseよりballoonsやthereが先に浮かぶ。",
      "alternativeAnswersEn": [
        "balloons",
        "there",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.770919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "around",
      "w": "around",
      "p": [
        "ret-"
      ],
      "rarity": 98,
      "imagePath": "assets/word/around.png",
      "imageGitBlobSha": "74ca16d01a71567e4b63d89d4a0f3b52ab8fbd00",
      "localImageExists": true,
      "sourceOrdinal": 1056,
      "reviewOrder": 66,
      "score": 83,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 22,
        "answerSpecific": 16,
        "smallImageReadable": 9
      },
      "reasonJa": "木を囲む子供たちでaroundの配置は明瞭だが、circleも候補。",
      "alternativeAnswersEn": [
        "circle",
        "tree",
        "children"
      ],
      "assessedAt": "2026-10-19T08:06:51.771919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "must@med",
      "w": "must",
      "p": [
        "med-"
      ],
      "rarity": 98,
      "imagePath": "assets/word/must@med.png",
      "imageGitBlobSha": "a390685ba48f7b715527822a2d9394e2b8455698",
      "localImageExists": true,
      "sourceOrdinal": 10193,
      "reviewOrder": 67,
      "score": 42,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "ヘルメットの着用と正解印は見えるが、mustの義務は特定しにくい。",
      "alternativeAnswersEn": [
        "helmet",
        "safe",
        "wear"
      ],
      "assessedAt": "2026-10-19T08:06:51.772919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "while",
      "w": "while",
      "p": [
        "kʷeiə-"
      ],
      "rarity": 98,
      "imagePath": "assets/word/while.png",
      "imageGitBlobSha": "4b60fb94b8a8ac593077c40d4668a01bdbb513d3",
      "localImageExists": true,
      "sourceOrdinal": 17203,
      "reviewOrder": 68,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "料理と勉強の同時進行は見えるが、whileを答える指定がない。",
      "alternativeAnswersEn": [
        "cook",
        "study",
        "together"
      ],
      "assessedAt": "2026-10-19T08:06:51.773918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "go",
      "w": "go",
      "p": [
        "ghē-"
      ],
      "rarity": 100,
      "imagePath": "assets/word/go.png",
      "imageGitBlobSha": "8cc21de1a7676e63b1caf27bea78332ffc1110dc",
      "localImageExists": true,
      "sourceOrdinal": 6867,
      "reviewOrder": 69,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "荷物を背負って道を進む動作は明瞭だが、walkやtravelも強い。",
      "alternativeAnswersEn": [
        "walk",
        "travel",
        "hike"
      ],
      "assessedAt": "2026-10-19T08:06:51.773918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "too",
      "w": "too",
      "p": [
        "de-"
      ],
      "rarity": 100,
      "imagePath": "assets/word/too.png",
      "imageGitBlobSha": "359901f175420dda39e9ba68c51de7c9f353864e",
      "localImageExists": true,
      "sourceOrdinal": 16066,
      "reviewOrder": 70,
      "score": 44,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "二人ともリンゴを食べるが、tooよりeatやsameの答えが自然。",
      "alternativeAnswersEn": [
        "eat",
        "apple",
        "same"
      ],
      "assessedAt": "2026-10-19T08:06:51.774920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "under",
      "w": "under",
      "p": [
        "n̥dher-"
      ],
      "rarity": 106,
      "imagePath": "assets/word/under.png",
      "imageGitBlobSha": "2ca41228f5a9fc3bc225c1f8a355b9950153c3e7",
      "localImageExists": true,
      "sourceOrdinal": 16493,
      "reviewOrder": 71,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "椅子の下の猫が明瞭でunderの上下関係を読み取りやすい。",
      "alternativeAnswersEn": [
        "cat",
        "chair",
        "below"
      ],
      "assessedAt": "2026-10-19T08:06:51.774920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "might",
      "w": "might",
      "p": [
        "magh-"
      ],
      "rarity": 112,
      "imagePath": "assets/word/might.png",
      "imageGitBlobSha": "8799c1cdcef4c9840f9ea66737bf9105bef4c285",
      "localImageExists": true,
      "sourceOrdinal": 9792,
      "reviewOrder": 72,
      "score": 48,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "大石を持つ筋肉質な人物から力は読めるが、mightよりstrongが自然。",
      "alternativeAnswersEn": [
        "strong",
        "strength",
        "lift"
      ],
      "assessedAt": "2026-10-19T08:06:51.775918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "never",
      "w": "never",
      "p": [
        "ne",
        "aiw-"
      ],
      "rarity": 112,
      "imagePath": "assets/word/never.png",
      "imageGitBlobSha": "3591a366e75d58eacce30da95c00bc7a418cb4de",
      "localImageExists": true,
      "sourceOrdinal": 10386,
      "reviewOrder": 73,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "飲物の拒否と連続した禁止印は見えるが、neverとnoが競合する。",
      "alternativeAnswersEn": [
        "no",
        "refuse",
        "water"
      ],
      "assessedAt": "2026-10-19T08:06:51.775918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "again",
      "w": "again",
      "p": [
        "gagina"
      ],
      "rarity": 118,
      "imagePath": "assets/word/again.png",
      "imageGitBlobSha": "71407264d00146f963dc5b055988d9e21db95c1b",
      "localImageExists": true,
      "sourceOrdinal": 356,
      "reviewOrder": 74,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "鐘を鳴らす子と指一本の身振りで、againという繰返しは明確でない。",
      "alternativeAnswersEn": [
        "ring",
        "bell",
        "once"
      ],
      "assessedAt": "2026-10-19T08:06:51.776917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "aint",
      "w": "ain't",
      "p": [],
      "rarity": 118,
      "imagePath": "assets/word/aint.png",
      "imageGitBlobSha": "71e2894407a168ecb0f09770f8553845faa89296",
      "localImageExists": true,
      "sourceOrdinal": 23335,
      "reviewOrder": 75,
      "score": 60,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "腕の交差は否定を示すが、aintという口語の語形は特定できない。",
      "alternativeAnswersEn": [
        "no",
        "not",
        "stop"
      ],
      "assessedAt": "2026-10-19T08:06:51.776917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "without",
      "w": "without",
      "p": [
        "wi-",
        "ud-"
      ],
      "rarity": 119,
      "imagePath": "assets/word/without.png",
      "imageGitBlobSha": "2a2628681b17415608baecfd6cb37e5a72304109",
      "localImageExists": true,
      "sourceOrdinal": 17294,
      "reviewOrder": 76,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "傘なしで濡れる人物だが、withoutよりrainやwetが直接的。",
      "alternativeAnswersEn": [
        "wet",
        "rain",
        "no umbrella"
      ],
      "assessedAt": "2026-10-19T08:06:51.776917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "against",
      "w": "against",
      "p": [
        "gagina"
      ],
      "rarity": 122,
      "imagePath": "assets/word/against.png",
      "imageGitBlobSha": "c447c1620677dcf25801c0e813fb61f1fbb957ea",
      "localImageExists": true,
      "sourceOrdinal": 357,
      "reviewOrder": 77,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "木の前で作業を止める姿は反対を示すが、againstよりstopが強い。",
      "alternativeAnswersEn": [
        "stop",
        "protect",
        "tree"
      ],
      "assessedAt": "2026-10-19T08:06:51.777918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "something",
      "w": "something",
      "p": [],
      "rarity": 126,
      "imagePath": "assets/word/something.png",
      "imageGitBlobSha": "6d229ddebd360eb427279925e8cf6e76f9dfc2ad",
      "localImageExists": true,
      "sourceOrdinal": 18883,
      "reviewOrder": 78,
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "贈物を見つめる人物で、somethingという不特定表現には絞れない。",
      "alternativeAnswersEn": [
        "gift",
        "present",
        "box"
      ],
      "assessedAt": "2026-10-19T08:06:51.777918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "during",
      "w": "during",
      "p": [
        "deuə-"
      ],
      "rarity": 136,
      "imagePath": "assets/word/during.png",
      "imageGitBlobSha": "beb54c0145ecd2a8517cb862086900b8b83f7520",
      "localImageExists": true,
      "sourceOrdinal": 4848,
      "reviewOrder": 79,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "電車内の読書は見えるが、duringよりreadやtrainを答えやすい。",
      "alternativeAnswersEn": [
        "read",
        "train",
        "travel"
      ],
      "assessedAt": "2026-10-19T08:06:51.778919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "within",
      "w": "within",
      "p": [
        "wi-",
        "en"
      ],
      "rarity": 142,
      "imagePath": "assets/word/within.png",
      "imageGitBlobSha": "8fdd0d1a9d2430385591d7d20cbfa30702894b60",
      "localImageExists": true,
      "sourceOrdinal": 17293,
      "reviewOrder": 80,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "円の内側に立つ位置関係は分かるが、withinよりinsideも自然。",
      "alternativeAnswersEn": [
        "inside",
        "circle",
        "stand"
      ],
      "assessedAt": "2026-10-19T08:06:51.778919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "always",
      "w": "always",
      "p": [
        "al-5",
        "wegh-"
      ],
      "rarity": 148,
      "imagePath": "assets/word/always.png",
      "imageGitBlobSha": "e7cd1a9544163cda417161061bbfd98145da3ed6",
      "localImageExists": true,
      "sourceOrdinal": 565,
      "reviewOrder": 81,
      "score": 60,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "歯磨きと毎日の印は習慣を示すが、alwaysとdailyが競合する。",
      "alternativeAnswersEn": [
        "brush",
        "daily",
        "teeth"
      ],
      "assessedAt": "2026-10-19T08:06:51.779918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "often",
      "w": "often",
      "p": [
        "upo"
      ],
      "rarity": 161,
      "imagePath": "assets/word/often.png",
      "imageGitBlobSha": "bf1f6b5d4818f30a6663a0621ef8d8c27b103c33",
      "localImageExists": true,
      "sourceOrdinal": 10772,
      "reviewOrder": 82,
      "score": 60,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "繰返す水やりの印は見えるが、oftenとalwaysの頻度差は示せない。",
      "alternativeAnswersEn": [
        "water",
        "daily",
        "plant"
      ],
      "assessedAt": "2026-10-19T08:06:51.779918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "men@x",
      "w": "men",
      "p": [],
      "rarity": 163,
      "imagePath": "assets/word/men@x.png",
      "imageGitBlobSha": "553ac7568b5ac4421c4abdfea9d773b2cbf8fe06",
      "localImageExists": true,
      "sourceOrdinal": 20871,
      "reviewOrder": 83,
      "score": 79,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "生理用品・血滴・カレンダーから月経を連想できるが、menという略形には絞れない。",
      "alternativeAnswersEn": [
        "period",
        "menstruation",
        "pad"
      ],
      "assessedAt": "2026-10-19T08:06:51.780917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "until",
      "w": "until",
      "p": [
        "ant-",
        "ad-"
      ],
      "rarity": 166,
      "imagePath": "assets/word/until.png",
      "imageGitBlobSha": "ff304b7f58569ae1cc6df762f32c9974e0b2f4d1",
      "localImageExists": true,
      "sourceOrdinal": 16582,
      "reviewOrder": 84,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "時計を見ながら待つ人物で、untilの終点関係は特定できない。",
      "alternativeAnswersEn": [
        "wait",
        "time",
        "station"
      ],
      "assessedAt": "2026-10-19T08:06:51.780917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "though",
      "w": "though",
      "p": [
        "to-"
      ],
      "rarity": 168,
      "imagePath": "assets/word/though.png",
      "imageGitBlobSha": "99c881ab86ffc923a670bf4efd1209f0ffaddbd4",
      "localImageExists": true,
      "sourceOrdinal": 15951,
      "reviewOrder": 85,
      "score": 31,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 6,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "雨の中を進む人物は見えるが、thoughの逆接関係は絵だけでは定まらない。",
      "alternativeAnswersEn": [
        "walk",
        "rain",
        "raincoat"
      ],
      "assessedAt": "2026-10-19T08:06:51.780917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "upon",
      "w": "upon",
      "p": [
        "upo",
        "an-"
      ],
      "rarity": 168,
      "imagePath": "assets/word/upon.png",
      "imageGitBlobSha": "c1d5460deae0f40347154303b841a8a78937f447",
      "localImageExists": true,
      "sourceOrdinal": 16600,
      "reviewOrder": 86,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "台の上の王冠で位置は読めるが、uponよりcrownやonが自然。",
      "alternativeAnswersEn": [
        "crown",
        "on",
        "cushion"
      ],
      "assessedAt": "2026-10-19T08:06:51.781918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "since",
      "w": "since",
      "p": [
        "sē-2",
        "to-"
      ],
      "rarity": 170,
      "imagePath": "assets/word/since.png",
      "imageGitBlobSha": "27f6ad52e8d90f3ff111a1e57be937b53aee1a05",
      "localImageExists": true,
      "sourceOrdinal": 14529,
      "reviewOrder": 87,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "植物の過去写真と現在の成長は見えるが、sinceよりgrowが強い。",
      "alternativeAnswersEn": [
        "grow",
        "plant",
        "before"
      ],
      "assessedAt": "2026-10-19T08:06:51.781918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "am",
      "w": "am",
      "p": [
        "es-"
      ],
      "rarity": 173,
      "imagePath": "assets/word/am.png",
      "imageGitBlobSha": "33f84c827227d66c0056d80b3042168adaeabef8",
      "localImageExists": true,
      "sourceOrdinal": 568,
      "reviewOrder": 88,
      "score": 18,
      "components": {
        "meaningVisible": 6,
        "conceptDistinct": 2,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "鉢を持つ人物を示す絵で、amというbe動詞の語形は分からない。",
      "alternativeAnswersEn": [
        "gardener",
        "plant",
        "I"
      ],
      "assessedAt": "2026-10-19T08:06:51.782917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "didnt",
      "w": "didn't",
      "p": [],
      "rarity": 178,
      "imagePath": "assets/word/didnt.png",
      "imageGitBlobSha": "d04f26f44ddc26e7523fec64a57c1563b4bef924",
      "localImageExists": true,
      "sourceOrdinal": 25941,
      "reviewOrder": 89,
      "score": 54,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "否定の腕と過去の時計はあるが、didntの過去否定に絞れない。",
      "alternativeAnswersEn": [
        "no",
        "not",
        "play"
      ],
      "assessedAt": "2026-10-19T08:06:51.782917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "himself",
      "w": "himself",
      "p": [
        "ko-",
        "s(w)e-"
      ],
      "rarity": 182,
      "imagePath": "assets/word/himself.png",
      "imageGitBlobSha": "26096c0321598e3e632154a393be2a699e51a2f0",
      "localImageExists": true,
      "sourceOrdinal": 7411,
      "reviewOrder": 90,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "自分で靴ひもを結ぶ姿だが、himselfよりtieが直接的。",
      "alternativeAnswersEn": [
        "tie",
        "shoelace",
        "alone"
      ],
      "assessedAt": "2026-10-19T08:06:51.783918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "house",
      "w": "house",
      "p": [
        "(s)keu-"
      ],
      "rarity": 182,
      "imagePath": "assets/word/house.png",
      "imageGitBlobSha": "e55eb3fc4d4300c0f40b9bf5ddd926cb739eff9c",
      "localImageExists": true,
      "sourceOrdinal": 7554,
      "reviewOrder": 91,
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "家全体が単独で明瞭に描かれhouseを推測しやすい。",
      "alternativeAnswersEn": [
        "home",
        "building"
      ],
      "assessedAt": "2026-10-19T08:06:51.783918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "together",
      "w": "together",
      "p": [
        "de-",
        "ghedh-"
      ],
      "rarity": 183,
      "imagePath": "assets/word/together.png",
      "imageGitBlobSha": "efe9b662e659ec460485a5d5d86bd573f30b2d4d",
      "localImageExists": true,
      "sourceOrdinal": 16044,
      "reviewOrder": 92,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "二人で板を運ぶ共同動作が明瞭でtogetherを連想しやすい。",
      "alternativeAnswersEn": [
        "carry",
        "help",
        "teamwork"
      ],
      "assessedAt": "2026-10-19T08:06:51.784920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "de",
      "w": "de",
      "p": [],
      "rarity": 184,
      "imagePath": "assets/word/de.png",
      "imageGitBlobSha": "c12e5a39f512a2580f378fd759cbc7753812afaa",
      "localImageExists": true,
      "sourceOrdinal": 20862,
      "reviewOrder": 93,
      "score": 30,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 6,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "下向き矢印と二枚の板で、deという語・接辞には特定できない。",
      "alternativeAnswersEn": [
        "down",
        "lower",
        "below"
      ],
      "assessedAt": "2026-10-19T08:06:51.784920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "why",
      "w": "why",
      "p": [
        "kʷo-"
      ],
      "rarity": 188,
      "imagePath": "assets/word/why.png",
      "imageGitBlobSha": "254de6d21a269d1bc5e6adc6e6e7e89173fe21b9",
      "localImageExists": true,
      "sourceOrdinal": 17228,
      "reviewOrder": 94,
      "score": 42,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "枯れた植物を不思議がる構図だが、whyよりwiltやsadが直接的。",
      "alternativeAnswersEn": [
        "wilt",
        "ask",
        "sad"
      ],
      "assessedAt": "2026-10-19T08:06:51.784920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "once",
      "w": "once",
      "p": [
        "oi-no-"
      ],
      "rarity": 191,
      "imagePath": "assets/word/once.png",
      "imageGitBlobSha": "418d1dc44b20ae2d0ff2948e68f6bc6e007edba3",
      "localImageExists": true,
      "sourceOrdinal": 10814,
      "reviewOrder": 95,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "呼び鈴を押す一場面だけでは、onceという回数は特定できない。",
      "alternativeAnswersEn": [
        "doorbell",
        "ring",
        "press"
      ],
      "assessedAt": "2026-10-19T08:06:51.785918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "really",
      "w": "really",
      "p": [],
      "rarity": 192,
      "imagePath": "assets/word/really.png",
      "imageGitBlobSha": "e2b30ee0b65f2961a65c8e883e2001735fe17a0d",
      "localImageExists": true,
      "sourceOrdinal": 20873,
      "reviewOrder": 96,
      "score": 25,
      "components": {
        "meaningVisible": 11,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "覆いを外して車のおもちゃを見る場面で、reallyという副詞は伝わらない。",
      "alternativeAnswersEn": [
        "toy",
        "discover",
        "reveal"
      ],
      "assessedAt": "2026-10-19T08:06:51.785918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "already",
      "w": "already",
      "p": [
        "al-5",
        "reidh-"
      ],
      "rarity": 193,
      "imagePath": "assets/word/already.png",
      "imageGitBlobSha": "b64ed4694f4c96211cc5b3c63b90c4b064b86d0e",
      "localImageExists": true,
      "sourceOrdinal": 536,
      "reviewOrder": 97,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "仕事を終えた様子は見えるが、alreadyの早さや基準時点が分からない。",
      "alternativeAnswersEn": [
        "finish",
        "work",
        "surprise"
      ],
      "assessedAt": "2026-10-19T08:06:51.786917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "among",
      "w": "among",
      "p": [
        "an-",
        "mag-"
      ],
      "rarity": 193,
      "imagePath": "assets/word/among.png",
      "imageGitBlobSha": "d1bf49818990fd84f53dc04316ba06d817c488ad",
      "localImageExists": true,
      "sourceOrdinal": 626,
      "reviewOrder": 98,
      "score": 83,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "黄色い花の中の赤い花が明瞭でamongの配置を連想できる。",
      "alternativeAnswersEn": [
        "flowers",
        "middle",
        "red"
      ],
      "assessedAt": "2026-10-19T08:06:51.787920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "shall",
      "w": "shall",
      "p": [
        "skel-2"
      ],
      "rarity": 194,
      "imagePath": "assets/word/shall.png",
      "imageGitBlobSha": "631fbca0ee65b231634cd095807ec8d200954e0c",
      "localImageExists": true,
      "sourceOrdinal": 14394,
      "reviewOrder": 99,
      "score": 22,
      "components": {
        "meaningVisible": 9,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "働く準備の人物で、shallの意志・未来の語形は読み取れない。",
      "alternativeAnswersEn": [
        "worker",
        "ready",
        "helmet"
      ],
      "assessedAt": "2026-10-19T08:06:51.787920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ever",
      "w": "ever",
      "p": [
        "aiw-"
      ],
      "rarity": 195,
      "imagePath": "assets/word/ever.png",
      "imageGitBlobSha": "8c61b3b7353847d2cdc9bcc56cb8f7e81844726b",
      "localImageExists": true,
      "sourceOrdinal": 5582,
      "reviewOrder": 100,
      "score": 33,
      "components": {
        "meaningVisible": 16,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "老人と昔の写真で、everという経験の範囲は特定できない。",
      "alternativeAnswersEn": [
        "memory",
        "photo",
        "grandfather"
      ],
      "assessedAt": "2026-10-19T08:06:51.788920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "across",
      "w": "across",
      "p": [],
      "rarity": 196,
      "imagePath": "assets/word/across.png",
      "imageGitBlobSha": "c32f49fb58c6a554ca3437ba777b9f9d2d19d9ce",
      "localImageExists": true,
      "sourceOrdinal": 18891,
      "reviewOrder": 101,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "川の橋を渡る動作は明瞭でacrossを連想できるが、bridgeも強い。",
      "alternativeAnswersEn": [
        "bridge",
        "cross",
        "walk"
      ],
      "assessedAt": "2026-10-19T08:06:51.789921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "rather",
      "w": "rather",
      "p": [
        "kret-1"
      ],
      "rarity": 197,
      "imagePath": "assets/word/rather.png",
      "imageGitBlobSha": "25073f036cea31e8f513a3b12763a1b5b4dce432",
      "localImageExists": true,
      "sourceOrdinal": 13015,
      "reviewOrder": 102,
      "score": 27,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "高めを示す計器だけではratherという程度副詞は定まらない。",
      "alternativeAnswersEn": [
        "gauge",
        "high",
        "meter"
      ],
      "assessedAt": "2026-10-19T08:06:51.789921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "known",
      "w": "known",
      "p": [],
      "rarity": 197,
      "imagePath": "assets/word/known.png",
      "imageGitBlobSha": "d20c038b100bc1e7744dd19029362b45973f0adf",
      "localImageExists": true,
      "sourceOrdinal": 20888,
      "reviewOrder": 103,
      "score": 28,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "クマのぬいぐるみを見る人物で、knownという既知の状態は示されない。",
      "alternativeAnswersEn": [
        "teddy bear",
        "recognize",
        "toy"
      ],
      "assessedAt": "2026-10-19T08:06:51.789921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "present",
      "w": "present",
      "p": [
        "per1",
        "es-"
      ],
      "rarity": 198,
      "imagePath": "assets/word/present.png",
      "imageGitBlobSha": "cac6163d42dfbba4f8e33f0e670060f9edaf8407",
      "localImageExists": true,
      "sourceOrdinal": 12344,
      "reviewOrder": 104,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "時計とカレンダーの現在位置を示すが、presentよりtodayやnowも自然。",
      "alternativeAnswersEn": [
        "today",
        "now",
        "calendar"
      ],
      "assessedAt": "2026-10-19T08:06:51.790920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sure",
      "w": "sure",
      "p": [
        "s(w)e-",
        "kʷei-3"
      ],
      "rarity": 198,
      "imagePath": "assets/word/sure.png",
      "imageGitBlobSha": "77ab7574cc7157a6534db69c80b27838f90201f3",
      "localImageExists": true,
      "sourceOrdinal": 15488,
      "reviewOrder": 105,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "道を示す自信のある人物は見えるが、sureよりdirectionが直接的。",
      "alternativeAnswersEn": [
        "direction",
        "confident",
        "map"
      ],
      "assessedAt": "2026-10-19T08:06:51.790920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "doesnt",
      "w": "doesn't",
      "p": [],
      "rarity": 199,
      "imagePath": "assets/word/doesnt.png",
      "imageGitBlobSha": "1c8685dd61a556a2f3c9514157746d6466cd0269",
      "localImageExists": true,
      "sourceOrdinal": 28979,
      "reviewOrder": 106,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 14,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "クッキーを食べる場面の禁止印は否定を示すが、doesntの語形は特定できない。",
      "alternativeAnswersEn": [
        "dont",
        "no",
        "eat"
      ],
      "assessedAt": "2026-10-19T08:06:51.791920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "least",
      "w": "least",
      "p": [
        "leis-2"
      ],
      "rarity": 200,
      "imagePath": "assets/word/least.png",
      "imageGitBlobSha": "06aeff86996b5c8d32c6cdeb1e0b6a441f984edf",
      "localImageExists": true,
      "sourceOrdinal": 8863,
      "reviewOrder": 107,
      "score": 62,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "最小のいちごは分かるが、leastよりsmallestやstrawberryも強い。",
      "alternativeAnswersEn": [
        "smallest",
        "strawberry",
        "small"
      ],
      "assessedAt": "2026-10-19T08:06:51.791920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "nothing",
      "w": "nothing",
      "p": [
        "ne",
        "aiw-",
        "tenk-1"
      ],
      "rarity": 200,
      "imagePath": "assets/word/nothing.png",
      "imageGitBlobSha": "9036d3c526a374dff4abb7c7dc83822f5881984e",
      "localImageExists": true,
      "sourceOrdinal": 10546,
      "reviewOrder": 108,
      "score": 84,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "空の袋を見せておりnothingを連想できるが、emptyも有力。",
      "alternativeAnswersEn": [
        "empty",
        "bag"
      ],
      "assessedAt": "2026-10-19T08:06:51.792922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "school@segh",
      "w": "school",
      "p": [
        "segh-"
      ],
      "rarity": 200,
      "imagePath": "assets/word/school@segh.png",
      "imageGitBlobSha": "7b6d3194c5dea5e6c2595675bd2dc1c3a3953773",
      "localImageExists": true,
      "sourceOrdinal": 14056,
      "reviewOrder": 109,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "校舎と登校する子供たちからschoolを推測しやすい。",
      "alternativeAnswersEn": [
        "building",
        "education"
      ],
      "assessedAt": "2026-10-19T08:06:51.792922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "able",
      "w": "able",
      "p": [
        "ghabh-"
      ],
      "rarity": 201,
      "imagePath": "assets/word/able.png",
      "imageGitBlobSha": "56d3793e456941489efcf0081781596442142acb",
      "localImageExists": true,
      "sourceOrdinal": 34,
      "reviewOrder": 110,
      "score": 55,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "自分で靴ひもを結ぶ動作は見えるが、ableよりtieが自然。",
      "alternativeAnswersEn": [
        "tie",
        "shoelace",
        "can"
      ],
      "assessedAt": "2026-10-19T08:06:51.793919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "woman",
      "w": "woman",
      "p": [
        "man-1"
      ],
      "rarity": 201,
      "imagePath": "assets/word/woman.png",
      "imageGitBlobSha": "32f73a4a36e345ccbaad0ab568a7f394948a8176",
      "localImageExists": true,
      "sourceOrdinal": 17310,
      "reviewOrder": 111,
      "score": 92,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "成人女性が単独で明瞭に描かれwomanを答えやすい。",
      "alternativeAnswersEn": [
        "lady",
        "person"
      ],
      "assessedAt": "2026-10-19T08:06:51.793919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "early",
      "w": "early",
      "p": [
        "ayer-",
        "līk-"
      ],
      "rarity": 202,
      "imagePath": "assets/word/early.png",
      "imageGitBlobSha": "2383f4c0a332c10e48579e820835c1904ea32da6",
      "localImageExists": true,
      "sourceOrdinal": 4886,
      "reviewOrder": 112,
      "score": 70,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "朝日と起床が示されるが、earlyよりmorningやwakeも自然。",
      "alternativeAnswersEn": [
        "morning",
        "wake",
        "stretch"
      ],
      "assessedAt": "2026-10-19T08:06:51.794919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "along",
      "w": "along",
      "p": [
        "ant-",
        "del-1"
      ],
      "rarity": 203,
      "imagePath": "assets/word/along.png",
      "imageGitBlobSha": "1198af9dd9f1b61c4637ed5b9b47d757ee5e83b0",
      "localImageExists": true,
      "sourceOrdinal": 529,
      "reviewOrder": 113,
      "score": 74,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 11,
        "smallImageReadable": 10
      },
      "reasonJa": "川沿いの道を歩く配置でalongは読めるが、walkも強い。",
      "alternativeAnswersEn": [
        "walk",
        "river",
        "path"
      ],
      "assessedAt": "2026-10-19T08:06:51.794919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "self",
      "w": "self",
      "p": [
        "s(w)e-"
      ],
      "rarity": 203,
      "imagePath": "assets/word/self.png",
      "imageGitBlobSha": "092a99a3e1d33df765172826ca76faab035910b1",
      "localImageExists": true,
      "sourceOrdinal": 14227,
      "reviewOrder": 114,
      "score": 54,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "鏡に映る自分を見るが、selfよりmirrorやreflectionも自然。",
      "alternativeAnswersEn": [
        "mirror",
        "reflection",
        "myself"
      ],
      "assessedAt": "2026-10-19T08:06:51.795919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "yet",
      "w": "yet",
      "p": [
        "i-"
      ],
      "rarity": 203,
      "imagePath": "assets/word/yet.png",
      "imageGitBlobSha": "c6a4faebd628a9a06117e33ae47bb6a4ee5a515f",
      "localImageExists": true,
      "sourceOrdinal": 17413,
      "reviewOrder": 115,
      "score": 34,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "時計の横で待つ姿だけではyetの未完了関係は特定できない。",
      "alternativeAnswersEn": [
        "wait",
        "late",
        "clock"
      ],
      "assessedAt": "2026-10-19T08:06:51.795919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "American",
      "w": "American",
      "p": [],
      "rarity": 203,
      "imagePath": "assets/word/American.png",
      "imageGitBlobSha": "efb1f2b6aec39336a90990455bad65b3cb939a0f",
      "localImageExists": true,
      "sourceOrdinal": 18892,
      "reviewOrder": 116,
      "score": 92,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "米国の旗と地図が明瞭でAmericanを連想しやすい。",
      "alternativeAnswersEn": [
        "America",
        "USA"
      ],
      "assessedAt": "2026-10-19T08:06:51.796919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "political",
      "w": "political",
      "p": [
        "pelə-3"
      ],
      "rarity": 204,
      "imagePath": "assets/word/political.png",
      "imageGitBlobSha": "87d9ac8ee9f3927a3100d44780ca97490d597c1e",
      "localImageExists": true,
      "sourceOrdinal": 12083,
      "reviewOrder": 117,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "投票箱と議事堂から政治は分かるが、politicalという形容詞には絞れない。",
      "alternativeAnswersEn": [
        "politics",
        "election",
        "vote"
      ],
      "assessedAt": "2026-10-19T08:06:51.796919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "several",
      "w": "several",
      "p": [
        "s(w)e-",
        "perə-1"
      ],
      "rarity": 204,
      "imagePath": "assets/word/several.png",
      "imageGitBlobSha": "0632d431c5c8ff42bbef03b3e286b60517c0c837",
      "localImageExists": true,
      "sourceOrdinal": 14364,
      "reviewOrder": 118,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "複数の鉛筆は見えるが、severalとsomeやfiveの区別はつかない。",
      "alternativeAnswersEn": [
        "pencils",
        "five",
        "some"
      ],
      "assessedAt": "2026-10-19T08:06:51.797920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "above",
      "w": "above",
      "p": [
        "an-",
        "ambhi",
        "upo"
      ],
      "rarity": 205,
      "imagePath": "assets/word/above.png",
      "imageGitBlobSha": "b240960302608a9246acfb0edb6dd60b41f1fa5b",
      "localImageExists": true,
      "sourceOrdinal": 49,
      "reviewOrder": 119,
      "score": 88,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "テーブルの上方の照明でaboveの配置は明瞭。",
      "alternativeAnswersEn": [
        "lamp",
        "over",
        "light"
      ],
      "assessedAt": "2026-10-19T08:06:51.797920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "analysis",
      "w": "analysis",
      "p": [
        "an-",
        "leu-"
      ],
      "rarity": 206,
      "imagePath": "assets/word/analysis.png",
      "imageGitBlobSha": "db24d3147df04bbfc14bf3b688f60f4796ca5dd2",
      "localImageExists": true,
      "sourceOrdinal": 689,
      "reviewOrder": 120,
      "score": 71,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "試料を分けて調べる姿からanalysisは連想できるが、examineも有力。",
      "alternativeAnswersEn": [
        "examine",
        "research",
        "scientist"
      ],
      "assessedAt": "2026-10-19T08:06:51.797920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "four",
      "w": "four",
      "p": [
        "kʷetwer-"
      ],
      "rarity": 206,
      "imagePath": "assets/word/four.png",
      "imageGitBlobSha": "ff2fa8d406062bbb56cd26ce3ba3fa12a35b17dd",
      "localImageExists": true,
      "sourceOrdinal": 6369,
      "reviewOrder": 121,
      "score": 75,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 20,
        "answerSpecific": 11,
        "smallImageReadable": 10
      },
      "reasonJa": "卵四個の数は明瞭だが、fourよりeggsも自然な答え。",
      "alternativeAnswersEn": [
        "eggs",
        "nest"
      ],
      "assessedAt": "2026-10-19T08:06:51.798919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "whole",
      "w": "whole",
      "p": [
        "kailo-"
      ],
      "rarity": 206,
      "imagePath": "assets/word/whole.png",
      "imageGitBlobSha": "a1a785fcfa226d4603e28c1b2654abc26fb1bb63",
      "localImageExists": true,
      "sourceOrdinal": 17220,
      "reviewOrder": 122,
      "score": 45,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "丸ごとのリンゴだが、比較がなくwholeよりappleが先に浮かぶ。",
      "alternativeAnswersEn": [
        "apple",
        "fruit",
        "red"
      ],
      "assessedAt": "2026-10-19T08:06:51.798919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "health",
      "w": "health",
      "p": [
        "kailo-"
      ],
      "rarity": 207,
      "imagePath": "assets/word/health.png",
      "imageGitBlobSha": "c283b13e64e38f75dcfbebf08cf116fe24c0cbf7",
      "localImageExists": true,
      "sourceOrdinal": 7247,
      "reviewOrder": 123,
      "score": 55,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "屋外を歩く人物で健康は連想できるが、healthよりwalkやexerciseが直接的。",
      "alternativeAnswersEn": [
        "walk",
        "exercise",
        "healthy"
      ],
      "assessedAt": "2026-10-19T08:06:51.799920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "mother",
      "w": "mother",
      "p": [
        "māter-"
      ],
      "rarity": 207,
      "imagePath": "assets/word/mother.png",
      "imageGitBlobSha": "acd30c986d7a8ec6b6dbe3a48b0078c71bd27230",
      "localImageExists": true,
      "sourceOrdinal": 10102,
      "reviewOrder": 124,
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "子供の服を整える女性からmotherを連想しやすいが、parentも候補。",
      "alternativeAnswersEn": [
        "parent",
        "mom",
        "help"
      ],
      "assessedAt": "2026-10-19T08:06:51.799920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "anything",
      "w": "anything",
      "p": [],
      "rarity": 207,
      "imagePath": "assets/word/anything.png",
      "imageGitBlobSha": "cf37f1bcdf49cfe8496f2ca076efedaa5c6e3ae3",
      "localImageExists": true,
      "sourceOrdinal": 18894,
      "reviewOrder": 125,
      "score": 29,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 5,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "様々な物の入った箱は見えるが、anythingという不定表現は特定できない。",
      "alternativeAnswersEn": [
        "box",
        "things",
        "toys"
      ],
      "assessedAt": "2026-10-19T08:06:51.800920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "moment",
      "w": "moment",
      "p": [
        "meuə-"
      ],
      "rarity": 208,
      "imagePath": "assets/word/moment.png",
      "imageGitBlobSha": "75804ee4f3278dec9d45984ed8a896a988a5a910",
      "localImageExists": true,
      "sourceOrdinal": 9986,
      "reviewOrder": 126,
      "score": 45,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "割れるシャボン玉は一瞬を連想させるが、momentよりbubbleが自然。",
      "alternativeAnswersEn": [
        "bubble",
        "pop",
        "play"
      ],
      "assessedAt": "2026-10-19T08:06:51.800920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "dont",
      "w": "don't",
      "p": [],
      "rarity": 208,
      "imagePath": "assets/word/dont.png",
      "imageGitBlobSha": "8de840e167a04f252da33edf0ec0ddd105207e26",
      "localImageExists": true,
      "sourceOrdinal": 23675,
      "reviewOrder": 127,
      "score": 71,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "熱いやかんに触る行為の禁止印は命令の否定を示すが、dontの語形は断定できない。",
      "alternativeAnswersEn": [
        "stop",
        "hot",
        "danger"
      ],
      "assessedAt": "2026-10-19T08:06:51.801918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "taken@x",
      "w": "taken",
      "p": [],
      "rarity": 209,
      "imagePath": "assets/word/taken@x.png",
      "imageGitBlobSha": "0588a142f773fec530fe0528e82d03352ba1fe3b",
      "localImageExists": true,
      "sourceOrdinal": 20886,
      "reviewOrder": 128,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "クッキーを食べる場面からtakenの意味や過去分詞形は特定できない。",
      "alternativeAnswersEn": [
        "eat",
        "cookie",
        "take"
      ],
      "assessedAt": "2026-10-19T08:06:51.801918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "taken@tak2",
      "w": "taken",
      "p": [
        "tak-2"
      ],
      "rarity": 209,
      "imagePath": "assets/word/taken@tak2.png",
      "imageGitBlobSha": "2b822aa0dc1c869ce718fc121059c1c6cd5c82b1",
      "localImageExists": true,
      "sourceOrdinal": 49166,
      "reviewOrder": 129,
      "score": 55,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "玉をつまむ手は取る行為を示すが、takenという過去分詞は読み取れない。",
      "alternativeAnswersEn": [
        "take",
        "hold",
        "marble"
      ],
      "assessedAt": "2026-10-19T08:06:51.802917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "father",
      "w": "father",
      "p": [
        "pəter-"
      ],
      "rarity": 210,
      "imagePath": "assets/word/father.png",
      "imageGitBlobSha": "0d4bf20676298a7cd6ba8e8119032a132d79bffa",
      "localImageExists": true,
      "sourceOrdinal": 5907,
      "reviewOrder": 130,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 9
      },
      "reasonJa": "子供と玩具を作る男性からfatherを連想できるが、dadやparentも候補。",
      "alternativeAnswersEn": [
        "dad",
        "parent",
        "build"
      ],
      "assessedAt": "2026-10-19T08:06:51.802917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "however",
      "w": "however",
      "p": [
        "kʷo-",
        "aiw-"
      ],
      "rarity": 211,
      "imagePath": "assets/word/however.png",
      "imageGitBlobSha": "53b722a7e905dd011f679f9afca16c116d1ee67e",
      "localImageExists": true,
      "sourceOrdinal": 7561,
      "reviewOrder": 131,
      "score": 23,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "雨でもテント内で休む構図だが、howeverという逆接は絵から特定できない。",
      "alternativeAnswersEn": [
        "camp",
        "rain",
        "tent"
      ],
      "assessedAt": "2026-10-19T08:06:51.803918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "whether",
      "w": "whether",
      "p": [
        "kʷo-"
      ],
      "rarity": 212,
      "imagePath": "assets/word/whether.png",
      "imageGitBlobSha": "0ed9072a44086ad4f2e1aa3b2e4ac26c88284fc6",
      "localImageExists": true,
      "sourceOrdinal": 17201,
      "reviewOrder": 132,
      "score": 31,
      "components": {
        "meaningVisible": 15,
        "conceptDistinct": 6,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "雨雲を見て傘を持つ姿で、whetherの選択・疑問関係は定まらない。",
      "alternativeAnswersEn": [
        "weather",
        "rain",
        "decide"
      ],
      "assessedAt": "2026-10-19T08:06:51.804918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "experience",
      "w": "experience",
      "p": [
        "eghs",
        "per-3"
      ],
      "rarity": 213,
      "imagePath": "assets/word/experience.png",
      "imageGitBlobSha": "b80d41336837dcf3fa37a27e02f8c0ec6ab87dd9",
      "localImageExists": true,
      "sourceOrdinal": 5714,
      "reviewOrder": 133,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "指導を受ける陶芸の体験は見えるが、experienceよりpotteryやlearnも強い。",
      "alternativeAnswersEn": [
        "pottery",
        "learn",
        "try"
      ],
      "assessedAt": "2026-10-19T08:06:51.804918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "young",
      "w": "young",
      "p": [
        "yeu-"
      ],
      "rarity": 213,
      "imagePath": "assets/word/young.png",
      "imageGitBlobSha": "4025adb00a2433fe678610c66a3457612425c813",
      "localImageExists": true,
      "sourceOrdinal": 17424,
      "reviewOrder": 134,
      "score": 39,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "苗を持つ若い人物だが、youngという年齢よりgardenerやplantが目立つ。",
      "alternativeAnswersEn": [
        "gardener",
        "plant",
        "boy"
      ],
      "assessedAt": "2026-10-19T08:06:51.805920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "behind",
      "w": "behind",
      "p": [
        "ambhi",
        "ko-"
      ],
      "rarity": 214,
      "imagePath": "assets/word/behind.png",
      "imageGitBlobSha": "91d98094122f2d3129f701c4de4de88bdfb7a945",
      "localImageExists": true,
      "sourceOrdinal": 1582,
      "reviewOrder": 135,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "椅子の後ろに人物が隠れる配置でbehindを読み取りやすい。",
      "alternativeAnswersEn": [
        "chair",
        "hide",
        "back"
      ],
      "assessedAt": "2026-10-19T08:06:51.805920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "low@legh",
      "w": "low",
      "p": [
        "legh-"
      ],
      "rarity": 214,
      "imagePath": "assets/word/low@legh.png",
      "imageGitBlobSha": "1cdfb6d11330cb0d43de0726b30e1cafdde555c1",
      "localImageExists": true,
      "sourceOrdinal": 9172,
      "reviewOrder": 136,
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "猫が球で遊ぶ絵で、lowの高さや低さは示されない。",
      "alternativeAnswersEn": [
        "cat",
        "play",
        "ball"
      ],
      "assessedAt": "2026-10-19T08:06:51.806917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "almost",
      "w": "almost",
      "p": [
        "al-5",
        "mē-3"
      ],
      "rarity": 215,
      "imagePath": "assets/word/almost.png",
      "imageGitBlobSha": "fbd19310dd24015aa67403f0688637741c4f7f5f",
      "localImageExists": true,
      "sourceOrdinal": 526,
      "reviewOrder": 137,
      "score": 61,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "縁近くまで水が入るが、almostの未達よりfullやwaterが強い。",
      "alternativeAnswersEn": [
        "full",
        "water",
        "glass"
      ],
      "assessedAt": "2026-10-19T08:06:51.806917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "heard@x",
      "w": "heard",
      "p": [],
      "rarity": 215,
      "imagePath": "assets/word/heard@x.png",
      "imageGitBlobSha": "ba4a4ae58a96b5f115640181838bcc2d30c397ab",
      "localImageExists": true,
      "sourceOrdinal": 20928,
      "reviewOrder": 138,
      "score": 26,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "海上の火山島の絵で、heardの聴覚や過去形は読み取れない。",
      "alternativeAnswersEn": [
        "island",
        "volcano",
        "sea"
      ],
      "assessedAt": "2026-10-19T08:06:51.806917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "looking",
      "w": "looking",
      "p": [],
      "rarity": 215,
      "imagePath": "assets/word/looking.png",
      "imageGitBlobSha": "6a75934a16ac0e09366e8736b1bcdb57e7cd7db3",
      "localImageExists": true,
      "sourceOrdinal": 47197,
      "reviewOrder": 139,
      "score": 76,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 11,
        "smallImageReadable": 10
      },
      "reasonJa": "蝶をのぞく動作は明瞭だが、lookingとlookやwatchの語形差は分からない。",
      "alternativeAnswersEn": [
        "look",
        "watch",
        "butterfly"
      ],
      "assessedAt": "2026-10-19T08:06:51.807918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "heard@kous",
      "w": "heard",
      "p": [
        "kous-"
      ],
      "rarity": 215,
      "imagePath": "assets/word/heard@kous.png",
      "imageGitBlobSha": "26eb7892d9213af7071ea9b2fc0d1d219763ad4a",
      "localImageExists": true,
      "sourceOrdinal": 49131,
      "reviewOrder": 140,
      "score": 68,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "鐘から耳への音は聞く意味を示すが、heardの過去形は示されない。",
      "alternativeAnswersEn": [
        "hear",
        "sound",
        "bell"
      ],
      "assessedAt": "2026-10-19T08:06:51.807918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "full@pele1",
      "w": "full",
      "p": [
        "pelə-1"
      ],
      "rarity": 216,
      "imagePath": "assets/word/full@pele1.png",
      "imageGitBlobSha": "12325ef1103fc2dd11ae02713d3e0aa44fbf0598",
      "localImageExists": true,
      "sourceOrdinal": 6501,
      "reviewOrder": 141,
      "score": 75,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "縁まで入ったカップだが、fullよりcupやcoffeeも有力。",
      "alternativeAnswersEn": [
        "cup",
        "coffee",
        "filled"
      ],
      "assessedAt": "2026-10-19T08:06:51.808917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "voice",
      "w": "voice",
      "p": [
        "wekʷ-"
      ],
      "rarity": 216,
      "imagePath": "assets/word/voice.png",
      "imageGitBlobSha": "3e3ac9666ee5b7925e4378c382cf6c067cd165fb",
      "localImageExists": true,
      "sourceOrdinal": 16972,
      "reviewOrder": 142,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "口から耳へ声を届ける構図でvoiceを連想できるが、speakも強い。",
      "alternativeAnswersEn": [
        "speak",
        "whisper",
        "sound"
      ],
      "assessedAt": "2026-10-19T08:06:51.808917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "says",
      "w": "says",
      "p": [],
      "rarity": 216,
      "imagePath": "assets/word/says.png",
      "imageGitBlobSha": "5345334912a792bdd4271c88f20f1af9c8559c61",
      "localImageExists": true,
      "sourceOrdinal": 48461,
      "reviewOrder": 143,
      "score": 66,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "相手に話す姿は分かるが、saysの三人称単数は示せない。",
      "alternativeAnswersEn": [
        "say",
        "talk",
        "speak"
      ],
      "assessedAt": "2026-10-19T08:06:51.809919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "due",
      "w": "due",
      "p": [
        "de-",
        "ghabh-"
      ],
      "rarity": 217,
      "imagePath": "assets/word/due.png",
      "imageGitBlobSha": "ee0d5b84f7bad78988b145c22b4a8aa7025526b8",
      "localImageExists": true,
      "sourceOrdinal": 4806,
      "reviewOrder": 144,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "駅の時刻表と待つ人物はあるが、dueよりtrainやtimeが直接的。",
      "alternativeAnswersEn": [
        "train",
        "time",
        "wait"
      ],
      "assessedAt": "2026-10-19T08:06:51.809919+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "further",
      "w": "further",
      "p": [
        "per1"
      ],
      "rarity": 217,
      "imagePath": "assets/word/further.png",
      "imageGitBlobSha": "0a90cd558d563e4447f57025bdcbe855fcd6a764",
      "localImageExists": true,
      "sourceOrdinal": 6541,
      "reviewOrder": 145,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "敷石を延長する作業は見えるが、furtherよりpathやextendも自然。",
      "alternativeAnswersEn": [
        "path",
        "extend",
        "build"
      ],
      "assessedAt": "2026-10-19T08:06:51.810917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "either",
      "w": "either",
      "p": [
        "aiw-",
        "kʷo-"
      ],
      "rarity": 218,
      "imagePath": "assets/word/either.png",
      "imageGitBlobSha": "5331e64db4dbaea331beb7ebf1c899be158a16fc",
      "localImageExists": true,
      "sourceOrdinal": 5025,
      "reviewOrder": 146,
      "score": 43,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "二つの飲物を示すが、eitherという選択範囲は特定できない。",
      "alternativeAnswersEn": [
        "choose",
        "tea",
        "coffee"
      ],
      "assessedAt": "2026-10-19T08:06:51.810917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "country",
      "w": "country",
      "p": [
        "kom"
      ],
      "rarity": 219,
      "imagePath": "assets/word/country.png",
      "imageGitBlobSha": "0dd782aa7037b65162e18f0f0ad363194a6e87d3",
      "localImageExists": true,
      "sourceOrdinal": 3543,
      "reviewOrder": 147,
      "score": 96,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "日本地図と国旗がそろいJapanを推測しやすい。",
      "alternativeAnswersEn": [
        "Japanese"
      ],
      "assessedAt": "2026-10-19T08:06:51.810917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "line",
      "w": "line",
      "p": [
        "lī̆no-"
      ],
      "rarity": 219,
      "imagePath": "assets/word/line.png",
      "imageGitBlobSha": "2a2d113063f796f22201fd5e7fbd41715ed8dfdf",
      "localImageExists": true,
      "sourceOrdinal": 9024,
      "reviewOrder": 148,
      "score": 55,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "定規で線を引く動作は見えるが、lineよりdrawやrulerも有力。",
      "alternativeAnswersEn": [
        "draw",
        "ruler",
        "straight"
      ],
      "assessedAt": "2026-10-19T08:06:51.811918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "United",
      "w": "United",
      "p": [],
      "rarity": 219,
      "imagePath": "assets/word/United.png",
      "imageGitBlobSha": "95c47a9195fe56bd563e8dde55c67bb055962419",
      "localImageExists": true,
      "sourceOrdinal": 20863,
      "reviewOrder": 149,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "つながるパズル片は結合を示すが、Unitedよりjoinやtogetherが自然。",
      "alternativeAnswersEn": [
        "join",
        "together",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T08:06:51.811918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "common",
      "w": "common",
      "p": [
        "kom",
        "mei-1"
      ],
      "rarity": 220,
      "imagePath": "assets/word/common.png",
      "imageGitBlobSha": "8d01ee2d4b580c2da9b5adcce68077b11de407e5",
      "localImageExists": true,
      "sourceOrdinal": 3019,
      "reviewOrder": 150,
      "score": 60,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "二人の共通した蝶の絵は分かるが、commonよりsameやmatchも強い。",
      "alternativeAnswersEn": [
        "same",
        "match",
        "butterfly"
      ],
      "assessedAt": "2026-10-19T08:06:51.812918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "non-",
      "w": "non-",
      "p": [],
      "rarity": 220,
      "imagePath": "assets/word/non-.png",
      "imageGitBlobSha": "833edb8f0d3e367be2b418457aa7a8ee31046586",
      "localImageExists": true,
      "sourceOrdinal": 22632,
      "reviewOrder": 151,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "アイスの禁止印は否定を示すが、接頭辞non-の形は特定できない。",
      "alternativeAnswersEn": [
        "no",
        "forbidden",
        "ice cream"
      ],
      "assessedAt": "2026-10-19T08:06:51.812918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "real",
      "w": "real",
      "p": [
        "rē-"
      ],
      "rarity": 221,
      "imagePath": "assets/word/real.png",
      "imageGitBlobSha": "7ac9f4000a7fcc6a4e9ce89349cc506324292405",
      "localImageExists": true,
      "sourceOrdinal": 13053,
      "reviewOrder": 152,
      "score": 21,
      "components": {
        "meaningVisible": 9,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "紋章入り硬貨が描かれ、実際の・本物というrealの意味は特定できない。",
      "alternativeAnswersEn": [
        "coin",
        "money",
        "currency"
      ],
      "assessedAt": "2026-10-19T08:06:51.813920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "show",
      "w": "show",
      "p": [
        "(s)keuə-"
      ],
      "rarity": 221,
      "imagePath": "assets/word/show.png",
      "imageGitBlobSha": "78643c4f2667367717855e18d1943997590b4b96",
      "localImageExists": true,
      "sourceOrdinal": 14457,
      "reviewOrder": 153,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "絵を相手に見せる動作が明瞭でshowを連想しやすい。",
      "alternativeAnswersEn": [
        "picture",
        "explain",
        "drawing"
      ],
      "assessedAt": "2026-10-19T08:06:51.813920+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "John",
      "w": "John",
      "p": [],
      "rarity": 221,
      "imagePath": "assets/word/John.png",
      "imageGitBlobSha": "fd60c082552c97a69ccdbf57074b4ec4f6977a72",
      "localImageExists": true,
      "sourceOrdinal": 18898,
      "reviewOrder": 154,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "古代風のひげの宗教的人物だが、ヨハネを特定する洗礼などの手掛かりがない。",
      "alternativeAnswersEn": [
        "saint",
        "man",
        "prophet"
      ],
      "assessedAt": "2026-10-19T08:06:51.814917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "general",
      "w": "general",
      "p": [
        "genə-"
      ],
      "rarity": 222,
      "imagePath": "assets/word/general.png",
      "imageGitBlobSha": "ab3bbfe0ae1263ef14b9d34e286d85c6e332768c",
      "localImageExists": true,
      "sourceOrdinal": 6676,
      "reviewOrder": 155,
      "score": 22,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 8
      },
      "reasonJa": "玄関で靴を履く家族に見え、generalという概念は特定できない。",
      "alternativeAnswersEn": [
        "family",
        "shoes",
        "entrance"
      ],
      "assessedAt": "2026-10-19T08:06:51.814917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "kind",
      "w": "kind",
      "p": [
        "genə-"
      ],
      "rarity": 222,
      "imagePath": "assets/word/kind.png",
      "imageGitBlobSha": "1733ea4d40dd0167d704e9103ad6c49aad204d6c",
      "localImageExists": true,
      "sourceOrdinal": 8623,
      "reviewOrder": 156,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "種類ごとに分けた果物は見えるが、kindよりfruitやsortも自然。",
      "alternativeAnswersEn": [
        "fruit",
        "sort",
        "apple"
      ],
      "assessedAt": "2026-10-19T08:06:51.815918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "past",
      "w": "past",
      "p": [
        "petə-"
      ],
      "rarity": 222,
      "imagePath": "assets/word/past.png",
      "imageGitBlobSha": "ed778c118e39f336abb140807453abbc62234ef3",
      "localImageExists": true,
      "sourceOrdinal": 11350,
      "reviewOrder": 157,
      "score": 74,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 11,
        "smallImageReadable": 10
      },
      "reasonJa": "老人が昔の写真を見る構図でpastを連想できるが、memoryも強い。",
      "alternativeAnswersEn": [
        "memory",
        "photo",
        "old"
      ],
      "assessedAt": "2026-10-19T08:06:51.815918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "self-",
      "w": "self-",
      "p": [],
      "rarity": 222,
      "imagePath": "assets/word/self-.png",
      "imageGitBlobSha": "d4a16cddfc04ac591914268cb6f6943e38d43a5a",
      "localImageExists": true,
      "sourceOrdinal": 24526,
      "reviewOrder": 158,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "自分を指す人物だが、接頭辞self-の語形は特定できない。",
      "alternativeAnswersEn": [
        "me",
        "myself",
        "I"
      ],
      "assessedAt": "2026-10-19T08:06:51.815918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "approach",
      "w": "approach",
      "p": [
        "ad-",
        "per1"
      ],
      "rarity": 223,
      "imagePath": "assets/word/approach.png",
      "imageGitBlobSha": "2e41306e3b63f8b5b48a27ad47df556651e1c71b",
      "localImageExists": true,
      "sourceOrdinal": 963,
      "reviewOrder": 159,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "玄関の相手へ近づく動作は見えるが、approachとvisitが競合する。",
      "alternativeAnswersEn": [
        "visit",
        "come",
        "door"
      ],
      "assessedAt": "2026-10-19T08:06:51.816917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "hard",
      "w": "hard",
      "p": [
        "kar-"
      ],
      "rarity": 223,
      "imagePath": "assets/word/hard.png",
      "imageGitBlobSha": "bb0fc5df0bb5d5bd087e651e71a7ee3dde2b197e",
      "localImageExists": true,
      "sourceOrdinal": 7178,
      "reviewOrder": 160,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "石を噛もうとする姿で硬さは読めるが、hardよりstoneも有力。",
      "alternativeAnswersEn": [
        "stone",
        "bite",
        "rock"
      ],
      "assessedAt": "2026-10-19T08:06:51.816917+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "role",
      "w": "role",
      "p": [
        "ret-"
      ],
      "rarity": 223,
      "imagePath": "assets/word/role.png",
      "imageGitBlobSha": "439da1f134f1792d41eff1cfb89cf7f89093920a",
      "localImageExists": true,
      "sourceOrdinal": 13700,
      "reviewOrder": 161,
      "score": 62,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "照明下の演技は役を連想させるが、roleよりactorやactも強い。",
      "alternativeAnswersEn": [
        "actor",
        "act",
        "stage"
      ],
      "assessedAt": "2026-10-19T08:06:51.817918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "food",
      "w": "food",
      "p": [
        "pā-"
      ],
      "rarity": 225,
      "imagePath": "assets/word/food.png",
      "imageGitBlobSha": "c22d333503d45ebc558dc959f3da2677da0ba170",
      "localImageExists": true,
      "sourceOrdinal": 6258,
      "reviewOrder": 162,
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "食事の皿と果物が明瞭でfoodを推測しやすい。",
      "alternativeAnswersEn": [
        "meal",
        "dinner"
      ],
      "assessedAt": "2026-10-19T08:06:51.817918+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "death",
      "w": "death",
      "p": [
        "dheu-3"
      ],
      "rarity": 226,
      "imagePath": "assets/word/death.png",
      "imageGitBlobSha": "ea998850287b72f6cd7062a857833c229d863881",
      "localImageExists": true,
      "sourceOrdinal": 3881,
      "reviewOrder": 163,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "動かない鳥と落ちた羽から死を連想できるが、deadやbirdも候補。",
      "alternativeAnswersEn": [
        "dead",
        "bird"
      ],
      "assessedAt": "2026-10-19T08:06:51.818921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "idea",
      "w": "idea",
      "p": [
        "weid-"
      ],
      "rarity": 226,
      "imagePath": "assets/word/idea.png",
      "imageGitBlobSha": "3004518fa236ca8b5a47656c2b4ed4b4e9b08468",
      "localImageExists": true,
      "sourceOrdinal": 7693,
      "reviewOrder": 164,
      "score": 70,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "工作中にひらめく姿はideaを連想させるが、buildも有力。",
      "alternativeAnswersEn": [
        "think",
        "build",
        "inspiration"
      ],
      "assessedAt": "2026-10-19T08:06:51.818921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "York",
      "w": "York",
      "p": [],
      "rarity": 226,
      "imagePath": "assets/word/York.png",
      "imageGitBlobSha": "3277b9e06b89421c83e461b17b12190997a89f52",
      "localImageExists": true,
      "sourceOrdinal": 18899,
      "reviewOrder": 165,
      "score": 62,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 17,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "城壁と大聖堂の町は見えるが、Yorkを他の歴史都市と区別しにくい。",
      "alternativeAnswersEn": [
        "city",
        "cathedral",
        "castle"
      ],
      "assessedAt": "2026-10-19T08:06:51.818921+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "working",
      "w": "working",
      "p": [],
      "rarity": 226,
      "imagePath": "assets/word/working.png",
      "imageGitBlobSha": "5e7806c3f1c428e2383f4f12e370faf42849f092",
      "localImageExists": true,
      "sourceOrdinal": 47599,
      "reviewOrder": 166,
      "score": 73,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "巣箱を作る作業は明瞭だが、workingとworkやbuildの語形は区別できない。",
      "alternativeAnswersEn": [
        "work",
        "build",
        "carpenter"
      ],
      "assessedAt": "2026-10-19T08:06:51.819924+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "related",
      "w": "related",
      "p": [],
      "rarity": 226,
      "imagePath": "assets/word/related.png",
      "imageGitBlobSha": "3ccd6eb86ddfab6370364166d93816f440fc28bf",
      "localImageExists": true,
      "sourceOrdinal": 48749,
      "reviewOrder": 167,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "パズル片の結び付きは見えるが、relatedよりjoinやconnectが直接的。",
      "alternativeAnswersEn": [
        "connect",
        "join",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T08:06:51.819924+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "free",
      "w": "free",
      "p": [
        "prī-"
      ],
      "rarity": 227,
      "imagePath": "assets/word/free.png",
      "imageGitBlobSha": "bf240602d9f51f908b2dbf8b60b1859acf655ca2",
      "localImageExists": true,
      "sourceOrdinal": 6416,
      "reviewOrder": 168,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた鳥かごから飛ぶ鳥が自由を示すが、freedomやescapeも候補。",
      "alternativeAnswersEn": [
        "freedom",
        "escape",
        "bird"
      ],
      "assessedAt": "2026-10-19T08:06:51.820922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "understand",
      "w": "understand",
      "p": [
        "n̥dher-",
        "stā-"
      ],
      "rarity": 227,
      "imagePath": "assets/word/understand.png",
      "imageGitBlobSha": "8245efa533405894b2ff358555d25380ea3539ca",
      "localImageExists": true,
      "sourceOrdinal": 16500,
      "reviewOrder": 169,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "型にはめる問題を解く姿は見えるが、understandという内面は断定しにくい。",
      "alternativeAnswersEn": [
        "solve",
        "fit",
        "puzzle"
      ],
      "assessedAt": "2026-10-19T08:06:51.820922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "white",
      "w": "white",
      "p": [
        "kweit-"
      ],
      "rarity": 227,
      "imagePath": "assets/word/white.png",
      "imageGitBlobSha": "455f50014e3441c63f6d88f12168699068492579",
      "localImageExists": true,
      "sourceOrdinal": 17214,
      "reviewOrder": 170,
      "score": 61,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "白い器は明瞭だが、色を問う指定なしではbowlが先に浮かぶ。",
      "alternativeAnswersEn": [
        "bowl",
        "empty",
        "cup"
      ],
      "assessedAt": "2026-10-19T08:06:51.821922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "arent",
      "w": "aren't",
      "p": [],
      "rarity": 227,
      "imagePath": "assets/word/arent.png",
      "imageGitBlobSha": "7fe566a6dea31363324869eac0c2053fe73d3e8a",
      "localImageExists": true,
      "sourceOrdinal": 25415,
      "reviewOrder": 171,
      "score": 42,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 10,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "果物の間の禁止印は否定を示すが、arentの複数形は特定できない。",
      "alternativeAnswersEn": [
        "not",
        "no",
        "different"
      ],
      "assessedAt": "2026-10-19T08:06:51.821922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "certain",
      "w": "certain",
      "p": [
        "krei-"
      ],
      "rarity": 228,
      "imagePath": "assets/word/certain.png",
      "imageGitBlobSha": "f9eaa4a67c68a2896ca3e0d87709031cc9df453f",
      "localImageExists": true,
      "sourceOrdinal": 2509,
      "reviewOrder": 172,
      "score": 35,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "袋から一個取る場面で、certainという確かさ・特定性は分からない。",
      "alternativeAnswersEn": [
        "take",
        "apple",
        "choose"
      ],
      "assessedAt": "2026-10-19T08:06:51.821922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "history",
      "w": "history",
      "p": [
        "weid-"
      ],
      "rarity": 228,
      "imagePath": "assets/word/history.png",
      "imageGitBlobSha": "90ea499b4e59483e96c600fc2625fe508ae41508",
      "localImageExists": true,
      "sourceOrdinal": 7439,
      "reviewOrder": 173,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 21,
        "answerSpecific": 10,
        "smallImageReadable": 9
      },
      "reasonJa": "古文書や遺物を調べる姿からhistoryを連想できるが、researchも強い。",
      "alternativeAnswersEn": [
        "research",
        "archaeology",
        "scholar"
      ],
      "assessedAt": "2026-10-19T08:06:51.822924+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "nature",
      "w": "nature",
      "p": [
        "genə-"
      ],
      "rarity": 228,
      "imagePath": "assets/word/nature.png",
      "imageGitBlobSha": "ddfcf6b09e3e9a336207d05265f1ef31ca08ffaa",
      "localImageExists": true,
      "sourceOrdinal": 10293,
      "reviewOrder": 174,
      "score": 92,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 20,
        "smallImageReadable": 10
      },
      "reasonJa": "木々・川・鳥の自然景観が明瞭でnatureを推測しやすい。",
      "alternativeAnswersEn": [
        "forest",
        "river",
        "landscape"
      ],
      "assessedAt": "2026-10-19T08:06:51.822924+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "specific",
      "w": "specific",
      "p": [
        "spek-",
        "dhē-"
      ],
      "rarity": 228,
      "imagePath": "assets/word/specific.png",
      "imageGitBlobSha": "fa792a392a340c9468edf5af108982c5a2b09e10",
      "localImageExists": true,
      "sourceOrdinal": 14862,
      "reviewOrder": 175,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "複数の鍵から合う一本を選ぶ場面だが、specificよりkeyやcorrectが強い。",
      "alternativeAnswersEn": [
        "key",
        "correct",
        "choose"
      ],
      "assessedAt": "2026-10-19T08:06:51.823923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "word",
      "w": "word",
      "p": [
        "werə-3",
        "dhē-"
      ],
      "rarity": 228,
      "imagePath": "assets/word/word.png",
      "imageGitBlobSha": "80cb7d77978bee68a60196d382215ff41675a313",
      "localImageExists": true,
      "sourceOrdinal": 17327,
      "reviewOrder": 176,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "単語の綴りをなぞる絵でwordを連想できるが、文字の読取りに依存する。",
      "alternativeAnswersEn": [
        "write",
        "tree",
        "letters"
      ],
      "assessedAt": "2026-10-19T08:06:51.823923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "result",
      "w": "result",
      "p": [
        "re-",
        "sel-4"
      ],
      "rarity": 229,
      "imagePath": "assets/word/result.png",
      "imageGitBlobSha": "3d70cd271722c9e4c8f81722b50c40b53395de46",
      "localImageExists": true,
      "sourceOrdinal": 13499,
      "reviewOrder": 177,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "焼き上がったパンは結果を示すが、resultよりbreadやbakeが自然。",
      "alternativeAnswersEn": [
        "bread",
        "bake",
        "finished"
      ],
      "assessedAt": "2026-10-19T08:06:51.824923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "child",
      "w": "child",
      "p": [],
      "rarity": 229,
      "imagePath": "assets/word/child.png",
      "imageGitBlobSha": "ae77959ef682ba9bdf0eb571c9a26698a9058cb0",
      "localImageExists": true,
      "sourceOrdinal": 18900,
      "reviewOrder": 178,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "子供が単独で明瞭に描かれるが、childとboyやkidが競合する。",
      "alternativeAnswersEn": [
        "boy",
        "kid"
      ],
      "assessedAt": "2026-10-19T08:06:51.824923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "local",
      "w": "local",
      "p": [],
      "rarity": 229,
      "imagePath": "assets/word/local.png",
      "imageGitBlobSha": "5ad7b0f45ae2fe71aab1bb5d486ced5f3515634d",
      "localImageExists": true,
      "sourceOrdinal": 18901,
      "reviewOrder": 179,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "近所の地図と家の印は見えるが、localという形容詞よりmapが直接的。",
      "alternativeAnswersEn": [
        "map",
        "neighborhood",
        "home"
      ],
      "assessedAt": "2026-10-19T08:06:51.825923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "States",
      "w": "States",
      "p": [],
      "rarity": 229,
      "imagePath": "assets/word/States.png",
      "imageGitBlobSha": "0d9d00d82a63bd5e81eb2a24cae395efddea3515",
      "localImageExists": true,
      "sourceOrdinal": 20866,
      "reviewOrder": 180,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "米国の州区分は見えるが、StatesよりUSAやmapも有力。",
      "alternativeAnswersEn": [
        "USA",
        "map",
        "America"
      ],
      "assessedAt": "2026-10-19T08:06:51.825923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "call",
      "w": "call",
      "p": [
        "gal-2"
      ],
      "rarity": 230,
      "imagePath": "assets/word/call.png",
      "imageGitBlobSha": "13bd69dbf17601e39746b17eeed7cdd5f733e993",
      "localImageExists": true,
      "sourceOrdinal": 2193,
      "reviewOrder": 181,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "電話で話す動作が明瞭でcallを推測しやすい。",
      "alternativeAnswersEn": [
        "phone",
        "talk"
      ],
      "assessedAt": "2026-10-19T08:06:51.826922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "front",
      "w": "front",
      "p": [
        "ser-4"
      ],
      "rarity": 230,
      "imagePath": "assets/word/front.png",
      "imageGitBlobSha": "bf913e19617ae568bcea03b585cd5fc9e8d49baa",
      "localImageExists": true,
      "sourceOrdinal": 6464,
      "reviewOrder": 182,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "家の正面に立つ配置は見えるが、frontよりhouseやdoorも強い。",
      "alternativeAnswersEn": [
        "house",
        "door",
        "entrance"
      ],
      "assessedAt": "2026-10-19T08:06:51.826922+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "matter",
      "w": "matter",
      "p": [
        "māter-"
      ],
      "rarity": 230,
      "imagePath": "assets/word/matter.png",
      "imageGitBlobSha": "7655b57445ac8b1209b96f0c6bf777ae8fff4e12",
      "localImageExists": true,
      "sourceOrdinal": 9535,
      "reviewOrder": 183,
      "score": 33,
      "components": {
        "meaningVisible": 16,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "配管の水漏れに困る姿で、matterという抽象語には絞れない。",
      "alternativeAnswersEn": [
        "leak",
        "problem",
        "repair"
      ],
      "assessedAt": "2026-10-19T08:06:51.827923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "problem",
      "w": "problem",
      "p": [
        "per1",
        "gʷelə-"
      ],
      "rarity": 230,
      "imagePath": "assets/word/problem.png",
      "imageGitBlobSha": "06217c24e2a18d05c73b39c982e49e19fde7bf56",
      "localImageExists": true,
      "sourceOrdinal": 12445,
      "reviewOrder": 184,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "自転車の故障に困る表情は問題を示すが、flat tireやrepairも強い。",
      "alternativeAnswersEn": [
        "flat tire",
        "repair",
        "trouble"
      ],
      "assessedAt": "2026-10-19T08:06:51.827923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "various",
      "w": "various",
      "p": [
        "wer-1"
      ],
      "rarity": 231,
      "imagePath": "assets/word/various.png",
      "imageGitBlobSha": "070d1927b9aad4d6bc9b4ad1b4aaa054a194c025",
      "localImageExists": true,
      "sourceOrdinal": 16718,
      "reviewOrder": 185,
      "score": 55,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "多種類の野菜は見えるが、variousよりvegetablesやbasketを答えやすい。",
      "alternativeAnswersEn": [
        "vegetables",
        "basket",
        "different"
      ],
      "assessedAt": "2026-10-19T08:06:51.828923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "close",
      "w": "close",
      "p": [
        "klāu-"
      ],
      "rarity": 232,
      "imagePath": "assets/word/close.png",
      "imageGitBlobSha": "718698775121493a0644b9517625bbc83b43ffd8",
      "localImageExists": true,
      "sourceOrdinal": 2852,
      "reviewOrder": 186,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "開いた窓を閉める動作は読めるが、一場面ではopenも候補。",
      "alternativeAnswersEn": [
        "shut",
        "window",
        "open"
      ],
      "assessedAt": "2026-10-19T08:06:51.828923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "effect",
      "w": "effect",
      "p": [
        "eghs",
        "dhē-"
      ],
      "rarity": 232,
      "imagePath": "assets/word/effect.png",
      "imageGitBlobSha": "0c8b02ddae9d2ef1aed5fc5fd80bfe7a347653d7",
      "localImageExists": true,
      "sourceOrdinal": 4969,
      "reviewOrder": 187,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "息で回る風車の因果は分かるが、effectよりblowやpinwheelが自然。",
      "alternativeAnswersEn": [
        "blow",
        "pinwheel",
        "wind"
      ],
      "assessedAt": "2026-10-19T08:06:51.829923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "toward",
      "w": "toward",
      "p": [
        "de-",
        "wer-3"
      ],
      "rarity": 232,
      "imagePath": "assets/word/toward.png",
      "imageGitBlobSha": "e88266efc9baaf582ce5188fff141be1fa5dd49d",
      "localImageExists": true,
      "sourceOrdinal": 16108,
      "reviewOrder": 188,
      "score": 70,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "球へ向かう犬の方向は読めるが、towardよりdogやchaseも強い。",
      "alternativeAnswersEn": [
        "dog",
        "chase",
        "ball"
      ],
      "assessedAt": "2026-10-19T08:06:51.829923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "true",
      "w": "true",
      "p": [
        "deru-"
      ],
      "rarity": 232,
      "imagePath": "assets/word/true.png",
      "imageGitBlobSha": "0050778f3de148bece20293c5498ab2fe307c819",
      "localImageExists": true,
      "sourceOrdinal": 16341,
      "reviewOrder": 189,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "カードと瓶の球が一致するが、trueよりsameやmatchも有力。",
      "alternativeAnswersEn": [
        "same",
        "match",
        "correct"
      ],
      "assessedAt": "2026-10-19T08:06:51.830923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "everything",
      "w": "everything",
      "p": [
        "aiw-",
        "līk-",
        "tenk-1"
      ],
      "rarity": 234,
      "imagePath": "assets/word/everything.png",
      "imageGitBlobSha": "d36adceb00bce2ec735f5502c2e4ad14ce054c40",
      "localImageExists": true,
      "sourceOrdinal": 5586,
      "reviewOrder": 190,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "持物を鞄へ入れる場面で、everythingとthingsやpackの区別がつかない。",
      "alternativeAnswersEn": [
        "pack",
        "bag",
        "things"
      ],
      "assessedAt": "2026-10-19T08:06:51.830923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "five",
      "w": "five",
      "p": [
        "penkʷe"
      ],
      "rarity": 234,
      "imagePath": "assets/word/five.png",
      "imageGitBlobSha": "e127845284116b7832839a936311aabd265bce1d",
      "localImageExists": true,
      "sourceOrdinal": 6113,
      "reviewOrder": 191,
      "score": 79,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 21,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "いちご五個の数は明瞭だが、fiveよりstrawberriesも自然。",
      "alternativeAnswersEn": [
        "strawberries",
        "fruit"
      ],
      "assessedAt": "2026-10-19T08:06:51.831923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "half",
      "w": "half",
      "p": [
        "(s)kel-1"
      ],
      "rarity": 234,
      "imagePath": "assets/word/half.png",
      "imageGitBlobSha": "88d3821f3ceefc583a37995807ba08174f1f497d",
      "localImageExists": true,
      "sourceOrdinal": 7130,
      "reviewOrder": 192,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "二分したリンゴを示しておりhalfを連想しやすい。",
      "alternativeAnswersEn": [
        "apple",
        "cut"
      ],
      "assessedAt": "2026-10-19T08:06:51.831923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "language",
      "w": "language",
      "p": [
        "dn̥ghū-"
      ],
      "rarity": 234,
      "imagePath": "assets/word/language.png",
      "imageGitBlobSha": "1046d4b9cfce8b321de082bd38d297e23019f488",
      "localImageExists": true,
      "sourceOrdinal": 8779,
      "reviewOrder": 193,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "対話の場面は見えるが、languageよりtalkやspeakが直接的。",
      "alternativeAnswersEn": [
        "talk",
        "speak",
        "conversation"
      ],
      "assessedAt": "2026-10-19T08:06:51.832923+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "air",
      "w": "air",
      "p": [
        "wer-2"
      ],
      "rarity": 235,
      "imagePath": "assets/word/air.png",
      "imageGitBlobSha": "c2a271f0f36014ea93432e48bb7d89f889636a16",
      "localImageExists": true,
      "sourceOrdinal": 420,
      "reviewOrder": 194,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "風船を膨らます動作から空気は連想できるが、airよりballoonやblowも強い。",
      "alternativeAnswersEn": [
        "balloon",
        "blow",
        "inflate"
      ],
      "assessedAt": "2026-10-19T08:06:51.833429+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "view",
      "w": "view",
      "p": [
        "weid-"
      ],
      "rarity": 235,
      "imagePath": "assets/word/view.png",
      "imageGitBlobSha": "3bbd42dec47b7623a572f0e18dc2d8d1f21219e3",
      "localImageExists": true,
      "sourceOrdinal": 16873,
      "reviewOrder": 195,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "湖と山を眺める構図でviewを連想できるが、sceneryやlandscapeも候補。",
      "alternativeAnswersEn": [
        "scenery",
        "landscape",
        "lake"
      ],
      "assessedAt": "2026-10-19T08:06:51.833429+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "individual",
      "w": "individual",
      "p": [
        "ne",
        "dwis-",
        "weidh-"
      ],
      "rarity": 236,
      "imagePath": "assets/word/individual.png",
      "imageGitBlobSha": "870bf7ef51d638cb2845931e4c1933761388b69f",
      "localImageExists": true,
      "sourceOrdinal": 8021,
      "reviewOrder": 196,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "各自の鉛筆入れを持つ子供たちだが、individualという抽象語は定まらない。",
      "alternativeAnswersEn": [
        "children",
        "pencils",
        "each"
      ],
      "assessedAt": "2026-10-19T08:06:51.834435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "particular",
      "w": "particular",
      "p": [
        "perə-2"
      ],
      "rarity": 236,
      "imagePath": "assets/word/particular.png",
      "imageGitBlobSha": "107220e29d8556714f67bdf7b9c53aa3df4dafd5",
      "localImageExists": true,
      "sourceOrdinal": 11316,
      "reviewOrder": 197,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "特定のケーキを指すが、particularよりchooseやcakeが自然。",
      "alternativeAnswersEn": [
        "choose",
        "cake",
        "this"
      ],
      "assessedAt": "2026-10-19T08:06:51.834435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "provide",
      "w": "provide",
      "p": [
        "per1",
        "weid-"
      ],
      "rarity": 236,
      "imagePath": "assets/word/provide.png",
      "imageGitBlobSha": "0b5906774481c71ab33dd0259b63f0ee6ac0f5f3",
      "localImageExists": true,
      "sourceOrdinal": 12640,
      "reviewOrder": 198,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "水を差し出す場面は供給を示すが、provideよりgiveやofferも強い。",
      "alternativeAnswersEn": [
        "give",
        "offer",
        "water"
      ],
      "assessedAt": "2026-10-19T08:06:51.835435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "especially",
      "w": "especially",
      "p": [
        "spek-"
      ],
      "rarity": 237,
      "imagePath": "assets/word/especially.png",
      "imageGitBlobSha": "968db5319c7cfb5c7f1a056390def1742c6fcc93",
      "localImageExists": true,
      "sourceOrdinal": 5480,
      "reviewOrder": 200,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "いちごを特に好む構図は見えるが、especiallyよりlikeやfavoriteが自然。",
      "alternativeAnswersEn": [
        "like",
        "favorite",
        "strawberry"
      ],
      "assessedAt": "2026-10-19T08:06:51.835435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "someone",
      "w": "someone",
      "p": [
        "sem-1",
        "oi-no-"
      ],
      "rarity": 237,
      "imagePath": "assets/word/someone.png",
      "imageGitBlobSha": "5447bd208c12a724f0a5a4083d7180055dc6d866",
      "localImageExists": true,
      "sourceOrdinal": 14760,
      "reviewOrder": 201,
      "score": 34,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "集団中の一人が手を挙げるが、someoneよりboyやvolunteerも自然。",
      "alternativeAnswersEn": [
        "boy",
        "volunteer",
        "group"
      ],
      "assessedAt": "2026-10-19T08:06:51.836435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "term",
      "w": "term",
      "p": [
        "ter-"
      ],
      "rarity": 237,
      "imagePath": "assets/word/term.png",
      "imageGitBlobSha": "9bc599ed6efa65916617a808196040fe4a3fcb33",
      "localImageExists": true,
      "sourceOrdinal": 15821,
      "reviewOrder": 202,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "契約書とカレンダーの期間は見えるが、termよりcontractやperiodも強い。",
      "alternativeAnswersEn": [
        "contract",
        "period",
        "calendar"
      ],
      "assessedAt": "2026-10-19T08:06:51.837437+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "themselves",
      "w": "themselves",
      "p": [
        "to-",
        "s(w)e-"
      ],
      "rarity": 237,
      "imagePath": "assets/word/themselves.png",
      "imageGitBlobSha": "c05500eb78821f1cf277c2165b92a1e16ca15538",
      "localImageExists": true,
      "sourceOrdinal": 15897,
      "reviewOrder": 203,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "二人が自分で上着を閉めるが、themselvesよりzipやdressが直接的。",
      "alternativeAnswersEn": [
        "zip",
        "dress",
        "children"
      ],
      "assessedAt": "2026-10-19T08:06:51.837437+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "itself",
      "w": "itself",
      "p": [
        "ko-",
        "s(w)e-"
      ],
      "rarity": 238,
      "imagePath": "assets/word/itself.png",
      "imageGitBlobSha": "241a2a4668a518d35e910d3a3a56ba77afa739c1",
      "localImageExists": true,
      "sourceOrdinal": 8473,
      "reviewOrder": 204,
      "score": 44,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "猫が自分の体をなめるが、itselfよりcatやgroomが自然。",
      "alternativeAnswersEn": [
        "cat",
        "groom",
        "lick"
      ],
      "assessedAt": "2026-10-19T08:06:51.838434+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "money",
      "w": "money",
      "p": [
        "mon-"
      ],
      "rarity": 238,
      "imagePath": "assets/word/money.png",
      "imageGitBlobSha": "1df07c76956e9a389c04df17331ea267f45e3e95",
      "localImageExists": true,
      "sourceOrdinal": 10000,
      "reviewOrder": 205,
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "紙幣と硬貨を入れた財布でmoneyを推測しやすい。",
      "alternativeAnswersEn": [
        "cash",
        "wallet"
      ],
      "assessedAt": "2026-10-19T08:06:51.838434+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "type",
      "w": "type",
      "p": [
        "(s)teu-1"
      ],
      "rarity": 238,
      "imagePath": "assets/word/type.png",
      "imageGitBlobSha": "7a955a6bd908676f0d00fa8efc0212b5e4283a2b",
      "localImageExists": true,
      "sourceOrdinal": 16425,
      "reviewOrder": 206,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "鍵を種類で分けているが、typeよりsortやkeysも強い。",
      "alternativeAnswersEn": [
        "sort",
        "keys",
        "kind"
      ],
      "assessedAt": "2026-10-19T08:06:51.839436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "higher",
      "w": "higher",
      "p": [],
      "rarity": 238,
      "imagePath": "assets/word/higher.png",
      "imageGitBlobSha": "77aeb8a4c8c5e8675c8c6b23a5582ab7ae5aa819",
      "localImageExists": true,
      "sourceOrdinal": 20891,
      "reviewOrder": 207,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "高さの違う風船で比較は読めるが、higherとhighやupが競合する。",
      "alternativeAnswersEn": [
        "high",
        "up",
        "balloon"
      ],
      "assessedAt": "2026-10-19T08:06:51.839436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "clear",
      "w": "clear",
      "p": [
        "kelə-2"
      ],
      "rarity": 240,
      "imagePath": "assets/word/clear.png",
      "imageGitBlobSha": "8e7f20ebbc98417e3f8275b486dfbff557a653ee",
      "localImageExists": true,
      "sourceOrdinal": 2809,
      "reviewOrder": 208,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "水越しの石が見えるため透明さは伝わるが、clearよりwaterも候補。",
      "alternativeAnswersEn": [
        "water",
        "transparent",
        "bowl"
      ],
      "assessedAt": "2026-10-19T08:06:51.840435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "period",
      "w": "period",
      "p": [
        "per1",
        "sed-2"
      ],
      "rarity": 240,
      "imagePath": "assets/word/period.png",
      "imageGitBlobSha": "f20c0c73f772607e13cf36de1cf13391f4bd49fe",
      "localImageExists": true,
      "sourceOrdinal": 11571,
      "reviewOrder": 209,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "カレンダーの連続日が区切られ期間は読めるが、periodとweekも競合する。",
      "alternativeAnswersEn": [
        "week",
        "calendar",
        "time"
      ],
      "assessedAt": "2026-10-19T08:06:51.840435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "action",
      "w": "action",
      "p": [
        "ag-"
      ],
      "rarity": 240,
      "imagePath": "assets/word/action.png",
      "imageGitBlobSha": "d6cec26167e8919296ae39f164eb50446525ce01",
      "localImageExists": true,
      "sourceOrdinal": 17553,
      "reviewOrder": 210,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "水漏れへ対処する動作は見えるが、actionよりhelpやleakが直接的。",
      "alternativeAnswersEn": [
        "leak",
        "help",
        "move"
      ],
      "assessedAt": "2026-10-19T08:06:51.841436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "believe",
      "w": "believe",
      "p": [
        "ambhi",
        "leubh-"
      ],
      "rarity": 241,
      "imagePath": "assets/word/believe.png",
      "imageGitBlobSha": "ca4eb5a6d700bfbd3d430b3da314e41e2b60a223",
      "localImageExists": true,
      "sourceOrdinal": 1601,
      "reviewOrder": 211,
      "score": 41,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "平均台の子を支える構図だが、believeという内面は特定しにくい。",
      "alternativeAnswersEn": [
        "trust",
        "help",
        "balance"
      ],
      "assessedAt": "2026-10-19T08:06:51.841436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "reason",
      "w": "reason",
      "p": [
        "rē(i)-"
      ],
      "rarity": 241,
      "imagePath": "assets/word/reason.png",
      "imageGitBlobSha": "0062ccf09ecf9e82ac4041155ffcf6b830ea259d",
      "localImageExists": true,
      "sourceOrdinal": 13070,
      "reviewOrder": 212,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "外れたチェーンを調べる場面で、reasonよりrepairやproblemも自然。",
      "alternativeAnswersEn": [
        "repair",
        "problem",
        "chain"
      ],
      "assessedAt": "2026-10-19T08:06:51.842436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "taking",
      "w": "taking",
      "p": [],
      "rarity": 241,
      "imagePath": "assets/word/taking.png",
      "imageGitBlobSha": "d7d95198e006be25c51555acdb1dbdb918cbb378",
      "localImageExists": true,
      "sourceOrdinal": 47746,
      "reviewOrder": 213,
      "score": 71,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "果物を取る動作は明瞭だが、takingとtakeの形は区別できない。",
      "alternativeAnswersEn": [
        "take",
        "apple",
        "pick"
      ],
      "assessedAt": "2026-10-19T08:06:51.842436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "age",
      "w": "age",
      "p": [
        "aiw-"
      ],
      "rarity": 242,
      "imagePath": "assets/word/age.png",
      "imageGitBlobSha": "352c25171fac9f6b759a7f79cae46bb0808c13c0",
      "localImageExists": true,
      "sourceOrdinal": 361,
      "reviewOrder": 214,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "ろうそくと指で年齢を示すが、ageよりbirthdayやsixも候補。",
      "alternativeAnswersEn": [
        "birthday",
        "six",
        "cake"
      ],
      "assessedAt": "2026-10-19T08:06:51.843436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "blood",
      "w": "blood",
      "p": [
        "bhel-3"
      ],
      "rarity": 242,
      "imagePath": "assets/word/blood.png",
      "imageGitBlobSha": "58dd7b3b81d4d86132b331c516d760d4067c9ac9",
      "localImageExists": true,
      "sourceOrdinal": 1822,
      "reviewOrder": 215,
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "指先の赤い血と押さえる動作でbloodを連想しやすい。",
      "alternativeAnswersEn": [
        "cut",
        "hurt",
        "bleed"
      ],
      "assessedAt": "2026-10-19T08:06:51.843436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "education",
      "w": "education",
      "p": [
        "deuk-"
      ],
      "rarity": 242,
      "imagePath": "assets/word/education.png",
      "imageGitBlobSha": "9bbb07fa1978ed7609305c60fd8e94b5dbdd9432",
      "localImageExists": true,
      "sourceOrdinal": 4961,
      "reviewOrder": 216,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "大人が子供に教える場面でeducationは読めるが、teachやlearnも強い。",
      "alternativeAnswersEn": [
        "teach",
        "learn",
        "blocks"
      ],
      "assessedAt": "2026-10-19T08:06:51.844436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "per",
      "w": "per",
      "p": [
        "per1"
      ],
      "rarity": 242,
      "imagePath": "assets/word/per.png",
      "imageGitBlobSha": "0c962293979641d39d90f40a7cb9bbc04c582a11",
      "localImageExists": true,
      "sourceOrdinal": 11520,
      "reviewOrder": 217,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "袋に果物を配分するが、perという単位当たりの関係は定まりにくい。",
      "alternativeAnswersEn": [
        "pack",
        "apples",
        "each"
      ],
      "assessedAt": "2026-10-19T08:06:51.845435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "short",
      "w": "short",
      "p": [
        "(s)ker-1"
      ],
      "rarity": 242,
      "imagePath": "assets/word/short.png",
      "imageGitBlobSha": "fff1420e08f8d22216d6d6302deeb26b806e5d60",
      "localImageExists": true,
      "sourceOrdinal": 14448,
      "reviewOrder": 218,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "短くなった鉛筆を強調しているが、shortよりpencilも有力。",
      "alternativeAnswersEn": [
        "pencil",
        "small"
      ],
      "assessedAt": "2026-10-19T08:06:51.845435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "single",
      "w": "single",
      "p": [
        "sem-1"
      ],
      "rarity": 242,
      "imagePath": "assets/word/single.png",
      "imageGitBlobSha": "5942b01b93d9784b97e54997c242f4cc1de59f66",
      "localImageExists": true,
      "sourceOrdinal": 14540,
      "reviewOrder": 219,
      "score": 67,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "かごに一個だけのいちごで単独性は読めるが、singleとoneが競合する。",
      "alternativeAnswersEn": [
        "one",
        "strawberry",
        "alone"
      ],
      "assessedAt": "2026-10-19T08:06:51.846436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "turn",
      "w": "turn",
      "p": [
        "terə-1"
      ],
      "rarity": 242,
      "imagePath": "assets/word/turn.png",
      "imageGitBlobSha": "697daeeefb0dd73c412a95776fd0ad8fc78ad9f6",
      "localImageExists": true,
      "sourceOrdinal": 16388,
      "reviewOrder": 220,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "回転する遊具の動きは明瞭だが、turnよりspinやroundaboutも強い。",
      "alternativeAnswersEn": [
        "spin",
        "roundabout",
        "rotate"
      ],
      "assessedAt": "2026-10-19T08:06:51.846436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "city",
      "w": "city",
      "p": [
        "kei-1"
      ],
      "rarity": 243,
      "imagePath": "assets/word/city.png",
      "imageGitBlobSha": "d571acd3e0b8ee28ee5b3418ad8e89f0fc2b1b86",
      "localImageExists": true,
      "sourceOrdinal": 2754,
      "reviewOrder": 221,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "ビル・道路・交通の街並みが明瞭でcityを推測しやすい。",
      "alternativeAnswersEn": [
        "town",
        "street"
      ],
      "assessedAt": "2026-10-19T08:06:51.847436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "community",
      "w": "community",
      "p": [
        "kom",
        "mei-1"
      ],
      "rarity": 243,
      "imagePath": "assets/word/community.png",
      "imageGitBlobSha": "2334f2abbd318ccb906cdc9e8d59c1040c7a4756",
      "localImageExists": true,
      "sourceOrdinal": 3029,
      "reviewOrder": 222,
      "score": 68,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 9
      },
      "reasonJa": "多世代で共同菜園を営む構図でcommunityは読めるが、gardenやtogetherも強い。",
      "alternativeAnswersEn": [
        "garden",
        "together",
        "cooperate"
      ],
      "assessedAt": "2026-10-19T08:06:51.847436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "economic",
      "w": "economic",
      "p": [
        "weik-1",
        "nem-"
      ],
      "rarity": 243,
      "imagePath": "assets/word/economic.png",
      "imageGitBlobSha": "e4c88504f4da959681284085e768d0a7474c9464",
      "localImageExists": true,
      "sourceOrdinal": 4927,
      "reviewOrder": 223,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "野菜の売買は見えるが、economicという形容詞には絞れない。",
      "alternativeAnswersEn": [
        "market",
        "buy",
        "vegetables"
      ],
      "assessedAt": "2026-10-19T08:06:51.848436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "company",
      "w": "company",
      "p": [
        "kom",
        "pā-"
      ],
      "rarity": 244,
      "imagePath": "assets/word/company.png",
      "imageGitBlobSha": "4486262e283f0c53ac35bb08c3300a10b97c2dee",
      "localImageExists": true,
      "sourceOrdinal": 3035,
      "reviewOrder": 224,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "家具を作り梱包する人々は会社を連想させるが、workやfactoryも候補。",
      "alternativeAnswersEn": [
        "factory",
        "work",
        "furniture"
      ],
      "assessedAt": "2026-10-19T08:06:51.848436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "position",
      "w": "position",
      "p": [
        "apo-"
      ],
      "rarity": 244,
      "imagePath": "assets/word/position.png",
      "imageGitBlobSha": "29cbe9d1d465d8b7502884c756eb24aef37d7706",
      "localImageExists": true,
      "sourceOrdinal": 12176,
      "reviewOrder": 225,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "盤上の駒を指すが、positionよりchessやmoveが直接的。",
      "alternativeAnswersEn": [
        "chess",
        "move",
        "piece"
      ],
      "assessedAt": "2026-10-19T08:06:51.849435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "London",
      "w": "London",
      "p": [],
      "rarity": 244,
      "imagePath": "assets/word/London.png",
      "imageGitBlobSha": "fe980c79c399aee733993523a6df0c0ab7d2af97",
      "localImageExists": true,
      "sourceOrdinal": 18903,
      "reviewOrder": 226,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "ビッグベンとタワーブリッジでLondonを推測しやすい。",
      "alternativeAnswersEn": [
        "England",
        "Big Ben"
      ],
      "assessedAt": "2026-10-19T08:06:51.849435+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "land",
      "w": "land",
      "p": [
        "lendh-2"
      ],
      "rarity": 245,
      "imagePath": "assets/word/land.png",
      "imageGitBlobSha": "1f6deda2af3b51ba00a1e2b37d10114b78327e34",
      "localImageExists": true,
      "sourceOrdinal": 8768,
      "reviewOrder": 227,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "海に囲まれた陸地は明瞭だが、landよりislandも強い。",
      "alternativeAnswersEn": [
        "island",
        "ground",
        "sea"
      ],
      "assessedAt": "2026-10-19T08:06:51.850436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "needs",
      "w": "needs",
      "p": [],
      "rarity": 245,
      "imagePath": "assets/word/needs.png",
      "imageGitBlobSha": "bb471621e58ba2ed62e71ee77c105a2612b4366b",
      "localImageExists": true,
      "sourceOrdinal": 47884,
      "reviewOrder": 228,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "水へ必死に手を伸ばす姿だが、needsよりthirstyやwaterが自然。",
      "alternativeAnswersEn": [
        "thirsty",
        "water",
        "need"
      ],
      "assessedAt": "2026-10-19T08:06:51.850436+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "inside",
      "w": "inside",
      "p": [
        "en",
        "sē-2"
      ],
      "rarity": 246,
      "imagePath": "assets/word/inside.png",
      "imageGitBlobSha": "15ea2f40722a2d147f0d5b67dec60c8bec31c438",
      "localImageExists": true,
      "sourceOrdinal": 8194,
      "reviewOrder": 229,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "箱の内部に座る猫でinsideの配置を読み取りやすい。",
      "alternativeAnswersEn": [
        "in",
        "cat",
        "box"
      ],
      "assessedAt": "2026-10-19T08:06:51.851440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "interest",
      "w": "interest",
      "p": [
        "en",
        "es-"
      ],
      "rarity": 246,
      "imagePath": "assets/word/interest.png",
      "imageGitBlobSha": "9c0f4be824efb1b8193091f90d101f7af08cadd2",
      "localImageExists": true,
      "sourceOrdinal": 8286,
      "reviewOrder": 230,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "虫を熱心に観察する姿は関心を示すが、interestよりlookやinsectも強い。",
      "alternativeAnswersEn": [
        "insect",
        "observe",
        "curious"
      ],
      "assessedAt": "2026-10-19T08:06:51.851440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "rate",
      "w": "rate",
      "p": [
        "rē(i)-"
      ],
      "rarity": 247,
      "imagePath": "assets/word/rate.png",
      "imageGitBlobSha": "0dbf6749cd3dcb26b688d55a7e00ee8a8334110f",
      "localImageExists": true,
      "sourceOrdinal": 13013,
      "reviewOrder": 231,
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "数珠状の珠を持つ人物で、rateという比率・速度は読み取れない。",
      "alternativeAnswersEn": [
        "beads",
        "bracelet",
        "count"
      ],
      "assessedAt": "2026-10-19T08:06:51.852439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "story",
      "w": "story",
      "p": [
        "weid-"
      ],
      "rarity": 247,
      "imagePath": "assets/word/story.png",
      "imageGitBlobSha": "95c4533111b7945717edfed8f1ef2e907beb3a8a",
      "localImageExists": true,
      "sourceOrdinal": 15187,
      "reviewOrder": 232,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "本から物語の城とドラゴンが広がりstoryを連想しやすい。",
      "alternativeAnswersEn": [
        "fairy tale",
        "book",
        "fantasy"
      ],
      "assessedAt": "2026-10-19T08:06:51.852439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "field",
      "w": "field",
      "p": [
        "pelə-2"
      ],
      "rarity": 248,
      "imagePath": "assets/word/field.png",
      "imageGitBlobSha": "be0e7420bdd98a866b156c92c048a2cdb921a6b4",
      "localImageExists": true,
      "sourceOrdinal": 6042,
      "reviewOrder": 233,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "草地と花の広がりでfieldは読めるが、meadowやpathも候補。",
      "alternativeAnswersEn": [
        "meadow",
        "path",
        "grass"
      ],
      "assessedAt": "2026-10-19T08:06:51.853440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "management",
      "w": "management",
      "p": [
        "man-2"
      ],
      "rarity": 248,
      "imagePath": "assets/word/management.png",
      "imageGitBlobSha": "faa0d9f0d319ee94be687143392409e47ede3730",
      "localImageExists": true,
      "sourceOrdinal": 9375,
      "reviewOrder": 234,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "パン屋で指示する人物は管理を示すが、managementよりmanagerやbakeryも強い。",
      "alternativeAnswersEn": [
        "manager",
        "bakery",
        "order"
      ],
      "assessedAt": "2026-10-19T08:06:51.853440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "treatment",
      "w": "treatment",
      "p": [
        "tragh-"
      ],
      "rarity": 248,
      "imagePath": "assets/word/treatment.png",
      "imageGitBlobSha": "aaf1a1c77cab1f2bf8ef706da770e3d38b1a3d9b",
      "localImageExists": true,
      "sourceOrdinal": 16221,
      "reviewOrder": 235,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "係員が荷物を扱う接客は見えるが、treatmentよりserviceやporterが自然。",
      "alternativeAnswersEn": [
        "service",
        "porter",
        "luggage"
      ],
      "assessedAt": "2026-10-19T08:06:51.854440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ways@wegh",
      "w": "ways",
      "p": [
        "wegh-"
      ],
      "rarity": 248,
      "imagePath": "assets/word/ways@wegh.png",
      "imageGitBlobSha": "91d999f31f764a2460b32816f97e2d75b6a82bbc",
      "localImageExists": true,
      "sourceOrdinal": 49162,
      "reviewOrder": 236,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "分かれ道は見えるが、waysの複数形よりpathsやdirectionsも有力。",
      "alternativeAnswersEn": [
        "paths",
        "directions",
        "choice"
      ],
      "assessedAt": "2026-10-19T08:06:51.854440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "mean@meino",
      "w": "mean",
      "p": [
        "mei-no-"
      ],
      "rarity": 249,
      "imagePath": "assets/word/mean@meino.png",
      "imageGitBlobSha": "3c22bb2f3ddadc93b50b36bab4825bcb158f4e90",
      "localImageExists": true,
      "sourceOrdinal": 9570,
      "reviewOrder": 237,
      "score": 24,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "赤信号で止まる車で、meanという語義は画像から特定できない。",
      "alternativeAnswersEn": [
        "stop",
        "traffic light",
        "car"
      ],
      "assessedAt": "2026-10-19T08:06:51.855439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "read",
      "w": "read",
      "p": [
        "rē(i)-"
      ],
      "rarity": 249,
      "imagePath": "assets/word/read.png",
      "imageGitBlobSha": "af757076543bb581c0fb61e85e27bd5e5520435e",
      "localImageExists": true,
      "sourceOrdinal": 13048,
      "reviewOrder": 238,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "椅子で本を読む姿が明瞭でreadを推測しやすい。",
      "alternativeAnswersEn": [
        "book",
        "reading"
      ],
      "assessedAt": "2026-10-19T08:06:51.855439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "evidence",
      "w": "evidence",
      "p": [
        "eghs",
        "weid-"
      ],
      "rarity": 250,
      "imagePath": "assets/word/evidence.png",
      "imageGitBlobSha": "8c890455424a624f005116418fdbebdb1a338235",
      "localImageExists": true,
      "sourceOrdinal": 5588,
      "reviewOrder": 239,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "探偵と足跡は証拠を連想させるが、evidenceよりclueやdetectiveも有力。",
      "alternativeAnswersEn": [
        "clue",
        "detective",
        "footprint"
      ],
      "assessedAt": "2026-10-19T08:06:51.856439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "relationship",
      "w": "relationship",
      "p": [
        "re-",
        "telə-",
        "(s)kep-"
      ],
      "rarity": 250,
      "imagePath": "assets/word/relationship.png",
      "imageGitBlobSha": "8a888f7d216dad21d4b9a6de3ffa2e582cdffc9c",
      "localImageExists": true,
      "sourceOrdinal": 13278,
      "reviewOrder": 240,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "祖父と子の写真は関係を示すが、relationshipよりfamilyやgrandfatherも強い。",
      "alternativeAnswersEn": [
        "family",
        "grandfather",
        "photo"
      ],
      "assessedAt": "2026-10-19T08:06:51.856439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ways@x",
      "w": "ways",
      "p": [],
      "rarity": 250,
      "imagePath": "assets/word/ways@x.png",
      "imageGitBlobSha": "48e6c231f03eee7a4854450ee2065984ac6a1ab7",
      "localImageExists": true,
      "sourceOrdinal": 47954,
      "reviewOrder": 241,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "池の周りに複数の道はあるが、waysよりparkやpathsが自然。",
      "alternativeAnswersEn": [
        "park",
        "paths",
        "pond"
      ],
      "assessedAt": "2026-10-19T08:06:51.856439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "class",
      "w": "class",
      "p": [
        "kelə-2"
      ],
      "rarity": 251,
      "imagePath": "assets/word/class.png",
      "imageGitBlobSha": "9ee231da1aaad037a2db3ec5f1e91f92a1944027",
      "localImageExists": true,
      "sourceOrdinal": 2783,
      "reviewOrder": 242,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "形で分類する姿からclassは連想できるが、sortやshapeも有力。",
      "alternativeAnswersEn": [
        "sort",
        "shape",
        "category"
      ],
      "assessedAt": "2026-10-19T08:06:51.857439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "else",
      "w": "else",
      "p": [
        "al-1"
      ],
      "rarity": 251,
      "imagePath": "assets/word/else.png",
      "imageGitBlobSha": "ad1563557ebe987d489b23ed341385bc5a13bbc4",
      "localImageExists": true,
      "sourceOrdinal": 5083,
      "reviewOrder": 243,
      "score": 40,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "リンゴを持つ客と梨を示す店員で、elseよりfruitやchooseが直接的。",
      "alternativeAnswersEn": [
        "fruit",
        "choose",
        "other"
      ],
      "assessedAt": "2026-10-19T08:06:51.857439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "include",
      "w": "include",
      "p": [
        "en",
        "klāu-"
      ],
      "rarity": 251,
      "imagePath": "assets/word/include.png",
      "imageGitBlobSha": "045013425dff67ce62ea0d6c71ce1ea6260d057e",
      "localImageExists": true,
      "sourceOrdinal": 7936,
      "reviewOrder": 244,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "かごの中身を示すが、includeよりbasketやfoodも強い。",
      "alternativeAnswersEn": [
        "basket",
        "food",
        "contain"
      ],
      "assessedAt": "2026-10-19T08:06:51.858439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "production",
      "w": "production",
      "p": [
        "per1",
        "deuk-"
      ],
      "rarity": 251,
      "imagePath": "assets/word/production.png",
      "imageGitBlobSha": "7ea74e4e7c7ee56f714ab7545a55a09f99cda057",
      "localImageExists": true,
      "sourceOrdinal": 12475,
      "reviewOrder": 245,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "粘土から器を作り並べる姿でproductionは読めるが、potteryやmakeも強い。",
      "alternativeAnswersEn": [
        "pottery",
        "make",
        "clay"
      ],
      "assessedAt": "2026-10-19T08:06:51.858439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "thus",
      "w": "thus",
      "p": [
        "to-"
      ],
      "rarity": 251,
      "imagePath": "assets/word/thus.png",
      "imageGitBlobSha": "4d05f8bd65453d3c07f0e2e3bd576462b96e1248",
      "localImageExists": true,
      "sourceOrdinal": 15984,
      "reviewOrder": 246,
      "score": 23,
      "components": {
        "meaningVisible": 10,
        "conceptDistinct": 4,
        "answerSpecific": 0,
        "smallImageReadable": 9
      },
      "reasonJa": "パン生地の編み方を教える場面で、thusという論理関係は特定できない。",
      "alternativeAnswersEn": [
        "braid",
        "bread",
        "teach"
      ],
      "assessedAt": "2026-10-19T08:06:51.859439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "trying",
      "w": "trying",
      "p": [],
      "rarity": 251,
      "imagePath": "assets/word/trying.png",
      "imageGitBlobSha": "e08960025fda5221d331c99b2dc7a574f9cba97f",
      "localImageExists": true,
      "sourceOrdinal": 48998,
      "reviewOrder": 247,
      "score": 68,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "重い箱を押そうと努力する姿だが、tryingよりpushやtryも強い。",
      "alternativeAnswersEn": [
        "push",
        "try",
        "effort"
      ],
      "assessedAt": "2026-10-19T08:06:51.859439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "myself",
      "w": "myself",
      "p": [
        "me-1",
        "s(w)e-"
      ],
      "rarity": 252,
      "imagePath": "assets/word/myself.png",
      "imageGitBlobSha": "c7fd2b57352e2fc02804fadc6994b97bd672e20e",
      "localImageExists": true,
      "sourceOrdinal": 10234,
      "reviewOrder": 248,
      "score": 37,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "自分を指す塗装中の人物だが、myselfよりIやpaintも自然。",
      "alternativeAnswersEn": [
        "I",
        "paint",
        "painter"
      ],
      "assessedAt": "2026-10-19T08:06:51.860439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "outside",
      "w": "outside",
      "p": [
        "ud-",
        "sē-2"
      ],
      "rarity": 252,
      "imagePath": "assets/word/outside.png",
      "imageGitBlobSha": "752bb8280f77222e9a66ff492ccffbd6a8828745",
      "localImageExists": true,
      "sourceOrdinal": 11051,
      "reviewOrder": 249,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "犬小屋の外にいる犬でoutsideを読み取りやすい。",
      "alternativeAnswersEn": [
        "dog",
        "kennel",
        "out"
      ],
      "assessedAt": "2026-10-19T08:06:51.860439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "towards",
      "w": "towards",
      "p": [],
      "rarity": 252,
      "imagePath": "assets/word/towards.png",
      "imageGitBlobSha": "3b3bc8b5e62efc10453d1264b4dc7bb376b4c7d7",
      "localImageExists": true,
      "sourceOrdinal": 47079,
      "reviewOrder": 250,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "家へ向かう人物は方向を示すが、towardsとtowardは区別できない。",
      "alternativeAnswersEn": [
        "toward",
        "go",
        "house"
      ],
      "assessedAt": "2026-10-19T08:06:51.860439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "available",
      "w": "available",
      "p": [
        "ad-",
        "wal-"
      ],
      "rarity": 253,
      "imagePath": "assets/word/available.png",
      "imageGitBlobSha": "1dc273338ba0fa0699b2a332df0630e1a9a280c9",
      "localImageExists": true,
      "sourceOrdinal": 1334,
      "reviewOrder": 251,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "空いた椅子を勧める姿で利用可能とは読めるが、availableよりseatやsitも強い。",
      "alternativeAnswersEn": [
        "seat",
        "sit",
        "empty"
      ],
      "assessedAt": "2026-10-19T08:06:51.861440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "similar",
      "w": "similar",
      "p": [
        "sem-1"
      ],
      "rarity": 253,
      "imagePath": "assets/word/similar.png",
      "imageGitBlobSha": "331695fdc56efa8cf8f3326cc5e2ec45d1d2cb35",
      "localImageExists": true,
      "sourceOrdinal": 14513,
      "reviewOrder": 252,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "似た模様の急須二つでsimilarを連想しやすいが、sameも候補。",
      "alternativeAnswersEn": [
        "same",
        "teapot",
        "alike"
      ],
      "assessedAt": "2026-10-19T08:06:51.861440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "quite",
      "w": "quite",
      "p": [
        "kʷeiə-"
      ],
      "rarity": 254,
      "imagePath": "assets/word/quite.png",
      "imageGitBlobSha": "5cfb8cf52099b6cd9108bef785099f38b82298a6",
      "localImageExists": true,
      "sourceOrdinal": 12908,
      "reviewOrder": 253,
      "score": 36,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "いっぱいのクッキー瓶は見えるが、quiteという程度副詞は特定できない。",
      "alternativeAnswersEn": [
        "full",
        "cookies",
        "many"
      ],
      "assessedAt": "2026-10-19T08:06:51.862439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "soon",
      "w": "soon",
      "p": [],
      "rarity": 254,
      "imagePath": "assets/word/soon.png",
      "imageGitBlobSha": "346029317c9c8c38facf5a8abb861d54fe8cf670",
      "localImageExists": true,
      "sourceOrdinal": 18906,
      "reviewOrder": 254,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "ホームに来る電車から間近は連想できるが、soonよりarriveが直接的。",
      "alternativeAnswersEn": [
        "arrive",
        "train",
        "wait"
      ],
      "assessedAt": "2026-10-19T08:06:51.862439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "leave@leip",
      "w": "leave",
      "p": [
        "leip-"
      ],
      "rarity": 255,
      "imagePath": "assets/word/leave@leip.png",
      "imageGitBlobSha": "334a3e4e9858ce9cef08151e30db43cc01330d63",
      "localImageExists": true,
      "sourceOrdinal": 8865,
      "reviewOrder": 255,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "荷物を持って家を出る動作が明瞭でleaveを推測しやすい。",
      "alternativeAnswersEn": [
        "depart",
        "travel",
        "goodbye"
      ],
      "assessedAt": "2026-10-19T08:06:51.863439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "main",
      "w": "main",
      "p": [
        "magh-"
      ],
      "rarity": 255,
      "imagePath": "assets/word/main.png",
      "imageGitBlobSha": "fb04598a892f216c3ad9aba6c1d535e81e8ea61c",
      "localImageExists": true,
      "sourceOrdinal": 9315,
      "reviewOrder": 256,
      "score": 40,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "人が入る建物の正面で、mainという主要性を示す比較がない。",
      "alternativeAnswersEn": [
        "building",
        "entrance",
        "school"
      ],
      "assessedAt": "2026-10-19T08:06:51.863439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "rights",
      "w": "rights",
      "p": [
        "reg-"
      ],
      "rarity": 255,
      "imagePath": "assets/word/rights.png",
      "imageGitBlobSha": "18d6e621e61881d9c7debc7e5ade12e3c762287c",
      "localImageExists": true,
      "sourceOrdinal": 13634,
      "reviewOrder": 257,
      "score": 62,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "天秤と人々から権利や平等は連想できるが、rightsよりequalityも自然。",
      "alternativeAnswersEn": [
        "equality",
        "justice",
        "balance"
      ],
      "assessedAt": "2026-10-19T08:06:51.864440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ground",
      "w": "ground",
      "p": [
        "ghrendh-"
      ],
      "rarity": 256,
      "imagePath": "assets/word/ground.png",
      "imageGitBlobSha": "71771409b06aeeceb6a94c4b6ed97b4c0fc41a9b",
      "localImageExists": true,
      "sourceOrdinal": 7026,
      "reviewOrder": 258,
      "score": 79,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "コーヒー豆と挽いた粉でgroundは読めるが、coffeeやgrindも強い。",
      "alternativeAnswersEn": [
        "coffee",
        "grind",
        "powder"
      ],
      "assessedAt": "2026-10-19T08:06:51.864440+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "live",
      "w": "live",
      "p": [
        "leip-"
      ],
      "rarity": 256,
      "imagePath": "assets/word/live.png",
      "imageGitBlobSha": "027c1f94e66db45f86533d4716ebb5bd774433d6",
      "localImageExists": true,
      "sourceOrdinal": 9089,
      "reviewOrder": 259,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "日光の下の人と苗は生命を連想させるが、liveよりsunやgrowも自然。",
      "alternativeAnswersEn": [
        "life",
        "grow",
        "sun"
      ],
      "assessedAt": "2026-10-19T08:06:51.865439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "required",
      "w": "required",
      "p": [],
      "rarity": 256,
      "imagePath": "assets/word/required.png",
      "imageGitBlobSha": "38d39bb3211d9ae22d6426cc0510094f5d7f9bc6",
      "localImageExists": true,
      "sourceOrdinal": 48471,
      "reviewOrder": 260,
      "score": 36,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "勉強する姿のみでrequiredという必要・要求は示されない。",
      "alternativeAnswersEn": [
        "study",
        "homework",
        "write"
      ],
      "assessedAt": "2026-10-19T08:06:51.865439+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "deep",
      "w": "deep",
      "p": [
        "dheub-"
      ],
      "rarity": 257,
      "imagePath": "assets/word/deep.png",
      "imageGitBlobSha": "1bc7f1aabc59f4f050301db793aad1c27f6d1c89",
      "localImageExists": true,
      "sourceOrdinal": 3970,
      "reviewOrder": 261,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "深い井戸の内壁と底が見えdeepを連想できるが、wellも強い。",
      "alternativeAnswersEn": [
        "well",
        "hole",
        "depth"
      ],
      "assessedAt": "2026-10-19T08:06:51.866448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "performance",
      "w": "performance",
      "p": [
        "per1"
      ],
      "rarity": 257,
      "imagePath": "assets/word/performance.png",
      "imageGitBlobSha": "80bf6bb4e10eef9d304edfcc03e9e30fca3387c3",
      "localImageExists": true,
      "sourceOrdinal": 11553,
      "reviewOrder": 262,
      "score": 42,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "照明を修理する動作でperformanceという実行・性能は特定しにくい。",
      "alternativeAnswersEn": [
        "repair",
        "lamp",
        "fix"
      ],
      "assessedAt": "2026-10-19T08:06:51.866448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "service",
      "w": "service",
      "p": [
        "servus"
      ],
      "rarity": 257,
      "imagePath": "assets/word/service.png",
      "imageGitBlobSha": "546cd6ccd796e4d3b0de259c5eb3473da2de13ee",
      "localImageExists": true,
      "sourceOrdinal": 14340,
      "reviewOrder": 263,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "自転車の整備はserviceを示すが、repairやmechanicも有力。",
      "alternativeAnswersEn": [
        "repair",
        "maintenance",
        "mechanic"
      ],
      "assessedAt": "2026-10-19T08:06:51.866448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "English",
      "w": "English",
      "p": [
        "ank-"
      ],
      "rarity": 258,
      "imagePath": "assets/word/English.png",
      "imageGitBlobSha": "39159e7ea742345106cc19644d0851e4c837b7af",
      "localImageExists": true,
      "sourceOrdinal": 5253,
      "reviewOrder": 264,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "ABCの本は英語を連想させるが、Englishよりalphabetやlettersも自然。",
      "alternativeAnswersEn": [
        "alphabet",
        "letters",
        "book"
      ],
      "assessedAt": "2026-10-19T08:06:51.867448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "potential",
      "w": "potential",
      "p": [
        "poti-",
        "es-"
      ],
      "rarity": 258,
      "imagePath": "assets/word/potential.png",
      "imageGitBlobSha": "084aea78ab973f95cced550ff39100f30d9c1035",
      "localImageExists": true,
      "sourceOrdinal": 12212,
      "reviewOrder": 265,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "どんぐりと苗、大木で潜在性は読めるが、potentialよりgrowやseedも強い。",
      "alternativeAnswersEn": [
        "grow",
        "seed",
        "oak"
      ],
      "assessedAt": "2026-10-19T08:06:51.867448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "lot",
      "w": "lot",
      "p": [],
      "rarity": 258,
      "imagePath": "assets/word/lot.png",
      "imageGitBlobSha": "6801f851ef07763e2be58415e094f2d713039fea",
      "localImageExists": true,
      "sourceOrdinal": 18908,
      "reviewOrder": 266,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "抽選器と球からlotのくじは連想できるが、lotteryやballsも自然。",
      "alternativeAnswersEn": [
        "lottery",
        "draw",
        "balls"
      ],
      "assessedAt": "2026-10-19T08:06:51.868448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "coming",
      "w": "coming",
      "p": [],
      "rarity": 258,
      "imagePath": "assets/word/coming.png",
      "imageGitBlobSha": "7358680853413d538e69156d8d684498a70ebb88",
      "localImageExists": true,
      "sourceOrdinal": 48332,
      "reviewOrder": 267,
      "score": 74,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "家へ到着する人は明瞭だが、comingとcomeやarriveの形は区別できない。",
      "alternativeAnswersEn": [
        "come",
        "arrive",
        "visit"
      ],
      "assessedAt": "2026-10-19T08:06:51.868448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "likely",
      "w": "likely",
      "p": [
        "līk-"
      ],
      "rarity": 259,
      "imagePath": "assets/word/likely.png",
      "imageGitBlobSha": "b52b39245ef9adf5d752169f565b6d9f4c042f9f",
      "localImageExists": true,
      "sourceOrdinal": 9010,
      "reviewOrder": 268,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "雨雲と傘の人物で、likelyという確率の高低は示されない。",
      "alternativeAnswersEn": [
        "rain",
        "umbrella",
        "weather"
      ],
      "assessedAt": "2026-10-19T08:06:51.869448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "necessary",
      "w": "necessary",
      "p": [
        "ne",
        "ked-"
      ],
      "rarity": 259,
      "imagePath": "assets/word/necessary.png",
      "imageGitBlobSha": "ea29b14d99cfd8e5b7a523784016abe87090509f",
      "localImageExists": true,
      "sourceOrdinal": 10320,
      "reviewOrder": 269,
      "score": 55,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "鍵で扉を開ける必要は連想できるが、necessaryよりkeyやunlockが直接的。",
      "alternativeAnswersEn": [
        "key",
        "unlock",
        "door"
      ],
      "assessedAt": "2026-10-19T08:06:51.869448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "herself",
      "w": "herself",
      "p": [
        "ko-",
        "s(w)e-"
      ],
      "rarity": 260,
      "imagePath": "assets/word/herself.png",
      "imageGitBlobSha": "4eb75605058f9bad772a7529871675876e61be8a",
      "localImageExists": true,
      "sourceOrdinal": 7360,
      "reviewOrder": 270,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "鏡を見て髪を編む女性だが、herselfよりmirrorやbraidが自然。",
      "alternativeAnswersEn": [
        "mirror",
        "braid",
        "hair"
      ],
      "assessedAt": "2026-10-19T08:06:51.870448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "natural",
      "w": "natural",
      "p": [
        "genə-"
      ],
      "rarity": 260,
      "imagePath": "assets/word/natural.png",
      "imageGitBlobSha": "485c7820c3fdef1b47975b8c704d3ae2c21990b3",
      "localImageExists": true,
      "sourceOrdinal": 10291,
      "reviewOrder": 271,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "自然の川と植物は明瞭だが、naturalという形容詞よりnatureも強い。",
      "alternativeAnswersEn": [
        "nature",
        "forest",
        "stream"
      ],
      "assessedAt": "2026-10-19T08:06:51.870448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "play",
      "w": "play",
      "p": [
        "dlegh-"
      ],
      "rarity": 261,
      "imagePath": "assets/word/play.png",
      "imageGitBlobSha": "70002c4417dd4b9c267a0e551b4aad31109847d2",
      "localImageExists": true,
      "sourceOrdinal": 11948,
      "reviewOrder": 272,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "舞台上で演じる人物と幕が明瞭でplayの演劇を連想しやすい。",
      "alternativeAnswersEn": [
        "drama",
        "theater",
        "act"
      ],
      "assessedAt": "2026-10-19T08:06:51.871448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "move",
      "w": "move",
      "p": [
        "meuə-"
      ],
      "rarity": 262,
      "imagePath": "assets/word/move.png",
      "imageGitBlobSha": "f458e473835f954bbd4af384c6ab5df681f10459",
      "localImageExists": true,
      "sourceOrdinal": 10125,
      "reviewOrder": 273,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "動線のある玩具の車で移動は読めるが、moveよりcarやtoyも強い。",
      "alternativeAnswersEn": [
        "car",
        "toy",
        "drive"
      ],
      "assessedAt": "2026-10-19T08:06:51.871448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "significant",
      "w": "significant",
      "p": [
        "sāg-",
        "dhē-"
      ],
      "rarity": 262,
      "imagePath": "assets/word/significant.png",
      "imageGitBlobSha": "b494e5d3d9390d0a168d5e3e4942ba49d1cf0cf8",
      "localImageExists": true,
      "sourceOrdinal": 14501,
      "reviewOrder": 274,
      "score": 28,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "柱の接合を調べる作業で、significantという重要性は示されない。",
      "alternativeAnswersEn": [
        "inspect",
        "wood",
        "builder"
      ],
      "assessedAt": "2026-10-19T08:06:51.871448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "therefore",
      "w": "therefore",
      "p": [
        "to-",
        "per1"
      ],
      "rarity": 262,
      "imagePath": "assets/word/therefore.png",
      "imageGitBlobSha": "a2b3b3253464f9ad4cf5db51e3cf44ab6ac94b31",
      "localImageExists": true,
      "sourceOrdinal": 15913,
      "reviewOrder": 275,
      "score": 33,
      "components": {
        "meaningVisible": 16,
        "conceptDistinct": 6,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "雨に備えて長靴を履く因果は見えるが、thereforeという接続詞には絞れない。",
      "alternativeAnswersEn": [
        "rain",
        "boots",
        "prepare"
      ],
      "assessedAt": "2026-10-19T08:06:51.872448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "Jesus",
      "w": "Jesus",
      "p": [],
      "rarity": 262,
      "imagePath": "assets/word/Jesus.png",
      "imageGitBlobSha": "19718af76b428aa47efd4c12c8e922cd5d0c8c4e",
      "localImageExists": true,
      "sourceOrdinal": 18909,
      "reviewOrder": 276,
      "score": 82,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "ひげ・長髪・衣装の宗教的人物でJesusを連想できるが、他の人物像とも競合する。",
      "alternativeAnswersEn": [
        "Christ",
        "prophet",
        "man"
      ],
      "assessedAt": "2026-10-19T08:06:51.872448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "longer",
      "w": "longer",
      "p": [],
      "rarity": 262,
      "imagePath": "assets/word/longer.png",
      "imageGitBlobSha": "49facd8efba2d57dc5081c15c947c83c76a30cee",
      "localImageExists": true,
      "sourceOrdinal": 20917,
      "reviewOrder": 277,
      "score": 90,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 18,
        "smallImageReadable": 10
      },
      "reasonJa": "二本のマフラーの長さの差が明瞭でlongerを読み取りやすい。",
      "alternativeAnswersEn": [
        "long",
        "scarf",
        "length"
      ],
      "assessedAt": "2026-10-19T08:06:51.873446+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "morning",
      "w": "morning",
      "p": [
        "mer-1"
      ],
      "rarity": 263,
      "imagePath": "assets/word/morning.png",
      "imageGitBlobSha": "f9afb9336b561242ca65bac5df306f3400fa3946",
      "localImageExists": true,
      "sourceOrdinal": 10076,
      "reviewOrder": 278,
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "朝日と朝食がそろいmorningを連想しやすい。",
      "alternativeAnswersEn": [
        "breakfast",
        "sunrise"
      ],
      "assessedAt": "2026-10-19T08:06:51.873446+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "policy@pele3",
      "w": "policy",
      "p": [
        "pelə-3"
      ],
      "rarity": 263,
      "imagePath": "assets/word/policy@pele3.png",
      "imageGitBlobSha": "077e6d2a3727241a1869c113e96c11f684643fed",
      "localImageExists": true,
      "sourceOrdinal": 12074,
      "reviewOrder": 279,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "公的文書と議事堂で方針は連想できるが、policyよりlawやgovernmentも強い。",
      "alternativeAnswersEn": [
        "law",
        "government",
        "document"
      ],
      "assessedAt": "2026-10-19T08:06:51.874448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "feet@x",
      "w": "feet",
      "p": [],
      "rarity": 263,
      "imagePath": "assets/word/feet@x.png",
      "imageGitBlobSha": "850e624c2b901ea80203b2606b3bc961fb2f7e69",
      "localImageExists": true,
      "sourceOrdinal": 20912,
      "reviewOrder": 280,
      "score": 86,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "両足の裏を大きく示しfeetは読めるが、solesやfootも候補。",
      "alternativeAnswersEn": [
        "soles",
        "foot"
      ],
      "assessedAt": "2026-10-19T08:06:51.874448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "feet@ped",
      "w": "feet",
      "p": [
        "ped-"
      ],
      "rarity": 263,
      "imagePath": "assets/word/feet@ped.png",
      "imageGitBlobSha": "b324261509cc873903a54b470cc4decb94a59a0b",
      "localImageExists": true,
      "sourceOrdinal": 49163,
      "reviewOrder": 281,
      "score": 97,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 22,
        "smallImageReadable": 10
      },
      "reasonJa": "二本の足が大きく描かれfeetの複数が読み取りやすい。",
      "alternativeAnswersEn": [
        "foot",
        "toes"
      ],
      "assessedAt": "2026-10-19T08:06:51.875447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "current",
      "w": "current",
      "p": [
        "kers-2"
      ],
      "rarity": 265,
      "imagePath": "assets/word/current.png",
      "imageGitBlobSha": "de8723522394740a8f64d15b95d4af2366583dc4",
      "localImageExists": true,
      "sourceOrdinal": 3758,
      "reviewOrder": 282,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "掲示された時刻表を示すが、currentという現在性は特定しにくい。",
      "alternativeAnswersEn": [
        "timetable",
        "schedule",
        "station"
      ],
      "assessedAt": "2026-10-19T08:06:51.875447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "physical",
      "w": "physical",
      "p": [
        "bheuə-"
      ],
      "rarity": 265,
      "imagePath": "assets/word/physical.png",
      "imageGitBlobSha": "c26ac0dfbe8e4842ef056a52663e002156ca1521",
      "localImageExists": true,
      "sourceOrdinal": 11760,
      "reviewOrder": 283,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "体のバランスを測る姿でphysicalは連想できるが、exerciseやbalanceが強い。",
      "alternativeAnswersEn": [
        "exercise",
        "balance",
        "body"
      ],
      "assessedAt": "2026-10-19T08:06:51.875447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "patient",
      "w": "patient",
      "p": [
        "pē(i)-"
      ],
      "rarity": 266,
      "imagePath": "assets/word/patient.png",
      "imageGitBlobSha": "e65816455dbcde4812def0825724426526a22eda",
      "localImageExists": true,
      "sourceOrdinal": 11377,
      "reviewOrder": 284,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "医師に診察される人が明瞭でpatientを推測しやすい。",
      "alternativeAnswersEn": [
        "checkup",
        "doctor"
      ],
      "assessedAt": "2026-10-19T08:06:51.876448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "subject",
      "w": "subject",
      "p": [
        "upo",
        "yē-"
      ],
      "rarity": 266,
      "imagePath": "assets/word/subject.png",
      "imageGitBlobSha": "da73bbbcad9286fd4531daebdb06d359acabae36",
      "localImageExists": true,
      "sourceOrdinal": 15308,
      "reviewOrder": 285,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "葉について教える授業だが、subjectよりlessonやteachも自然。",
      "alternativeAnswersEn": [
        "lesson",
        "teach",
        "leaf"
      ],
      "assessedAt": "2026-10-19T08:06:51.876448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "key",
      "w": "key",
      "p": [
        "kagh-"
      ],
      "rarity": 268,
      "imagePath": "assets/word/key.png",
      "imageGitBlobSha": "26127fad4ab37a96ccbda73a07e466643d1ec583",
      "localImageExists": true,
      "sourceOrdinal": 8606,
      "reviewOrder": 286,
      "score": 62,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 17,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "小さな島が描かれkeyの小島の意味には合うが、islandやisletが強い。",
      "alternativeAnswersEn": [
        "island",
        "islet",
        "cay"
      ],
      "assessedAt": "2026-10-19T08:06:51.877448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "society",
      "w": "society",
      "p": [
        "sekʷ-1"
      ],
      "rarity": 270,
      "imagePath": "assets/word/society.png",
      "imageGitBlobSha": "a7b6fca94ede6b020c6074e55250156037a50c9c",
      "localImageExists": true,
      "sourceOrdinal": 14703,
      "reviewOrder": 287,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "異なる役割の人がいる街は社会を示すが、societyよりcommunityも自然。",
      "alternativeAnswersEn": [
        "community",
        "town",
        "people"
      ],
      "assessedAt": "2026-10-19T08:06:51.877448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "surface",
      "w": "surface",
      "p": [
        "uper",
        "dhē-"
      ],
      "rarity": 270,
      "imagePath": "assets/word/surface.png",
      "imageGitBlobSha": "6ec33ecd976fd32281304e0e28818d32b7e6541b",
      "localImageExists": true,
      "sourceOrdinal": 15490,
      "reviewOrder": 288,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "水滴の付いたリンゴの外面だが、surfaceよりappleやwetが目立つ。",
      "alternativeAnswersEn": [
        "apple",
        "wet",
        "skin"
      ],
      "assessedAt": "2026-10-19T08:06:51.878447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "personal",
      "w": "personal",
      "p": [],
      "rarity": 270,
      "imagePath": "assets/word/personal.png",
      "imageGitBlobSha": "8d51dc542f06aececf18369301837d282d6cf0b7",
      "localImageExists": true,
      "sourceOrdinal": 18911,
      "reviewOrder": 289,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "枕を抱く女性の絵で、personalという私的な性質は特定できない。",
      "alternativeAnswersEn": [
        "pillow",
        "hug",
        "love"
      ],
      "assessedAt": "2026-10-19T08:06:51.878447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "force",
      "w": "force",
      "p": [
        "bhergh-2"
      ],
      "rarity": 271,
      "imagePath": "assets/word/force.png",
      "imageGitBlobSha": "fe6a5eb8c3c020348eaaf54177694be5ab91cf49",
      "localImageExists": true,
      "sourceOrdinal": 6280,
      "reviewOrder": 290,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "重い荷物を押す姿から力は読めるが、forceよりpushやeffortも強い。",
      "alternativeAnswersEn": [
        "push",
        "effort",
        "power"
      ],
      "assessedAt": "2026-10-19T08:06:51.879447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "quality",
      "w": "quality",
      "p": [
        "kʷo-"
      ],
      "rarity": 271,
      "imagePath": "assets/word/quality.png",
      "imageGitBlobSha": "98a311f831987f7a085c2160d5fdcd9d83d14dd2",
      "localImageExists": true,
      "sourceOrdinal": 12836,
      "reviewOrder": 291,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "仕上げた靴を誇る職人で品質は連想できるが、qualityよりshoeやcraftも自然。",
      "alternativeAnswersEn": [
        "shoe",
        "craft",
        "polish"
      ],
      "assessedAt": "2026-10-19T08:06:51.879447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "whose",
      "w": "whose",
      "p": [
        "kʷo-"
      ],
      "rarity": 271,
      "imagePath": "assets/word/whose.png",
      "imageGitBlobSha": "50e9b8d045663b9cd3753ec8d5aedb81a1a879d1",
      "localImageExists": true,
      "sourceOrdinal": 17227,
      "reviewOrder": 292,
      "score": 41,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "手袋の持主を尋ねる場面だが、whoseという所有疑問は特定しにくい。",
      "alternativeAnswersEn": [
        "glove",
        "ask",
        "owner"
      ],
      "assessedAt": "2026-10-19T08:06:51.879447+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "hair",
      "w": "hair",
      "p": [],
      "rarity": 271,
      "imagePath": "assets/word/hair.png",
      "imageGitBlobSha": "5b0f197e4396f8b4ffd08c5633f64ae04a7bf505",
      "localImageExists": true,
      "sourceOrdinal": 18912,
      "reviewOrder": 293,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "長い髪が大きく描かれhairを推測しやすいが、womanも候補。",
      "alternativeAnswersEn": [
        "woman",
        "hairstyle"
      ],
      "assessedAt": "2026-10-19T08:06:51.880448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "test",
      "w": "test",
      "p": [],
      "rarity": 271,
      "imagePath": "assets/word/test.png",
      "imageGitBlobSha": "85bb2ed30143f7170957b932ebe7c061cbdad472",
      "localImageExists": true,
      "sourceOrdinal": 18913,
      "reviewOrder": 294,
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "答案を解く机上の場面でtestを連想しやすい。",
      "alternativeAnswersEn": [
        "exam",
        "study",
        "write"
      ],
      "assessedAt": "2026-10-19T08:06:51.880448+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "return",
      "w": "return",
      "p": [
        "re-",
        "terə-1"
      ],
      "rarity": 272,
      "imagePath": "assets/word/return.png",
      "imageGitBlobSha": "c993c145fd58789225ccda93f485e94bf9d34bcf",
      "localImageExists": true,
      "sourceOrdinal": 13544,
      "reviewOrder": 295,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "荷物を持って家族のもとへ戻る場面だが、returnとarriveも競合する。",
      "alternativeAnswersEn": [
        "arrive",
        "welcome",
        "home"
      ],
      "assessedAt": "2026-10-19T08:06:51.881888+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "lost",
      "w": "lost",
      "p": [],
      "rarity": 272,
      "imagePath": "assets/word/lost.png",
      "imageGitBlobSha": "b52ff2dca69388f8a5e0fd5c4433de8831d614dc",
      "localImageExists": true,
      "sourceOrdinal": 20894,
      "reviewOrder": 297,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "分かれ道で地図を見て困る姿が迷子を示しlostを読み取りやすい。",
      "alternativeAnswersEn": [
        "confused",
        "map",
        "which way"
      ],
      "assessedAt": "2026-10-19T08:06:51.881888+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "probably",
      "w": "probably",
      "p": [
        "per1",
        "bheuə-"
      ],
      "rarity": 273,
      "imagePath": "assets/word/probably.png",
      "imageGitBlobSha": "fd3972ddcc219c707155a564c112a309167c89d7",
      "localImageExists": true,
      "sourceOrdinal": 12439,
      "reviewOrder": 298,
      "score": 36,
      "components": {
        "meaningVisible": 18,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "雨雲を見て傘を持つ姿で、probablyという確率は特定できない。",
      "alternativeAnswersEn": [
        "rain",
        "umbrella",
        "weather"
      ],
      "assessedAt": "2026-10-19T08:06:51.882888+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "usually",
      "w": "usually",
      "p": [
        "oit-"
      ],
      "rarity": 273,
      "imagePath": "assets/word/usually.png",
      "imageGitBlobSha": "19e80fd56603f79f0222a545dc66d7660bd165a7",
      "localImageExists": true,
      "sourceOrdinal": 16630,
      "reviewOrder": 299,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "決まった時刻の歯磨きは習慣を示すが、usuallyとalwaysの頻度差は示せない。",
      "alternativeAnswersEn": [
        "brush",
        "teeth",
        "routine"
      ],
      "assessedAt": "2026-10-19T08:06:51.882888+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "theory",
      "w": "theory",
      "p": [],
      "rarity": 273,
      "imagePath": "assets/word/theory.png",
      "imageGitBlobSha": "a828097138856ecdbaee23324ce75a255ebbe4d1",
      "localImageExists": true,
      "sourceOrdinal": 18915,
      "reviewOrder": 300,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "複数の要素を関連づける説明は理論を連想させるが、theoryよりexplainも強い。",
      "alternativeAnswersEn": [
        "explain",
        "idea",
        "science"
      ],
      "assessedAt": "2026-10-19T08:06:51.883887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "run",
      "w": "run",
      "p": [
        "reiə-"
      ],
      "rarity": 274,
      "imagePath": "assets/word/run.png",
      "imageGitBlobSha": "cc58013e1debe8fe675c755ea2bad49e595fc564",
      "localImageExists": true,
      "sourceOrdinal": 13799,
      "reviewOrder": 301,
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "大きな歩幅と動線で走る動作が明瞭、runを推測しやすい。",
      "alternativeAnswersEn": [
        "sprint",
        "jog"
      ],
      "assessedAt": "2026-10-19T08:06:51.883887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "account",
      "w": "account",
      "p": [
        "ad-",
        "pau-2"
      ],
      "rarity": 275,
      "imagePath": "assets/word/account.png",
      "imageGitBlobSha": "626139253e414c4542d8775edf86c80610e5d75d",
      "localImageExists": true,
      "sourceOrdinal": 117,
      "reviewOrder": 303,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "銀行窓口で金銭と書類を扱いaccountを連想できるが、bankやdepositも強い。",
      "alternativeAnswersEn": [
        "bank",
        "deposit",
        "pay"
      ],
      "assessedAt": "2026-10-19T08:06:51.884887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "late",
      "w": "late",
      "p": [
        "lē-2"
      ],
      "rarity": 275,
      "imagePath": "assets/word/late.png",
      "imageGitBlobSha": "10833c0b94fb4e04db95a0cbb74938203e4dd32d",
      "localImageExists": true,
      "sourceOrdinal": 8813,
      "reviewOrder": 304,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "時計を見て焦って走る姿は遅刻を示すが、lateよりhurryも候補。",
      "alternativeAnswersEn": [
        "hurry",
        "rush",
        "run"
      ],
      "assessedAt": "2026-10-19T08:06:51.884887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "near",
      "w": "near",
      "p": [
        "nēhw-iz"
      ],
      "rarity": 275,
      "imagePath": "assets/word/near.png",
      "imageGitBlobSha": "7af2ef59293acde103d0ec662602078fe74c9172",
      "localImageExists": true,
      "sourceOrdinal": 10312,
      "reviewOrder": 305,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "犬と猫が密着しており近さは読めるが、nearよりpetsやtogetherも自然。",
      "alternativeAnswersEn": [
        "close",
        "together",
        "pets"
      ],
      "assessedAt": "2026-10-19T08:06:51.885887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "set@sekw1",
      "w": "set",
      "p": [
        "sekʷ-1"
      ],
      "rarity": 275,
      "imagePath": "assets/word/set@sekw1.png",
      "imageGitBlobSha": "d989ba2dd99fb8cc7fc125fc46a0973e09755dda",
      "localImageExists": true,
      "sourceOrdinal": 14353,
      "reviewOrder": 306,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "柄をそろえた学用品の一式はsetを示すが、school suppliesも候補。",
      "alternativeAnswersEn": [
        "school supplies",
        "matching",
        "bag"
      ],
      "assessedAt": "2026-10-19T08:06:51.885887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "today",
      "w": "today",
      "p": [
        "de-",
        "agh-2"
      ],
      "rarity": 275,
      "imagePath": "assets/word/today.png",
      "imageGitBlobSha": "0f28ebc738b6917ca3877fa201aa6f0714821e9a",
      "localImageExists": true,
      "sourceOrdinal": 16040,
      "reviewOrder": 307,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "カレンダーの特定日を示しtodayは連想できるが、dateやcalendarも強い。",
      "alternativeAnswersEn": [
        "date",
        "calendar",
        "now"
      ],
      "assessedAt": "2026-10-19T08:06:51.886887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "situation",
      "w": "situation",
      "p": [
        "tkei-"
      ],
      "rarity": 276,
      "imagePath": "assets/word/situation.png",
      "imageGitBlobSha": "5fc2e4df0cf29ae7f7337ea4971a130b237beedd",
      "localImageExists": true,
      "sourceOrdinal": 14563,
      "reviewOrder": 308,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "散らかった部屋の状況は見えるが、situationよりmessやtroubleも自然。",
      "alternativeAnswersEn": [
        "mess",
        "trouble",
        "room"
      ],
      "assessedAt": "2026-10-19T08:06:51.886887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "third",
      "w": "third",
      "p": [
        "trei-"
      ],
      "rarity": 276,
      "imagePath": "assets/word/third.png",
      "imageGitBlobSha": "be9c353a56a8d4be5476d819e10e5149b0618f77",
      "localImageExists": true,
      "sourceOrdinal": 15933,
      "reviewOrder": 309,
      "score": 51,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "三人の競走だが順位の目印がなくthirdを特定しにくい。",
      "alternativeAnswersEn": [
        "race",
        "run",
        "finish"
      ],
      "assessedAt": "2026-10-19T08:06:51.887889+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "major",
      "w": "major",
      "p": [
        "meg-"
      ],
      "rarity": 277,
      "imagePath": "assets/word/major.png",
      "imageGitBlobSha": "8bf38ccd5b520db4e590c026d7165d24fc4d268d",
      "localImageExists": true,
      "sourceOrdinal": 9325,
      "reviewOrder": 310,
      "score": 41,
      "components": {
        "meaningVisible": 20,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "合流する川は見えるが、majorという主要性や他の語義は明確でない。",
      "alternativeAnswersEn": [
        "river",
        "tributary",
        "confluence"
      ],
      "assessedAt": "2026-10-19T08:06:51.887889+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "provided",
      "w": "provided",
      "p": [
        "per1",
        "weid-"
      ],
      "rarity": 277,
      "imagePath": "assets/word/provided.png",
      "imageGitBlobSha": "b8e13d5694e541f375ea741c4023bc583a275583",
      "localImageExists": true,
      "sourceOrdinal": 12641,
      "reviewOrder": 311,
      "score": 21,
      "components": {
        "meaningVisible": 8,
        "conceptDistinct": 3,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "傘を差し出す行為で、条件を示すprovidedの語義は読み取れない。",
      "alternativeAnswersEn": [
        "umbrella",
        "help",
        "rain"
      ],
      "assessedAt": "2026-10-19T08:06:51.888887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "national",
      "w": "national",
      "p": [],
      "rarity": 277,
      "imagePath": "assets/word/national.png",
      "imageGitBlobSha": "fd6d9d3a39aa23cfa761950894130f752c9dd832",
      "localImageExists": true,
      "sourceOrdinal": 18918,
      "reviewOrder": 312,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "旗と議事堂は国家を示すが、nationalという形容詞には絞れない。",
      "alternativeAnswersEn": [
        "nation",
        "government",
        "flag"
      ],
      "assessedAt": "2026-10-19T08:06:51.888887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "international",
      "w": "international",
      "p": [
        "en",
        "genə-"
      ],
      "rarity": 278,
      "imagePath": "assets/word/international.png",
      "imageGitBlobSha": "ee3a270041cfdde5b4a9b396aae74518b3afb21f",
      "localImageExists": true,
      "sourceOrdinal": 8304,
      "reviewOrder": 313,
      "score": 80,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 9
      },
      "reasonJa": "複数国の旗と地球を囲む会議でinternationalを連想しやすい。",
      "alternativeAnswersEn": [
        "global",
        "meeting",
        "countries"
      ],
      "assessedAt": "2026-10-19T08:06:51.889889+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "addition",
      "w": "addition",
      "p": [
        "ad-",
        "dō-"
      ],
      "rarity": 279,
      "imagePath": "assets/word/addition.png",
      "imageGitBlobSha": "312344692e282b940fff6cb042366db8333ddad9",
      "localImageExists": true,
      "sourceOrdinal": 215,
      "reviewOrder": 314,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "箱の玩具に一個を追加する動作でadditionを連想できるが、addも強い。",
      "alternativeAnswersEn": [
        "add",
        "toy",
        "put"
      ],
      "assessedAt": "2026-10-19T08:06:51.889889+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "bring",
      "w": "bring",
      "p": [
        "bher-1",
        "nek-3"
      ],
      "rarity": 279,
      "imagePath": "assets/word/bring.png",
      "imageGitBlobSha": "d715f99e997f2457101a236dbf48e5ede681fa17",
      "localImageExists": true,
      "sourceOrdinal": 2012,
      "reviewOrder": 315,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "本を相手のもとへ持ってくる動作は見えるが、bringとgiveが競合する。",
      "alternativeAnswersEn": [
        "give",
        "book",
        "carry"
      ],
      "assessedAt": "2026-10-19T08:06:51.889889+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "feeling",
      "w": "feeling",
      "p": [
        "pāl-"
      ],
      "rarity": 279,
      "imagePath": "assets/word/feeling.png",
      "imageGitBlobSha": "06269a0a9e34ebae82a15edf3af37a37ed8311d0",
      "localImageExists": true,
      "sourceOrdinal": 5948,
      "reviewOrder": 316,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "胸に手を当てる表情は感情を示すが、feelingよりsadやworryも自然。",
      "alternativeAnswersEn": [
        "sad",
        "worry",
        "emotion"
      ],
      "assessedAt": "2026-10-19T08:06:51.890887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "stop",
      "w": "stop",
      "p": [
        "(s)teuə-"
      ],
      "rarity": 279,
      "imagePath": "assets/word/stop.png",
      "imageGitBlobSha": "4143a7739d4af49b97ea924e7db9256196be052e",
      "localImageExists": true,
      "sourceOrdinal": 15181,
      "reviewOrder": 317,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "障害物で車輪付きの乗物が止まる構図でstopを連想しやすい。",
      "alternativeAnswersEn": [
        "halt",
        "barrier",
        "crash"
      ],
      "assessedAt": "2026-10-19T08:06:51.890887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "job",
      "w": "job",
      "p": [],
      "rarity": 279,
      "imagePath": "assets/word/job.png",
      "imageGitBlobSha": "843e01e67fffc9a53f5ce9f7e9d9bf832163ad11",
      "localImageExists": true,
      "sourceOrdinal": 18919,
      "reviewOrder": 318,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "机で働く姿は仕事を示すが、jobよりworkやofficeも強い。",
      "alternativeAnswersEn": [
        "work",
        "office",
        "computer"
      ],
      "assessedAt": "2026-10-19T08:06:51.890887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "impact",
      "w": "impact",
      "p": [
        "en",
        "pag-"
      ],
      "rarity": 280,
      "imagePath": "assets/word/impact.png",
      "imageGitBlobSha": "5b8c1be2949737db161372f89e0278248f55d5dd",
      "localImageExists": true,
      "sourceOrdinal": 7791,
      "reviewOrder": 319,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "球が太鼓へ当たる瞬間は衝撃を示すが、impactよりhitも自然。",
      "alternativeAnswersEn": [
        "hit",
        "collision",
        "drum"
      ],
      "assessedAt": "2026-10-19T08:06:51.890887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "European",
      "w": "European",
      "p": [],
      "rarity": 280,
      "imagePath": "assets/word/European.png",
      "imageGitBlobSha": "b6a13bfa06c801286c3accb63608746710da2fee",
      "localImageExists": true,
      "sourceOrdinal": 18920,
      "reviewOrder": 320,
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "ヨーロッパ地図と各国旗が明瞭だが、EuropeanとEuropeが競合する。",
      "alternativeAnswersEn": [
        "Europe",
        "EU",
        "countries"
      ],
      "assessedAt": "2026-10-19T08:06:51.890887+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "son",
      "w": "son",
      "p": [
        "seuə-1"
      ],
      "rarity": 281,
      "imagePath": "assets/word/son.png",
      "imageGitBlobSha": "72e36b537459471acdd32ba5283559df58c9f899",
      "localImageExists": true,
      "sourceOrdinal": 14768,
      "reviewOrder": 321,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "父子らしい男性と少年でsonを連想できるが、boyやfatherも強い。",
      "alternativeAnswersEn": [
        "boy",
        "father",
        "child"
      ],
      "assessedAt": "2026-10-19T08:06:51.892363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "context",
      "w": "context",
      "p": [
        "kom",
        "teks-"
      ],
      "rarity": 282,
      "imagePath": "assets/word/context.png",
      "imageGitBlobSha": "fa1d6a9ce471dd94e3c30f6ddab47e5422c92fd5",
      "localImageExists": true,
      "sourceOrdinal": 3339,
      "reviewOrder": 322,
      "score": 45,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "本の一節を指しているが、contextよりreadやsentenceが直接的。",
      "alternativeAnswersEn": [
        "read",
        "sentence",
        "book"
      ],
      "assessedAt": "2026-10-19T08:06:51.892363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "difficult",
      "w": "difficult",
      "p": [
        "dwis-",
        "dhē-"
      ],
      "rarity": 283,
      "imagePath": "assets/word/difficult.png",
      "imageGitBlobSha": "223b27911f1f7c7cf4aa80ebc31eb754b8cbac20",
      "localImageExists": true,
      "sourceOrdinal": 4380,
      "reviewOrder": 323,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "苦労して岩を登る姿は困難を示すが、difficultよりclimbも有力。",
      "alternativeAnswersEn": [
        "climb",
        "hard",
        "effort"
      ],
      "assessedAt": "2026-10-19T08:06:51.892363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "mouth",
      "w": "mouth",
      "p": [
        "men-2"
      ],
      "rarity": 283,
      "imagePath": "assets/word/mouth.png",
      "imageGitBlobSha": "abbdf8d5f3dbd01ac4bd48f18ff1d77c80579a68",
      "localImageExists": true,
      "sourceOrdinal": 10123,
      "reviewOrder": 324,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "歯科診察で大きく開く口が明瞭だが、mouthよりdentistも候補。",
      "alternativeAnswersEn": [
        "dentist",
        "teeth",
        "open"
      ],
      "assessedAt": "2026-10-19T08:06:51.893363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "girl",
      "w": "girl",
      "p": [],
      "rarity": 284,
      "imagePath": "assets/word/girl.png",
      "imageGitBlobSha": "4af296de6345795d294c16c2ec766985bda46056",
      "localImageExists": true,
      "sourceOrdinal": 18921,
      "reviewOrder": 325,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "若い女の子が単独で明瞭に描かれgirlを推測しやすい。",
      "alternativeAnswersEn": [
        "child",
        "kid"
      ],
      "assessedAt": "2026-10-19T08:06:51.893363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "population",
      "w": "population",
      "p": [],
      "rarity": 284,
      "imagePath": "assets/word/population.png",
      "imageGitBlobSha": "c52750e2626eca0f04761d012a784ebce4117aae",
      "localImageExists": true,
      "sourceOrdinal": 18922,
      "reviewOrder": 326,
      "score": 76,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 9
      },
      "reasonJa": "地図上の多くの住民でpopulationを連想できるが、peopleも強い。",
      "alternativeAnswersEn": [
        "people",
        "residents",
        "town"
      ],
      "assessedAt": "2026-10-19T08:06:51.894363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "written@x",
      "w": "written",
      "p": [],
      "rarity": 284,
      "imagePath": "assets/word/written@x.png",
      "imageGitBlobSha": "e5ed3c31a5627331f2df56ebabe0b1d5c3e0b81b",
      "localImageExists": true,
      "sourceOrdinal": 20882,
      "reviewOrder": 327,
      "score": 63,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "手書きの文書は見えるが、writtenとwriteやletterの形は区別できない。",
      "alternativeAnswersEn": [
        "letter",
        "writing",
        "document"
      ],
      "assessedAt": "2026-10-19T08:06:51.894363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "access",
      "w": "access",
      "p": [
        "ad-",
        "ked-"
      ],
      "rarity": 285,
      "imagePath": "assets/word/access.png",
      "imageGitBlobSha": "06c92095afaef76444264bfa4be3902b72eb52b8",
      "localImageExists": true,
      "sourceOrdinal": 97,
      "reviewOrder": 328,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "車椅子で通れるスロープと入口でaccessを連想しやすいが、rampも有力。",
      "alternativeAnswersEn": [
        "ramp",
        "entrance",
        "accessible"
      ],
      "assessedAt": "2026-10-19T08:06:51.895363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "forward",
      "w": "forward",
      "p": [
        "per1",
        "wer-3"
      ],
      "rarity": 285,
      "imagePath": "assets/word/forward.png",
      "imageGitBlobSha": "f0c85dd028726ea03d7c3301f9ab2f02fc26c4ab",
      "localImageExists": true,
      "sourceOrdinal": 6356,
      "reviewOrder": 329,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "門から先へ歩く姿はあるが、forwardよりgoやwalkが強い。",
      "alternativeAnswersEn": [
        "go",
        "walk",
        "ahead"
      ],
      "assessedAt": "2026-10-19T08:06:51.895363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "hope",
      "w": "hope",
      "p": [
        "keu-2"
      ],
      "rarity": 285,
      "imagePath": "assets/word/hope.png",
      "imageGitBlobSha": "77a757284d8e1add19d012f5fef2f0ba85a77360",
      "localImageExists": true,
      "sourceOrdinal": 7506,
      "reviewOrder": 330,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "明るい道へ進む期待の表情だが、hopeよりfutureやjourneyも自然。",
      "alternativeAnswersEn": [
        "future",
        "journey",
        "happy"
      ],
      "assessedAt": "2026-10-19T08:06:51.896364+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "although",
      "w": "although",
      "p": [
        "al-5",
        "to-"
      ],
      "rarity": 286,
      "imagePath": "assets/word/although.png",
      "imageGitBlobSha": "954fd75fdd5b75a91dd8fef15623af5dcde7b886",
      "localImageExists": true,
      "sourceOrdinal": 551,
      "reviewOrder": 331,
      "score": 29,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 5,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "雨でも食事を楽しむ場面だが、althoughという逆接を特定できない。",
      "alternativeAnswersEn": [
        "picnic",
        "rain",
        "shelter"
      ],
      "assessedAt": "2026-10-19T08:06:51.896364+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "beyond",
      "w": "beyond",
      "p": [
        "ambhi",
        "i-"
      ],
      "rarity": 286,
      "imagePath": "assets/word/beyond.png",
      "imageGitBlobSha": "ea73f7659afd10054d70b1eb944c0e4915bf584f",
      "localImageExists": true,
      "sourceOrdinal": 1679,
      "reviewOrder": 332,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "橋の向こうの家は見えるが、beyondよりbridgeやacrossも強い。",
      "alternativeAnswersEn": [
        "bridge",
        "across",
        "house"
      ],
      "assessedAt": "2026-10-19T08:06:51.896364+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "fire",
      "w": "fire",
      "p": [
        "paəwr̥"
      ],
      "rarity": 286,
      "imagePath": "assets/word/fire.png",
      "imageGitBlobSha": "88a2861590400d29c4cd2cf3c75e53d8a28a7490",
      "localImageExists": true,
      "sourceOrdinal": 6095,
      "reviewOrder": 333,
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "大きな炎と燃える薪が明瞭でfireを推測しやすい。",
      "alternativeAnswersEn": [
        "flame",
        "campfire"
      ],
      "assessedAt": "2026-10-19T08:06:51.897363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "positive",
      "w": "positive",
      "p": [
        "apo-"
      ],
      "rarity": 286,
      "imagePath": "assets/word/positive.png",
      "imageGitBlobSha": "1af4931b4e6d4eb7056a18d2e2f0be474f495815",
      "localImageExists": true,
      "sourceOrdinal": 12177,
      "reviewOrder": 334,
      "score": 41,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "自信ある男性と迷う女性の対比だが、positiveという性質は絞りにくい。",
      "alternativeAnswersEn": [
        "confident",
        "sure",
        "uncertain"
      ],
      "assessedAt": "2026-10-19T08:06:51.897363+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sound@swen",
      "w": "sound",
      "p": [
        "swen-"
      ],
      "rarity": 286,
      "imagePath": "assets/word/sound@swen.png",
      "imageGitBlobSha": "fd25367fcd6ec7f3248f8a7a16815a4a27cdf019",
      "localImageExists": true,
      "sourceOrdinal": 14812,
      "reviewOrder": 335,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "鐘から耳へ届く波でsoundを連想しやすいが、hearやbellも候補。",
      "alternativeAnswersEn": [
        "hear",
        "bell",
        "noise"
      ],
      "assessedAt": "2026-10-19T08:06:51.897866+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "truth",
      "w": "truth",
      "p": [
        "deru-"
      ],
      "rarity": 286,
      "imagePath": "assets/word/truth.png",
      "imageGitBlobSha": "5f6b5f9811b3acaab21b0075925ec395d0881888",
      "localImageExists": true,
      "sourceOrdinal": 16354,
      "reviewOrder": 336,
      "score": 54,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "割れた鉢について話す姿は告白を連想させるが、truthよりsorryも自然。",
      "alternativeAnswersEn": [
        "confess",
        "sorry",
        "broken"
      ],
      "assessedAt": "2026-10-19T08:06:51.897866+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "bit",
      "w": "bit",
      "p": [
        "bheid-"
      ],
      "rarity": 287,
      "imagePath": "assets/word/bit.png",
      "imageGitBlobSha": "ad56874594f464b0c4f750ee12049a24f8395c4a",
      "localImageExists": true,
      "sourceOrdinal": 1763,
      "reviewOrder": 337,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "クッキーから欠けた小片が明瞭だが、bitよりpieceやcookieも自然。",
      "alternativeAnswersEn": [
        "piece",
        "cookie",
        "crumb"
      ],
      "assessedAt": "2026-10-19T08:06:51.897866+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "wife",
      "w": "wife",
      "p": [],
      "rarity": 287,
      "imagePath": "assets/word/wife.png",
      "imageGitBlobSha": "70c43d65f9c2eb4c74052c33be7b8fa088bc7b23",
      "localImageExists": true,
      "sourceOrdinal": 18925,
      "reviewOrder": 338,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "親密な男女からwifeは連想できるが、結婚の印がなくgirlfriendも有力。",
      "alternativeAnswersEn": [
        "girlfriend",
        "couple",
        "love"
      ],
      "assessedAt": "2026-10-19T08:06:51.898871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "couldnt",
      "w": "couldn't",
      "p": [],
      "rarity": 287,
      "imagePath": "assets/word/couldnt.png",
      "imageGitBlobSha": "ab6277d43cfa2a5d1362bfa5536eec9bd1d5fff4",
      "localImageExists": true,
      "sourceOrdinal": 32184,
      "reviewOrder": 339,
      "score": 58,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "動かせない壁を押す姿は不能を示すが、couldntの過去形は分からない。",
      "alternativeAnswersEn": [
        "cant",
        "push",
        "unable"
      ],
      "assessedAt": "2026-10-19T08:06:51.898871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "meet@mod",
      "w": "meet",
      "p": [
        "mōd-"
      ],
      "rarity": 288,
      "imagePath": "assets/word/meet@mod.png",
      "imageGitBlobSha": "b1f9bb3e65db8d33ec0231fe182080eec801a997",
      "localImageExists": true,
      "sourceOrdinal": 9615,
      "reviewOrder": 340,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "二人が出会って挨拶する姿でmeetを連想しやすい。",
      "alternativeAnswersEn": [
        "greet",
        "hello",
        "friends"
      ],
      "assessedAt": "2026-10-19T08:06:51.899871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "simply",
      "w": "simply",
      "p": [
        "sem-1"
      ],
      "rarity": 288,
      "imagePath": "assets/word/simply.png",
      "imageGitBlobSha": "a4e76afa36c232073ebe94321fe0a3b7e05184de",
      "localImageExists": true,
      "sourceOrdinal": 14521,
      "reviewOrder": 341,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "照明のスイッチを押すだけだが、simplyという容易さの指定が弱い。",
      "alternativeAnswersEn": [
        "switch",
        "light",
        "press"
      ],
      "assessedAt": "2026-10-19T08:06:51.899871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sent@x",
      "w": "sent",
      "p": [],
      "rarity": 288,
      "imagePath": "assets/word/sent@x.png",
      "imageGitBlobSha": "892ec57db35d968a58d4319d66363a047236b7f0",
      "localImageExists": true,
      "sourceOrdinal": 20897,
      "reviewOrder": 343,
      "score": 16,
      "components": {
        "meaningVisible": 5,
        "conceptDistinct": 1,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "紋章のある硬貨で、sentの送る動作や過去形は見えない。",
      "alternativeAnswersEn": [
        "coin",
        "money",
        "currency"
      ],
      "assessedAt": "2026-10-19T08:06:51.899871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sent@sent",
      "w": "sent",
      "p": [
        "sent-"
      ],
      "rarity": 288,
      "imagePath": "assets/word/sent@sent.png",
      "imageGitBlobSha": "558f3a7c55491f41f51d94c251dd1ff83cde18d9",
      "localImageExists": true,
      "sourceOrdinal": 49128,
      "reviewOrder": 345,
      "score": 64,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "手紙を送り出す図は明瞭だが、sentという過去形は示されない。",
      "alternativeAnswersEn": [
        "send",
        "letter",
        "mail"
      ],
      "assessedAt": "2026-10-19T08:06:51.899871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "amount",
      "w": "amount",
      "p": [
        "ad-",
        "men-2"
      ],
      "rarity": 289,
      "imagePath": "assets/word/amount.png",
      "imageGitBlobSha": "b812f3eeb1f1f71dbc1d2c22d444aa2ab2ced894",
      "localImageExists": true,
      "sourceOrdinal": 632,
      "reviewOrder": 346,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "硬貨を数える姿で量は連想できるが、amountよりcountやmoneyも強い。",
      "alternativeAnswersEn": [
        "count",
        "money",
        "total"
      ],
      "assessedAt": "2026-10-19T08:06:51.900872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "instead",
      "w": "instead",
      "p": [
        "en",
        "stā-",
        "apo-"
      ],
      "rarity": 289,
      "imagePath": "assets/word/instead.png",
      "imageGitBlobSha": "2053b0ac8302016489f3c37d7df605481c54b947",
      "localImageExists": true,
      "sourceOrdinal": 8224,
      "reviewOrder": 347,
      "score": 44,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "別のカップへ替える場面だが、insteadよりreplaceやserveが自然。",
      "alternativeAnswersEn": [
        "replace",
        "serve",
        "cup"
      ],
      "assessedAt": "2026-10-19T08:06:51.900872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "below",
      "w": "below",
      "p": [
        "legh-",
        "ambhi"
      ],
      "rarity": 290,
      "imagePath": "assets/word/below.png",
      "imageGitBlobSha": "7efe33b126eb85ca9f35c56808b9a351a696439d",
      "localImageExists": true,
      "sourceOrdinal": 1614,
      "reviewOrder": 348,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "テーブルの下の猫でbelowの位置関係を読み取りやすい。",
      "alternativeAnswersEn": [
        "under",
        "cat",
        "table"
      ],
      "assessedAt": "2026-10-19T08:06:51.900872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "expression",
      "w": "expression",
      "p": [
        "eghs",
        "per-4"
      ],
      "rarity": 290,
      "imagePath": "assets/word/expression.png",
      "imageGitBlobSha": "6d02468beed80b8b18eee665de9bd8b614f846ba",
      "localImageExists": true,
      "sourceOrdinal": 5749,
      "reviewOrder": 349,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "絵で気持ちを表す姿は見えるが、expressionよりpaintやartが直接的。",
      "alternativeAnswersEn": [
        "paint",
        "picture",
        "art"
      ],
      "assessedAt": "2026-10-19T08:06:51.901871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "May",
      "w": "May",
      "p": [
        "magh-"
      ],
      "rarity": 290,
      "imagePath": "assets/word/May.png",
      "imageGitBlobSha": "5651957a7abd0115f23ac98779126fa97609364f",
      "localImageExists": true,
      "sourceOrdinal": 9551,
      "reviewOrder": 350,
      "score": 35,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "雨雲を見て迷う姿で、Mayの可能性・許可の語形は特定できない。",
      "alternativeAnswersEn": [
        "rain",
        "maybe",
        "umbrella"
      ],
      "assessedAt": "2026-10-19T08:06:51.901871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sometimes",
      "w": "sometimes",
      "p": [
        "sem-1",
        "dā-"
      ],
      "rarity": 290,
      "imagePath": "assets/word/sometimes.png",
      "imageGitBlobSha": "6e94e83b38f04c6e20286f2dd9f9ded7a4b4a5ca",
      "localImageExists": true,
      "sourceOrdinal": 14763,
      "reviewOrder": 351,
      "score": 65,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "月に数日だけの自転車印は時々を示すが、sometimesよりscheduleも候補。",
      "alternativeAnswersEn": [
        "schedule",
        "cycle",
        "occasionally"
      ],
      "assessedAt": "2026-10-19T08:06:51.902872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "met@x",
      "w": "met",
      "p": [],
      "rarity": 290,
      "imagePath": "assets/word/met@x.png",
      "imageGitBlobSha": "0d20b38b8bd56b167151f30721a53165312850b1",
      "localImageExists": true,
      "sourceOrdinal": 20938,
      "reviewOrder": 352,
      "score": 16,
      "components": {
        "meaningVisible": 5,
        "conceptDistinct": 1,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "気象観測の機器で、metの出会ったという意味や過去形は示されない。",
      "alternativeAnswersEn": [
        "weather",
        "thermometer",
        "meteorology"
      ],
      "assessedAt": "2026-10-19T08:06:51.902872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "met@mod",
      "w": "met",
      "p": [
        "mōd-"
      ],
      "rarity": 290,
      "imagePath": "assets/word/met@mod.png",
      "imageGitBlobSha": "15900eea2bff7a728700716961c8167c749cb508",
      "localImageExists": true,
      "sourceOrdinal": 49127,
      "reviewOrder": 353,
      "score": 70,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "握手して出会う動作は明瞭だが、metの過去形は特定できない。",
      "alternativeAnswersEn": [
        "meet",
        "handshake",
        "greet"
      ],
      "assessedAt": "2026-10-19T08:06:51.903871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "quickly",
      "w": "quickly",
      "p": [
        "gwei-"
      ],
      "rarity": 291,
      "imagePath": "assets/word/quickly.png",
      "imageGitBlobSha": "5bca1d0af3096975c00560fe054ca3a46e43d7d6",
      "localImageExists": true,
      "sourceOrdinal": 12876,
      "reviewOrder": 354,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "大きな動線で素早さは読めるが、quicklyよりrunやfastも自然。",
      "alternativeAnswersEn": [
        "run",
        "fast",
        "sprint"
      ],
      "assessedAt": "2026-10-19T08:06:51.903871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "six",
      "w": "six",
      "p": [
        "s(w)eks"
      ],
      "rarity": 291,
      "imagePath": "assets/word/six.png",
      "imageGitBlobSha": "87bdbbc374242826d788a42f11c03d0b6491304d",
      "localImageExists": true,
      "sourceOrdinal": 14568,
      "reviewOrder": 355,
      "score": 79,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 21,
        "answerSpecific": 13,
        "smallImageReadable": 10
      },
      "reasonJa": "車六台の数は明瞭だが、sixよりcarsも自然。",
      "alternativeAnswersEn": [
        "cars",
        "vehicles"
      ],
      "assessedAt": "2026-10-19T08:06:51.904872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "writing",
      "w": "writing",
      "p": [],
      "rarity": 291,
      "imagePath": "assets/word/writing.png",
      "imageGitBlobSha": "324bd9147973c388fbb8fd377828b0952ef780c8",
      "localImageExists": true,
      "sourceOrdinal": 48168,
      "reviewOrder": 356,
      "score": 78,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "紙に文字を書く動作は明瞭だが、writingとwriteが競合する。",
      "alternativeAnswersEn": [
        "write",
        "pencil",
        "words"
      ],
      "assessedAt": "2026-10-19T08:06:51.904872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "actually",
      "w": "actually",
      "p": [
        "ag-"
      ],
      "rarity": 292,
      "imagePath": "assets/word/actually.png",
      "imageGitBlobSha": "74c6e8c2aaa8eabeffd76711c6bb05a8fe2f3cba",
      "localImageExists": true,
      "sourceOrdinal": 195,
      "reviewOrder": 357,
      "score": 28,
      "components": {
        "meaningVisible": 13,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "石の感触を確かめる人物で、actuallyという副詞は特定できない。",
      "alternativeAnswersEn": [
        "stone",
        "touch",
        "rock"
      ],
      "assessedAt": "2026-10-19T08:06:51.905874+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "content",
      "w": "content",
      "p": [
        "kom",
        "ten-"
      ],
      "rarity": 292,
      "imagePath": "assets/word/content.png",
      "imageGitBlobSha": "7e61b5225114401c56ac32261ba5ad29e3ba1a48",
      "localImageExists": true,
      "sourceOrdinal": 3334,
      "reviewOrder": 358,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "鞄の中身が見えてcontentを連想できるが、contentsやpackも有力。",
      "alternativeAnswersEn": [
        "contents",
        "pack",
        "bag"
      ],
      "assessedAt": "2026-10-19T08:06:51.905874+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "create",
      "w": "create",
      "p": [
        "ker-3"
      ],
      "rarity": 292,
      "imagePath": "assets/word/create.png",
      "imageGitBlobSha": "dee1a8656dcf46ec644be13961e36a7751929650",
      "localImageExists": true,
      "sourceOrdinal": 3596,
      "reviewOrder": 359,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "粘土から動物を作る姿でcreateは読めるが、makeやsculptも強い。",
      "alternativeAnswersEn": [
        "make",
        "sculpt",
        "clay"
      ],
      "assessedAt": "2026-10-19T08:06:51.906871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "everyone",
      "w": "everyone",
      "p": [
        "aiw-",
        "līk-",
        "oi-no-"
      ],
      "rarity": 292,
      "imagePath": "assets/word/everyone.png",
      "imageGitBlobSha": "57bb8f9b3e772659f3807beea3867c8d848c4ef5",
      "localImageExists": true,
      "sourceOrdinal": 5585,
      "reviewOrder": 360,
      "score": 62,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "多様な人々が一緒にいるが、everyoneよりpeopleやgroupも自然。",
      "alternativeAnswersEn": [
        "people",
        "group",
        "everybody"
      ],
      "assessedAt": "2026-10-19T08:06:51.906871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ready",
      "w": "ready",
      "p": [
        "reidh-"
      ],
      "rarity": 292,
      "imagePath": "assets/word/ready.png",
      "imageGitBlobSha": "134dca64ab39d60d3cf609d680159888761ebd2f",
      "localImageExists": true,
      "sourceOrdinal": 13052,
      "reviewOrder": 361,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "荷物を持って出発直前の姿は準備完了を示すが、readyよりtravelも強い。",
      "alternativeAnswersEn": [
        "prepared",
        "travel",
        "leave"
      ],
      "assessedAt": "2026-10-19T08:06:51.907871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "legal",
      "w": "legal",
      "p": [
        "leg-"
      ],
      "rarity": 293,
      "imagePath": "assets/word/legal.png",
      "imageGitBlobSha": "cc2947bffa648498b819c8181a1041239dc97432",
      "localImageExists": true,
      "sourceOrdinal": 8887,
      "reviewOrder": 362,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "裁判官と法律書は法を示すが、legalよりlawやlawyerが直接的。",
      "alternativeAnswersEn": [
        "law",
        "lawyer",
        "court"
      ],
      "assessedAt": "2026-10-19T08:06:51.907871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "perhaps",
      "w": "perhaps",
      "p": [
        "per1",
        "kob-"
      ],
      "rarity": 293,
      "imagePath": "assets/word/perhaps.png",
      "imageGitBlobSha": "3e5f98f558db5f23567fd40b9d626d4ce3ed3109",
      "localImageExists": true,
      "sourceOrdinal": 11558,
      "reviewOrder": 363,
      "score": 42,
      "components": {
        "meaningVisible": 21,
        "conceptDistinct": 9,
        "answerSpecific": 2,
        "smallImageReadable": 10
      },
      "reasonJa": "贈物を迷っているが、perhapsという推量の副詞は特定しにくい。",
      "alternativeAnswersEn": [
        "choose",
        "maybe",
        "gift"
      ],
      "assessedAt": "2026-10-19T08:06:51.907871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "whom",
      "w": "whom",
      "p": [
        "kʷo-"
      ],
      "rarity": 293,
      "imagePath": "assets/word/whom.png",
      "imageGitBlobSha": "1aea9f7774799ba0d2c63cf6642d0d04113ae5d2",
      "localImageExists": true,
      "sourceOrdinal": 17224,
      "reviewOrder": 364,
      "score": 34,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 9
      },
      "reasonJa": "複数人について尋ねる構図だが、whomとwhoの格は区別できない。",
      "alternativeAnswersEn": [
        "who",
        "people",
        "ask"
      ],
      "assessedAt": "2026-10-19T08:06:51.908871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "added@ad-do",
      "w": "added",
      "p": [
        "ad-",
        "dō-"
      ],
      "rarity": 293,
      "imagePath": "assets/word/added@ad-do.png",
      "imageGitBlobSha": "22a4724f36aba594a3913ac311e0582fbde64d36",
      "localImageExists": true,
      "sourceOrdinal": 49159,
      "reviewOrder": 365,
      "score": 67,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "積木を一個加える動作は明瞭だが、addedの過去形は示されない。",
      "alternativeAnswersEn": [
        "add",
        "stack",
        "blocks"
      ],
      "assessedAt": "2026-10-19T08:06:51.908871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "involved",
      "w": "involved",
      "p": [
        "en",
        "wel-3"
      ],
      "rarity": 294,
      "imagePath": "assets/word/involved.png",
      "imageGitBlobSha": "3bdc4aacd9d71f8f88a4adc9b9f841f83f49a16b",
      "localImageExists": true,
      "sourceOrdinal": 8403,
      "reviewOrder": 366,
      "score": 53,
      "components": {
        "meaningVisible": 26,
        "conceptDistinct": 14,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "共同で巣箱を作る姿は参加を示すが、involvedよりhelpやbuildも強い。",
      "alternativeAnswersEn": [
        "help",
        "participate",
        "build"
      ],
      "assessedAt": "2026-10-19T08:06:51.908871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "greater",
      "w": "greater",
      "p": [],
      "rarity": 294,
      "imagePath": "assets/word/greater.png",
      "imageGitBlobSha": "c218fd6686b44ee0ab7e63f4dc3c623e88e8d2be",
      "localImageExists": true,
      "sourceOrdinal": 20915,
      "reviewOrder": 367,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "二つの球の大きさの差は明瞭だが、greaterよりlargerやbiggerも自然。",
      "alternativeAnswersEn": [
        "larger",
        "bigger",
        "ball"
      ],
      "assessedAt": "2026-10-19T08:06:51.909873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "reported",
      "w": "reported",
      "p": [],
      "rarity": 294,
      "imagePath": "assets/word/reported.png",
      "imageGitBlobSha": "c73a26453cd91b97c062635fd13d31eda2de1c92",
      "localImageExists": true,
      "sourceOrdinal": 46449,
      "reviewOrder": 368,
      "score": 54,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "故障を報告する場面は見えるが、reportedの過去形やreportとの区別はつかない。",
      "alternativeAnswersEn": [
        "report",
        "explain",
        "bicycle"
      ],
      "assessedAt": "2026-10-19T08:06:51.909873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "cultural",
      "w": "cultural",
      "p": [
        "kʷel-1"
      ],
      "rarity": 295,
      "imagePath": "assets/word/cultural.png",
      "imageGitBlobSha": "0cfde732db8e4feb13bb382cffb2afddcbfb535d",
      "localImageExists": true,
      "sourceOrdinal": 3731,
      "reviewOrder": 369,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "伝統的な陶器作りは文化を連想させるが、culturalよりpotteryも強い。",
      "alternativeAnswersEn": [
        "pottery",
        "tradition",
        "culture"
      ],
      "assessedAt": "2026-10-19T08:06:51.910871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "text",
      "w": "text",
      "p": [
        "teks-"
      ],
      "rarity": 295,
      "imagePath": "assets/word/text.png",
      "imageGitBlobSha": "5c6a30d31073bcf1845f36039b99e26305a66298",
      "localImageExists": true,
      "sourceOrdinal": 15870,
      "reviewOrder": 370,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "紙の文字列が中心でtextを連想できるが、writingやdocumentも強い。",
      "alternativeAnswersEn": [
        "writing",
        "document",
        "words"
      ],
      "assessedAt": "2026-10-19T08:06:51.910871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "written@wreid",
      "w": "written",
      "p": [
        "wreid-"
      ],
      "rarity": 295,
      "imagePath": "assets/word/written@wreid.png",
      "imageGitBlobSha": "e2a217b187b21c507ff5abea01c6e9506cbe5022",
      "localImageExists": true,
      "sourceOrdinal": 49132,
      "reviewOrder": 371,
      "score": 64,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "手書きの紙とペンは見えるが、writtenという過去分詞形は示されない。",
      "alternativeAnswersEn": [
        "writing",
        "letter",
        "write"
      ],
      "assessedAt": "2026-10-19T08:06:51.910871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "private",
      "w": "private",
      "p": [
        "per1"
      ],
      "rarity": 297,
      "imagePath": "assets/word/private.png",
      "imageGitBlobSha": "a7b42307f5d1fcafc2e847bd6a29da9a51129b5b",
      "localImageExists": true,
      "sourceOrdinal": 12427,
      "reviewOrder": 372,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "施錠した日記を書く姿で私的とは読めるが、privateよりdiaryも強い。",
      "alternativeAnswersEn": [
        "diary",
        "secret",
        "write"
      ],
      "assessedAt": "2026-10-19T08:06:51.911872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "remember",
      "w": "remember",
      "p": [
        "re-",
        "(s)mer-1"
      ],
      "rarity": 297,
      "imagePath": "assets/word/remember.png",
      "imageGitBlobSha": "6976e4402b13c69a3f729005d68fe0aec53fee43",
      "localImageExists": true,
      "sourceOrdinal": 13313,
      "reviewOrder": 373,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "思い出の玩具を手にする姿は回想を示すが、rememberよりmemoryも自然。",
      "alternativeAnswersEn": [
        "memory",
        "toy",
        "recall"
      ],
      "assessedAt": "2026-10-19T08:06:51.911872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "wrong",
      "w": "wrong",
      "p": [
        "wer-3"
      ],
      "rarity": 297,
      "imagePath": "assets/word/wrong.png",
      "imageGitBlobSha": "961f24f9a310b68ae182334ce093c01246134bf8",
      "localImageExists": true,
      "sourceOrdinal": 17370,
      "reviewOrder": 374,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "違う形の穴へ積木を入れようとする誤りが明瞭でwrongを推測しやすい。",
      "alternativeAnswersEn": [
        "incorrect",
        "mistake",
        "fit"
      ],
      "assessedAt": "2026-10-19T08:06:51.911872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "received",
      "w": "received",
      "p": [],
      "rarity": 297,
      "imagePath": "assets/word/received.png",
      "imageGitBlobSha": "b9121606b19a04b9b12f31ff8cf0c3d074853a51",
      "localImageExists": true,
      "sourceOrdinal": 46836,
      "reviewOrder": 375,
      "score": 43,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 2,
        "smallImageReadable": 9
      },
      "reasonJa": "発想を周囲が喜ぶ場面だが、receivedという受け入れられた状態は特定しにくい。",
      "alternativeAnswersEn": [
        "praise",
        "idea",
        "approval"
      ],
      "assessedAt": "2026-10-19T08:06:51.912873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "complex",
      "w": "complex",
      "p": [
        "kom",
        "plek-"
      ],
      "rarity": 298,
      "imagePath": "assets/word/complex.png",
      "imageGitBlobSha": "c36fc502674be56098db85c0473a7f9a8c14a37c",
      "localImageExists": true,
      "sourceOrdinal": 3074,
      "reviewOrder": 376,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "複雑に絡むひもが明瞭でcomplexを連想しやすい。",
      "alternativeAnswersEn": [
        "tangled",
        "knot",
        "complicated"
      ],
      "assessedAt": "2026-10-19T08:06:51.912873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "dead",
      "w": "dead",
      "p": [
        "dheu-3"
      ],
      "rarity": 298,
      "imagePath": "assets/word/dead.png",
      "imageGitBlobSha": "13e2f60e3a5f6eddd247d0cc0ec53fd465f7a17f",
      "localImageExists": true,
      "sourceOrdinal": 3871,
      "reviewOrder": 377,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "茶色く垂れた葉の枯れた植物でdeadを読み取りやすい。",
      "alternativeAnswersEn": [
        "wilted",
        "plant",
        "dry"
      ],
      "assessedAt": "2026-10-19T08:06:51.912873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "influence",
      "w": "influence",
      "p": [
        "en",
        "bhleu-"
      ],
      "rarity": 298,
      "imagePath": "assets/word/influence.png",
      "imageGitBlobSha": "1b54bdd98eccf6f9e392d9522a8c10f73c2e7002",
      "localImageExists": true,
      "sourceOrdinal": 8099,
      "reviewOrder": 378,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "相手の食べ方が影響する場面だが、influenceよりeatやcopyも強い。",
      "alternativeAnswersEn": [
        "copy",
        "eat",
        "pear"
      ],
      "assessedAt": "2026-10-19T08:06:51.913873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "particularly",
      "w": "particularly",
      "p": [
        "perə-2"
      ],
      "rarity": 298,
      "imagePath": "assets/word/particularly.png",
      "imageGitBlobSha": "4abb1ef47f385d71e8b311ec17f1e3712e512701",
      "localImageExists": true,
      "sourceOrdinal": 11317,
      "reviewOrder": 379,
      "score": 35,
      "components": {
        "meaningVisible": 17,
        "conceptDistinct": 7,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "バラに注目する人物で、particularlyという副詞は特定できない。",
      "alternativeAnswersEn": [
        "rose",
        "flower",
        "smell"
      ],
      "assessedAt": "2026-10-19T08:06:51.913873+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "stay@stak",
      "w": "stay",
      "p": [
        "stāk-"
      ],
      "rarity": 298,
      "imagePath": "assets/word/stay@stak.png",
      "imageGitBlobSha": "c62679c0c70d2d050f8babc725ed12500de35739",
      "localImageExists": true,
      "sourceOrdinal": 15068,
      "reviewOrder": 380,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "壁を支える斜材はbraceの意味に合うが、stayという名称には絞れない。",
      "alternativeAnswersEn": [
        "brace",
        "support",
        "beam"
      ],
      "assessedAt": "2026-10-19T08:06:51.914871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "network",
      "w": "network",
      "p": [],
      "rarity": 298,
      "imagePath": "assets/word/network.png",
      "imageGitBlobSha": "2a54a3de9d2b421041aef2bc703f5ca74df3fcbe",
      "localImageExists": true,
      "sourceOrdinal": 18928,
      "reviewOrder": 381,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "複数の機器をつなぐ接続図でnetworkを推測しやすい。",
      "alternativeAnswersEn": [
        "internet",
        "connection",
        "Wi-Fi"
      ],
      "assessedAt": "2026-10-19T08:06:51.914871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "left@x",
      "w": "left",
      "p": [],
      "rarity": 298,
      "imagePath": "assets/word/left@x.png",
      "imageGitBlobSha": "f6e1c2c5024c5e8320f30d95994a2549333a93b6",
      "localImageExists": true,
      "sourceOrdinal": 20872,
      "reviewOrder": 382,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "正面人物の左腕側を示すが、見る側との方向差でleftは迷いやすい。",
      "alternativeAnswersEn": [
        "right",
        "arm",
        "point"
      ],
      "assessedAt": "2026-10-19T08:06:51.914871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "art@ar",
      "w": "art",
      "p": [
        "ar-"
      ],
      "rarity": 299,
      "imagePath": "assets/word/art@ar.png",
      "imageGitBlobSha": "2f8d3dc71b20829babe741c4ac2abd285228dc85",
      "localImageExists": true,
      "sourceOrdinal": 1080,
      "reviewOrder": 383,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "絵画と彫刻、制作道具がそろいartを連想しやすい。",
      "alternativeAnswersEn": [
        "painting",
        "sculpture"
      ],
      "assessedAt": "2026-10-19T08:06:51.915871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "effective",
      "w": "effective",
      "p": [
        "eghs",
        "dhē-"
      ],
      "rarity": 299,
      "imagePath": "assets/word/effective.png",
      "imageGitBlobSha": "cd5d6c1dbd4d3e2cfb3e5b2bae0127a2c552131c",
      "localImageExists": true,
      "sourceOrdinal": 4970,
      "reviewOrder": 384,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "吸引具で排水を直す成功は見えるが、effectiveよりunclogやrepairが直接的。",
      "alternativeAnswersEn": [
        "unclog",
        "repair",
        "plunger"
      ],
      "assessedAt": "2026-10-19T08:06:51.915871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "special",
      "w": "special",
      "p": [
        "spek-"
      ],
      "rarity": 299,
      "imagePath": "assets/word/special.png",
      "imageGitBlobSha": "0034917d8d7163b4ce0997aab0491a1a1cac96ae",
      "localImageExists": true,
      "sourceOrdinal": 14855,
      "reviewOrder": 385,
      "score": 44,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "花で飾った特別な食卓だが、specialよりsurpriseやdecorationも自然。",
      "alternativeAnswersEn": [
        "surprise",
        "decoration",
        "flowers"
      ],
      "assessedAt": "2026-10-19T08:06:51.915871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "simple",
      "w": "simple",
      "p": [
        "sem-1",
        "pel-3"
      ],
      "rarity": 300,
      "imagePath": "assets/word/simple.png",
      "imageGitBlobSha": "56d40783d2460ada45bf2c4617f3da8f9cf7ad84",
      "localImageExists": true,
      "sourceOrdinal": 14516,
      "reviewOrder": 387,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "丸い穴と球の簡単な型合わせは見えるが、simpleよりeasyやfitも強い。",
      "alternativeAnswersEn": [
        "easy",
        "fit",
        "ball"
      ],
      "assessedAt": "2026-10-19T08:06:51.916871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ability",
      "w": "ability",
      "p": [
        "ghabh-"
      ],
      "rarity": 301,
      "imagePath": "assets/word/ability.png",
      "imageGitBlobSha": "623d64a30a015ae96368c0cad3ea8d84a4c82994",
      "localImageExists": true,
      "sourceOrdinal": 28,
      "reviewOrder": 388,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "上手にバイオリンを弾く姿だが、abilityよりviolinやplayが直接的。",
      "alternativeAnswersEn": [
        "violin",
        "play",
        "talent"
      ],
      "assessedAt": "2026-10-19T08:06:51.916871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "town",
      "w": "town",
      "p": [
        "dheuə-"
      ],
      "rarity": 301,
      "imagePath": "assets/word/town.png",
      "imageGitBlobSha": "47ce1dd2c0f51d85a1d46565a7b9af455477d57b",
      "localImageExists": true,
      "sourceOrdinal": 16109,
      "reviewOrder": 390,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "家や店が並ぶ小さな街でtownを連想しやすい。",
      "alternativeAnswersEn": [
        "village",
        "neighborhood",
        "city"
      ],
      "assessedAt": "2026-10-19T08:06:51.916871+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "financial",
      "w": "financial",
      "p": [],
      "rarity": 301,
      "imagePath": "assets/word/financial.png",
      "imageGitBlobSha": "9a2b4ec758878c557ffca1cb99f4926a720d4ef6",
      "localImageExists": true,
      "sourceOrdinal": 18931,
      "reviewOrder": 392,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "硬貨を計算する姿は金銭を示すが、financialよりmoneyやcountが強い。",
      "alternativeAnswersEn": [
        "money",
        "count",
        "finance"
      ],
      "assessedAt": "2026-10-19T08:06:51.917872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "floor",
      "w": "floor",
      "p": [
        "pelə-2"
      ],
      "rarity": 302,
      "imagePath": "assets/word/floor.png",
      "imageGitBlobSha": "2332f8cd84a1d739079d17703386ff48da60273d",
      "localImageExists": true,
      "sourceOrdinal": 6184,
      "reviewOrder": 393,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "モップをかける床が明瞭だが、floorよりcleanやmopも有力。",
      "alternativeAnswersEn": [
        "clean",
        "mop",
        "tiles"
      ],
      "assessedAt": "2026-10-19T08:06:51.917872+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "share",
      "w": "share",
      "p": [
        "(s)ker-1"
      ],
      "rarity": 302,
      "imagePath": "assets/word/share.png",
      "imageGitBlobSha": "2a1853b61a3892a0fd371b11641de4c629a0f592",
      "localImageExists": true,
      "sourceOrdinal": 14402,
      "reviewOrder": 394,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "切り分けたケーキの一人分は読めるが、shareよりsliceやserveも強い。",
      "alternativeAnswersEn": [
        "slice",
        "portion",
        "serve"
      ],
      "assessedAt": "2026-10-19T08:06:51.918876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "consider",
      "w": "consider",
      "p": [
        "kom",
        "sweid-1"
      ],
      "rarity": 303,
      "imagePath": "assets/word/consider.png",
      "imageGitBlobSha": "8948ee48716b4baeb7cac1e798f69fdc84c3f3ec",
      "localImageExists": true,
      "sourceOrdinal": 3274,
      "reviewOrder": 395,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "壊れた椅子の部品を見て考える姿でconsiderを連想できるが、thinkも有力。",
      "alternativeAnswersEn": [
        "think",
        "repair",
        "ponder"
      ],
      "assessedAt": "2026-10-19T08:06:51.918876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "parts",
      "w": "parts",
      "p": [],
      "rarity": 303,
      "imagePath": "assets/word/parts.png",
      "imageGitBlobSha": "c5f505699fd4f9a4ad457ede10758165522e6641",
      "localImageExists": true,
      "sourceOrdinal": 46728,
      "reviewOrder": 396,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "時計から取り出した歯車やねじが部品を示しpartsを推測しやすい。",
      "alternativeAnswersEn": [
        "components",
        "gears",
        "pieces"
      ],
      "assessedAt": "2026-10-19T08:06:51.918876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "last",
      "w": "last",
      "p": [
        "leis-1"
      ],
      "rarity": 304,
      "imagePath": "assets/word/last.png",
      "imageGitBlobSha": "7cfd15e603ed842e16f84a80bcd0718c6b0027d4",
      "localImageExists": true,
      "sourceOrdinal": 8810,
      "reviewOrder": 397,
      "score": 18,
      "components": {
        "meaningVisible": 6,
        "conceptDistinct": 2,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "ゴールへ向かう人物で、持続するというlastの語義は示されない。",
      "alternativeAnswersEn": [
        "finish",
        "goal",
        "run"
      ],
      "assessedAt": "2026-10-19T08:06:51.919876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "nor",
      "w": "nor",
      "p": [
        "ne",
        "aiw-",
        "kʷo-"
      ],
      "rarity": 305,
      "imagePath": "assets/word/nor.png",
      "imageGitBlobSha": "e764caa167a496afcb36199ac687f32f8c20d3e3",
      "localImageExists": true,
      "sourceOrdinal": 10514,
      "reviewOrder": 398,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "飲物を拒む姿は否定を示すが、norという二重の否定関係は特定できない。",
      "alternativeAnswersEn": [
        "no",
        "refuse",
        "neither"
      ],
      "assessedAt": "2026-10-19T08:06:51.919876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "seem",
      "w": "seem",
      "p": [
        "sem-1"
      ],
      "rarity": 305,
      "imagePath": "assets/word/seem.png",
      "imageGitBlobSha": "dbad0680b45d273fca4bc56d00135ce74da65249",
      "localImageExists": true,
      "sourceOrdinal": 14207,
      "reviewOrder": 399,
      "score": 52,
      "components": {
        "meaningVisible": 25,
        "conceptDistinct": 13,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "服掛けを人と見間違える姿は見え方を示すが、seemよりscaredも強い。",
      "alternativeAnswersEn": [
        "scared",
        "coat rack",
        "appear"
      ],
      "assessedAt": "2026-10-19T08:06:51.919876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "speak",
      "w": "speak",
      "p": [
        "spreg-1"
      ],
      "rarity": 305,
      "imagePath": "assets/word/speak.png",
      "imageGitBlobSha": "329ae1ccf6287bc966b3cb9c82e034a6eb93546a",
      "localImageExists": true,
      "sourceOrdinal": 14852,
      "reviewOrder": 400,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "相手に向かって話す動作は明瞭だが、speakとtalkが競合する。",
      "alternativeAnswersEn": [
        "talk",
        "say",
        "conversation"
      ],
      "assessedAt": "2026-10-19T08:06:51.920878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "wall",
      "w": "wall",
      "p": [
        "walso-"
      ],
      "rarity": 305,
      "imagePath": "assets/word/wall.png",
      "imageGitBlobSha": "cc91f44538163c98fee99f1d72f617bdbb679dd5",
      "localImageExists": true,
      "sourceOrdinal": 17048,
      "reviewOrder": 401,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "単独の壁面とれんが模様が明瞭でwallを推測しやすい。",
      "alternativeAnswersEn": [
        "barrier",
        "partition"
      ],
      "assessedAt": "2026-10-19T08:06:51.921876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "skin",
      "w": "skin",
      "p": [
        "sek-"
      ],
      "rarity": 306,
      "imagePath": "assets/word/skin.png",
      "imageGitBlobSha": "97c20a572d9aeb9a850634e1addaaad4ffffad8a",
      "localImageExists": true,
      "sourceOrdinal": 14595,
      "reviewOrder": 403,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "腕の肌に塗る姿でskinを連想できるが、creamやarmも強い。",
      "alternativeAnswersEn": [
        "cream",
        "arm",
        "lotion"
      ],
      "assessedAt": "2026-10-19T08:06:51.921876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "stay",
      "w": "stay",
      "p": [
        "stā-"
      ],
      "rarity": 306,
      "imagePath": "assets/word/stay.png",
      "imageGitBlobSha": "860469644a7f37a3ce729980983872aeef04b714",
      "localImageExists": true,
      "sourceOrdinal": 15067,
      "reviewOrder": 404,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "一人は去り一人は座ったままでstayを連想できるが、sitも有力。",
      "alternativeAnswersEn": [
        "sit",
        "remain",
        "leave"
      ],
      "assessedAt": "2026-10-19T08:06:51.921876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "global",
      "w": "global",
      "p": [],
      "rarity": 306,
      "imagePath": "assets/word/global.png",
      "imageGitBlobSha": "f4fc03c5c1d073e57011d801f74922c79b4bcab2",
      "localImageExists": true,
      "sourceOrdinal": 18932,
      "reviewOrder": 405,
      "score": 84,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 15,
        "smallImageReadable": 10
      },
      "reasonJa": "地球を囲む多国籍の人々でglobalは読めるが、worldやinternationalも強い。",
      "alternativeAnswersEn": [
        "world",
        "international",
        "people"
      ],
      "assessedAt": "2026-10-19T08:06:51.922878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "learn",
      "w": "learn",
      "p": [
        "leis-1"
      ],
      "rarity": 308,
      "imagePath": "assets/word/learn.png",
      "imageGitBlobSha": "90cdbb5744f256515a0b9f966f043dc46a91b89c",
      "localImageExists": true,
      "sourceOrdinal": 8859,
      "reviewOrder": 407,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "形合わせを習う子は学習を示すが、learnよりplayやshapeも強い。",
      "alternativeAnswersEn": [
        "play",
        "shape",
        "fit"
      ],
      "assessedAt": "2026-10-19T08:06:51.923878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "finally",
      "w": "finally",
      "p": [],
      "rarity": 308,
      "imagePath": "assets/word/finally.png",
      "imageGitBlobSha": "c234d9ed21328e2e76dac6de2ffeae63574b8f7e",
      "localImageExists": true,
      "sourceOrdinal": 20921,
      "reviewOrder": 408,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "パズル完成を喜ぶが、finallyの時間経過よりfinishやsuccessが直接的。",
      "alternativeAnswersEn": [
        "finish",
        "success",
        "complete"
      ],
      "assessedAt": "2026-10-19T08:06:51.923878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "entire",
      "w": "entire",
      "p": [
        "ne",
        "tag-"
      ],
      "rarity": 309,
      "imagePath": "assets/word/entire.png",
      "imageGitBlobSha": "e5f2fe36d16afd3753a46b4f427fee3ce563483f",
      "localImageExists": true,
      "sourceOrdinal": 5304,
      "reviewOrder": 409,
      "score": 50,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 10
      },
      "reasonJa": "丸ごとのスイカを持つが、entireよりwatermelonやwholeが強い。",
      "alternativeAnswersEn": [
        "watermelon",
        "whole",
        "fruit"
      ],
      "assessedAt": "2026-10-19T08:06:51.924876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "eye",
      "w": "eye",
      "p": [
        "okʷ-"
      ],
      "rarity": 309,
      "imagePath": "assets/word/eye.png",
      "imageGitBlobSha": "30b1683e6a7095cf177412dbc6a26f372d0b4644",
      "localImageExists": true,
      "sourceOrdinal": 5808,
      "reviewOrder": 410,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "鏡で目を大きく確認する姿でeyeを連想しやすい。",
      "alternativeAnswersEn": [
        "mirror",
        "look",
        "face"
      ],
      "assessedAt": "2026-10-19T08:06:51.924876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "closed",
      "w": "closed",
      "p": [],
      "rarity": 309,
      "imagePath": "assets/word/closed.png",
      "imageGitBlobSha": "a9fd04cd4d9223efd2a3fb3210681bafc3264279",
      "localImageExists": true,
      "sourceOrdinal": 47221,
      "reviewOrder": 413,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "閉じた扉が明瞭だが、closedよりdoorも有力。",
      "alternativeAnswersEn": [
        "door",
        "shut"
      ],
      "assessedAt": "2026-10-19T08:06:51.924876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "modern",
      "w": "modern",
      "p": [
        "med-"
      ],
      "rarity": 310,
      "imagePath": "assets/word/modern.png",
      "imageGitBlobSha": "bcd325dff3144f972ccc44a101ed06097c7615e8",
      "localImageExists": true,
      "sourceOrdinal": 9944,
      "reviewOrder": 414,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "新式のバスと充電設備は現代性を示すが、modernよりbusが強い。",
      "alternativeAnswersEn": [
        "bus",
        "electric",
        "station"
      ],
      "assessedAt": "2026-10-19T08:06:51.925876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "pay",
      "w": "pay",
      "p": [
        "pag-"
      ],
      "rarity": 310,
      "imagePath": "assets/word/pay.png",
      "imageGitBlobSha": "0ea7b1aa214cf1031c63a0ad11fd62d90ef112a5",
      "localImageExists": true,
      "sourceOrdinal": 11408,
      "reviewOrder": 415,
      "score": 15,
      "components": {
        "meaningVisible": 4,
        "conceptDistinct": 1,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "パン代を払う絵で、辞書に記載されたpayの防水する語義は示されない。",
      "alternativeAnswersEn": [
        "buy",
        "pay money",
        "bread"
      ],
      "assessedAt": "2026-10-19T08:06:51.925876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "wide",
      "w": "wide",
      "p": [
        "wi-"
      ],
      "rarity": 310,
      "imagePath": "assets/word/wide.png",
      "imageGitBlobSha": "ee9710580e72adb04302b602c66ca26ed2872bd7",
      "localImageExists": true,
      "sourceOrdinal": 17234,
      "reviewOrder": 416,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "太さの違う二本の帯でwideの幅は明瞭だが、broadやwiderも候補。",
      "alternativeAnswersEn": [
        "broad",
        "wider",
        "ribbon"
      ],
      "assessedAt": "2026-10-19T08:06:51.926876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "brother",
      "w": "brother",
      "p": [
        "bhrāter-"
      ],
      "rarity": 311,
      "imagePath": "assets/word/brother.png",
      "imageGitBlobSha": "48487ea5e3ac9672ead2193e17adbbae5a3ef98c",
      "localImageExists": true,
      "sourceOrdinal": 2033,
      "reviewOrder": 417,
      "score": 72,
      "components": {
        "meaningVisible": 32,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "年齢の違う親密な少年二人でbrotherは連想できるが、friendも候補。",
      "alternativeAnswersEn": [
        "friend",
        "boys",
        "sibling"
      ],
      "assessedAt": "2026-10-19T08:06:51.927876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "complete",
      "w": "complete",
      "p": [
        "kom",
        "pelə-1"
      ],
      "rarity": 311,
      "imagePath": "assets/word/complete.png",
      "imageGitBlobSha": "b5bb0ea4e135dbc5566d29c761ee7d898404d209",
      "localImageExists": true,
      "sourceOrdinal": 3071,
      "reviewOrder": 418,
      "score": 86,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "完成したパズルを見せてcompleteを連想しやすいが、finishも強い。",
      "alternativeAnswersEn": [
        "finish",
        "puzzle",
        "done"
      ],
      "assessedAt": "2026-10-19T08:06:51.927876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "limited",
      "w": "limited",
      "p": [],
      "rarity": 311,
      "imagePath": "assets/word/limited.png",
      "imageGitBlobSha": "f620e5222ac867bd789e4441193f77377971436b",
      "localImageExists": true,
      "sourceOrdinal": 47400,
      "reviewOrder": 420,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "入らない形と三つの穴は制限を連想させるが、limitedよりwrongやfitも強い。",
      "alternativeAnswersEn": [
        "wrong",
        "fit",
        "restricted"
      ],
      "assessedAt": "2026-10-19T08:06:51.928876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "arm",
      "w": "arm",
      "p": [
        "ar-"
      ],
      "rarity": 312,
      "imagePath": "assets/word/arm.png",
      "imageGitBlobSha": "6d6fe0a8056ea42bba299d6aae52c0007e7a1f35",
      "localImageExists": true,
      "sourceOrdinal": 1044,
      "reviewOrder": 422,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "伸ばした腕を指す構図が明瞭でarmを推測しやすい。",
      "alternativeAnswersEn": [
        "limb",
        "elbow"
      ],
      "assessedAt": "2026-10-19T08:06:51.928876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "critical",
      "w": "critical",
      "p": [
        "krei-"
      ],
      "rarity": 312,
      "imagePath": "assets/word/critical.png",
      "imageGitBlobSha": "7f25143d57809079879f0e8a89a4050e21427a55",
      "localImageExists": true,
      "sourceOrdinal": 3652,
      "reviewOrder": 423,
      "score": 56,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 9
      },
      "reasonJa": "椅子の欠陥を調べる姿で批判的な検討は読めるが、criticalよりinspectが強い。",
      "alternativeAnswersEn": [
        "inspect",
        "broken",
        "examine"
      ],
      "assessedAt": "2026-10-19T08:06:51.928876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "middle",
      "w": "middle",
      "p": [
        "medhyo-"
      ],
      "rarity": 313,
      "imagePath": "assets/word/middle.png",
      "imageGitBlobSha": "0e80cfdb74b24f8bb6b4b75fe2b7921808c5ceff",
      "localImageExists": true,
      "sourceOrdinal": 9781,
      "reviewOrder": 426,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "左右を灰色にして中央のリンゴを強調しmiddleを読み取りやすい。",
      "alternativeAnswersEn": [
        "center",
        "apple"
      ],
      "assessedAt": "2026-10-19T08:06:51.929878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "easy",
      "w": "easy",
      "p": [],
      "rarity": 313,
      "imagePath": "assets/word/easy.png",
      "imageGitBlobSha": "e97770d07ee9b6c76eb8448941a7122b1a7a561e",
      "localImageExists": true,
      "sourceOrdinal": 18935,
      "reviewOrder": 427,
      "score": 66,
      "components": {
        "meaningVisible": 30,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "少ないピースを楽に合わせる姿でeasyは読めるが、simpleやpuzzleも強い。",
      "alternativeAnswersEn": [
        "simple",
        "puzzle",
        "fit"
      ],
      "assessedAt": "2026-10-19T08:06:51.929878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "final",
      "w": "final",
      "p": [],
      "rarity": 313,
      "imagePath": "assets/word/final.png",
      "imageGitBlobSha": "153d7eeec7fd9b0f5c08d2e7842a4b5eedcda9cd",
      "localImageExists": true,
      "sourceOrdinal": 18936,
      "reviewOrder": 428,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "最後のクッキー一個は分かるが、finalよりlastやcookieも自然。",
      "alternativeAnswersEn": [
        "last",
        "cookie",
        "remaining"
      ],
      "assessedAt": "2026-10-19T08:06:51.930876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "standing",
      "w": "standing",
      "p": [],
      "rarity": 313,
      "imagePath": "assets/word/standing.png",
      "imageGitBlobSha": "de1017aae11afded8d74ef466719b6c39b407196",
      "localImageExists": true,
      "sourceOrdinal": 47608,
      "reviewOrder": 431,
      "score": 80,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "直立する姿が明瞭だが、standingとstandの形は区別できない。",
      "alternativeAnswersEn": [
        "stand",
        "upright",
        "boy"
      ],
      "assessedAt": "2026-10-19T08:06:51.930876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "i.e.",
      "w": "i.e.",
      "p": [
        "es-"
      ],
      "rarity": 314,
      "imagePath": "assets/word/i.e..png",
      "imageGitBlobSha": "a7d0100f3265ea52fae9386760a546791a735515",
      "localImageExists": true,
      "sourceOrdinal": 7679,
      "reviewOrder": 432,
      "score": 29,
      "components": {
        "meaningVisible": 14,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "星の輪郭を塗る矢印だけで、i.e.の言い換え関係は特定できない。",
      "alternativeAnswersEn": [
        "star",
        "color",
        "fill"
      ],
      "assessedAt": "2026-10-19T08:06:51.931876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "generally",
      "w": "generally",
      "p": [
        "genə-"
      ],
      "rarity": 315,
      "imagePath": "assets/word/generally.png",
      "imageGitBlobSha": "44a6b220885ec5fb5d84a358e0eb1ade5be62afc",
      "localImageExists": true,
      "sourceOrdinal": 6681,
      "reviewOrder": 433,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "大半が傘を使う構図だが、generallyよりrainやmostも強い。",
      "alternativeAnswersEn": [
        "rain",
        "umbrella",
        "most"
      ],
      "assessedAt": "2026-10-19T08:06:51.931876+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "happy",
      "w": "happy",
      "p": [
        "kob-"
      ],
      "rarity": 315,
      "imagePath": "assets/word/happy.png",
      "imageGitBlobSha": "14f3c2042c1c0ceda645ea60758be5b601b5f664",
      "localImageExists": true,
      "sourceOrdinal": 7172,
      "reviewOrder": 434,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "大きな笑顔と開いた腕でhappyを推測しやすい。",
      "alternativeAnswersEn": [
        "joyful",
        "glad"
      ],
      "assessedAt": "2026-10-19T08:06:51.932878+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "normal",
      "w": "normal",
      "p": [
        "gnō-"
      ],
      "rarity": 315,
      "imagePath": "assets/word/normal.png",
      "imageGitBlobSha": "b48708cfc78e6847bb863a0e8e69c9aae4c36046",
      "localImageExists": true,
      "sourceOrdinal": 10519,
      "reviewOrder": 435,
      "score": 38,
      "components": {
        "meaningVisible": 19,
        "conceptDistinct": 8,
        "answerSpecific": 1,
        "smallImageReadable": 10
      },
      "reasonJa": "普通のパンを焼く人物だが、normalという通常性の比較がない。",
      "alternativeAnswersEn": [
        "bread",
        "baker",
        "bake"
      ],
      "assessedAt": "2026-10-19T08:06:51.933385+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "hold",
      "w": "hold",
      "p": [
        "kel-3"
      ],
      "rarity": 316,
      "imagePath": "assets/word/hold.png",
      "imageGitBlobSha": "ca8f0bdcf59fc2a4def090cc6003e5512417f094",
      "localImageExists": true,
      "sourceOrdinal": 7454,
      "reviewOrder": 437,
      "score": 68,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 8,
        "smallImageReadable": 10
      },
      "reasonJa": "船の貨物室は見えるが、holdの握る・舞台の語義には合いにくい。",
      "alternativeAnswersEn": [
        "cargo",
        "ship",
        "crane"
      ],
      "assessedAt": "2026-10-19T08:06:51.933385+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "basis",
      "w": "basis",
      "p": [
        "gʷā-"
      ],
      "rarity": 317,
      "imagePath": "assets/word/basis.png",
      "imageGitBlobSha": "45a53dd10fb0ad8e8282dd93e067847912909222",
      "localImageExists": true,
      "sourceOrdinal": 1501,
      "reviewOrder": 439,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "建物の骨組みと土台は見えるが、basisよりfoundationやframeが自然。",
      "alternativeAnswersEn": [
        "foundation",
        "frame",
        "structure"
      ],
      "assessedAt": "2026-10-19T08:06:51.934391+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "brain",
      "w": "brain",
      "p": [
        "mregh-m(n)o-"
      ],
      "rarity": 317,
      "imagePath": "assets/word/brain.png",
      "imageGitBlobSha": "93a94f46f802689c0ee0dfae0d001ec8585c9256",
      "localImageExists": true,
      "sourceOrdinal": 1953,
      "reviewOrder": 440,
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "脳のしわと全体形が大きく明瞭でbrainを推測しやすい。",
      "alternativeAnswersEn": [
        "cerebrum"
      ],
      "assessedAt": "2026-10-19T08:06:51.934391+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "medical",
      "w": "medical",
      "p": [
        "med-"
      ],
      "rarity": 317,
      "imagePath": "assets/word/medical.png",
      "imageGitBlobSha": "0c1d7982dbe4a1228343f06dff77bfb0386b3101",
      "localImageExists": true,
      "sourceOrdinal": 9598,
      "reviewOrder": 441,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "医師の診察は医療を示すが、medicalという形容詞よりdoctorも強い。",
      "alternativeAnswersEn": [
        "doctor",
        "checkup",
        "medicine"
      ],
      "assessedAt": "2026-10-19T08:06:51.935390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "breath",
      "w": "breath",
      "p": [
        "gʷhrē-"
      ],
      "rarity": 318,
      "imagePath": "assets/word/breath.png",
      "imageGitBlobSha": "5f21624fd4135c6a0b288ce8861f4a9d75ca241c",
      "localImageExists": true,
      "sourceOrdinal": 1981,
      "reviewOrder": 442,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "白い息が口から出る様子でbreathを連想しやすいが、coldも候補。",
      "alternativeAnswersEn": [
        "cold",
        "exhale",
        "breathe"
      ],
      "assessedAt": "2026-10-19T08:06:51.935390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "concept",
      "w": "concept",
      "p": [
        "kom",
        "kap-"
      ],
      "rarity": 318,
      "imagePath": "assets/word/concept.png",
      "imageGitBlobSha": "0dbf5892097c4d439c2e904780c6064f2eae5e83",
      "localImageExists": true,
      "sourceOrdinal": 3131,
      "reviewOrder": 443,
      "score": 46,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 9
      },
      "reasonJa": "三角形を教える授業だが、conceptよりtriangleやteachが直接的。",
      "alternativeAnswersEn": [
        "triangle",
        "teach",
        "idea"
      ],
      "assessedAt": "2026-10-19T08:06:51.936390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "multiple",
      "w": "multiple",
      "p": [
        "mel-4",
        "pel-3"
      ],
      "rarity": 318,
      "imagePath": "assets/word/multiple.png",
      "imageGitBlobSha": "54a421579d90f6ba319c7c41eb21634815ab8cd3",
      "localImageExists": true,
      "sourceOrdinal": 10150,
      "reviewOrder": 444,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "複数のカップが並ぶが、multipleよりcupsやeightも自然。",
      "alternativeAnswersEn": [
        "cups",
        "eight",
        "many"
      ],
      "assessedAt": "2026-10-19T08:06:51.936390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "negative",
      "w": "negative",
      "p": [
        "ne"
      ],
      "rarity": 319,
      "imagePath": "assets/word/negative.png",
      "imageGitBlobSha": "9eeb161e0fdcfd98cc762f64df76b8e7a940f72e",
      "localImageExists": true,
      "sourceOrdinal": 10335,
      "reviewOrder": 445,
      "score": 49,
      "components": {
        "meaningVisible": 24,
        "conceptDistinct": 12,
        "answerSpecific": 4,
        "smallImageReadable": 9
      },
      "reasonJa": "提案に不満そうな人物は否定的態度を示すが、negativeよりdisagreeも強い。",
      "alternativeAnswersEn": [
        "disagree",
        "no",
        "angry"
      ],
      "assessedAt": "2026-10-19T08:06:51.937390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "choice",
      "w": "choice",
      "p": [
        "geus-"
      ],
      "rarity": 320,
      "imagePath": "assets/word/choice.png",
      "imageGitBlobSha": "7fd1500c7e44f42d130fd98b049e5070b1a8f7e7",
      "localImageExists": true,
      "sourceOrdinal": 2652,
      "reviewOrder": 447,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "二つの果物から一方を選ぶ構図でchoiceを連想しやすい。",
      "alternativeAnswersEn": [
        "choose",
        "select",
        "apple"
      ],
      "assessedAt": "2026-10-19T08:06:51.937390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "review",
      "w": "review",
      "p": [
        "re-",
        "weid-"
      ],
      "rarity": 320,
      "imagePath": "assets/word/review.png",
      "imageGitBlobSha": "3e2c3d401fadaa53c8e15fa108c96244c202f1b7",
      "localImageExists": true,
      "sourceOrdinal": 13569,
      "reviewOrder": 448,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "書類の誤りを赤で見直す姿でreviewを連想できるが、checkやcorrectも強い。",
      "alternativeAnswersEn": [
        "check",
        "correct",
        "edit"
      ],
      "assessedAt": "2026-10-19T08:06:51.938391+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "ten",
      "w": "ten",
      "p": [
        "dekm̥"
      ],
      "rarity": 320,
      "imagePath": "assets/word/ten.png",
      "imageGitBlobSha": "22ea6e27bf72846cbef9bc7b3145dffcf0660e11",
      "localImageExists": true,
      "sourceOrdinal": 15784,
      "reviewOrder": 449,
      "score": 82,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "両手の指十本が明瞭だが、tenよりhandsやfingersも自然。",
      "alternativeAnswersEn": [
        "hands",
        "fingers"
      ],
      "assessedAt": "2026-10-19T08:06:51.938391+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "cold",
      "w": "cold",
      "p": [
        "gel-2"
      ],
      "rarity": 321,
      "imagePath": "assets/word/cold.png",
      "imageGitBlobSha": "d18011f24e5b0d8d2e78180d305f745e5aaa7a91",
      "localImageExists": true,
      "sourceOrdinal": 2920,
      "reviewOrder": 450,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "厚着と震え、寒そうな表情がそろいcoldを推測しやすい。",
      "alternativeAnswersEn": [
        "freezing",
        "chilly"
      ],
      "assessedAt": "2026-10-19T08:06:51.939390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "flow",
      "w": "flow",
      "p": [
        "pleu-"
      ],
      "rarity": 321,
      "imagePath": "assets/word/flow.png",
      "imageGitBlobSha": "b2a801819d1ef105913ad016d59b88d24c2d38e3",
      "localImageExists": true,
      "sourceOrdinal": 6203,
      "reviewOrder": 451,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "器から流れ出る水が明瞭でflowを連想しやすいが、pourも強い。",
      "alternativeAnswersEn": [
        "pour",
        "water",
        "stream"
      ],
      "assessedAt": "2026-10-19T08:06:51.939390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "religious",
      "w": "religious",
      "p": [
        "re-",
        "leig-"
      ],
      "rarity": 321,
      "imagePath": "assets/word/religious.png",
      "imageGitBlobSha": "aef3a2e440a180dd02d5896e44a4f1ba102c97b9",
      "localImageExists": true,
      "sourceOrdinal": 13296,
      "reviewOrder": 452,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "十字架の祭壇で祈る姿は宗教を示すが、religiousよりprayも強い。",
      "alternativeAnswersEn": [
        "pray",
        "religion",
        "church"
      ],
      "assessedAt": "2026-10-19T08:06:51.940390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "strength",
      "w": "strength",
      "p": [
        "strenk-"
      ],
      "rarity": 321,
      "imagePath": "assets/word/strength.png",
      "imageGitBlobSha": "a8ad8278e3bb233befff8f9dedc92063dc1c06f1",
      "localImageExists": true,
      "sourceOrdinal": 15223,
      "reviewOrder": 453,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "重りを上げる姿で力を連想できるが、strengthよりstrongやliftも候補。",
      "alternativeAnswersEn": [
        "strong",
        "lift",
        "power"
      ],
      "assessedAt": "2026-10-19T08:06:51.940390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "previous",
      "w": "previous",
      "p": [
        "per1",
        "wegh-"
      ],
      "rarity": 322,
      "imagePath": "assets/word/previous.png",
      "imageGitBlobSha": "43b5ae956c5bf28b1c44bf970a27c35884eb94d7",
      "localImageExists": true,
      "sourceOrdinal": 12386,
      "reviewOrder": 454,
      "score": 59,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 9
      },
      "reasonJa": "本の前の頁へ戻る図だが、previousよりpageやbackも自然。",
      "alternativeAnswersEn": [
        "page",
        "back",
        "book"
      ],
      "assessedAt": "2026-10-19T08:06:51.940390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "trade",
      "w": "trade",
      "p": [
        "der-1"
      ],
      "rarity": 322,
      "imagePath": "assets/word/trade.png",
      "imageGitBlobSha": "e4cd44485547dcfe7f68bc21e590ebd3ec226dca",
      "localImageExists": true,
      "sourceOrdinal": 16128,
      "reviewOrder": 455,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "果物と金銭を交換する場面でtradeを連想しやすい。",
      "alternativeAnswersEn": [
        "buy",
        "sell",
        "exchange"
      ],
      "assessedAt": "2026-10-19T08:06:51.941390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "twenty",
      "w": "twenty",
      "p": [
        "dwo-",
        "dekm̥"
      ],
      "rarity": 322,
      "imagePath": "assets/word/twenty.png",
      "imageGitBlobSha": "e23952a30296791ea43616f61ac13782be46cf55",
      "localImageExists": true,
      "sourceOrdinal": 16406,
      "reviewOrder": 456,
      "score": 66,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 18,
        "answerSpecific": 8,
        "smallImageReadable": 9
      },
      "reasonJa": "十個ずつ二列の玉で二十は数えられるが、twentyよりabacusも強い。",
      "alternativeAnswersEn": [
        "abacus",
        "beads",
        "count"
      ],
      "assessedAt": "2026-10-19T08:06:51.941390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "walk",
      "w": "walk",
      "p": [
        "wel-3"
      ],
      "rarity": 322,
      "imagePath": "assets/word/walk.png",
      "imageGitBlobSha": "a034dd0235567d7b38212311f2e8c89ea0b16cce",
      "localImageExists": true,
      "sourceOrdinal": 17045,
      "reviewOrder": 457,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "ゆっくり道を歩く姿が明瞭でwalkを推測しやすい。",
      "alternativeAnswersEn": [
        "stroll",
        "hike"
      ],
      "assessedAt": "2026-10-19T08:06:51.942389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "running",
      "w": "running",
      "p": [],
      "rarity": 322,
      "imagePath": "assets/word/running.png",
      "imageGitBlobSha": "b445f26fbadac1377b3729cfa72dab5a868330a7",
      "localImageExists": true,
      "sourceOrdinal": 47176,
      "reviewOrder": 459,
      "score": 82,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "走る動作は明瞭だが、runningとrunの語形差は絵だけで分からない。",
      "alternativeAnswersEn": [
        "run",
        "jog",
        "sprint"
      ],
      "assessedAt": "2026-10-19T08:06:51.942389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "lack",
      "w": "lack",
      "p": [
        "leg-2"
      ],
      "rarity": 323,
      "imagePath": "assets/word/lack.png",
      "imageGitBlobSha": "2756ae36c3762aa8b908e2abeff870723a0fa19a",
      "localImageExists": true,
      "sourceOrdinal": 8722,
      "reviewOrder": 462,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "空の器と果物入りの器の対比は不足を示すが、lackよりemptyも強い。",
      "alternativeAnswersEn": [
        "empty",
        "shortage",
        "none"
      ],
      "assessedAt": "2026-10-19T08:06:51.943392+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "capital",
      "w": "capital",
      "p": [
        "kaput-"
      ],
      "rarity": 324,
      "imagePath": "assets/word/capital.png",
      "imageGitBlobSha": "3613f0a12570a17c171743eb2f0889edb748ff69",
      "localImageExists": true,
      "sourceOrdinal": 2273,
      "reviewOrder": 465,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "都市と中心的な議事堂は見えるが、capitalよりgovernmentやcityも自然。",
      "alternativeAnswersEn": [
        "government",
        "city",
        "parliament"
      ],
      "assessedAt": "2026-10-19T08:06:51.943392+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "oil",
      "w": "oil",
      "p": [
        "elaiā"
      ],
      "rarity": 324,
      "imagePath": "assets/word/oil.png",
      "imageGitBlobSha": "c60ad24af0696b337c447661ec4289f58ba8c5b6",
      "localImageExists": true,
      "sourceOrdinal": 10777,
      "reviewOrder": 466,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "黄色く粘る液体を注ぐ絵でoilは連想できるが、honeyとも見分けにくい。",
      "alternativeAnswersEn": [
        "honey",
        "pour",
        "liquid"
      ],
      "assessedAt": "2026-10-19T08:06:51.943392+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "rule",
      "w": "rule",
      "p": [
        "reg-"
      ],
      "rarity": 324,
      "imagePath": "assets/word/rule.png",
      "imageGitBlobSha": "bb74740cee5807493f745f0f69b55bc227780ee0",
      "localImageExists": true,
      "sourceOrdinal": 13793,
      "reviewOrder": 467,
      "score": 69,
      "components": {
        "meaningVisible": 31,
        "conceptDistinct": 19,
        "answerSpecific": 9,
        "smallImageReadable": 10
      },
      "reasonJa": "プールで走る子を止める係員は規則を示すが、ruleよりstopも強い。",
      "alternativeAnswersEn": [
        "stop",
        "no running",
        "lifeguard"
      ],
      "assessedAt": "2026-10-19T08:06:51.944389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "sleep",
      "w": "sleep",
      "p": [
        "slēb-"
      ],
      "rarity": 324,
      "imagePath": "assets/word/sleep.png",
      "imageGitBlobSha": "c041c1262d896a6ad5464d2f62d95f54f28a1406",
      "localImageExists": true,
      "sourceOrdinal": 14615,
      "reviewOrder": 468,
      "score": 98,
      "components": {
        "meaningVisible": 40,
        "conceptDistinct": 25,
        "answerSpecific": 23,
        "smallImageReadable": 10
      },
      "reasonJa": "ベッドで目を閉じ寝息の記号がありsleepを推測しやすい。",
      "alternativeAnswersEn": [
        "asleep",
        "slumber"
      ],
      "assessedAt": "2026-10-19T08:06:51.944389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "green",
      "w": "green",
      "p": [
        "ghrē-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/green.png",
      "imageGitBlobSha": "07eba768d2ac3b0b5ad638cc2d3e558b57293a57",
      "localImageExists": true,
      "sourceOrdinal": 6976,
      "reviewOrder": 471,
      "score": 60,
      "components": {
        "meaningVisible": 28,
        "conceptDistinct": 16,
        "answerSpecific": 6,
        "smallImageReadable": 10
      },
      "reasonJa": "緑の布は明瞭だが、色の指定なしではgreenよりclothやtowelも自然。",
      "alternativeAnswersEn": [
        "cloth",
        "towel",
        "fabric"
      ],
      "assessedAt": "2026-10-19T08:06:51.945389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "offer",
      "w": "offer",
      "p": [
        "epi",
        "bher-1"
      ],
      "rarity": 325,
      "imagePath": "assets/word/offer.png",
      "imageGitBlobSha": "9d29f7cf674f1a07491c46e7a040c8a467241055",
      "localImageExists": true,
      "sourceOrdinal": 10762,
      "reviewOrder": 472,
      "score": 85,
      "components": {
        "meaningVisible": 36,
        "conceptDistinct": 23,
        "answerSpecific": 16,
        "smallImageReadable": 10
      },
      "reasonJa": "相手に飲物を差し出す動作は明瞭だが、offerとgiveが競合する。",
      "alternativeAnswersEn": [
        "give",
        "serve",
        "tea"
      ],
      "assessedAt": "2026-10-19T08:06:51.945389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "onto",
      "w": "onto",
      "p": [
        "an-",
        "de-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/onto.png",
      "imageGitBlobSha": "035a36941a98abdeff520322d9c9f365b63eee40",
      "localImageExists": true,
      "sourceOrdinal": 10829,
      "reviewOrder": 473,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "猫が台の上へ跳び乗る動線でontoを読み取りやすい。",
      "alternativeAnswersEn": [
        "jump",
        "on",
        "cat"
      ],
      "assessedAt": "2026-10-19T08:06:51.946389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "solution",
      "w": "solution",
      "p": [
        "s(w)e-",
        "leu-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/solution.png",
      "imageGitBlobSha": "7e102f1ee686a7fc695b456f906f397afd20c662",
      "localImageExists": true,
      "sourceOrdinal": 14750,
      "reviewOrder": 474,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "揺れる机にくさびを入れる解決は見えるが、solutionよりfixやwedgeも強い。",
      "alternativeAnswersEn": [
        "fix",
        "wedge",
        "repair"
      ],
      "assessedAt": "2026-10-19T08:06:51.946389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "status",
      "w": "status",
      "p": [
        "stā-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/status.png",
      "imageGitBlobSha": "d94857a3b396e4de24ee49a39fb6fcb965045068",
      "localImageExists": true,
      "sourceOrdinal": 15062,
      "reviewOrder": 475,
      "score": 62,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 9
      },
      "reasonJa": "船長と水兵の階級差は見えるが、statusよりcaptainやrankも強い。",
      "alternativeAnswersEn": [
        "captain",
        "rank",
        "sailor"
      ],
      "assessedAt": "2026-10-19T08:06:51.947390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "trust",
      "w": "trust",
      "p": [
        "deru-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/trust.png",
      "imageGitBlobSha": "e0940c35624e18e3231f6e79db804d356cda3479",
      "localImageExists": true,
      "sourceOrdinal": 16350,
      "reviewOrder": 476,
      "score": 73,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "後ろへ倒れる人を相手が受け止める姿でtrustを連想できるが、catchも強い。",
      "alternativeAnswersEn": [
        "catch",
        "fall",
        "confidence"
      ],
      "assessedAt": "2026-10-19T08:06:51.947390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "weight",
      "w": "weight",
      "p": [
        "wegh-"
      ],
      "rarity": 325,
      "imagePath": "assets/word/weight.png",
      "imageGitBlobSha": "e6abb97024bbfa2d338fe3da24257771126cbf7c",
      "localImageExists": true,
      "sourceOrdinal": 17147,
      "reviewOrder": 477,
      "score": 87,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 17,
        "smallImageReadable": 10
      },
      "reasonJa": "かぼちゃを秤に載せる動作でweightを連想しやすい。",
      "alternativeAnswersEn": [
        "weigh",
        "scale",
        "pumpkin"
      ],
      "assessedAt": "2026-10-19T08:06:51.947390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "central",
      "w": "central",
      "p": [
        "kent-"
      ],
      "rarity": 326,
      "imagePath": "assets/word/central.png",
      "imageGitBlobSha": "de8375021bdc572572179462fa8ba24f7d53f104",
      "localImageExists": true,
      "sourceOrdinal": 2487,
      "reviewOrder": 479,
      "score": 94,
      "components": {
        "meaningVisible": 39,
        "conceptDistinct": 24,
        "answerSpecific": 21,
        "smallImageReadable": 10
      },
      "reasonJa": "四つの灰色球に囲まれた赤球で中央は明瞭だが、centralとcenterが競合する。",
      "alternativeAnswersEn": [
        "center",
        "middle"
      ],
      "assessedAt": "2026-10-19T08:06:51.948389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "clearly",
      "w": "clearly",
      "p": [
        "kelə-2"
      ],
      "rarity": 326,
      "imagePath": "assets/word/clearly.png",
      "imageGitBlobSha": "db5d4d0019029dd825d63dbbcb75f7d8860eb2a0",
      "localImageExists": true,
      "sourceOrdinal": 2811,
      "reviewOrder": 481,
      "score": 45,
      "components": {
        "meaningVisible": 22,
        "conceptDistinct": 10,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "双眼鏡で鳥を見る姿で、clearlyという見え方の明瞭さは特定しにくい。",
      "alternativeAnswersEn": [
        "binoculars",
        "birdwatching",
        "look"
      ],
      "assessedAt": "2026-10-19T08:06:51.948389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "immediately",
      "w": "immediately",
      "p": [
        "ne",
        "medhyo-"
      ],
      "rarity": 326,
      "imagePath": "assets/word/immediately.png",
      "imageGitBlobSha": "8d46e78b254a532571596532567453c604e8c4ce",
      "localImageExists": true,
      "sourceOrdinal": 7769,
      "reviewOrder": 482,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "呼び鈴にすぐ応じる姿だが、immediatelyよりanswerやdoorが直接的。",
      "alternativeAnswersEn": [
        "answer",
        "door",
        "hurry"
      ],
      "assessedAt": "2026-10-19T08:06:51.949389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "recent",
      "w": "recent",
      "p": [
        "re-",
        "ken-2"
      ],
      "rarity": 326,
      "imagePath": "assets/word/recent.png",
      "imageGitBlobSha": "cf8ef00d6bc74364a8204e97b439008e125c13f7",
      "localImageExists": true,
      "sourceOrdinal": 13097,
      "reviewOrder": 484,
      "score": 47,
      "components": {
        "meaningVisible": 23,
        "conceptDistinct": 11,
        "answerSpecific": 3,
        "smallImageReadable": 10
      },
      "reasonJa": "新しい足跡を見る姿だが、recentという時間の短さは絵から断定しにくい。",
      "alternativeAnswersEn": [
        "footprints",
        "mud",
        "track"
      ],
      "assessedAt": "2026-10-19T08:06:51.949389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "primary",
      "w": "primary",
      "p": [
        "per1"
      ],
      "rarity": 327,
      "imagePath": "assets/word/primary.png",
      "imageGitBlobSha": "bc91dd0d68d0854f8435e65844a2907cdcc26985",
      "localImageExists": true,
      "sourceOrdinal": 12398,
      "reviewOrder": 485,
      "score": 27,
      "components": {
        "meaningVisible": 12,
        "conceptDistinct": 5,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "明るい部屋で絵を描く姿で、primaryの主要・初等の意味は示されない。",
      "alternativeAnswersEn": [
        "paint",
        "art",
        "draw"
      ],
      "assessedAt": "2026-10-19T08:06:51.949389+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "memory",
      "w": "memory",
      "p": [
        "(s)mer-1"
      ],
      "rarity": 328,
      "imagePath": "assets/word/memory.png",
      "imageGitBlobSha": "c306832cf09aa8523dfb73a1a8db4c9d32e625d5",
      "localImageExists": true,
      "sourceOrdinal": 9658,
      "reviewOrder": 488,
      "score": 77,
      "components": {
        "meaningVisible": 34,
        "conceptDistinct": 21,
        "answerSpecific": 12,
        "smallImageReadable": 10
      },
      "reasonJa": "写真を見て思い出す表情でmemoryは読めるが、photoやrememberも強い。",
      "alternativeAnswersEn": [
        "photo",
        "remember",
        "recollection"
      ],
      "assessedAt": "2026-10-19T08:06:51.950390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "degree",
      "w": "degree",
      "p": [
        "de-",
        "ghredh-"
      ],
      "rarity": 330,
      "imagePath": "assets/word/degree.png",
      "imageGitBlobSha": "be2cabacfef700cd469d4beeaadf62d03ba322fb",
      "localImageExists": true,
      "sourceOrdinal": 4022,
      "reviewOrder": 492,
      "score": 57,
      "components": {
        "meaningVisible": 27,
        "conceptDistinct": 15,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "角度を測る道具と斜材は見えるが、degreeよりangleやmeasureが自然。",
      "alternativeAnswersEn": [
        "angle",
        "measure",
        "protractor"
      ],
      "assessedAt": "2026-10-19T08:06:51.950390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "letter",
      "w": "letter",
      "p": [
        "deph-"
      ],
      "rarity": 330,
      "imagePath": "assets/word/letter.png",
      "imageGitBlobSha": "e03674a53ac1f6c5b24cda2290ce4d179e13203d",
      "localImageExists": true,
      "sourceOrdinal": 8944,
      "reviewOrder": 493,
      "score": 91,
      "components": {
        "meaningVisible": 38,
        "conceptDistinct": 24,
        "answerSpecific": 19,
        "smallImageReadable": 10
      },
      "reasonJa": "封筒と手書きの便りが明瞭でletterを推測しやすい。",
      "alternativeAnswersEn": [
        "mail",
        "love letter"
      ],
      "assessedAt": "2026-10-19T08:06:51.951390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "mental",
      "w": "mental",
      "p": [
        "men-2"
      ],
      "rarity": 330,
      "imagePath": "assets/word/mental.png",
      "imageGitBlobSha": "1b7c48b4bf53aeb20753f3b7225dfdc8f0d3d112",
      "localImageExists": true,
      "sourceOrdinal": 9679,
      "reviewOrder": 494,
      "score": 15,
      "components": {
        "meaningVisible": 4,
        "conceptDistinct": 1,
        "answerSpecific": 0,
        "smallImageReadable": 10
      },
      "reasonJa": "考え事と電球の絵で、語根に対応するあごのというmentalの語義は示されない。",
      "alternativeAnswersEn": [
        "think",
        "idea",
        "mind"
      ],
      "assessedAt": "2026-10-19T08:06:51.951390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "throughout",
      "w": "throughout",
      "p": [
        "terə-2",
        "ud-"
      ],
      "rarity": 330,
      "imagePath": "assets/word/throughout.png",
      "imageGitBlobSha": "5fb2f7db8e8e2b49231ddb48a23a5f078efc69f4",
      "localImageExists": true,
      "sourceOrdinal": 15972,
      "reviewOrder": 495,
      "score": 63,
      "components": {
        "meaningVisible": 29,
        "conceptDistinct": 17,
        "answerSpecific": 7,
        "smallImageReadable": 10
      },
      "reasonJa": "庭いっぱいの花は全域を示すが、throughoutよりflowersやeverywhereが強い。",
      "alternativeAnswersEn": [
        "flowers",
        "everywhere",
        "garden"
      ],
      "assessedAt": "2026-10-19T08:06:51.952390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "waiting",
      "w": "waiting",
      "p": [],
      "rarity": 330,
      "imagePath": "assets/word/waiting.png",
      "imageGitBlobSha": "c373b679fe376daff613b26da448375cbe1f91b4",
      "localImageExists": true,
      "sourceOrdinal": 48661,
      "reviewOrder": 497,
      "score": 80,
      "components": {
        "meaningVisible": 37,
        "conceptDistinct": 23,
        "answerSpecific": 10,
        "smallImageReadable": 10
      },
      "reasonJa": "閉じた扉の前で座って待つ姿は明瞭だが、waitingとwaitの形は区別できない。",
      "alternativeAnswersEn": [
        "wait",
        "door",
        "sit"
      ],
      "assessedAt": "2026-10-19T08:06:51.952390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "length",
      "w": "length",
      "p": [
        "del-1"
      ],
      "rarity": 331,
      "imagePath": "assets/word/length.png",
      "imageGitBlobSha": "c23bd16623ded112ea70c571fd433b28056aab16",
      "localImageExists": true,
      "sourceOrdinal": 8913,
      "reviewOrder": 498,
      "score": 81,
      "components": {
        "meaningVisible": 35,
        "conceptDistinct": 22,
        "answerSpecific": 14,
        "smallImageReadable": 10
      },
      "reasonJa": "長短のひもで長さは読めるが、lengthよりlongやshortも自然。",
      "alternativeAnswersEn": [
        "long",
        "short",
        "rope"
      ],
      "assessedAt": "2026-10-19T08:06:51.952390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    },
    {
      "id": "moving",
      "w": "moving",
      "p": [
        "meuə-"
      ],
      "rarity": 331,
      "imagePath": "assets/word/moving.png",
      "imageGitBlobSha": "f458e473835f954bbd4af384c6ab5df681f10459",
      "localImageExists": true,
      "sourceOrdinal": 10128,
      "reviewOrder": 499,
      "score": 68,
      "components": {
        "meaningVisible": 33,
        "conceptDistinct": 20,
        "answerSpecific": 5,
        "smallImageReadable": 10
      },
      "reasonJa": "車の動線で移動は見えるが、movingとmoveの語形は区別できない。",
      "alternativeAnswersEn": [
        "move",
        "car",
        "drive"
      ],
      "assessedAt": "2026-10-19T08:06:51.953390+00:00",
      "reviewer": "codex",
      "reviewMethod": "actual_image_visual_review",
      "rubricVersion": "visual-answer-v1",
      "currentPublicImageVerification": "git_blob_match",
      "verifiedPublicCommit": "5d9a23624f24b660cec6c96bdc1c4857b9b6019e"
    }
  ]
};
