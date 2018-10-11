import Vue from "vue";

export function applyDiff(target, changes) {
  for (let j = changes.length - 1; j >= 0; j--) {
    const change = changes[j];
    if (target && change && change.kind) {
      let it = target;
      let i = -1;
      const last = change.path ? change.path.length - 1 : 0;
      while (++i < last) {
        if (typeof it[ change.path[ i ] ] === 'undefined') {
          Vue.set(it, change.path[ i ], (typeof change.path[ i + 1 ] !== 'undefined' && typeof change.path[ i + 1 ] === 'number') ? [] : {});
        }
        it = it[ change.path[ i ] ];
      }
      switch (change.kind) {
        case 'A':
          if (change.path && typeof it[ change.path[ i ] ] === 'undefined') {
            Vue.set(it, change.path[ i ], [])
          }
          applyArrayChange(change.path ? it[ change.path[ i ] ] : it, change.index, change.item);
          break;
        case 'D':
          Vue.delete(it, change.path[ i ]);
          break;
        case 'E':
        case 'N':
          Vue.set(it, change.path[ i ], change.rhs);
          break;
      }
    }
  }
}
function applyArrayChange(arr, index, change) {
  if (change.path && change.path.length) {
    let it = arr[ index ];
    let i = 0;
    const u = change.path.length - 1;
    for (; i < u; i++) {
      it = it[ change.path[ i ] ];
    }
    switch (change.kind) {
      case 'A':
        applyArrayChange(it[ change.path[ i ] ], change.index, change.item);
        break;
      case 'D':
        Vue.delete(it, change.path[ i ]);
        break;
      case 'E':
      case 'N':
        Vue.set(it, change.path[ i ], change.rhs);
        break;
    }
  } else {
    switch (change.kind) {
      case 'A':
        applyArrayChange(arr[ index ], change.index, change.item);
        break;
      case 'D':
        arr.splice(index, 1);
        break;
      case 'E':
      case 'N':
        Vue.set(arr, index, change.rhs);
        break;
    }
  }
  return arr;
}
