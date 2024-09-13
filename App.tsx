import React, { useEffect } from 'react';
import { NativeModules, NativeEventEmitter, Button, View, StyleSheet } from 'react-native';

const { QuickActionsManager } = NativeModules;
const quickActionEmitter = new NativeEventEmitter(QuickActionsManager);

const App = () => {
  useEffect(() => {
    const subscription = quickActionEmitter.addListener('QuickAction', (data) => {
      console.log('Quick Action pressed:', data.type);
    });

    return () => subscription.remove();
  }, []);

  const setQuickActions = () => {
    // @ts-ignore
    QuickActionsManager.setQuickActions([
      {
        type: 'com.yourapp.newmessage',
        title: 'New Message',
        subtitle: 'Create a new message',
        iconType: '1', // (1 = UIApplicationShortcutIconTypeCompose)
      },
      {
        type: 'com.yourapp.search',
        title: 'Search',
        subtitle: 'Search something',
        iconType: '2', // (2 = UIApplicationShortcutIconTypeSearch)
      },
    ]);
  };

  const removeQuickActions = () => {
    // @ts-ignore
    QuickActionsManager.removeAllQuickActions();
  };

  return (
    <View style={styles.container}>
      <Button title="Set Quick Actions" onPress={setQuickActions} />
      <Button title="Remove All Quick Actions" onPress={removeQuickActions} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 100,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
