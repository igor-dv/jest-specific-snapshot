/* eslint no-underscore-dangle: ["error", { "allow": ["_updateSnapshot"] }] */
import path from 'path';
import { SnapshotState, toMatchSnapshot, addSerializer } from 'jest-snapshot';
import { getState, setState } from 'expect';

const snapshotsStateMap = new Map();

function getAbsolutePathToSnapshot(testPath, snapshotFile) {
  return path.isAbsolute(snapshotFile)
    ? snapshotFile
    : path.resolve(path.dirname(testPath), snapshotFile);
}

afterAll(() => {
  snapshotsStateMap.forEach(snapshotState => {
    if (snapshotState.getUncheckedCount()) {
      snapshotState.removeUncheckedKeys();
    }

    snapshotState.save();
  });
});

expect.extend({
  toMatchSpecificSnapshot(received, snapshotFile) {
    const absoluteSnapshotFile = getAbsolutePathToSnapshot(this.testPath, snapshotFile);

    let localState = snapshotsStateMap.get(absoluteSnapshotFile);
    if (!localState) {
      const { snapshotState } = getState();

      localState = new SnapshotState(absoluteSnapshotFile, {
        expand: snapshotState.expand,
        updateSnapshot: snapshotState._updateSnapshot,
        snapshotPath: absoluteSnapshotFile,
      });
      snapshotsStateMap.set(absoluteSnapshotFile, localState);
    }

    setState({ snapshotState: localState });

    return toMatchSnapshot.call(this, received);
  },
});

export { addSerializer };
