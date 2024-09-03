const useStorage = () => {
    let length = localStorage.length;

    const get = (key="") => {
        try {
            return JSON.parse(localStorage.getItem(key));            
        }catch(err){
            console.error("useStorage: get Error", err);
            return null;
        }
    }

    const set = (key="", value=null) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }catch(err){
            console.error("useStorage: set Error", err);
        }
    }

    const clear = () => {
        try {
            localStorage.clear();
        }catch(err){
            console.error("useStorage: clear Error", err);
        }
    }

    const find = (key="") => {
        try {
            if(localStorage.getItem(key)){
                return true;
            }
            return false;
        }catch(err){
            console.error("useStorage: find Error", err);
        }
    }

    const remove = (key="") => {
        try {
            if(localStorage.getItem(key)){
                localStorage.removeItem(key);
            }else {
                console.error(`${key}: key not found!`);
            }
        }catch(err){
            console.error("useStorage: remove Error", err);
        }
    }

    return {
        length,
        get,
        set,
        clear,
        find,
        remove,
    }
}

export default useStorage;