
/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带 tracker-key 点击事件上报
 * @sdkVersionsdk版本
 * @extra 透穿字段
 * @jsError js 和 promise 报错异常上报
 */
 export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersionsdk: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean,
 }

 // sdk版本
 export enum TrackerConfig {
    version = '1.0.0'
 }

 // 定义必传的参数配置
 export interface Options extends Partial<DefaultOptions> {
    requestUrl: string
 }