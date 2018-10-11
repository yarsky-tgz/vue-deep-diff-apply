# vue-deep-diff-apply
Apply `deep-diff` changes array to Vue reactive data

## Installation

```bash
npm i vue-deep-diff-apply
```

## Usage

```javascript
import { applyDiff, revertDiff } from 'vue-deep-diff-apply';

applyDiff(reactiveObject, changes);
revertDiff(reactiveObject, changes);
```