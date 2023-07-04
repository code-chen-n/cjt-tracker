import { DefaultOptions, TrackerConfig, Options } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
export default class Tracker {
    public data: Options;
    constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options);  // 用户传递的值要覆盖初始化的配置
        this.installTracker();
    }

    // 初始化参数，设置默认配置
    private initDef(): DefaultOptions {
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
        return <DefaultOptions>{
            sdkVersionsdk: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        }
    }

    // 
    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid;
    }

    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra;
    }


    // 手动上报
    public sendTracker<T>(data: T) {
        this.reportTracker(data);
    }

    private tragetKeyReport() {
        MouseEventList.forEach((ev) => {
            window.addEventListener(ev, (e) => {
                const traget = e.target as HTMLElement;
                const tragetKey = traget.getAttribute('traget-key');
                if (tragetKey) {
                    this.reportTracker({
                        event: ev,
                        tragetKey
                    })
                }
            })
        })
    }

    // 自动上报
    private captureEvent<T>(mouseEventList: string[], tragetKey: string, data?: T) {
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({
                    event,
                    tragetKey,
                    data
                })
            })
        })
    }

    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvent(['pushState', 'replaceState', 'popstate'], 'history-pv')
        }
        // 监听hash值变化
        if (this.data.hashTracker) {
            this.captureEvent(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.tragetKeyReport()
        }
        if(this.data.jsError){
            this.jsError();
        }
    }

    private jsError(){
        this.errorEvent()
        this.promiseReject()
    }

    // js 错误上报
    private errorEvent() {
        window.addEventListener('error', (event) => {
            this.reportTracker({
                event: 'error',
                tragetKey: 'message',
                message: event.message
            })
        })
    }

    // promise 错误上报
    private promiseReject(){
        window.addEventListener('unhandledrejection', (event)=>{
            event.promise.catch(error => {
                this.reportTracker({
                    event: 'promise',
                    tragetKey: 'message',
                    message: error
                })
            })
        })
    }

    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() })
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);

    }

}