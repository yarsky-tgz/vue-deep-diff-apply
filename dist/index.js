import Vue from "vue";
export function applyDiff(data, changes) {
    for (const change of changes) {
        let it = data;
        let i = -1;
        const last = change.path ? change.path.length - 1 : 0;
        while (++i < last) {
            if (typeof it[change.path[i]] === "undefined") {
                Vue.set(it, change.path[i], (typeof change.path[i] === "number") ? [] : {});
            }
            it = it[change.path[i]];
        }
        switch (change.kind) {
            case "A":
                applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
                break;
            case "D":
                Vue.delete(it, change.path[i]);
                break;
            case "E":
            case "N":
                Vue.set(it, change.path[i], change.rhs);
                break;
        }
    }
}
function applyArrayChange(array, index, change) {
    if (change.path && change.path.length) {
        let it = array[index];
        let i = 0;
        const u = change.path.length - 1;
        for (; i < u; i++) {
            it = it[change.path[i]];
        }
        switch (change.kind) {
            case "A":
                applyArrayChange(it[change.path[i]], change.index, change.item);
                break;
            case "D":
                Vue.delete(it, change.path[i]);
                break;
            case "E":
            case "N":
                Vue.set(it, change.path[i], change.rhs);
                break;
        }
    }
    else {
        switch (change.kind) {
            case "A":
                applyArrayChange(array[index], change.index, change.item);
                break;
            case "D":
                array.splice(index, 1);
                break;
            case "E":
            case "N":
                Vue.set(array, index, change.rhs);
                break;
        }
    }
}
//# sourceMappingURL=index.js.map