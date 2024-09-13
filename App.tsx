// import React, { useEffect } from 'react';
// import { NativeModules, NativeEventEmitter, Button, View, StyleSheet } from 'react-native';
//
// const { QuickActionsManager } = NativeModules;
// const quickActionEmitter = new NativeEventEmitter(QuickActionsManager);
//
// const App = () => {
//   useEffect(() => {
//     const subscription = quickActionEmitter.addListener('QuickAction', (data) => {
//       console.log('Quick Action pressed:', data.type);
//     });
//
//     return () => subscription.remove();
//   }, []);
//
//   const setQuickActions = () => {
//     // @ts-ignore
//     QuickActionsManager.setQuickActions([
//       {
//         type: 'com.yourapp.newmessage',
//         title: 'New Message',
//         subtitle: 'Create a new message',
//         iconType: '1', // (1 = UIApplicationShortcutIconTypeCompose)
//       },
//       {
//         type: 'com.yourapp.search',
//         title: 'Search',
//         subtitle: 'Search something',
//         iconType: '2', // (2 = UIApplicationShortcutIconTypeSearch)
//       },
//     ]);
//   };
//
//   const removeQuickActions = () => {
//     // @ts-ignore
//     QuickActionsManager.removeAllQuickActions();
//   };
//
//   return (
//     <View style={styles.container}>
//       <Button title="Set Quick Actions" onPress={setQuickActions} />
//       <Button title="Remove All Quick Actions" onPress={removeQuickActions} />
//     </View>
//   );
// };
//
// export default App;
//
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingTop: 100,
//     gap: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import React, { useEffect } from 'react';
import { View, Text, Button, NativeModules, DeviceEventEmitter } from 'react-native';

const { QuickActionsManager } = NativeModules;

const QuickActions = {
  setQuickActions: (actions) => {
    if (actions && actions.length > 0) {
      const ids = actions.map((a) => a.id);
      const labels = actions.map((a) => a.label);
      const descriptions = actions.map((a) => a.description);
      QuickActionsManager.setQuickActions(ids, labels, descriptions);
    }
  },

  removeAllQuickActions: () => {
    QuickActionsManager.removeAllQuickActions();
  },

  onQuickActionPress: (callback) => {
    // Lắng nghe sự kiện trên Android (DeviceEventEmitter)
    DeviceEventEmitter.addListener('onQuickActionPress', callback);
  },

  removeQuickActionListener: (callback) => {
    DeviceEventEmitter.removeListener('onQuickActionPress', callback);
  },
};

const App = () => {
  useEffect(() => {
    const handleQuickAction = (data) => {
      console.log('Quick Action pressed: ', data);
    };

    // Đăng ký lắng nghe sự kiện
    QuickActions.onQuickActionPress(handleQuickAction);

    return () => {
      // Hủy lắng nghe sự kiện khi component bị hủy
      QuickActions.removeQuickActionListener(handleQuickAction);
    };
  }, []);

  const setQuickActions = () => {
    const actions = [
      { id: 'action1', label: 'Action 1', description: 'Description 1' },
      { id: 'action2', label: 'Action 2', description: 'Description 2' },
    ];
    QuickActions.setQuickActions(actions);
  };

  const clearQuickActions = () => {
    QuickActions.removeAllQuickActions();
  };

  return (
    <View>
      <Text>Quick Actions Example</Text>
      <Button title="Set Quick Actions" onPress={setQuickActions} />
      <Button title="Clear Quick Actions" onPress={clearQuickActions} />
    </View>
  );
};

export default App;
