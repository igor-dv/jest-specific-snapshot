/* eslint no-underscore-dangle: ["error", { "allow": ["_updateSnapshot"] }] */
import path from 'path';
import { SnapshotState, toMatchSnapshot, addSerializer } from 'jest-snapshot';

const snapshotsStateMap = new Map();

function getAbsolutePathToSnapshot(testPath, snapshotFile) {
  return path.isAbsolute(snapshotFile)
    ? snapshotFile
    : path.resolve(path.dirname(testPath), snapshotFile);
}

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

    const commonSnapshotState = this.snapshotState;
    let snapshotState = snapshotsStateMap.get(absoluteSnapshotFile);

    if (!snapshotState) {
      snapshotState = new SnapshotState(absoluteSnapshotFile, {
        updateSnapshot: commonSnapshotState._updateSnapshot,
        snapshotPath: absoluteSnapshotFile,
      });
      snapshotsStateMap.set(absoluteSnapshotFile, snapshotState);
    }

    const newThis = Object.assign({}, this, { snapshotState });
    const patchedToMatchSnapshot = toMatchSnapshot.bind(newThis);

    return patchedToMatchSnapshot(received);
  },
});

export { addSerializer };
