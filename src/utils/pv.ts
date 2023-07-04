// 重写 history 事件
export const createHistoryEvent = <T extends keyof History>(type:T) => {
    const origin = history[type];  // 取到原始函数

    // 返回一个高级函数
    return function(this: any){
        const res = origin.apply(this, arguments)

        // 创建一个自定义事件
        const e = new Event(type);
        // 派发事件
        window.dispatchEvent(e);  // 可以使用 addEventListener() 监听到

        return res;
    }
}


