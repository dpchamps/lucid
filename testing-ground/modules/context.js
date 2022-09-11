import {STATEFUL} from "./useState.js";

// todo: take parent context, recurse up the chain if defined
export const createContext = (context, parentContext) => {
    const watchers = Object.values(context).map(value => value[STATEFUL]).filter(Boolean);
    const getNextContextValues = () => Object.entries(context).reduce(
            (acc, [name, value]) => {
                acc[0].push(name);
                acc[1].push(value);

                return acc;
            },
            parentContext ? parentContext.getScopedVars() : [[], []]
        );

    return {
        //todo remove
        context,
        getScopedVars: () => getNextContextValues(),
        withScope: (body, ...argNames) => {
            const [contextNames, contextValues] = getNextContextValues();
            const f = new Function(...argNames, ...contextNames, body);

            return (...argValues) => f(...argValues, ...contextValues);
        },
        onStateChange: (cb) => {
            for( const watcher of watchers ){
                watcher.watch(cb)
            }
        }
    }
}