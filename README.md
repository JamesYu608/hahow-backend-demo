# Hahow Backend Engineer 作業（James Yu）

很高興能嘗試這個小專案，從無到有的開發過程蠻有趣的，同時也產生了許多想法，希望有機會能做後續討論！

這份說明文件的大綱：

* TODO

## Quick Start

```bash
git clone https://github.com/JamesYu608/hahow-backend-demo.git
cd hahow-backend-demo
npm install

# Start project
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

告訴使用者 server 內部發生錯誤，在這個專案中，理論上是發生在 server 無法從 Hahow 的 API 拿到預期的資料的時候。

例如有時候會從 Hahow 那裡得到 `{"code":1000, "message": "Backend error"}`。

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

連續勝出 N 次者為贏家！超過一定回合不分勝負則為平手。

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

測試相關的架構沒有列在這邊，獨立到後面的**測試架構**章節

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

基本上我習慣將架構分成三個 Layer 和其它幾個部分：

1. Web Layer：例如 Express 和它的 router
    * `index.js`、`routes/`
2. Business Logic Layer：主要的邏輯處理
    * 因為這個專案不大，所以我將大部分的邏輯處理寫在 Web Layer 的 `routes/` 。平常的話我會把邏輯的部分獨立出來，覺得這樣更方便測試，主要邏輯也不需要綁定 Express。
    * `Hero.js`：將英雄封裝起來變成物件，避免直接對 raw data 做操作。
3. Data Layer：封裝外部 API 以及資料庫
    * `HeroDAL.js`：DAL（Data Access Layer）負責邏輯層物件的 CRUD ，像是從資料來源建構物件，或是將物件處理後儲存。
    * `services/`：放外部 API ，並加上定義好的 schema 做驗證，確保得到的是預期的資料。
4. Middlewares
    * `authenticate`：放在 routing 比較前面的位置，用來做 request 權限的驗證
    * `requestValidator`：request 進來先檢查內容是否正確。大部分的 bugs 都是由未預期的資料產生的，及早 return 400 也比較不需要在後面邏輯處理的時候各處判斷。
    * `appErrorHandler`：放在最後面， routing 過程中發生任何的錯誤我都會往後丟，由這個 handler 統一處理（e.g. 印 log 、發警告、回傳錯誤訊息給使用者等等）。
5. Utils
    * `AppError`：定義常見的錯誤，以及一些額外的資訊供 `appErrorHandler` 使用。另外我會區分預期和非預期的錯誤（使用 `isOperational` 標記），來確保 server 狀態的穩定性。
    * `logger`：這邊我選用 winston 並且只輸出到 console ，更大的專案的話可以依錯誤嚴重性輸出到不同位置。
6. Config
    * `config/`：在 server 啟動時，統一在這裡管控所有的 config ，並加上定義好的 schema 做驗證。若 config 有誤， server 啟動時直接報錯，避免跑到某些 code 才發現 config 沒正確設定。

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
* [express](https://www.npmjs.com/package/express)： Web framework（順帶一提，我上一個專案使用的是 [fastify](https://www.npmjs.com/package/fastify) ，也蠻有意思的）
* [express-async-errors]('https://www.npmjs.com/package/express-async-errors')：在 Express 的 routing 中可以直接丟 async error 而不需要自己呼叫 next ，語法上比較簡潔
* [got](https://www.npmjs.com/package/got)：用於發送 HTTP request
* [morgan](https://www.npmjs.com/package/morgan)：Logging 進來的 request
* [winston](https://www.npmjs.com/package/winston)：Logger ，另外我也蠻喜歡 [pino](https://www.npmjs.com/package/pino) 的


devDependencies：

* [jest](https://www.npmjs.com/package/jest)：Testing framework 
* [standard](https://www.npmjs.com/package/standard)：我選用的 coding style ，在跑 test 前會先檢查一次
* [supertest](https://www.npmjs.com/package/supertest)：可以直接對 routing 的部分做 HTTP request 的測試，而不需要真的跑一個 server 起來


## 測試架構

## 議題探討

