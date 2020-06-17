# Hahow Backend Engineer 作業（James Yu）

很高興能嘗試這個作業，從無到有的開發過程總是蠻有趣的，同時也產生了許多想法，希望有機會能做後續討論！

這份說明文件的大綱：

* Quick Start：如何啟動專案、跑測試
* API：API 說明文件，包含各種錯誤的回傳值
    * 我在需求外多加了一條 API，可以讓兩位英雄進行一場簡單的決鬥！
* 專案架構：架構的設計、目錄編排、各檔案用途及使用到的第三方 library
* 測試架構：測試的設計，撰寫方式
* 議題探討：開發過程產生的一些想法、針對 Hahow 問題的回答

## Quick Start

```bash
git clone https://github.com/JamesYu608/hahow-backend-demo.git
cd hahow-backend-demo
npm install

# Start project on http://localhost:8080
npm start

# Run test
npm test
```
## API

### General Errors

**Response 400**

Request 的資料格式有誤（e.g. 缺少所需欄位）。

```jsonc
{
    "code": 400,
    "message": "should have required property 'heroId2'"
}
```

**Response 401**

Request 的 headers 帶有 `name` 和 `password` ，但是驗證失敗。

```jsonc
{
    "code": 401,
    "message": "Unauthorized"
}
```

**Response 500**

告訴使用者 server 內部發生錯誤。

在這個專案中，理論上是發生在 server 無法從 Hahow 的 API 拿到預期的資料的時候。例如有時候會從 Hahow 那裡得到 `{"code":1000, "message": "Backend error"}`。

```jsonc
{
    "code": 500,
    "message": "Bad implementation"
}
```

### List Heroes [GET] /heroes

回傳英雄列表，內含**所有**英雄的**最小資訊**。

**Request**

```bash
curl -X GET http://localhost:8080/heroes
```

**Response 200**

```jsonc
{
    "heroes": [
        {
            "id": "1",
            "name": "Daredevil",
            "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
        },
        {
            "id": "2",
            "name": "Thor",
            "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
        },
        // ...
    ]
}
```


### Single Hero [GET] /heroes/:heroId

回傳**指定**英雄的**最小資訊**。

**Request**

```bash
curl -X GET http://localhost:8080/heroes/1
```

**Response 200**

```jsonc
{
    "id": "1",
    "name": "Daredevil",
    "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
}
```

**Response 404**

```jsonc
{
    "code": 404,
    "message": "Hero is not found!"
}
```

### Authenticated List Heroes [GET] /heroes

**驗證**通過，回傳英雄列表，內含**所有**英雄的**完整資訊**（e.g. 能力值）。

**Request**

```bash
curl -X GET http://localhost:8080/heroes \
  -H 'name: hahow' \
  -H 'password: rocks'
```

**Response 200**

```jsonc
{
    "heroes": [
        {
            "id": "1",
            "name": "Daredevil",
            "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
            "profile": {
                "str": 2,
                "int": 7,
                "agi": 9,
                "luk": 7
            }
        },
        {
            "id": "2",
            "name": "Thor",
            "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg",
            "profile": {
                "str": 8,
                "int": 2,
                "agi": 5,
                "luk": 9
            }
        },
        // ...
    ]
}
```

### Authenticated Single Heroes [GET] /heroes/:heroId

**驗證**通過，回傳**指定**英雄的**完整資訊**（e.g. 能力值）。

**Request**

```bash
curl -X GET http://localhost:8080/heroes/1 \
  -H 'name: hahow' \
  -H 'password: rocks'
```

**Response 200**

```jsonc
{
    "id": "1",
    "name": "Daredevil",
    "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
    "profile": {
        "str": 2,
        "int": 7,
        "agi": 9,
        "luk": 7
    }
}
```

**Response 404**

```jsonc
{
    "code": 404,
    "message": "Hero is not found!"
}
```

### Create a Duel [POST] /heroes/duel

進行一場決鬥，根據雙方基礎能力值加上一點亂數，看每輪傷害由誰勝出。

連續勝出 N 次者為贏家，超過一定回合不分勝負則為平手！

**Request**

```bash
curl -X POST http://localhost:8080/heroes/duel \
  -H 'content-type: application/json' \
  -d '{
	"heroId1": "1",
	"heroId2": "2"
}'
```

**Response 200**

```jsonc
{
    "winner": "Daredevil",
    "history": [
        "Thor hits Daredevil, damage: 19",
        "Daredevil hits Thor, damage: 20",
        "Thor hits Daredevil, damage: 20",
        "Thor hits Daredevil, damage: 21",
        "Daredevil hits Thor, damage: 21",
        "Daredevil hits Thor, damage: 21",
        "Daredevil hits Thor, damage: 24",
        "Daredevil wins the fight!"
    ]
}
```

**Response 404**

```jsonc
{
    "code": 404,
    "message": "Hero is not found!"
}
```

## 專案架構

測試相關的檔案沒有列在這邊，測試的說明獨立到後面的**測試架構**章節

```bash
.
├── config/
├── src/
│  ├── components/
│  │  └── heroes/
│  │     ├── Hero.js
│  │     └── HeroDAL.js
│  ├── middlewares/
│  │  ├── appErrorHandler.js
│  │  ├── authenticate.js
│  │  └── requestValidator.js
│  ├── routes/
│  │  ├── heroes.js
│  │  └── index.js
│  ├── services/
│  │  ├── hahowAPI.js
│  │  └── hahowAPISchema.js
│  ├── util.js
│  │  ├── AppError.js
│  │  └── logger.js
│  └── index.js
├── index.js
└── package.json
```

基本上我習慣將架構分成三個主要的 Layer：

1. Web Layer：例如 Express 和它的 router
    * `index.js`、`routes/`
2. Business Logic Layer：主要的邏輯處理
    * 因為這個專案不大，所以我將大部分的邏輯處理寫在 Web Layer 的 `routes/` 。平常的話我會把邏輯的部分獨立出來，覺得這樣更方便測試，主要邏輯也不需要綁定 Express。
    * `Hero.js`：將英雄封裝起來變成物件，避免直接對 raw data 做操作。
3. Data Layer：封裝外部 API 以及資料庫
    * `HeroDAL.js`：DAL（Data Access Layer）負責邏輯層物件的 CRUD ，像是從資料來源建構物件，或是將物件處理後儲存。
    * `services/`：放外部 API ，並加上定義好的 schema 做驗證，確保得到的是預期的資料。

其它部分：


1. Middlewares
    * `authenticate`：放在 routing 比較前面的位置，用來做 request 權限的驗證。
    * `requestValidator`：request 進來先檢查內容是否正確。經驗上大部分的 bugs 都是由未預期的資料產生的，及早 return 400 後續也比較不需要到處預防資料有問題。
    * `appErrorHandler`：放在最後面， routing 過程中發生任何的錯誤我都會往後丟，由這個 handler 統一處理。像是印 log 、發警告、回傳錯誤訊息給使用者等等。
2. Utils
    * `AppError`：定義常見的錯誤，以及一些額外的資訊供給前述的 handler 使用。另外我會使用 `isOperational` 區分預期和非預期的錯誤，來確保 server 狀態的穩定性。
    * `logger`：這邊我選用 winston 並且只輸出到 console ，更大的專案的話可以依 error level 輸出到不同位置。
3. Config
    * `config/`：在 server 啟動時，統一在這裡管控所有的 config ，並加上 schema 做驗證。若 config 有誤， server 啟動時直接報錯，避免跑到某些 code 才發現 config 沒正確設定。

### 使用到的第三方 Library

```jsonc
{
  "dependencies": {
    "ajv": "^6.12.2",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "express-async-errors": "^3.1.1",
    "got": "^11.3.0",
    "morgan": "^1.10.0",
    "winston": "^3.2.1"
  },
  "devDependencies": {
    "jest": "^26.0.1",
    "standard": "^14.3.4",
    "supertest": "^4.0.2"
  }
}
```
dependencies：

* [ajv](https://www.npmjs.com/package/ajv)：JSON schema validator ，我在所有覺得需要驗證資料正確性的地方都會用它（e.g. request 格式、第三方 API 回傳的資料等等）
* [body-parser](https://www.npmjs.com/package/body-parser)：解析 request 的內容
* [express](https://www.npmjs.com/package/express)：目前在 Node.JS 專案上最多人使用的 Web framework，順帶一提，我上一個專案使用的是 [fastify](https://www.npmjs.com/package/fastify) ，也是蠻有意思的
* [express-async-errors]('https://www.npmjs.com/package/express-async-errors')：讓我們在 Express 的 routing 中可以直接丟 async error 而不需要自己呼叫 `next(err)` ，提升程式的可讀性
* [got](https://www.npmjs.com/package/got)：用於發送 HTTP request，這邊用來從 Hahow API 獲取資料
* [morgan](https://www.npmjs.com/package/morgan)：Logging 進來的 request
* [winston](https://www.npmjs.com/package/winston)：一套很成熟的 logger，其它 logger 的話我也蠻喜歡 [pino](https://www.npmjs.com/package/pino) 的


devDependencies：

* [jest](https://www.npmjs.com/package/jest)：我選用的 testing framework，各種測試常用的功能幾乎都有 cover 到，不太需要再導入額外的 library。Multi-process 的執行方式跑起來感覺效率不錯，每一個測項的環境也切的比較乾淨。另外以前也用過 [Mocha](https://www.npmjs.com/package/mocha)，但近期還是 jest 使用的比較多。
* [standard](https://www.npmjs.com/package/standard)：我選用的 coding style ，在跑 test 前會先檢查一次
* [supertest](https://www.npmjs.com/package/supertest)：可以直接對 routing 的部分做 HTTP request 的測試，而不需要真的跑一個 server 起來


## 測試架構

```bash
# run all tests (code style, units, integrations)
npm test

# run unit tests
npm run unit

# run integration tests
npm run integration
```

測試的檔案都放在 `test/` 下，我使用和 source code 的目錄結構一樣的方式去放。

檔名中有 `unit` 的表示為 unit test，有 `int` 的表示為 integration test 。我習慣將有網路或是資料庫存取的部分歸類為 integration test，並讓兩者可以分開跑。

為了保證測試結果的穩定性， integration test 的部分：

* 網路相關：我會用 jest 的 mock ，或是透過 [nock](https://www.npmjs.com/package/nock) 這套 library ，去回傳事先定義好的假資料。
* 資料庫相關：一樣透過 jest 的 mock ，或是使用 docker 跑乾淨的 DB instances 起來，測試啟動時塞入假資料，過程中對它做存取，測試結束時再將資料 flush 掉（皆為自動）。

測試的編排，我習慣使用下面這種方式：

```javascript
// 架構中的哪個部分、哪個檔案？
describe('[Unit][Component] Hero model', () => {
  // 這個檔案中的哪個 Function？
  describe('[Function] constructor', () => {
    // 想要測試什麼？預期得到什麼結果？
    test('Properties can be setup by passing data', () => {
      // Arrange：準備階段，初始化測試所需要的東西
      const name = 'Tester'
      const str = 100

      // Act：實際執行測試目標
      const hero = new Hero({
        name, profile: { str }
      })

      // Assert：驗證結果（通常會先設成相反，讓測試失敗一次，確保測試有正確運作）
      expect(hero.name).toBe(name)
      expect(hero.profile.str).toBe(str)
    })
  })
})
```

這樣的方式，當測試失敗時，跑出來的錯誤訊息可以讓我比較快定位到可能的問題。

另外我也盡量在一個測項中只測試一件事情，避免太多環節彼此干擾，以及增加定位錯誤的難度。

實際跑出來的測試結果，以 `services/hahowAPI.js` 的測試來說，大概是像這樣子：

```bash
 PASS  test/services/hahowAPI.int.test.js
  [Integration][Service] Hahow API
    [Function] getAllHeroes
      ✓ Response is 200 and data is expected, return heroes data (3 ms)
      ✓ Response is 200 but data is not expected, throw error (9 ms)
      ✓ Response is not 200, throw error (2 ms)
    [Function] getHeroById
      ✓ Response is 200 and get expected data, return hero data (1 ms)
      ✓ Response is 404, return null (1 ms)
    [Function] authenticate
      ✓ Response is 200, return true
      ✓ Response is 401, throw unauthorized error (2 ms)
      ✓ Response is not 200 or 401 (unexpected), throw badImplementation error (1 ms)
```

## 議題探討

以下是我認為除了目前的需求外，其它幾個可以討論的部分。還有針對 Hahow 提出的問題的回答。

### Cache

這次專案的 API 需求都是 read 的 request，當效能需要進一步優化的時候我會考慮加上 cache 。

實作方面，我認為這邊適合採用典型 cache aside 的方式，程式碼大概會像這樣子：

```javascript
// 在 Hero component 下新增一個 `HeroCache.js`

class HeroCache {
  constructor (cache) {
    this.cache = cache // e.g. Redis instance
  }

  // Save to cache
  async setWithID (id, hero) {
    // { key: id, value: JSON.stringify(hero) }
  }

  // Get from cache
  async getByID (id) {
    // cacheData: this.cache.get(id)
    // return new Hero(JSON.parse(cacheData))
  }
}

```

對原本的 `HeroDAL.js` 做相對應的修改（以 getHero 為例）

```javascript
async getHero (id) {
  const cacheHero = await this.heroCache.getByID(id)
  // Case 1: Cache hit
  if (cacheHero) {
    return cacheHero
  }
  
  // Case 2: Cache miss
  // 繼續原本的邏輯，從來源取得英雄資料
  // 加到 cache
  await this.heroCache.setWithID(id, hero)
  // ...
}
```

Cache 更新機制：
* 視需求選擇合理的 TTL（Time To Live）
* 若 Hero 的 update、delete 也在我這邊，做這些操作時，我會先更新來源資料，成功後將該筆 cache 刪掉（不直接更新 cache 避免 race condition）

整個為 Hero 增加 cache 的實作，只修改到 Data Layer 以下的程式碼，上層邏輯的部分無需變動（Hero instance 的使用者無需知道它是如何建構的）。

### Pagination

API List Heroes 的部分，雖然目前總共只有 4 筆英雄，但可以想像若實際上有上千，甚至上萬筆資料，那就要重新考慮一下 API 的設計。

假設來源資料是在我這邊，首先就是讓 request 進來時可以帶上 query parameters ，先過濾一次 client 真正需要的資料。

接著我可能會做分頁的功能，根據 client 對這隻 API 的使用方式，有兩種不同的設計：

1. Page Number：Client 可以指定要拿第幾頁的資料
    * 適用典型的分頁介面（可以快速跳頁），但若先前資料筆數有修改，可能會影響到後續頁面的內容（一般來說是可以接受的）。
3. Cursor：Client 可以指定第一筆資料的 id，Server 會回傳這個 id 後的 N 筆資料以及 next_id
    * 適用不斷往下 scroll 的介面，即使先前資料有修改，也不影響下個頁面的內容。

### Troubleshooting

當專案變得愈來越龐大，debug 的難度也指數上升。

我可能會在每一條 log 都加上[TransactionId](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/assigntransactionid.md)，識別這筆 log 是出自哪一條 request，當有必要的時候，可以直接搜尋屬於這條 request 的所有 log。

當回傳錯誤給 client 的時候，帶上這個 id 方便和 client 一起 troubleshooting（可以根據環境選擇要透露多少錯誤資訊給 client）。

### Q：你在程式碼中寫註解的原則，遇到什麼狀況會寫註解

大家都說最好的註解就是程式碼本身，我平常會盡量抽出各段邏輯，並讓 function name 簡潔明瞭。

但現實中，有時候我自己寫的 code 可能都想不太起來當初為什麼這樣寫。

所以一般我在下面幾種情況會寫註解：

1. 每個檔案的開頭我會大概說明一下這個檔案的用途，讓觀看的人可以先有一個 context，接著要理解裡面的 function 就會快一些。
2. 如果是 util 的 function（給很多人使用的），我會使用 JSDoc 的格式完整說明這個 function 的介面和目的。
3. 一些比較特殊的情況，例如我遇過 library 提供的 function 使用 callback 的方式回傳資料，但它執行起來其實是 synchronous 的（文件中有特別提到），那我就會加上註解，避免觀看的人疑惑又要去翻文件。
4. 特殊的商業邏輯，例如我之前有個專案除了一般使用者以外，製造商也會打 API 做測試。製造商的邏輯跟一般使用者可能有些微出入，那我就會特別註明這是 special case。並將前因後果的原因整理在公司內部頁面，並在註解的地方附上 link。
5. 任何我覺得可以幫助理解的地方。

### Q：在這份專案中你遇到的困難、問題，以及解決的方法

從頭建立一個新的專案，雖然少去了 legacy code 的包袱，同時也意味著架構的設計可以有無限的想像空間（因為什麼都沒有，所以什麼都做得到？！）。

因此我的問題主要著重在專案架構，以及 API 設計這兩部分，整個開發過程就是不斷的 trade-off，去選擇怎麼樣呈現我的經驗和能力。

**專案架構**

其實我過往經歷，大多數專案都是從頭建立的。每次重新來過都會對架構、測試方式有不一樣的理解，不同時期“最潮”的架構方式也有所不同。

在開發過程中，有些地方不太確定怎麼設計比較好的時候，我會參考 [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) 這份指南。我實際看過內容之後真的覺得獲益良多（而不只因為它在 Github 上已經有 47 萬顆星），而過往實際將這些準則應用在工作當中，也獲得了不錯的成果！

**API 設計**

一隻 API 的設計需要考慮到的細節很多，根據不同情境可能會有截然不同的實作方式。

這邊為了讓專案的呈現比較著重在架構上，以及避免太多 over kill 的設計（想像出來的需求）。

我把可能的議題獨立列在上面（e.g. Cache、Pagination）而不是直接實作。

實際的工作場合，當需要設計 API 時，我的習慣做法：

1. 需求：首先確認 PM（或是需求提出者）想要的是什麼、前端（或其它開發人員）有什麼看法？我這邊有沒有其它的方式可以更好的滿足這些需求？
2. 文件：與前端討論好，先把 API 的介面定義出來，讓雙方可以同時開始實作。
3. 實作：根據這隻 API 的使用情境，例如它對資料即時性、一致性的要求程度，選擇不同的實作方式。

## 感謝

以上是我對這次作業的說明。在過程中我學習到很多，也非常期待聽到各位的想法，讓我能知道現階段自己的不足之處。

非常感謝！

**Have a nice day :D**
