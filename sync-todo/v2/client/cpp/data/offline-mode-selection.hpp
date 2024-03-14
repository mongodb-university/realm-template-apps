#pragma once

/* Offline mode pauses the Sync connection,
 * simulating offline network conditions.
 * Write while offline to see the item locally,
 * then see that the item does not sync to Atlas. */
enum OfflineModeSelection: int {
    offlineModeEnabled,
    offlineModeDisabled
};