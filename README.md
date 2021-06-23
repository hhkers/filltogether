# Fill-together web

### Prerequisites

- python 3.X, pip
- node.js > 14.16.1
- yarn > 1.22.10



### 백엔드 initialization

```
$ cd {PROJ_ROOT}/backend-server
$ source init_be.sh
```



### 백엔드 서버 구동

```
$ cd {PROJ_ROOT}/backend-server
$ ./start_be_server.sh
```
http://localhost:8000

### 백엔드 서버 구동 중단

```
$ ./stop_be_server.sh
```



### 프론트엔드 initialization

```
$ cd {PROJ_ROOT}/frontend-server
$ source init_fe.sh
```



### 프론트엔드 서버 구동

```
$ cd {PROJ_ROOT}/frontend-server
$ ./start_fe_server.sh
```

http://localhost:3000

### 프론트엔드 서버 구동 중단

```
$ ./stop_fe_server.sh
```





# Development Guide



##### Git commit시 eslint 오류 발생시

````
yarn remove husky && git config --unset core.hooksPath
````

https://typicode.github.io/husky/#/