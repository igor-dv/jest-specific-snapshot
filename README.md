# Jest Specific Snapshot #

TBD

# Installation #

TBD

# Example #

```js
const path = require('path');
// extend jest to have 'toMatchSpecificSnapshot' matcher
require('jest-specifics-snapshot');

test('test', () => {
  // provides snapshot file with absolute file
  const pathToSnap = path.resolve(process.cwd(), './example/specific/dir/my.shot');
  expect(100).toMatchSpecificSnapshot(pathToSnap);

  //same snapshot but with relative file
  expect(14).toMatchSpecificSnapshot('./specific/dir/my.shot');

  // another snapshot file in the same test
  expect(19).toMatchSpecificSnapshot('./specific/another_dir/another.shot');
});
```

# Limitations # 

1. Snapshot files should have an extension **other** than `.snap`, since it conflicts with jest.
2. TBD
