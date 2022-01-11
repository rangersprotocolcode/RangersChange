# RangersChange

代码流程描述
## 1 调用后端接口
代码入口：https://github.com/rangersprotocolcode/RangersChange/blob/main/src/pages/home/index.jsx#L47

接口名：home/queryAccounttx

入参：json格式 string

## 2 调用matamash，对后端接口返回的hash字段签名
代码入口： https://github.com/rangersprotocolcode/RangersChange/blob/main/src/pages/home/index.jsx#L56

## 3 将签名附着于后端接口返回的json字符串中
代码入口：https://github.com/rangersprotocolcode/RangersChange/blob/main/src/pages/home/index.jsx#L63

## 4 通过websocket，将上述字符串发送至rangersProtocol
代码入口：https://github.com/rangersprotocolcode/RangersChange/blob/main/src/pages/home/index.jsx#L65
