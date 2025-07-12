# Changelog

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
