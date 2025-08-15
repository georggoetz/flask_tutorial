# Changelog

## [0.12.1](https://github.com/georggoetz/flask_tutorial/compare/v0.12.0...v0.12.1) (2025-08-15)


### Bug Fixes

* **release-please:** Prevent redundant deplyoment when pushing to mas… ([98b6b6c](https://github.com/georggoetz/flask_tutorial/commit/98b6b6c00470514fd1c475bff74cb5c7b8fc3984))
* **release-please:** Prevent redundant deplyoment when pushing to master. First Release-please creates a tag that triggers the deployment. ([28b6d13](https://github.com/georggoetz/flask_tutorial/commit/28b6d137191882dae32ae618c66a98c3ce2a8185))

## [0.12.0](https://github.com/georggoetz/flask_tutorial/compare/v0.11.0...v0.12.0) (2025-08-15)


### Features

* **swagger:** Added swagger for API endpoint documentation. ([ea0e6d3](https://github.com/georggoetz/flask_tutorial/commit/ea0e6d3b0a2bc9dc6a0c509537efc6473bd14249))
* **swagger:** Added swagger for API endpoint documentation. ([eb74a9a](https://github.com/georggoetz/flask_tutorial/commit/eb74a9a611ced3f6fc69331461aae2619d214bd6))

## [0.11.0](https://github.com/georggoetz/flask_tutorial/compare/v0.10.0...v0.11.0) (2025-08-14)


### Features

* **compression:** Enabled compression for static resources. Enabled … ([1506b05](https://github.com/georggoetz/flask_tutorial/commit/1506b05e9925d97daa67e5dd92f2e63efdc3b566))

## [0.10.0](https://github.com/georggoetz/flask_tutorial/compare/v0.9.0...v0.10.0) (2025-08-14)


### Features

* **comments:** Better handling of the bfcache. Fire an event to relo… ([39abcec](https://github.com/georggoetz/flask_tutorial/commit/39abcecf1d0b9f1f261afbbc436b484f73e4b4c4))
* **comments:** Better handling of the bfcache. Fire an event to reload components dynamically, when a page is retrieved from bfcache. Added JSDoc to Javascript components. Refactorings. ([1ad690a](https://github.com/georggoetz/flask_tutorial/commit/1ad690a9560973ff0beb0387223120f73e3c372f))

## [0.9.0](https://github.com/georggoetz/flask_tutorial/compare/v0.8.1...v0.9.0) (2025-07-26)


### Features

* **comments:** basic comments implemented ([695a434](https://github.com/georggoetz/flask_tutorial/commit/695a43480ff41e7e8b286b19387fa6a86d330749))
* **comments:** Make comments basically work ([71374ef](https://github.com/georggoetz/flask_tutorial/commit/71374ef65b491cec23ad4fd281a87be458154b1e))


### Bug Fixes

* **comments:** Added missing import ([02d1953](https://github.com/georggoetz/flask_tutorial/commit/02d1953448732c5b26510abae729f8d4721baf3b))
* **comments:** Handle back and forward button. ([612d135](https://github.com/georggoetz/flask_tutorial/commit/612d135976919899209359f924a3cd8114185190))

## [0.8.1](https://github.com/georggoetz/flask_tutorial/compare/v0.8.0...v0.8.1) (2025-07-14)


### Bug Fixes

* Fixed eslint warning ([9455566](https://github.com/georggoetz/flask_tutorial/commit/9455566093780b89c009e099a7ea826630ff82d1))

## [0.8.0](https://github.com/georggoetz/flask_tutorial/compare/v0.7.0...v0.8.0) (2025-07-14)


### Features

* **aria:** Better logging of a11y violations. Github action: upload screenshots after cypress run. ([92adb0c](https://github.com/georggoetz/flask_tutorial/commit/92adb0ca321109d935388e7a551716a56f875aef))
* **aria:** Made all pages accessible. Added cypress-axe tests to check accessibility. ([cff0f9d](https://github.com/georggoetz/flask_tutorial/commit/cff0f9dd845782c45a109bbf8b3b87e25b104ddc))
* **aria:** merge feature branch [#28](https://github.com/georggoetz/flask_tutorial/issues/28) [#23](https://github.com/georggoetz/flask_tutorial/issues/23) ([bf696a0](https://github.com/georggoetz/flask_tutorial/commit/bf696a0bf334410873c97486b0cfc4ba97485e71))


### Bug Fixes

* **aria:** Logging not goot for axe. Upload screenshots even if Cypress failed. [#23](https://github.com/georggoetz/flask_tutorial/issues/23) ([850ce05](https://github.com/georggoetz/flask_tutorial/commit/850ce059bbb609ef8b4950b8aeb8f582ec4e7601))
* **aria:** Trying to fix "page must have a level one heading". [#23](https://github.com/georggoetz/flask_tutorial/issues/23) ([6832168](https://github.com/georggoetz/flask_tutorial/commit/683216816132410b5398598dd2305f059dddb0f6))

## [0.7.0](https://github.com/georggoetz/flask_tutorial/compare/v0.6.0...v0.7.0) (2025-07-13)


### Features

* **cypress:** added end-to-end tests ([dcc3e22](https://github.com/georggoetz/flask_tutorial/commit/dcc3e2292e35582296da6e6149efe74de9058473))
* **cypress:** added end-to-end tests. [#24](https://github.com/georggoetz/flask_tutorial/issues/24) ([dcc3e22](https://github.com/georggoetz/flask_tutorial/commit/dcc3e2292e35582296da6e6149efe74de9058473))
* **cypress:** Added tests for creating, editing and liking posts. ([2e31455](https://github.com/georggoetz/flask_tutorial/commit/2e3145528c62e094ab07415bd33fde11a128ac5d))
* **cypress:** Added tests for register and login flows. ([4fb8b99](https://github.com/georggoetz/flask_tutorial/commit/4fb8b99b282d4bb9cd63ea86815ae1b2c78ef98a))
* **cypress:** Adjusted database URL in Github action. ([2649b0c](https://github.com/georggoetz/flask_tutorial/commit/2649b0ce997e16113375c2ed4b71d3896d6b1d84))
* **cypress:** Fixed eslint warnings ([4a8ee8f](https://github.com/georggoetz/flask_tutorial/commit/4a8ee8f461aa8d83a3a0c5bafc72ef3130882009))
* **cypress:** Fixed syntax error in Github action. ([47be8ec](https://github.com/georggoetz/flask_tutorial/commit/47be8ecd862565bee29697a808218e61bcf09d2e))
* **cypress:** Forgot Flask app. ([7b6e7ec](https://github.com/georggoetz/flask_tutorial/commit/7b6e7ec7792953ab3fa3851e9ce639b0d17a3bc2))
* **cypress:** Forgot to initialize database. ([d256fd1](https://github.com/georggoetz/flask_tutorial/commit/d256fd1ef1710956e159ae1ce22febd79247677b))
* **cypress:** Frontend assets before cypress tests. ([8b29fbf](https://github.com/georggoetz/flask_tutorial/commit/8b29fbf95ba11d28e1eae653d13b5e2089a2bc22))
* **cypress:** Install and configure Cypress. Add a first test. Integrate into Github action. Action now runs on feature branches as well but deoplys on master only. ([5b99095](https://github.com/georggoetz/flask_tutorial/commit/5b99095c46e84a413282027e10375b07c292ef0f))
* **cypress:** Run python from venv in Github action. ([afff020](https://github.com/georggoetz/flask_tutorial/commit/afff020f429eabc9a51759f200cbcb52c9ac2b1d))

## [0.6.0](https://github.com/georggoetz/flask_tutorial/compare/v0.5.0...v0.6.0) (2025-07-12)


### Features

* **error-handling:** added error handlers and an error page for Flask ([27f42dc](https://github.com/georggoetz/flask_tutorial/commit/27f42dcf3f283c66fd8a257c4ea0d59ef317bf2e))

## [0.5.0](https://github.com/georggoetz/flask_tutorial/compare/v0.4.1...v0.5.0) (2025-07-12)


### Features

* **error-handling:** created a toast component. Flash messages an JS errors will be displayed there. ([9cadd58](https://github.com/georggoetz/flask_tutorial/commit/9cadd58bbb361fdd244bc2243fb8db674ac81e43))
* **error-handling:** extracted requests into their own JS module with common error handling. Handle CSRF token for post and delete requests. ([9ad9d14](https://github.com/georggoetz/flask_tutorial/commit/9ad9d142c6ff4211b97e1fe4974b40593ee24dec))
* **error-handling:** fixed eslint warning ([c3bb6a0](https://github.com/georggoetz/flask_tutorial/commit/c3bb6a06312fc2c87d17ef24b1e53d1b4d5d2c7b))

## [0.4.1](https://github.com/georggoetz/flask_tutorial/compare/v0.4.0...v0.4.1) (2025-07-09)


### Bug Fixes

* **csfr:** Added CSRF token to post and delete requests. ([890b2f9](https://github.com/georggoetz/flask_tutorial/commit/890b2f97ec6f01eec4c4679a6ede83ec3300dd1a))
* **jinja:** Own template for post likes ([890b2f9](https://github.com/georggoetz/flask_tutorial/commit/890b2f97ec6f01eec4c4679a6ede83ec3300dd1a))

## [0.4.0](https://github.com/georggoetz/flask_tutorial/compare/v0.3.1...v0.4.0) (2025-07-08)


### Features

* add pipeline status to readme ([1439a70](https://github.com/georggoetz/flask_tutorial/commit/1439a70d68b6b8cef61c1a16349381dab7403b5c))

## [0.3.1](https://github.com/georggoetz/flask_tutorial/compare/v0.3.0...v0.3.1) (2025-07-08)


### Bug Fixes

* **csfr:** added flask-wtf as runtime dependency ([5e15eb6](https://github.com/georggoetz/flask_tutorial/commit/5e15eb6e093425aeb1789f4868632fb3316b4713))

## [0.3.0](https://github.com/georggoetz/flask_tutorial/compare/v0.2.0...v0.3.0) (2025-07-08)


### Features

* **csrf:** added test to check if all forms have the CSFR token ([7370177](https://github.com/georggoetz/flask_tutorial/commit/737017786e9b304e6758bdb87ce12c2996849660))


### Bug Fixes

* **csfr:** forms require a hidden input field to store the csfr token ([629e1e8](https://github.com/georggoetz/flask_tutorial/commit/629e1e8fb54b2bb0d6755441b9bbbc6995e809b7))
* improved time dependent test by  getting the current time in UTC ([7370177](https://github.com/georggoetz/flask_tutorial/commit/737017786e9b304e6758bdb87ce12c2996849660))

## [0.2.0](https://github.com/georggoetz/flask_tutorial/compare/v0.1.0...v0.2.0) (2025-07-08)


### Features

* **csfr:** enabled csfr protection ([d75cf99](https://github.com/georggoetz/flask_tutorial/commit/d75cf997795e2c31d85092742165b18830fcd89f))
* **csfr:** enabled csfr protection using flask-wtf ([d1faa7a](https://github.com/georggoetz/flask_tutorial/commit/d1faa7a2e41b1843acdfd8563dc80af8a456f5cc))


### Bug Fixes

* **test:** fixed unit test because date format changed ([9aec418](https://github.com/georggoetz/flask_tutorial/commit/9aec418eccbcf99dfa7b701ff0e95eb2d55ceed9))

## 0.1.0 (2025-07-06)


### Bug Fixes

* established original CSS style. ([d6a5fcc](https://github.com/georggoetz/flask_tutorial/commit/d6a5fcc39ffef2ec68f4e3f7d089faed50b4b5e5))
* release-please permit issue write ([bcf341a](https://github.com/georggoetz/flask_tutorial/commit/bcf341a0d93f93a174230f9bf2bddb4fc5c329b0))
