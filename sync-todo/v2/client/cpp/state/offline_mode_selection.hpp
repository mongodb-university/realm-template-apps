#pragma once

/** Pause the Sync connection, simulating offline network conditions.
 *  Write while offline to see the item locally, check Atlas to see that the item does not sync. */
enum class OfflineModeSelection: int {
  offlineModeEnabled,
  offlineModeDisabled
};