#! /bin/bash

PROJECT=$(git rev-parse --show-toplevel)
FLUTTER_APP=${PROJECT}sync-todo/v2/client/flutter/lib

# Get output directory from the CLI
EXAMPLE_OUT_DIR=$1

if [ ! -d $EXAMPLE_OUT_DIR ]
then
  mkdir -p $EXAMPLE_OUT_DIR
  echo Created directory for examples: ${EXAMPLE_OUT_DIR}
fi

UPDATE_SUB_QUERY_DIR=$EXAMPLE_OUT_DIR/update-subscription-query
if [ ! -d $UPDATE_SUB_QUERY_DIR ]
then
  mkdir $UPDATE_SUB_QUERY_DIR
  echo Created directory for update-subscription-query state example: ${UPDATE_SUB_QUERY_DIR}
fi

# Create snippets for project (no state)
# bluehawk snip $FLUTTER_APP --output $EXAMPLE_OUT_DIR --format rst
# Create snippets for update-subscription-query state
echo FOOOO ${FLUTTER_APP}/realm/realm-services.dart
bluehawk snip ${FLUTTER_APP}/realm/realm-services.dart \
--output $UPDATE_SUB_QUERY_DIR --state update-subscription-query --format rst

echo Created all snippets! Go to them: ${EXAMPLE_OUT_DIR}




