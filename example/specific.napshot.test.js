const path = require('path');
require('../src/index');

test('test', () => {
  const pathToSnap = path.resolve(process.cwd(), './example/specific/dir/my.shot');
  expect(100).toMatchSpecificSnapshot(pathToSnap);

  expect(14).toMatchSpecificSnapshot('./specific/dir/my.shot');

  expect(19).toMatchSpecificSnapshot('./specific/another_dir/another.shot');
});