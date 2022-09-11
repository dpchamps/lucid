export const STATEFUL = "__STATEFUL"

export const useState = (initialState) => {
    const watchers = [];
    const onUpdate = () => {
        for(const watcher of watchers){
            watcher()
        }
    }

    initialState[STATEFUL] = {
        watch: (cb) => {
            watchers.push(cb)
        }
    }

    return new Proxy(initialState, {
        set(target, p, value, receiver) {
            const result = Reflect.set(target, p, value, receiver);
            onUpdate();
            return result
        }
    });
}