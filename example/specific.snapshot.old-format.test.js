import '../src/index';

test('test object serialization format', () => {
  const object = {
    array: [{ hello: 'Danger' }],
  };

  expect(object).toMatchSpecificSnapshot('./specific/strings/strings-old-format.shot');
});
