import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import {COLORS} from './Colors';

type Props = {
  onSubmit: ({summary}: {summary: string}) => void;
};

export function CreateToDoPrompt(props: Props): React.ReactElement<Props> {
  const {onSubmit} = props;
  const [summary, setSummary] = useState('');

  return (
    <View style={styles.modalWrapper}>
      <Text h4 style={styles.addItemTitle}>
        Add To-Do Item
      </Text>
      <Input
        placeholder="What do you want to do?"
        onChangeText={(text: string) => setSummary(text)}
        autoCompleteType={undefined}
      />
      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        onPress={() => onSubmit({summary})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 300,
    minHeight: 400,
    borderRadius: 4,
    alignItems: 'center',
  },
  addItemTitle: {
    margin: 20,
  },
  saveButton: {
    width: 280,
    backgroundColor: COLORS.primary,
  },
});
