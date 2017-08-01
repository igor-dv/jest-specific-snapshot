const path = require('path');
const SnapshotState = require('jest-snapshot').SnapshotState;
const toMatchSnapshot = require('jest-snapshot').toMatchSnapshot;

const snapshotsStateMap = new Map();

afterAll(() => {
  snapshotsStateMap.forEach(snapshotState => {
    const uncheckedCount = snapshotState.getUncheckedCount();

    if (uncheckedCount) {
      snapshotState.removeUncheckedKeys();
    }

    snapshotState.save();
  });
});

expect.extend({
  toMatchSpecificSnapshot(received, snapshotFile) {
    const absoluteSnapshotFile = getAbsolutePathToSnapshot(this.testPath, snapshotFile);

    let snapshotState = snapshotsStateMap.get(absoluteSnapshotFile);

    if (!snapshotState) {
      snapshotState = new SnapshotState(absoluteSnapshotFile, {updateSnapshot: 'new', snapshotPath: absoluteSnapshotFile});
      snapshotsStateMap.set(absoluteSnapshotFile, snapshotState)
    }

    const newThis = Object.assign({}, this, {snapshotState: snapshotState});
    const patchedToMatchSnapshot = toMatchSnapshot.bind(newThis);

    return patchedToMatchSnapshot(received);
  }
});

function getAbsolutePathToSnapshot(testPath, snapshotFile) {
  return path.isAbsolute(snapshotFile)
    ? snapshotFile
    : path.resolve(path.dirname(testPath), snapshotFile);
}